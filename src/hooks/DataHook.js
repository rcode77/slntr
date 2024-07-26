// import axios from "axios";

// // description moth for chart
// // depend by data
// const months = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// const body = (lattitude, longitude) => {
//   return {
//     query: {
//       bool: {
//         must: [
//           {
//             geo_distance: {
//               distance: "11km",
//               location: {
//                 lat: lattitude,
//                 lon: longitude,
//               },
//             },
//           },
//         ],
//       },
//     },
//   };
// };

// // get data potensi energi surya Bulanan
// export const getHistorisPotensi = async (lattitude, longitude) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.REACT_APP_ELASTIC}/historis-bulanan-2023-potensi-bulanan/_search`,
//       body(lattitude, longitude)
//     );

//     let results = data.hits.hits[0]?._source ? data.hits.hits[0]._source : null;
//     return {
//       data: [
//         {
//           name: "Potensi Energi Surya",
//           data:
//             results?.Jan !== undefined
//               ? months.map((month) => parseFloat(results[month].toFixed(1)))
//               : [],
//         },
//       ],
//       categories: months,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

// // get data suhu rata-rata Bulanan
// export const getHistorisSuhuRataRata = async (lattitude, longitude) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.REACT_APP_ELASTIC}/historis-bulanan-2023-temperature-bulanan/_search`,
//       body(lattitude, longitude)
//     );
//     let results = data.hits.hits[0]?._source ? data.hits.hits[0]._source : null;
//     return {
//       data: [
//         {
//           name: "Suhu Rata-Rata",
//           data:
//             results?.Jan !== undefined
//               ? months.map((month) => parseFloat(results[month].toFixed(1)))
//               : [],
//         },
//       ],
//       categories: months,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

// // get data suhu Maksimum Bulanan
// export const getHistorisSuhuMaksimum = async (lattitude, longitude) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.REACT_APP_ELASTIC}/historis-bulanan-2023-temperature-maximum-bulanan/_search`,
//       body(lattitude, longitude)
//     );
//     // empty data can't 0 cause its a number so using -
//     let results = data.hits.hits[0]?._source ? data.hits.hits[0]._source : null;
//     return {
//       data: [
//         {
//           name: "Suhu Maksimum",
//           data:
//             results?.Jan !== undefined
//               ? months.map((month) => parseFloat(results[month].toFixed(1)))
//               : [],
//         },
//       ],
//       categories: months,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

// // get data Index Kebeningan Bulanan
// export const getHistorisIndexKebeningan = async (lattitude, longitude) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.REACT_APP_ELASTIC}/historis-bulanan-2023-indeks-kebeningan-bulanan/_search`,
//       body(lattitude, longitude)
//     );
//     // empty data can't 0 cause its a number so using -
//     let results = data.hits.hits[0]?._source ? data.hits.hits[0]._source : null;
//     return {
//       data: [
//         {
//           name: "Index Kebeningan",
//           data:
//             results?.Jan !== undefined
//               ? months.map((month) => parseFloat(results[month].toFixed(1)))
//               : [],
//         },
//       ],
//       categories: months,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

// // get data Kecepatan Angin Maksimum Bulanan
// export const getHistorisKecepatanAnginMaksimum = async (
//   lattitude,
//   longitude
// ) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.REACT_APP_ELASTIC}/historis-bulanan-2023-kecepatan-angin-maksimum-bulanan/_search`,
//       body(lattitude, longitude)
//     );
//     let results =
//       data.hits.hits.length > 0 || data.hits.hits[0]?._source
//         ? data.hits.hits[0]._source
//         : null;
//     return {
//       data: [
//         {
//           name: "Kecepatan Angin Maksimum",
//           data: results?.Jan
//             ? months.map((month) => parseFloat(results[month]))
//             : [],
//         },
//       ],
//       categories: months,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

