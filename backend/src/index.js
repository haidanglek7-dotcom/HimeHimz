/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://hime.himehimzvtuber.workers.dev",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);

   if (url.pathname === "/api/schedule") {

    if (request.method === "GET") {

        const { results } = await env.hime_schedule
            .prepare("SELECT * FROM schedule")
            .all();

        return Response.json(results,{
            headers:corsHeaders
        });
    }

    if (request.method === "POST") {

        const data = await request.json();

        await env.hime_schedule
            .prepare(`
                UPDATE schedule
                SET time = ?, title = ?
                WHERE day = ?
            `)
            .bind(
                data.time,
                data.title,
                data.day
            )
            .run();

        return Response.json({
            success:true
        },{
            headers:corsHeaders
        });
    }
}
    return new Response("Not Found", {
      status: 404,
      headers: corsHeaders,
    });
  },
};