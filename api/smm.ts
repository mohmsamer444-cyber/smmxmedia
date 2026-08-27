export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const apiUrl = process.env.SMM_API_URL || process.env.VITE_SMM_API_URL || 'https://smmxmedia.com/api/v2';
    const apiKey = process.env.SMM_API_KEY || process.env.VITE_SMM_API_KEY || '';

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'No API key configured' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const incoming = await req.json();

    const bodyParams = new URLSearchParams();
    bodyParams.append('key', apiKey);
    Object.keys(incoming).forEach((k) => {
      if (incoming[k] !== undefined && incoming[k] !== null) {
        bodyParams.append(k, String(incoming[k]));
      }
    });

    const providerRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyParams.toString(),
    });

    const text = await providerRes.text();

    if (!providerRes.ok) {
      return new Response(JSON.stringify({ error: text || providerRes.statusText }), {
        status: providerRes.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(text, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