// // get data Kecepatan Angin Maksimum Bulanan
// export const getHistorisKecepatanAngin = async (lattitude, longitude) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.REACT_APP_ELASTIC}/historis-bulanan-2023-kecepatan-angin-bulanan/_search`,
//       body(lattitude, longitude)
//     );

//     let results =
//       data.hits.hits.length > 0 || data.hits.hits[0]?._source
//         ? data.hits.hits[0]._source
//         : null;
//     return {
//       data: [
//         {
//           name: "Kecepatan Angin",
//           data:
//             results?.Jan !== undefined
//               ? months.map((month) => parseFloat(results[month]))
//               : [],
//         },
//       ],
//       categories: months,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

// // get data historis arah angin bulanan
// export const getHistorisArahAngin = async (lattitude, longitude) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.REACT_APP_ELASTIC}/historis-bulanan-2023-arah-angin-bulanan/_search`,
//       body(lattitude, longitude)
//     );
//     let results =
//       data.hits.hits.length > 0 || data.hits.hits[0]?._source
//         ? data.hits.hits[0]._source
//         : null;
//     return {
//       data: [
//         {
//           name: "Arah Angin",
//           data:
//             results?.Jan !== undefined
//               ? months.map((month) => parseFloat(results[month]))
//               : [],
//         },
//       ],
//       categories: months,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

// // get data historis tutuptan awan total
// export const getHistorisTutupanAwanTotal = async (lattitude, longitude) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.REACT_APP_ELASTIC}/historis-bulanan-2023-tutupan-awan-total-bulanan/_search`,
//       body(lattitude, longitude)
//     );
//     let results =
//       data.hits.hits.length > 0 || data.hits.hits[0]?._source
//         ? data.hits.hits[0]._source
//         : null;
//     return {
//       data: [
//         {
//           name: "Tutupan Awan Total",
//           data:
//             results?.Jan !== undefined
//               ? months.map((month) => parseFloat(results[month]).toFixed(1))
//               : [],
//         },
//       ],
//       categories: months,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

// // get data historis tutuptan awan total
// export const getHistorisTutupanAwanRendah = async (lattitude, longitude) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.REACT_APP_ELASTIC}/historis-bulanan-2023-tutupan-awan-rendah-bulanan/_search`,
//       body(lattitude, longitude)
//     );
//     let results =
//       data.hits.hits.length > 0 || data.hits.hits[0]?._source
//         ? data.hits.hits[0]._source
//         : null;
//     return {
//       data: [
//         {
//           name: "Tutupan Awan Rendah",
//           data:
//             results?.Jan !== undefined
//               ? months.map((month) => parseFloat(results[month]))
//               : [],
//         },
//       ],
//       categories: months,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

// // get data historis tutuptan awan total
// export const getHistorisTutupanAwanMenengah = async (lattitude, longitude) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.REACT_APP_ELASTIC}/historis-bulanan-2023-tutupan-awan-menengah-bulanan/_search`,
//       body(lattitude, longitude)
//     );
//     let results =
//       data.hits.hits.length > 0 || data.hits.hits[0]?._source
//         ? data.hits.hits[0]._source
//         : null;
//     return {
//       data: [
//         {
//           name: "Tutupan Awan Menengah",
//           data:
//             results?.Jan !== undefined
//               ? months.map((month) => parseFloat(results[month]))
//               : [],
//         },
//       ],
//       categories: months,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

// // get data historis tutuptan awan total
// export const getHistorisTutupanAwanTinggi = async (lattitude, longitude) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.REACT_APP_ELASTIC}/historis-bulanan-2023-tutupan-awan-tinggi-bulanan/_search`,
//       body(lattitude, longitude)
//     );
//     let results =
//       data.hits.hits.length > 0 || data.hits.hits[0]?._source
//         ? data.hits.hits[0]._source
//         : null;
//     return {
//       data: [
//         {
//           name: "Tutupan Awan Tinggi",
//           data:
//             results?.Jan !== undefined
//               ? months.map((month) => parseFloat(results[month]))
//               : [],
//         },
//       ],
//       categories: months,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

