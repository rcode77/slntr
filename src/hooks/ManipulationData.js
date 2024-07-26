export const AverageData = (data) => {
  const total = data.reduce(
    (accumulator, currentValue) => accumulator + parseFloat(currentValue),
    0
  );
  const rataRata = total / data.length;
  return rataRata;
};
