import usePlacesStore from "@/hooks/usePlacesStore";
import { TuristPoint } from "@/services/types";
import { HStack, Text, VStack } from "@chakra-ui/react";

const WEEK_DAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const OpeningHoursTable = () => {
  const { selectedPlace } = usePlacesStore();

  if (selectedPlace?.shouldContact)
    return <Text color="primaryText">Entrar em contato</Text>;

  return (
    <HStack gap="10px">
      <VStack align="left" gap="0">
        {WEEK_DAYS.map((val, index) => (
          <Text key={index} fontFamily="Montserrat-Bold">
            {val}
          </Text>
        ))}
      </VStack>
      <VStack align="left" gap="0">
        {WEEK_DAYS.map((_, index) => {
          let day = `day${index + 1}` as keyof TuristPoint;
          const text =
            selectedPlace && selectedPlace[day]
              ? `${selectedPlace[day]}`
              : "Fechado";

          return (
            <Text key={index}>
              {text}
            </Text>
          );
        })}
      </VStack>
    </HStack>
  );
};

export default OpeningHoursTable;