// // get data arah matahari
// export const getHistorisArahMatahari = async (lattitude, longitude) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.REACT_APP_ELASTIC}/historis-bulanan-2023-arah-matahari-zenith-bulanan/_search`,
//       body(lattitude, longitude)
//     );
//     let results =
//       data.hits.hits.length > 0 || data.hits.hits[0]?._source
//         ? data.hits.hits[0]._source
//         : null;
//     return {
//       data: [
//         {
//           name: "Pergerakan Matahari",
//           data:
//             results?.Jan !== undefined
//               ? months.map((month) => parseFloat(results[month]))
//               : [],
//         },
//       ],
//       categories: months,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

// // get data curah hujan
// export const getHistorisCurahHujan = async (lattitude, longitude) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.REACT_APP_ELASTIC}/historis-bulanan-2023-curah-hujan-bulanan/_search`,
//       body(lattitude, longitude)
//     );
//     let results =
//       data.hits.hits.length > 0 || data.hits.hits[0]?._source
//         ? data.hits.hits[0]._source
//         : null;
//     return {
//       data: [
//         {
//           name: "Curah Hujan",
//           data:
//             results?.Jan !== undefined
//               ? months.map((month) => parseFloat(results[month]))
//               : [],
//         },
//       ],
//       categories: months,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

import axios from "axios";
import { useState } from "react";
const { useSelector } = require("react-redux");

// description moth for chart
// depend by data
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const url = `${process.env.REACT_APP_URL_API}/search`;
const body = (lattitude, longitude, nameIndex) => {
  return {
    distance: "10km",
    lat: lattitude,
    lon: longitude,
    year: 2023,
    nameindex: nameIndex,
    time: nameIndex.includes("bulan") ? "bulanan" : "tahunan",
  };
};

// get data potensi energi surya Bulanan
export const getHistorisPotensi = async (lattitude, longitude) => {
  try {
    const { data } = await axios.post(
      url,
      body(lattitude, longitude, "potensi-bulanan")
    );

    let results = data.hits.hits[0]?._source ? data.hits.hits[0]._source : null;
    return {
      data: [
        {
          name: "Potensi Energi Surya",
          data:
            results?.Jan !== undefined
              ? months.map((month) => parseFloat(results[month].toFixed(1)))
              : [],
        },
      ],
      categories: months,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [
        {
          name: "Potensi Energi Surya",
          data: [],
        },
      ],
      categories: months,
    };
  }
};

// get data suhu rata-rata Bulanan
export const getHistorisSuhuRataRata = async (lattitude, longitude) => {
  try {
    const { data } = await axios.post(
      url,
      body(lattitude, longitude, "temperature-bulanan")
    );
    let results = data.hits.hits[0]?._source ? data.hits.hits[0]._source : null;
    return {
      data: [
        {
          name: "Suhu Rata-Rata",
          data:
            results?.Jan !== undefined
              ? months.map((month) => parseFloat(results[month].toFixed(1)))
              : [],
        },
      ],
      categories: months,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [
        {
          name: "Suhu Rata-Rata",
          data: [],
        },
      ],
      categories: months,
    };
  }
};

// get data suhu Maksimum Bulanan
export const getHistorisSuhuMaksimum = async (lattitude, longitude) => {
  try {
    const { data } = await axios.post(
      url,
      body(lattitude, longitude, "temperature-maximum-bulanan")
    );
    // empty data can't 0 cause its a number so using -
    let results = data.hits.hits[0]?._source ? data.hits.hits[0]._source : null;
    return {
      data: [
        {
          name: "Suhu Maksimum",
          data:
            results?.Jan !== undefined
              ? months.map((month) =>
                  parseFloat(parseFloat(results[month]).toFixed(1))
                )
              : [],
        },
      ],
      categories: months,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [
        {
          name: "Suhu Maksimum",
          data: [],
        },
      ],
      categories: months,
    };
  }
};

