import Divider from "@/components/TuristPointPage/Divider";
import usePlacesStore from "@/hooks/usePlacesStore";
import { Text, VStack } from "@chakra-ui/react";
import formatPrice from "./utils/formatPrice";
import OpeningHoursTable from "./OpeningHoursTable";
import CustomSection from "./CustomSection";

const InformationsTab = () => {
  const { selectedPlace } = usePlacesStore();
  const { address, entryPrice } = selectedPlace || {};

  return (
    <VStack paddingBottom="18px" align="left" gap="0">
      <CustomSection title="Horários">
        <OpeningHoursTable />
      </CustomSection>

      <Divider />

      <CustomSection title="Entrada">
        <Text>{formatPrice(entryPrice)}</Text>
      </CustomSection>

      <Divider />

      <CustomSection title="Endereço">
        <Text>{address}</Text>
      </CustomSection>
    </VStack>
  );
};

export default InformationsTab;
