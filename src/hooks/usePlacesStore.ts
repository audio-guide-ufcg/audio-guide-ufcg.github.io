import { create } from "zustand";
import Cookies from "js-cookie";
import { TuristPoint } from "@/services/types";

interface PlacesStore {
  places: TuristPoint[];
  selectedPlace?: TuristPoint;
  setSelectedPlace: (turistPoint: TuristPoint) => void;
  setPlaces: (places: TuristPoint[]) => void;
}

// Create the store with the defined types
const usePlacesStore = create<PlacesStore>((set) => ({
  places: [],
  selectedPlace: undefined,
  setSelectedPlace: (turistPoint: TuristPoint) => {
    Cookies.set("lastSeenPlace", turistPoint.id.toString());
    set({ selectedPlace: turistPoint});
  },
  setPlaces: (places: TuristPoint[]) => set({ places: places }),
}));


export default usePlacesStore;
