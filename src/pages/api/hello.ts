import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const name = url.searchParams.get('name') ?? 'stranger';
  return new Response(
    JSON.stringify({ message: `Yo, ${name}!` }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
};
