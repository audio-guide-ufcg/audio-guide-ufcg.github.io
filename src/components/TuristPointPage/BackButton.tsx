import { Circle } from "@chakra-ui/react";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  return (
    <Circle
      position="absolute"
      top="52px"
      left="8px"
      borderRadius="100px"
      backgroundColor="bgButton"
      zIndex="1"
      textAlign="center"
      size="32px"
      cursor="pointer"
      onClick={() => router.back()}
    >
      <FontAwesomeIcon icon={faChevronLeft} fontSize={16} />
    </Circle>
  );
};

export default BackButton;
