const formatPrice = (price: number | undefined) => {
  if (price === -1 || price === undefined) {
    return "Entrar em contato";
  }

  if (price == 0) {
    return "Gratuita";
  }

  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency",
    currency: "BRL",
  };

  return price?.toLocaleString("pt-BR", options);
};

export default formatPrice;
