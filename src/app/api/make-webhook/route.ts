import { NextResponse } from 'next/server';

type Payload = any;

export async function POST(req: Request) {
  try {
    const data: Payload = await req.json();
    console.log('[webhook proxy] payload received:', data);
    // URL del webhook de Make publicada en variables de entorno de servidor
    const webhookUrl = process.env.MAKE_WEBHOOK_URL || 'https://hook.us2.make.com/webhook/22tlt5pg3q3g145tw9nhgcxqvihmwymc';
    console.log('[webhook proxy] forwarding to Make webhook URL:', webhookUrl);

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  console.log('[webhook proxy] forwarding to Make webhook URL:', webhookUrl);

    const text = await res.text();
    console.log('[webhook proxy] Make webhook response status:', res.status);
    console.log('[webhook proxy] Make webhook response text:', text);
    return new Response(text, { status: res.status });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}