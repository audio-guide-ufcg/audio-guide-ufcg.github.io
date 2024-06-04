import { TuristPoint } from "@/services/types";

const calculateStatus = (place: TuristPoint) => {
  if (place.shouldContact) return "Indeterminado";

  const now = new Date();
  const workingHours = place[
    `day${now.getDay() + 1}` as keyof TuristPoint
  ] as string;

  if (!workingHours) return "Fechado";

  const times = workingHours.split(",");

  const results = times.find((val) => {
    const startingHour = val.split("-")[0];
    const finishingHour = val.split("-")[1];

    const start = new Date(`2000-01-01T${startingHour}:00`);
    var end = new Date(`2000-01-01T${finishingHour}:00`);
    if (end < start) end.setDate(end.getDate() + 1);

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const targetTime = `${hours}:${minutes}`;
    const target = new Date(`2000-01-01T${targetTime}:00`);

    return start <= target && target <= end;
  });

  return results ? "Aberto" : "Fechado";
};

export default calculateStatus;
