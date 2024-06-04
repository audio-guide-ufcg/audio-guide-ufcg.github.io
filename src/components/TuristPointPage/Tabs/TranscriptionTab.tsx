import usePlacesStore from "@/hooks/usePlacesStore";
import { Text } from "@chakra-ui/react";

const TranscriptionTab = () => {
  const { selectedPlace } = usePlacesStore();

  const { transcript } = selectedPlace || {};
  
  return (
    <Text fontSize="14px" textAlign="justify">
      {transcript?.text}
    </Text>
  );
};

export default TranscriptionTab;
