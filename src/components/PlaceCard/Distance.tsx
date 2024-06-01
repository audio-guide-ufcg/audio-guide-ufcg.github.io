import { HStack, Text } from "@chakra-ui/react";
import { faWalking } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DistanceProps {
  distance: number;
}

const Distance: React.FC<DistanceProps> = ({ distance = 10 }) => {
  return (
    <HStack gap="5px">
      <FontAwesomeIcon icon={faWalking} height="16px" color="white" />
      <Text color="white" fontSize="16px">{distance.toFixed(1)}km</Text>
    </HStack>
  );
};

export default Distance;
