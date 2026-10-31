import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizePoint,
  openingStatus,
  distance,
  fold,
  price,
} from "../src/lib/guide";

test("nullable API fields do not crash details or fabricate free entry", () => {
  const point = normalizePoint({
    id: 1,
    latitude: 0,
    longitude: 0,
    audio: null,
    images: null,
    transcript: null,
    tags: [null, "Museu"],
    entry_price: null,
  });
  assert.equal(point.audio, null);
  assert.deepEqual(point.images, []);
  assert.deepEqual(point.tags, ["Museu"]);
  assert.equal(point.transcript, "");
  assert.equal(point.accessible, null);
  assert.equal(price(point.entryPrice), "Consultar entrada");
});
test("normalization preserves accessibility, ratings, media and split hours", () => {
  const p = normalizePoint({
    id: 4,
    latitude: -7,
    longitude: -35,
    accessible: true,
    rating: 4.5,
    entry_price: 0,
    day2: "08:00-12:00,14:00-18:00",
    audio: { id: "abc" },
    images: [{ id: "xyz", credits: "Autor" }],
    transcript: { text: "História" },
  });
  assert.equal(p.rating, 4.5);
  assert.equal(p.accessible, true);
  assert.equal(p.hours[1], "08:00-12:00,14:00-18:00");
  assert.match(p.audio!, /abc.mp3$/);
  assert.equal(p.images[0].credits, "Autor");
  assert.equal(p.transcript, "História");
  assert.equal(price(p.entryPrice), "Gratuito");
});
test("invalid API records are rejected explicitly", () => {
  assert.throws(() => normalizePoint({ id: 1 }));
});
test("opening hours use Fortaleza timezone, split shifts and overnight carryover", () => {
  const p = {
    shouldContact: false,
    hours: ["", "08:00-12:00,14:00-18:00", "", "", "", "22:00-02:00", ""],
  };
  assert.equal(openingStatus(p, new Date("2026-10-26T12:00:00Z")), "open");
  assert.equal(openingStatus(p, new Date("2026-10-26T16:00:00Z")), "closed");
  assert.equal(openingStatus(p, new Date("2026-10-26T21:00:00Z")), "closed");
  assert.equal(openingStatus(p, new Date("2026-10-31T04:00:00Z")), "open");
  assert.equal(openingStatus(p, new Date("2026-10-31T06:00:00Z")), "closed");
  assert.equal(openingStatus({ ...p, shouldContact: true }), "unknown");
});
test("search ignores accents and distance uses real Earth radius", () => {
  assert.equal(fold("  História  "), "historia");
  assert.equal(
    distance({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 0 }),
    0,
  );
  assert.ok(
    Math.abs(
      distance({ latitude: 0, longitude: 0 }, { latitude: 1, longitude: 0 }) -
        111.195,
    ) < 0.01,
  );
});

test('recovered catalog has unique local IDs, complete media, credits and normalized hours', async () => {
  const { recoveredPoints, canRatePoint, loadPoint } = await import('../src/lib/guide');
  const { existsSync } = await import('node:fs');
  const { resolve } = await import('node:path');
  assert.equal(recoveredPoints.length, 42);
  assert.equal(new Set(recoveredPoints.map(p => p.id)).size, 42);
  const imageUrls = new Set<string>();
  for (const point of recoveredPoints) {
    assert.ok(point.id < 0);
    assert.equal(canRatePoint(point), false);
    assert.ok(point.latitude >= -90 && point.latitude <= 90);
    assert.ok(point.longitude >= -180 && point.longitude <= 180);
    if (!(point.longitude < -35 && point.longitude > -36)) assert.equal(point.locationNeedsReview, true);
    assert.ok(point.transcript.length > 0);
    assert.ok(point.audio && existsSync(resolve('public', '.' + point.audio)));
    assert.ok(point.images.length > 0);
    for (const image of point.images) {
      assert.ok(existsSync(resolve('public', '.' + image.url)));
      imageUrls.add(image.url);
    }
    for (const day of point.hours) {
      assert.match(day, /^(?:\d{2}:\d{2}-\d{2}:\d{2}(?:,\d{2}:\d{2}-\d{2}:\d{2})*)?$/);
    }
    await assert.rejects(loadPoint(point.id, 'pt'), /ID local/);
  }
  assert.equal(imageUrls.size, 67);
  const parque = recoveredPoints.find(p => p.name === 'Parque da Criança')!;
  assert.equal(parque.accessible, true);
  assert.equal(parque.shouldContact, false);
  assert.equal(parque.hours[1], '04:00-11:00,13:00-20:30');
  assert.ok(recoveredPoints.some(p => p.accessible === false));
  assert.ok(recoveredPoints.some(p => p.shouldContact === true));
  assert.ok(recoveredPoints.some(p => p.images.some(i => i.credits.length > 0)));
});