// get data Index Kebeningan Bulanan
export const getHistorisIndexKebeningan = async (lattitude, longitude) => {
  try {
    const { data } = await axios.post(
      url,
      body(lattitude, longitude, "indeks-kebeningan-bulanan")
    );
    // empty data can't 0 cause its a number so using -
    let results = data.hits.hits[0]?._source ? data.hits.hits[0]._source : null;
    return {
      data: [
        {
          name: "Index Kebeningan",
          data:
            results?.Jan !== undefined
              ? months.map((month) => parseFloat(results[month].toFixed(1)))
              : [],
        },
      ],
      categories: months,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [
        {
          name: "Index Kebeningan",
          data: [],
        },
      ],
      categories: months,
    };
  }
};

// get data Kecepatan Angin Maksimum Bulanan
export const getHistorisKecepatanAnginMaksimum = async (
  lattitude,
  longitude
) => {
  try {
    const { data } = await axios.post(
      url,
      body(lattitude, longitude, "kecepatan-angin-maksimum-bulanan")
    );
    let results =
      data.hits.hits?.length > 0 || data.hits?.hits[0]?._source
        ? data.hits.hits[0]._source
        : null;
    return {
      data: [
        {
          name: "Kecepatan Angin Maksimum",
          data: results?.Jan
            ? months.map((month) => parseFloat(results[month]))
            : [],
        },
      ],
      categories: months,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [
        {
          name: "Kecepatan Angin Maksimum",
          data: [],
        },
      ],
      categories: months,
    };
  }
};

// get data Kecepatan Angin Maksimum Bulanan
export const getHistorisKecepatanAngin = async (lattitude, longitude) => {
  try {
    const { data } = await axios.post(
      url,
      body(lattitude, longitude, "kecepatan-angin-bulanan")
    );

    let results =
      data.hits.hits.length > 0 || data.hits.hits[0]?._source
        ? data.hits.hits[0]._source
        : null;
    return {
      data: [
        {
          name: "Kecepatan Angin",
          data:
            results?.Jan !== undefined
              ? months.map((month) => parseFloat(results[month]))
              : [],
        },
      ],
      categories: months,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [
        {
          name: "Kecepatan Angin",
          data: [],
        },
      ],
      categories: months,
    };
  }
};

// get data historis arah angin bulanan
export const getHistorisArahAngin = async (lattitude, longitude) => {
  try {
    const { data } = await axios.post(
      url,
      body(lattitude, longitude, "arah-angin-bulanan")
    );
    let results =
      data.hits.hits.length > 0 || data.hits.hits[0]?._source
        ? data.hits.hits[0]._source
        : null;
    return {
      data: [
        {
          name: "Arah Angin",
          data:
            results?.Jan !== undefined
              ? months.map((month) => parseFloat(results[month]))
              : [],
        },
      ],
      categories: months,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [
        {
          name: "Arah Angin",
          data: [],
        },
      ],
      categories: months,
    };
  }
};

// get data historis tutuptan awan total
export const getHistorisTutupanAwanTotal = async (lattitude, longitude) => {
  try {
    const { data } = await axios.post(
      url,
      body(lattitude, longitude, "tutupan-awan-total-bulanan")
    );
    let results =
      data.hits.hits.length > 0 || data.hits.hits[0]?._source
        ? data.hits.hits[0]._source
        : null;
    return {
      data: [
        {
          name: "Tutupan Awan Total",
          data:
            results?.Jan !== undefined
              ? months.map((month) => parseFloat(results[month]).toFixed(1))
              : [],
        },
      ],
      categories: months,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [
        {
          name: "Tutupan Awan Total",
          data: [],
        },
      ],
      categories: months,
    };
  }
};

