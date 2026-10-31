import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";

test("API adapter handles detail reload, language, rating payload, HTTP errors and cancellation", async () => {
  const requests: { url: string; method: string; body: string }[] = [];
  const server = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    requests.push({ url: req.url!, method: req.method!, body });
    res.setHeader("Content-Type", "application/json");
    if (req.url?.startsWith("/api/points/999")) {
      res.writeHead(503);
      res.end("{}");
      return;
    }
    if (req.method === "POST") {
      res.end(JSON.stringify({ id: 7 }));
      return;
    }
    const point = {
      id: 7,
      name: "Museu de teste",
      latitude: -7,
      longitude: -35,
      language: "en",
      audio: null,
    };
    res.end(
      JSON.stringify(req.url?.startsWith("/api/points?") ? [point] : point),
    );
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  process.env.NEXT_PUBLIC_API_URL = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  try {
    const { loadPoints, loadPoint, request } = await import("../src/lib/guide");
    assert.equal((await loadPoints("en"))[0].name, "Museu de teste");
    assert.equal((await loadPoint(7, "en")).id, 7);
    await request("points/rate", undefined, { point_id: 7, rating: 4 });
    assert.deepEqual(
      requests.map((r) => r.url),
      [
        "/api/points?language=en",
        "/api/points/7?language=en",
        "/api/points/rate",
      ],
    );
    assert.equal(requests[2].method, "POST");
    assert.deepEqual(JSON.parse(requests[2].body), { point_id: 7, rating: 4 });
    await assert.rejects(loadPoint(999, "pt"), /503/);
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(loadPoints("pt", controller.signal));
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
