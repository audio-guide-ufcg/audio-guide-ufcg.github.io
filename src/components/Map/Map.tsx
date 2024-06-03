"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Box } from "@chakra-ui/react";
import useLocationStore from "@/hooks/useLocationStore";
import usePlacesStore from "@/hooks/usePlacesStore";
import { Coords } from "@/services/types";

const MapComponent = () => {
  const { places, setSelectedPlace } = usePlacesStore();
  const { location, setLocation } = useLocationStore();

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || "";

  const mapContainer = useRef(null);

  const [lng, setLng] = useState(-35.889344208);
  const [lat, setLat] = useState(-7.221827092);
  const [zoom, setZoom] = useState(14);

  const map = useRef<mapboxgl.Map>(
    null
  ) as React.MutableRefObject<mapboxgl.Map>; // Assert type

  useEffect(() => {
    if (map.current) return; // Check if map is already initialized

    map.current = new mapboxgl.Map({
      container: mapContainer.current || "",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  }, []);

  function getLocation() {
    return navigator.geolocation.getCurrentPosition(showPosition);
  }

  function showPosition(position: { coords: Coords }) {
    setLocation(position.coords);
  }

  useEffect(() => {
    getLocation();
  }, []);

  return <Box ref={mapContainer} className="map-container" height="66vh" />;
};

export default MapComponent;
