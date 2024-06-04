import { HStack } from "@chakra-ui/react";
import { faDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";

interface PriceProps {
  price: number;
}

const Price: React.FC<PriceProps> = ({ price }) => {
  const category = price / 10;

  const icons =
    category > 0 ? (
      Array.from({ length: category }, (_, index) => {
        return (
          <FontAwesomeIcon
            key={index}
            icon={faDollar}
            height="16"
            color="#F2C894"
          />
        );
      })
    ) : (
      <MoneyOffIcon style={{ color: "#85E7F2", height: "19px" }} />
    );

  return (
    <HStack align="end" gap={0}>
      {icons}
    </HStack>
  );
};

export default Price;
