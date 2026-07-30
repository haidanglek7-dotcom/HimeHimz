import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src";

describe("Hello World worker", () => {
	it("responds with Hello World! (unit style)", async () => {
		const request = new Request("http://example.com");
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	});

	it("responds with Hello World! (integration style)", async () => {
		const response = await SELF.fetch("http://example.com");
		expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	});

	it("supports preflight requests for schedule updates", async () => {
		const request = new Request("http://example.com/api/schedule", {
			method: "OPTIONS",
			headers: {
				Origin: "https://hime.himehimzvtuber.workers.dev",
			},
		});

		const response = await worker.fetch(request, env);

		expect(response.status).toBe(200);
		expect(response.headers.get("Access-Control-Allow-Methods")).toContain("PUT");
		expect(response.headers.get("Access-Control-Allow-Methods")).toContain("DELETE");
	});
});
