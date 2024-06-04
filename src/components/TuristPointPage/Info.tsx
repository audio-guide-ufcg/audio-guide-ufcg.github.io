import { Text } from "@chakra-ui/react";
import Divider from "./Divider";
import usePlacesStore from "@/hooks/usePlacesStore";

const Info = () => {
  const { selectedPlace } = usePlacesStore();
  const { name, type } = selectedPlace || {};

  return (
    <>
      <Text fontSize={14} textTransform="uppercase">
        {type}
      </Text>
      <Divider />
      <Text fontSize="20px" textTransform="uppercase">
        {name}
      </Text>
    </>
  );
};

export default Info;