// get data historis tutuptan awan total
export const getHistorisTutupanAwanRendah = async (lattitude, longitude) => {
  try {
    const { data } = await axios.post(
      url,
      body(lattitude, longitude, "tutupan-awan-rendah-bulanan")
    );
    let results =
      data.hits.hits.length > 0 || data.hits.hits[0]?._source
        ? data.hits.hits[0]._source
        : null;
    return {
      data: [
        {
          name: "Tutupan Awan Rendah",
          data:
            results?.Jan !== undefined
              ? months.map((month) => parseFloat(results[month]))
              : [],
        },
      ],
      categories: months,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [
        {
          name: "Tutupan Awan Rendah",
          data: [],
        },
      ],
      categories: months,
    };
  }
};

// get data historis tutuptan awan total
export const getHistorisTutupanAwanMenengah = async (lattitude, longitude) => {
  try {
    const { data } = await axios.post(
      url,
      body(lattitude, longitude, "tutupan-awan-menengah-bulanan")
    );
    let results =
      data.hits.hits.length > 0 || data.hits.hits[0]?._source
        ? data.hits.hits[0]._source
        : null;
    return {
      data: [
        {
          name: "Tutupan Awan Menengah",
          data:
            results?.Jan !== undefined
              ? months.map((month) => parseFloat(results[month]))
              : [],
        },
      ],
      categories: months,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [
        {
          name: "Tutupan Awan Menengah",
          data: [],
        },
      ],
      categories: months,
    };
  }
};

// get data historis tutuptan awan total
export const getHistorisTutupanAwanTinggi = async (lattitude, longitude) => {
  try {
    const { data } = await axios.post(
      url,
      body(lattitude, longitude, "tutupan-awan-tinggi-bulanan")
    );
    let results =
      data.hits.hits.length > 0 || data.hits.hits[0]?._source
        ? data.hits.hits[0]._source
        : null;
    return {
      data: [
        {
          name: "Tutupan Awan Tinggi",
          data:
            results?.Jan !== undefined
              ? months.map((month) => parseFloat(results[month]))
              : [],
        },
      ],
      categories: months,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [
        {
          name: "Tutupan Awan Tinggi",
          data: [],
        },
      ],
      categories: months,
    };
  }
};

// get data arah matahari
export const getHistorisArahMatahari = async (lattitude, longitude) => {
  try {
    const { data } = await axios.post(
      url,
      body(lattitude, longitude, "arah-matahari-zenith-bulanan")
    );
    let results =
      data.hits.hits.length > 0 || data.hits.hits[0]?._source
        ? data.hits.hits[0]._source
        : null;
    return {
      data: [
        {
          name: "Pergerakan Matahari",
          data:
            results?.Jan !== undefined
              ? months.map((month) => parseFloat(results[month]))
              : [],
        },
      ],
      categories: months,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [
        {
          name: "Pergerakan Matahari",
          data: [],
        },
      ],
      categories: months,
    };
  }
};

// get data curah hujan
export const getHistorisCurahHujan = async (lattitude, longitude) => {
  try {
    const { data } = await axios.post(
      url,
      body(lattitude, longitude, "curah-hujan-bulanan")
    );
    let results =
      data.hits.hits.length > 0 || data.hits.hits[0]?._source
        ? data.hits.hits[0]._source
        : null;
    return {
      data: [
        {
          name: "Curah Hujan",
          data:
            results?.Jan !== undefined
              ? months.map((month) =>
                  parseFloat(parseFloat(results[month]).toFixed(1))
                )
              : [],
        },
      ],
      categories: months,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [
        {
          name: "Curah Hujan",
          data: [],
        },
      ],
      categories: months,
    };
  }
};

