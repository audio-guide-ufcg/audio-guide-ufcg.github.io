"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Point } from "@/lib/guide";
import "leaflet/dist/leaflet.css";
export default function Map({
  points,
  location,
  selectedId,
  onSelect,
}: {
  points: Point[];
  location: { latitude: number; longitude: number } | null;
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!container.current) return;
    const instance = L.map(container.current, { zoomControl: false }).setView(
      [-7.2218, -35.8893],
      14,
    );
    map.current = instance;
    L.control.zoom({ position: "bottomright" }).addTo(instance);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    })
      .on("tileerror", () => setError(true))
      .addTo(instance);
    layer.current = L.layerGroup().addTo(instance);
    const observer = new ResizeObserver(() => instance.invalidateSize());
    observer.observe(container.current);
    return () => {
      observer.disconnect();
      instance.remove();
      map.current = null;
    };
  }, []);
  useEffect(() => {
    if (!map.current || !layer.current) return;
    layer.current.clearLayers();
    points.forEach((p, index) => {
      if (p.locationNeedsReview || Math.abs(p.latitude) > 90 || Math.abs(p.longitude) > 180) return;
      L.marker([p.latitude, p.longitude], {
        title: p.name,
        alt: p.name,
        keyboard: true,
        icon: L.divIcon({
          className: `guide-marker ${selectedId === p.id ? "selected" : ""}`,
          html: `<span>${p.audio ? "♫" : index + 1}</span>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        }),
      })
        .on("click", () => onSelect(p.id))
        .bindTooltip(p.name, { direction: "top", offset: [0, -38] })
        .addTo(layer.current!);
    });
    if (location)
      L.circleMarker([location.latitude, location.longitude], {
        radius: 8,
        color: "#fff",
        fillColor: "#096bd9",
        fillOpacity: 1,
      })
        .bindTooltip("Você está aqui")
        .addTo(layer.current);
  }, [points, location, selectedId, onSelect]);
  useEffect(() => {
    if (!map.current) return;
    const selected = points.find((p) => p.id === selectedId);
    const coords: L.LatLngExpression[] = (selected ? [selected] : points)
      .filter((p) => !p.locationNeedsReview && Math.abs(p.latitude) <= 90 && Math.abs(p.longitude) <= 180)
      .map((p) => [p.latitude, p.longitude]);
    if (location && !selected)
      coords.push([location.latitude, location.longitude]);
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    if (coords.length)
      map.current.fitBounds(L.latLngBounds(coords), {
        paddingTopLeft: [45, mobile ? 170 : 90],
        paddingBottomRight: [
          45,
          mobile ? Math.min(window.innerHeight * 0.43, 360) : 70,
        ],
        maxZoom: selected ? 16 : 15,
        animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
  }, [points, location, selectedId]);
  return (
    <div className="map-shell">
      <div
        className="map"
        ref={container}
        aria-label="Mapa dos pontos turísticos"
      />
      {error && (
        <p className="map-note">
          Não foi possível carregar o mapa. Explore pela lista de lugares.
        </p>
      )}
    </div>
  );
}
