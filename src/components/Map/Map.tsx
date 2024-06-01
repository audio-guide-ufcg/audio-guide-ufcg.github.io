"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Box } from "@chakra-ui/react";

const MapComponent = () => {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || "";

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
      height: "100vh", // Set height to 100vh
    });
  });

  return <Box ref={mapContainer} className="map-container" height="100vh" />;
};

export default MapComponent;
