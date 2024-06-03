import { create } from "zustand";
import Cookies from "js-cookie";
import { TuristPoint } from "@/services/types";

const usePlacesStore = create((set) => ({
  places: [] as TuristPoint[],
  selectedPlace: undefined,
  setSelectedPlace: (id: number) => {
    Cookies.set("lastSeenPlace", id.toString());
    set({ selectedPlace: id });
  },
  setPlaces: (places: any) => set({ places: places }),
}));

export default usePlacesStore;
