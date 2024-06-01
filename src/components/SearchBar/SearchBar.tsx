import { Box, HStack, Input } from "@chakra-ui/react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchBar = () => {
  return (
    <Box position="absolute" top="48px" width="full" paddingX="16px">
      <HStack
        backgroundColor="white"
        height="48px"
        width="full"
        borderRadius="50px"
        paddingX="16px"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.25)"
        zIndex={4}
      >
        <FontAwesomeIcon icon={faSearch} fill="primary-text" height={16} />
        <Input placeholder="Pesquisar pontos próximos" color="black" />
      </HStack>
    </Box>
  );
};

export default SearchBar;
