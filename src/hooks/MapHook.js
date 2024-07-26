import axios from "axios";

export const getAllProvince = async () => {
  try {
    const { data } = await axios.get(
      `https://proxy-cors.carakan.id/https://geoportal.big.go.id/sikambing/api/provinces`
    );
    return {
      data: data,
    };
  } catch (error) {
    console.log(error);
  }
};
