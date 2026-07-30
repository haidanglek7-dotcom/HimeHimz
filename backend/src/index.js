/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const buildCorsHeaders = (request) => {
  const origin = request.headers.get("Origin");
  const allowedOrigin = origin && (origin === "https://hime.himehimzvtuber.workers.dev" || origin.startsWith("http://localhost"))
    ? origin
    : "https://hime.himehimzvtuber.workers.dev";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
};

export default {
  async fetch(request, env) {
    const corsHeaders = buildCorsHeaders(request);
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    if (url.pathname === "/") {
      return new Response("Hello World!", {
        headers: corsHeaders,
      });
    }

    const pathParts = url.pathname.split("/").filter(Boolean);
    const isScheduleRoute = pathParts[0] === "api" && pathParts[1] === "schedule";
    const id = isScheduleRoute && pathParts[2] ? pathParts[2] : null;

    if (isScheduleRoute) {
      if (request.method === "GET") {
        const { results } = await env.hime_schedule
          .prepare("SELECT * FROM schedule ORDER BY id")
          .all();

        return Response.json(results, {
          headers: corsHeaders,
        });
      }

      if (request.method === "POST") {
        const data = await request.json();

        await env.hime_schedule
          .prepare(`
            INSERT INTO schedule(day,time,title)
            VALUES(?,?,?)
          `)
          .bind(data.day, data.time, data.title)
          .run();

        return Response.json({ success: true }, {
          headers: corsHeaders,
        });
      }

      if (request.method === "PUT") {
        const data = await request.json();

        if (id) {
          await env.hime_schedule
            .prepare(`
              UPDATE schedule
              SET day=?, time=?, title=?
              WHERE id=?
            `)
            .bind(data.day, data.time, data.title, id)
            .run();
        } else {
          const items = Array.isArray(data) ? data : [data];

          await env.hime_schedule.prepare("DELETE FROM schedule").run();

          for (const item of items) {
            await env.hime_schedule
              .prepare(`
                INSERT INTO schedule(day,time,title)
                VALUES(?,?,?)
              `)
              .bind(item.day, item.time, item.title)
              .run();
          }
        }

        const { results } = await env.hime_schedule
          .prepare("SELECT * FROM schedule ORDER BY id")
          .all();

        return Response.json(results, {
          headers: corsHeaders,
        });
      }

      if (request.method === "DELETE") {
        if (id) {
          await env.hime_schedule
            .prepare("DELETE FROM schedule WHERE id=?")
            .bind(id)
            .run();
        } else {
          await env.hime_schedule.prepare("DELETE FROM schedule").run();
        }

        const { results } = await env.hime_schedule
          .prepare("SELECT * FROM schedule ORDER BY id")
          .all();

        return Response.json(results, {
          headers: corsHeaders,
        });
      }
    }

    return new Response("Not Found", {
      status: 404,
      headers: corsHeaders,
    });
  },
};