// Tahunan
export const getDataTahunan = async (
  lattitude,
  longitude,
  nameIndex,
  nameTitle
) => {
  try {
    const { data } = await axios.post(
      url,
      body(lattitude, longitude, nameIndex)
    );

    let categories = Object.keys(data.hits.hits[0]._source).filter(
      (key) => !["Lat", "Lon", "location"].includes(key)
    );
    let results =
      data.hits.hits.length > 0 || data.hits.hits[0]?._source
        ? data.hits.hits[0]._source
        : null;

    // console.log({
    //   data: [
    //     {
    //       name: nameTitle ? nameTitle : nameIndex,
    //       data:
    //         results && Object.entries(results).length > 0
    //           ? categories.map((categori) =>
    //               parseFloat(results[categori]).toFixed(1)
    //             )
    //           : [],
    //     },
    //   ],
    //   categories: categories,
    // });
    return {
      data: [
        {
          name: nameTitle ? nameTitle : nameIndex,
          data:
            results && Object.entries(results).length > 0
              ? categories.map((categori) =>
                  parseFloat(results[categori]).toFixed(1)
                )
              : [],
        },
      ],
      categories: categories,
      // categories.map((item, index) => {
      //   if (index === 0 || index === categories.length - 1 || index % 5 === 0) {
      //     return item;
      //   } else {
      //     return "";
      //   }
      // }),
    };
  } catch (error) {
    console.log(error);
    return {
      data: [
        {
          name: nameTitle,
          data: [],
        },
      ],
      categories: [],
    };
  }
};

// get All save location
export const savedAllLocation = async (token) => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_URL_API}/saveloc`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

// get Windrose Data
export const getDataWindrose = async (month, lon, lat) => {
  const windDirection = [
    ["N", 0],
    ["NNE", 22.5],
    ["NE", 45],
    ["ENE", 67.5],
    ["E", 90],
    ["ESE", 112.5],
    ["SE", 135],
    ["SSE", 157.5],
    ["S", 180],
    ["SSW", 202.5],
    ["SW", 225],
    ["WSW", 247.5],
    ["W", 270],
    ["WNW", 292.5],
    ["NW", 315],
    ["NNW", 337.5],
  ];

  return new Promise(async (resolve, reject) => {
    const body = {
      distance: "10km",
      lat: lat,
      lon: lon,
    };

    try {
      const dataWindDir = await axios.post(
        `${process.env.REACT_APP_URL_API}/month/${month
          .split(",")
          .map((month) => month.trim() + "1")
          .join(",")}`,
        body
      );

      try {
        const dataWind = await axios.post(
          `${process.env.REACT_APP_URL_API}/month/${month
            .split(",")
            .map((month) => month.trim() + "2")
            .join(",")}`,
          body
        );

        const getData = dataWind.data.hits.hits.map((item, index) => {
          const dataJsonDir = Object.entries(
            dataWindDir.data.hits.hits[index]._source
          )
            .filter(
              ([key]) => key !== "Lon" && key !== "Lat" && key !== "location"
            )
            .map((item) => item[1]);

          const dataJson = Object.entries(item._source)
            .filter(
              ([key]) => key !== "Lon" && key !== "Lat" && key !== "location"
            )
            .map((item) => item[1]);

          const result = dataJson.map((data, index) => [
            dataJsonDir[index],
            parseFloat(parseFloat(data).toFixed(1)),
            parseInt(Object.keys(item._source)[index]),
          ]);

          for (let i = 0; i < result.length; i++) {
            if (result[i][0] === null) {
              result[i][0] = null;
            } else if (result[i][0] > 349.75) {
              result[i][0] = 0;
            } else if (result[i][0] >= 337.5 && result[i][0] <= 349.75) {
              result[i][0] = 337.5;
            } else if (result[i][0] % 22.5 !== 0) {
              result[i][0] = Math.round(result[i][0] / 22.5) * 22.5;
            }
          }

          // console.log({ result });
          return result;
        });

        resolve(getData.flat().sort((a, b) => a[2] - b[2]));
      } catch (error) {
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
};
