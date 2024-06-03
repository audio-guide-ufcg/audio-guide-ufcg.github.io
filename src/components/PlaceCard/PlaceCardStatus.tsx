import { Box, Text } from "@chakra-ui/react";

interface PlaceCardStatusProps {
  status: string;
}

const PlaceCardStatus: React.FC<PlaceCardStatusProps> = ({ status }) => (
  <Box
    position="absolute"
    right={0}
    top="24px"
    paddingY="4px"
    paddingX="12px"
    backgroundColor="primaryText"
  >
    <Text fontSize="12px" color="white">
      {status}
    </Text>
  </Box>
);

export default PlaceCardStatus;
