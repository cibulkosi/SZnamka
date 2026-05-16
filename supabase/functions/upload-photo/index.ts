import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Všechny citlivé hodnoty se čtou z Supabase Secrets trezoru
const R2_ACCOUNT_ID = Deno.env.get('R2_ACCOUNT_ID')!;
const R2_ACCESS_KEY = Deno.env.get('R2_ACCESS_KEY_ID')!;
const R2_SECRET_KEY = Deno.env.get('R2_SECRET_ACCESS_KEY')!;
const R2_BUCKET = Deno.env.get('R2_BUCKET_NAME')!;
const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_PUBLIC_URL = `https://pub-${R2_ACCOUNT_ID}.r2.dev`;

async function hmac(key: ArrayBuffer, data: string): Promise<ArrayBuffer> {
  const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', k, new TextEncoder().encode(data));
}

async function getSignatureKey(secret: string, date: string, region: string, service: string): Promise<ArrayBuffer> {
  const kDate = await hmac(new TextEncoder().encode('AWS4' + secret), date);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  return await hmac(kService, 'aws4_request');
}

function toHex(b: ArrayBuffer): string {
  return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
}

async function sha256hex(data: ArrayBuffer | Uint8Array): Promise<string> {
  return toHex(await crypto.subtle.digest('SHA-256', data));
}

async function uploadToR2(buffer: Uint8Array, key: string, contentType: string): Promise<string> {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '').slice(0, 15) + 'Z';
  const dateStamp = amzDate.slice(0, 8);
  const region = 'auto', service = 's3';
  const payloadHash = await sha256hex(buffer);
  const host = `${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';
  const canonicalRequest = `PUT\n/${R2_BUCKET}/${key}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${await sha256hex(new TextEncoder().encode(canonicalRequest))}`;
  const signingKey = await getSignatureKey(R2_SECRET_KEY, dateStamp, region, service);
  const signature = toHex(await hmac(signingKey, stringToSign));
  const auth = `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  const res = await fetch(`${R2_ENDPOINT}/${R2_BUCKET}/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': contentType, 'x-amz-content-sha256': payloadHash, 'x-amz-date': amzDate, 'Authorization': auth },
    body: buffer,
  });
  if (!res.ok) throw new Error(`R2 upload failed: ${res.status} ${await res.text()}`);
  return `${R2_PUBLIC_URL}/${key}`;
}

serve(async (req) => {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = (formData.get('userId') as string) || 'anonymous';
    if (!file) return new Response(JSON.stringify({ error: 'No file' }), { status: 400, headers: cors });
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
      return new Response(JSON.stringify({ error: 'Only JPEG/PNG/WebP' }), { status: 400, headers: cors });
    if (file.size > 10 * 1024 * 1024)
      return new Response(JSON.stringify({ error: 'Max 10MB' }), { status: 400, headers: cors });
    const ext = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
    const key = `photos/${userId}/${crypto.randomUUID()}.${ext}`;
    const buffer = new Uint8Array(await file.arrayBuffer());
    const url = await uploadToR2(buffer, key, file.type);
    return new Response(JSON.stringify({ url, key }), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: cors });
  }
});
