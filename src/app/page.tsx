"use client"

import { some } from "lodash";
import ExploreArea from "@/components/ExploreArea";
import Map from "@/components/Map";
import SearchBar from "@/components/SearchBar";
import useLocationStore from "@/hooks/useLocationStore";
import usePlacesStore from "@/hooks/usePlacesStore";
import useSearchStore from "@/hooks/useSearchStore";
import { useEffect, useState } from "react";
import { TuristPoint } from "@/services/types";
import { distanceBetweenCoords, getFullLocationsData, getLocationsFromBackend } from "@/utils/MapUtils";

const PLACES_KEYS = ["type", "name"];

export default function Home() {
  const { places, setPlaces } = usePlacesStore();
  const { location } = useLocationStore();
  const { search } = useSearchStore();
  const [filteredPlaces, setFilteredPlaces] = useState(places);
  const [orderedPlaces, setOrderedPlaces] = useState(places);

  useEffect(() => {
    const list = places;

    const filtered = list?.filter((item: any) => {
      const lowercaseSearchTerm = search.toLowerCase();
      return some(PLACES_KEYS, (key: any) =>
        item[key]?.toLowerCase().includes(lowercaseSearchTerm)
      );
    });

    setFilteredPlaces(filtered);
  }, [search, places]);

  useEffect(() => {
    const fetchPlaces = async () => {
      const data = await getLocationsFromBackend();

      const completeData = await getFullLocationsData(data);
      setPlaces(completeData);
    };
    fetchPlaces();
  }, []);

  useEffect(() => {
    function orderFunc(point1: TuristPoint, point2: TuristPoint) {
      const dist1 = distanceBetweenCoords(location, {
        longitude: point1.longitude,
        latitude: point1.latitude,
      });

      const dist2 = distanceBetweenCoords(location, {
        longitude: point2.longitude,
        latitude: point2.latitude,
      });

      return dist1 - dist2;
    }

    const orederedData = filteredPlaces.sort(orderFunc);

    setOrderedPlaces(orederedData);
  }, [location, filteredPlaces]);

  return (
    <main>
      <Map />
      <SearchBar />
      <ExploreArea places={places}/>
    </main>
  );
}
