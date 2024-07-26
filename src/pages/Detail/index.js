import React, { useEffect, useRef, useState } from "react";
import Chart from "@components/molecule/Chart/Chart";
import { AiOutlineArrowLeft, AiOutlineLock } from "react-icons/ai";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
  IoMdClose,
} from "react-icons/io";
import { FaLocationArrow, FaRegFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getDataTahunan,
  getDataWindrose,
  getHistorisArahAngin,
  getHistorisArahMatahari,
  getHistorisCurahHujan,
  getHistorisIndexKebeningan,
  getHistorisKecepatanAngin,
  getHistorisKecepatanAnginMaksimum,
  getHistorisPotensi,
  getHistorisSuhuMaksimum,
  getHistorisSuhuRataRata,
  getHistorisTutupanAwanMenengah,
  getHistorisTutupanAwanRendah,
  getHistorisTutupanAwanTinggi,
  getHistorisTutupanAwanTotal,
} from "@hooks/DataHook";
import { useDispatch, useSelector } from "react-redux";
import { setLoginPopup } from "@redux/features/login/loginSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Cookies from "js-cookie";
import Dropdown from "@components/molecule/Dropdown";
import { Menu } from "@headlessui/react";
import { BsFiletypeCsv } from "react-icons/bs";
import DetailMap from "@components/molecule/Map/DetailMap";
import Modal from "@components/molecule/Modal";
import Windrose from "@components/molecule/Chart/Windrose";
import CustomLineChart from "@components/molecule/Chart/CustomChart/CustomLineChart";
import CustomBarChart from "@components/molecule/Chart/CustomChart/CustomeBarChart";

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

const monthsCom = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const monthsShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const Detail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pdfRef = useRef();
  const urlParams = new URLSearchParams(window.location.search);
  const subscription = Cookies.get("_subs")
    ? JSON.parse(Cookies.get("_subs"))
    : null;

  const { user } = useSelector((state) => state.auth);
  const { realCoordinate } = useSelector((state) => state.location);

  const cookieCoordinate = Cookies.get("coordinate");

  const [dataHistorisActive, setDataHistorisActive] = useState(true);
  // data potensi exacly should get from API
  const [lonLat, setLonLat] = useState({
    lon: 0,
    lat: 0,
    region: "",
  });

  const [selectOption, setSelectOption] = useState({
    value: "month",
    for: "",
  });

  const [isTahunan, setIsTahunan] = useState("month");
  const [years, setYears] = useState([]);

  useEffect(() => {
    const long = parseFloat(urlParams.get("long"));
    const lat = parseFloat(urlParams.get("lat"));
    const region = urlParams.get("region");

    setLonLat({
      lon: parseFloat(parseFloat(long).toFixed(1)),
      lat: parseFloat(parseFloat(lat).toFixed(1)),
      region: region,
    });
  }, []);

  // Get Data Potensi
  const [dataPotensiBar, setDataPotensiBar] = useState({
    data: [
      {
        name: "Potensi Energi Surya",
        data: [],
      },
    ],
    categories: [],
  });

  // index kebeningan
  const [dataIndexKebeninganLine, setDataIndexKebeningan] = useState({
    data: [
      {
        name: "Index Kebeningan",
        data: [],
      },
    ],
    categories: [],
  });

  // pergerakan matahari
  const [dataPergerakanMatahariLine, setDataPergerakanMatahariLine] = useState({
    data: [
      {
        name: "Pergerakan Matahari",
        data: [],
      },
    ],
    categories: [],
  });

  // curah hujan
  const [dataCurahHujanBar, setDataCurahHujan] = useState({
    data: [
      {
        name: "Curah Hujan",
        data: [],
      },
    ],
    categories: [],
  });

  // suhu
  const [dataSuhuRataRataLine, setDataSuhuRataRataLine] = useState(null);
  const [dataSuhuMaximumLine, setDataSuhuMaximumLine] = useState(null);

  const [dataSuhuLine, setDataSuhuLine] = useState({
    data: [
      {
        name: "Suhu",
        data: [],
      },
    ],
    categories: [],
  });

  useEffect(() => {
    if (dataSuhuMaximumLine && dataSuhuRataRataLine) {
      setDataSuhuLine({
        ...dataSuhuLine,
        data: [dataSuhuMaximumLine.data[0], dataSuhuRataRataLine.data[0]],
      });
    }
  }, [dataSuhuRataRataLine, dataSuhuMaximumLine]);

  // angin
  const [
    dataHistorisKecepatanAnginMaksimum,
    setDataHistorisKecepatanAnginMaksimum,
  ] = useState({
    data: [
      {
        name: "Kecepatan Angin Maksimum",
        data: [],
      },
    ],
    categories: [],
  });

  const [dataHistorisKecepatanAngin, setDataHistorisKecepatanAngin] = useState({
    data: [
      {
        name: "Kecepatan Angin",
        data: [],
      },
    ],
    categories: [],
  });

  const [dataHistorisAngin, setDataHistorisAngin] = useState({
    data: [
      {
        name: "Arah Angin",
        data: [],
      },
    ],
    categories: [],
  });

  // awan
  const [dataTutupanAwanTotal, setDataTutupanAwanTotal] = useState(null);
  const [dataTutupanAwanRendah, setDataTutupanAwanRendah] = useState(null);
  const [dataTutupanAwanMenegah, setDataTutupanAwanMenegah] = useState(null);
  const [dataTutupanAwanTinggi, setDataTutupanAwanTinggi] = useState(null);

  const [dataTutupanAwanLine, setDataTutupanAwanLine] = useState({
    data: [
      {
        name: "Tuupan Awan Total",
        data: [],
      },
      {
        name: "Tutupan Awan Rendah",
        data: [],
      },
      {
        name: "Tutupan Awan Menengah",
        data: [],
      },
      {
        name: "Tutupan Awan Tinggi",
        data: [],
      },
    ],
    categories: [],
  });

  useEffect(() => {
    if (
      dataTutupanAwanTotal &&
      dataTutupanAwanRendah &&
      dataTutupanAwanMenegah &&
      dataTutupanAwanTinggi
    )
      setDataTutupanAwanLine({
        ...dataTutupanAwanLine,
        data: [
          dataTutupanAwanTotal,
          dataTutupanAwanRendah,
          dataTutupanAwanMenegah,
          dataTutupanAwanTinggi,
        ],
      });
  }, [
    dataTutupanAwanTotal,
    dataTutupanAwanRendah,
    dataTutupanAwanMenegah,
    dataTutupanAwanTinggi,
  ]);

  useEffect(() => {
    if (lonLat.region) {
      getHistorisPotensi(lonLat.lat, lonLat.lon).then((res) => {
        setDataPotensiBar(res);
      });
      getHistorisTutupanAwanTotal(lonLat.lat, lonLat.lon).then((res) => {
        setDataTutupanAwanTotal(res.data[0]);
        setDataTutupanAwanLine({
          ...dataTutupanAwanLine,
          categories: res.categories,
        });
      });
      getHistorisTutupanAwanRendah(lonLat.lat, lonLat.lon).then((res) => {
        setDataTutupanAwanRendah(res.data[0]);
      });
      getHistorisTutupanAwanMenengah(lonLat.lat, lonLat.lon).then((res) => {
        setDataTutupanAwanMenegah(res.data[0]);
      });
      getHistorisTutupanAwanTinggi(lonLat.lat, lonLat.lon).then((res) => {
        setDataTutupanAwanTinggi(res.data[0]);
      });
      getHistorisIndexKebeningan(lonLat.lat, lonLat.lon).then((res) =>
        setDataIndexKebeningan(res)
      );
      getHistorisArahMatahari(lonLat.lat, lonLat.lon).then((res) =>
        setDataPergerakanMatahariLine(res)
      );
      getHistorisCurahHujan(lonLat.lat, lonLat.lon).then((res) =>
        setDataCurahHujan(res)
      );
      getHistorisSuhuRataRata(lonLat.lat, lonLat.lon).then((res) => {
        setDataSuhuRataRataLine(res);
        setDataSuhuLine({
          ...dataSuhuLine,
          categories: res.categories,
        });
      });
      getHistorisSuhuMaksimum(lonLat.lat, lonLat.lon).then((res) =>
        setDataSuhuMaximumLine(res)
      );
      getHistorisKecepatanAngin(lonLat.lat, lonLat.lon).then((res) =>
        setDataHistorisKecepatanAngin(res)
      );
      getHistorisKecepatanAnginMaksimum(lonLat.lat, lonLat.lon).then((res) =>
        setDataHistorisKecepatanAnginMaksimum(res)
      );
      getHistorisArahAngin(lonLat.lat, lonLat.lon).then((res) =>
        setDataHistorisAngin(res)
      );
    }
  }, [lonLat]);

  useEffect(() => {
    if (lonLat.region) {
      if (isTahunan === "month") {
        getHistorisPotensi(lonLat.lat, lonLat.lon).then((res) => {
          setDataPotensiBar(res);
        });
        getHistorisTutupanAwanTotal(lonLat.lat, lonLat.lon).then((res) => {
          setDataTutupanAwanTotal(res.data[0]);
          setDataTutupanAwanLine({
            ...dataTutupanAwanLine,
            categories: res.categories,
          });
        });
        getHistorisTutupanAwanRendah(lonLat.lat, lonLat.lon).then((res) => {
          setDataTutupanAwanRendah(res.data[0]);
        });
        getHistorisTutupanAwanMenengah(lonLat.lat, lonLat.lon).then((res) => {
          setDataTutupanAwanMenegah(res.data[0]);
        });
        getHistorisTutupanAwanTinggi(lonLat.lat, lonLat.lon).then((res) => {
          setDataTutupanAwanTinggi(res.data[0]);
        });
        getHistorisIndexKebeningan(lonLat.lat, lonLat.lon).then((res) =>
          setDataIndexKebeningan(res)
        );
        getHistorisArahMatahari(lonLat.lat, lonLat.lon).then((res) =>
          setDataPergerakanMatahariLine(res)
        );
        getHistorisCurahHujan(lonLat.lat, lonLat.lon).then((res) =>
          setDataCurahHujan(res)
        );
        getHistorisSuhuRataRata(lonLat.lat, lonLat.lon).then((res) => {
          setDataSuhuRataRataLine(res);
          setDataSuhuLine({
            ...dataSuhuLine,
            categories: res.categories,
          });
        });
        getHistorisSuhuMaksimum(lonLat.lat, lonLat.lon).then((res) =>
          setDataSuhuMaximumLine(res)
        );
        getHistorisKecepatanAngin(lonLat.lat, lonLat.lon).then((res) =>
          setDataHistorisKecepatanAngin(res)
        );
        getHistorisKecepatanAnginMaksimum(lonLat.lat, lonLat.lon).then((res) =>
          setDataHistorisKecepatanAnginMaksimum(res)
        );
        getHistorisArahAngin(lonLat.lat, lonLat.lon).then((res) =>
          setDataHistorisAngin(res)
        );
      } else if (isTahunan === "year") {
        getDataTahunan(lonLat.lat, lonLat.lon, "potensi-tahunan").then(
          (res) => {
            setDataPotensiBar(res);
            setDataPergerakanMatahariLine({
              categories: res.categories,
              data: res.data.map((item) => ({
                name: "Pergerakan Matahari",
                data: res.categories.map((_) => "-"),
              })),
            });
            setYears(res.categories);
          }
        );
        getDataTahunan(lonLat.lat, lonLat.lon, "curah-hujan-tahunan").then(
          (res) => {
            setDataCurahHujan(res);
          }
        );
        getDataTahunan(
          lonLat.lat,
          lonLat.lon,
          "indeks-kebeningan-tahunan"
        ).then((res) => {
          setDataIndexKebeningan(res);
        });
        getDataTahunan(lonLat.lat, lonLat.lon, "temperature-tahunan").then(
          (res) => {
            setDataSuhuRataRataLine(res);
            setDataSuhuLine({
              ...dataSuhuLine,
              categories: res.categories,
            });
          }
        );
        getDataTahunan(
          lonLat.lat,
          lonLat.lon,
          "temperature-maximum-tahunan"
        ).then((res) => {
          setDataSuhuMaximumLine(res);
        });
        getDataTahunan(
          lonLat.lat,
          lonLat.lon,
          "tutupan-awan-total-tahunan"
        ).then((res) => {
          setDataTutupanAwanTotal(res.data[0]);
          setDataTutupanAwanLine({
            ...dataTutupanAwanLine,
            categories: res.categories,
          });
        });
        getDataTahunan(
          lonLat.lat,
          lonLat.lon,
          "tutupan-awan-tinggi-tahunan"
        ).then((res) => {
          setDataTutupanAwanTinggi(res.data[0]);
        });
        getDataTahunan(
          lonLat.lat,
          lonLat.lon,
          "tutupan-awan-menengah-tahunan"
        ).then((res) => {
          setDataTutupanAwanMenegah(res.data[0]);
        });
        getDataTahunan(
          lonLat.lat,
          lonLat.lon,
          "tutupan-awan-rendah-tahunan"
        ).then((res) => {
          setDataTutupanAwanRendah(res.data[0]);
        });
      }
    }
  }, [lonLat, isTahunan]);

  // delete this after done new one
  useEffect(() => {
    if (lonLat.region) {
      if (selectOption.for === "potensi energi surya") {
        if (selectOption.value === "month") {
          getHistorisPotensi(lonLat.lat, lonLat.lon).then((res) =>
            setDataPotensiBar(res)
          );
        } else {
          getDataTahunan(lonLat.lat, lonLat.lon, "potensi-tahunan").then(
            (res) => setDataPotensiBar(res)
          );
        }
      } else if (selectOption.for === "tutupan awan total") {
        if (selectOption.value === "month") {
          getHistorisTutupanAwanTotal(lonLat.lat, lonLat.lon).then((res) => {
            setDataTutupanAwanTotal(res.data[0]);
            setDataTutupanAwanLine({
              ...dataTutupanAwanLine,
              categories: res.categories,
            });
          });
          getHistorisTutupanAwanRendah(lonLat.lat, lonLat.lon).then((res) => {
            setDataTutupanAwanRendah(res.data[0]);
          });
          getHistorisTutupanAwanMenengah(lonLat.lat, lonLat.lon).then((res) => {
            setDataTutupanAwanMenegah(res.data[0]);
          });
          getHistorisTutupanAwanTinggi(lonLat.lat, lonLat.lon).then((res) => {
            setDataTutupanAwanTinggi(res.data[0]);
          });
        } else {
          getDataTahunan(
            lonLat.lat,
            lonLat.lon,
            "tutupan-awan-total-tahunan"
          ).then((res) => {
            setDataTutupanAwanTotal(res.data[0]);
            setDataTutupanAwanLine({
              ...dataTutupanAwanLine,
              categories: res.categories,
            });
          });
          getDataTahunan(
            lonLat.lat,
            lonLat.lon,
            "tutupan-awan-rendah-tahunan"
          ).then((res) => {
            setDataTutupanAwanRendah(res.data[0]);
          });
          getDataTahunan(
            lonLat.lat,
            lonLat.lon,
            "tutupan-awan-menengah-tahunan"
          ).then((res) => {
            setDataTutupanAwanMenegah(res.data[0]);
          });
          getDataTahunan(
            lonLat.lat,
            lonLat.lon,
            "tutupan-awan-tinggi-tahunan"
          ).then((res) => {
            setDataTutupanAwanTinggi(res.data[0]);
          });
        }
      } else if (selectOption.for === "index kebeningan") {
        if (selectOption.value === "month") {
          getHistorisIndexKebeningan(lonLat.lat, lonLat.lon).then((res) =>
            setDataIndexKebeningan(res)
          );
        } else {
          getDataTahunan(
            lonLat.lat,
            lonLat.lon,
            "indeks-kebeningan-tahunan"
          ).then((res) => {
            setDataIndexKebeningan(res);
          });
        }
      } else if (selectOption.for === "curah hujan") {
        if (selectOption.value === "month") {
          getHistorisCurahHujan(lonLat.lat, lonLat.lon).then((res) =>
            setDataCurahHujan(res)
          );
        } else {
          getDataTahunan(lonLat.lat, lonLat.lon, "curah-hujan-tahunan").then(
            (res) => {
              setDataCurahHujan(res);
            }
          );
        }
      } else if (selectOption.for === "suhu") {
        if (selectOption.value === "month") {
          getHistorisSuhuRataRata(lonLat.lat, lonLat.lon).then((res) => {
            setDataSuhuRataRataLine(res);
            setDataSuhuLine({
              ...dataSuhuLine,
              categories: res.categories,
            });
          });
          getHistorisSuhuMaksimum(lonLat.lat, lonLat.lon).then((res) =>
            setDataSuhuMaximumLine(res)
          );
        } else {
          getDataTahunan(lonLat.lat, lonLat.lon, "temperature-tahunan").then(
            (res) => {
              setDataSuhuRataRataLine(res);
              setDataSuhuLine({
                ...dataSuhuLine,
                categories: res.categories,
              });
            }
          );
          getDataTahunan(
            lonLat.lat,
            lonLat.lon,
            "temperature-maximum-tahunan"
          ).then((res) => {
            setDataSuhuMaximumLine(res);
          });
        }
      } else if (selectOption.for === "kecepatan angin") {
        if (selectOption.value === "month") {
          getHistorisKecepatanAngin(lonLat.lat, lonLat.lon).then((res) =>
            setDataHistorisKecepatanAngin(res)
          );
        } else {
          getDataTahunan(
            lonLat.lat,
            lonLat.lon,
            "kecepatan-angin-tahunan"
          ).then((res) => {
            setDataHistorisKecepatanAngin(res);
          });
        }
      }
    }
  }, [lonLat, selectOption]);

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

  const [dataArahAnginWinds, setDataArahAnginWinds] = useState({
    data: [...new Array(12)].map((item, index) => ({
      name: months[index],
      data: [...new Array(16)].map((item, index) => [
        windDirection[index][0],
        Math.random() * 10 + index,
      ]),
    })),
    maxCount: 100,
    categories: [
      "N",
      "",
      "",
      "",
      "E",
      "",
      "",
      "",
      "S",
      "",
      "",
      "",
      "W",
      "",
      "",
      "",
    ],
  });

  useEffect(() => {
    if (dataHistorisAngin.data[0].data.length > 0) {
      setDataArahAnginWinds({
        ...dataArahAnginWinds,
        maxCount: Math.max(...dataHistorisKecepatanAnginMaksimum.data[0].data),
        data: dataHistorisAngin.data[0].data.map((arahAngin, index) => ({
          name:
            months[index] +
            ` ${parseFloat(
              dataHistorisKecepatanAnginMaksimum.data[0].data[index]
            ).toFixed(1)}/ms`,
          data: windDirection.map((item) => [
            item[0],
            item[1] === arahAngin
              ? dataHistorisKecepatanAnginMaksimum.data[0].data[index]
              : 0,
          ]),
        })),
      });
      // setDataArahAnginWinds();
    }
  }, [dataHistorisAngin]);

  // windrose
  const [monthsData] = useState([
    {
      id: 1,
      name: "Januari",
      value: "januari",
    },
    {
      id: 2,
      name: "Februari",
      value: "februari",
    },
    {
      id: 3,
      name: "Maret",
      value: "maret",
    },
    {
      id: 4,
      name: "April",
      value: "april",
    },
    {
      id: 5,
      name: "Mei",
      value: "mei",
    },
    {
      id: 6,
      name: "Juni",
      value: "juni",
    },
    {
      id: 7,
      name: "Juli",
      value: "juli",
    },
    {
      id: 8,
      name: "Agustus",
      value: "agustus",
    },
    {
      id: 9,
      name: "September",

      value: "september",
    },
    {
      id: 10,
      name: "Oktober",
      value: "oktober",
    },
    {
      id: 11,
      name: "November",
      value: "november",
    },
    {
      id: 12,
      name: "Desember",
      value: "desember",
    },
  ]);

  const [dataWindrose, setDataWindrose] = useState([]);
  const [windrose, setWindrose] = useState([]);
  const [monthWindrose, setMonthWindrose] = useState(null);

  useEffect(() => {
    if (dataWindrose.length > 0) {
      const realData = dataWindrose;

      const resultData = [
        { name: "< 0.5 m/s", data: [] },
        { name: "0.5 - 2 m/s", data: [] },
        { name: "2-4 m/s", data: [] },
        { name: "4-6 m/s", data: [] },
        { name: "6-8 m/s", data: [] },
        { name: "> 10 m/s", data: [] },
      ];

      realData.forEach((item) => {
        const value = item[1];
        if (value < 0.5) {
          resultData[0].data.push(item); //data index pertama itu windrose data ke 2 rata rata dari hasil item denga windrose
        } else if (value >= 0.5 && value < 2) {
          resultData[1].data.push(item); //data index pertama itu windrose data ke 2 rata rata dari hasil item denga windrose
        } else if (value >= 2 && value < 4) {
          resultData[2].data.push(item); //data index pertama itu windrose data ke 2 rata rata dari hasil item denga windrose
        } else if (value >= 4 && value < 6) {
          resultData[3].data.push(item); //data index pertama itu windrose data ke 2 rata rata dari hasil item denga windrose
        } else if (value >= 6 && value < 8) {
          resultData[4].data.push(item); //data index pertama itu windrose data ke 2 rata rata dari hasil item denga windrose
        } else if (value > 10) {
          resultData[5].data.push(item); //data index pertama itu windrose data ke 2 rata rata dari hasil item denga windrose
        }
      });

      const hasil = [];

      for (let i = 0; i < resultData.length; i++) {
        const category = resultData[i];
        const newData = [];

        for (let j = 0; j < windDirection.length; j++) {
          const angle = windDirection[j][1];
          const angleData = category.data.filter((item) => item[0] === angle);

          if (angleData.length > 0) {
            const sum = angleData.reduce((total, item) => total + item[1], 0);
            const average = sum / angleData.length;
            newData.push([windDirection[j][0], parseFloat(average.toFixed(1))]);
          } else {
            newData.push([windDirection[j][0], 0]);
          }
        }

        hasil.push({ name: category.name, data: newData });

        setWindrose(hasil);
      }
    }
  }, [dataWindrose.length]);

  useEffect(() => {
    const getDataTahunan = async () => {
      try {
        const data1 = await getDataWindrose(
          "januari, februari, maret, april, mei, juni",
          104,
          -5.3
        );

        try {
          const data2 = await getDataWindrose(
            "juli, agustus, september, oktober, november, desember",
            104,
            -5.3
          );
          setDataWindrose([...data1, ...data2]);
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getDataBulanan = async () => {
      try {
        const data = await getDataWindrose(monthWindrose, 104, -5.3);

        setDataWindrose(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (lonLat.region) {
      if (monthWindrose) {
        getDataBulanan(monthWindrose);
      } else {
        getDataTahunan();
      }
    }
  }, [monthWindrose, lonLat]);

  const handleDownlaodPdf = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgY = 0;
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgx = (pdfWidth - imgWidth * ratio) / 2;

      pdf.addImage(
        imgData,
        "PNG",
        imgx,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`${lonLat.region}.pdf`);
    });
  };

  // data for table Historis
  const [tableDataHistoris, setTableDataHistoris] = useState([
    {
      for: "",
      name: "Distribusi Arah Angin (m/s)",
      data: [],
      border: false,
    },
    {
      for: "Distribusi Arah Angin (m/s)",
      name: "Max",
      data: [],
      border: true,
    },
    {
      for: "",
      name: "Suhu (C)",
      data: months.map((month) => ({
        name: month,
        value: 1,
      })),
      border: false,
    },
    {
      for: "Suhu (C)",
      name: "Max",
      data: months.map((month) => ({
        name: month,
        value: 1,
      })),
      border: true,
    },
    {
      for: "",
      name: "Tutupan Awan",
      data: months.map((month) => ({
        name: month,
        value: 1,
      })),
      border: false,
    },
    {
      for: "Tutupan Awan",
      name: "High",
      data: months.map((month) => ({
        name: month,
        value: 1,
      })),
      border: false,
    },
    {
      for: "Tutupan Awan",
      name: "Med",
      data: months.map((month) => ({
        name: month,
        value: 1,
      })),
      border: false,
    },
    {
      for: "Tutupan Awan",
      name: "Low",
      data: months.map((month) => ({
        name: month,
        value: 1,
      })),
      border: false,
    },
  ]);

  useEffect(() => {
    if (
      dataSuhuRataRataLine?.data[0]?.data?.length === 12 &&
      dataSuhuMaximumLine &&
      dataTutupanAwanTotal &&
      dataTutupanAwanTinggi &&
      dataTutupanAwanMenegah &&
      dataTutupanAwanRendah &&
      isTahunan === "month"
    ) {
      setTableDataHistoris(
        tableDataHistoris.map((item) => {
          if (item.name === "Suhu (C)") {
            return {
              ...item,
              data: months.map((month, index) => ({
                name: month,
                value: parseFloat(
                  dataSuhuRataRataLine.data[0].data[index].toFixed(1)
                ),
              })),
            };
          } else if (item.for === "Suhu (C)") {
            return {
              ...item,
              data: months.map((month, index) => ({
                name: month,
                value: parseFloat(
                  dataSuhuMaximumLine.data[0].data[index].toFixed(1)
                ),
              })),
            };
          } else if (item.name === "Tutupan Awan") {
            return {
              ...item,
              data: months.map((month, index) => ({
                name: month,
                value: parseFloat(parseFloat(dataTutupanAwanTotal.data[index])),
              })),
            };
          } else if (item.name === "High") {
            return {
              ...item,
              data: months.map((month, index) => ({
                name: month,
                value: parseFloat(dataTutupanAwanTinggi.data[index].toFixed(1)),
              })),
            };
          } else if (item.name === "Med") {
            return {
              ...item,
              data: months.map((month, index) => ({
                name: month,
                value: parseFloat(
                  dataTutupanAwanMenegah.data[index].toFixed(1)
                ),
              })),
            };
          } else if (item.name === "Low") {
            return {
              ...item,
              data: months.map((month, index) => ({
                name: month,
                value: parseFloat(dataTutupanAwanRendah.data[index].toFixed(1)),
              })),
            };
          } else {
            return {
              ...item,
              data: months.map((month, index) => ({
                name: month,
                value: 1,
              })),
            };
          }
        })
      );
    } else if (
      dataSuhuRataRataLine &&
      dataSuhuMaximumLine &&
      dataTutupanAwanTotal &&
      dataTutupanAwanTinggi &&
      dataTutupanAwanMenegah &&
      dataTutupanAwanRendah &&
      isTahunan === "year" &&
      years.length > 0
    ) {
      setTableDataHistoris(
        tableDataHistoris.map((item) => {
          if (item.name === "Suhu (C)") {
            return {
              ...item,
              data: years.map((year, index) => ({
                name: year,
                // value: 1,
                value: parseFloat(dataSuhuRataRataLine.data[0].data[index]),
              })),
            };
          } else if (item.for === "Suhu (C)") {
            return {
              ...item,
              data: years.map((year, index) => ({
                name: year,
                value: parseFloat(dataSuhuMaximumLine.data[0].data[index]),
                // value: 1,
              })),
            };
          } else if (item.name === "Tutupan Awan") {
            return {
              ...item,
              data: years.map((year, index) => ({
                name: year,
                value: parseFloat(parseFloat(dataTutupanAwanTotal.data[index])),
                // value: 1,
              })),
            };
          } else if (item.name === "High") {
            return {
              ...item,
              data: years.map((year, index) => ({
                name: year,
                value: parseFloat(dataTutupanAwanTinggi.data[index]),
                // value: 1,
              })),
            };
          } else if (item.name === "Med") {
            return {
              ...item,
              data: years.map((year, index) => ({
                name: year,
                value: parseFloat(dataTutupanAwanMenegah.data[index]),
                // value: 1,
              })),
            };
          } else if (item.name === "Low") {
            return {
              ...item,
              data: years.map((year, index) => ({
                name: year,
                value: parseFloat(dataTutupanAwanRendah.data[index]),
                // value: 1,
              })),
            };
          } else {
            return {
              ...item,
              data: years.map((year, index) => ({
                name: year,
                value: 1,
              })),
            };
          }
        })
      );
    }
  }, [
    dataSuhuRataRataLine,
    dataSuhuMaximumLine,
    dataTutupanAwanTotal,
    dataTutupanAwanTinggi,
    dataTutupanAwanMenegah,
    dataTutupanAwanRendah,
    isTahunan,
    years.length,
  ]);

  const [openModalAngin, setOpenModalAngin] = useState(false);
  const [openModalSuhu, setOpenModalSuhu] = useState(false);
  const [openModalAwan, setOpenModalAwan] = useState(false);

  // data prakiraan

  function generateRandomNumber(min = 1, max = 7) {
    // Generate a random decimal between 0 and 1
    const randomDecimal = Math.random();

    // Scale the random decimal to the desired range
    const randomInRange = randomDecimal * (max - min + 1);

    // Shift the range to start from the minimum value
    const randomNumber = Math.floor(randomInRange) + min;

    return randomNumber;
  }

  const [dataPotensi, setDataPotensi] = useState([]);
  const [categoriesPrakiraan] = useState([0, 3, 6, 9, 12, 15, 18, 21, 24]);
  const [slicePotensi, setSlicePotensi] = useState({
    start: 0,
    finish: 4,
  });
  const [dataIndeksKebeningan, setDataIndeksKebeningan] = useState([]);
  const [sliceIndeksKebeningan, setSliceIndeksKebeningan] = useState({
    start: 0,
    finish: 4,
  });

  // data for table Prakiraan
  const [tableDataPrakiraan, setTableDataPrakiraan] = useState([]);

  useEffect(() => {
    if (subscription?.package?.day) {
      setDataPotensi(
        [...new Array(subscription.package.day)].map((item, index) => ({
          name: `${index + 1} - 05 - 2023`,
          data: [
            {
              name: "Potensi",
              data: [...new Array(9)].map((item) => generateRandomNumber()),
            },
          ],
        }))
      );

      setDataIndeksKebeningan(
        [...new Array(subscription.package.day)].map((item, index) => ({
          name: `201${index}`,
          data: [
            {
              name: "Indeks Kebeningan",
              data: [...new Array(9)].map((item) => generateRandomNumber()),
            },
          ],
        }))
      );

      setTableDataPrakiraan([
        {
          for: "",
          name: "Distribusi Arah Angin (m/s)",
          data: [],
          border: false,
        },
        {
          for: "Distribusi Arah Angin (m/s)",
          name: "Max",
          data: [],
          border: true,
        },
        {
          for: "",
          name: "Suhu (C)",
          data: [...new Array(subscription.package.day)].map((_, index) => ({
            name: index,
            value: generateRandomNumber(1, 10),
          })),
          border: false,
        },
        {
          for: "Suhu (C)",
          name: "Max",
          data: [...new Array(subscription.package.day)].map((_, index) => ({
            name: index,
            value: generateRandomNumber(1, 10),
          })),
          border: true,
        },
        {
          for: "",
          name: "Tutupan Awan",
          data: [...new Array(subscription.package.day)].map((_, index) => ({
            name: index,
            value: generateRandomNumber(1, 10),
          })),
          border: false,
        },
        {
          for: "Tutupan Awan",
          name: "High",
          data: [...new Array(subscription.package.day)].map((_, index) => ({
            name: index,
            value: generateRandomNumber(1, 10),
          })),
          border: false,
        },
        {
          for: "Tutupan Awan",
          name: "Med",
          data: [...new Array(subscription.package.day)].map((_, index) => ({
            name: index,
            value: generateRandomNumber(1, 10),
          })),
          border: false,
        },
        {
          for: "Tutupan Awan",
          name: "Low",
          data: [...new Array(subscription.package.day)].map((_, index) => ({
            name: index,
            value: generateRandomNumber(1, 10),
          })),
          border: true,
        },
        {
          for: "",
          name: "Curah Hujan (mm)",
          data: [...new Array(subscription.package.day)].map((_, index) =>
            generateRandomNumber(50, 100)
          ),
          border: false,
        },
      ]);
    }
  }, [subscription?.package?.day]);

  return (
    <div className="font-poppins bg-[#F7FFF4] px-[2%] pt-10  2xl:container mx-auto">
      {/* Modal */}
      <Modal
        isOpen={openModalAngin}
        setIsOpen={setOpenModalAngin}
        className="max-w-[50vw] relative"
      >
        <div className="px-10 py-4">
          <p className="font-medium text-blue-500 pb-10">
            Distribusi Arah Angin (m/s)
          </p>
          <Windrose
            data={windrose}
            colors={[
              "#FDE624",
              "#BEDE2C",
              "#6CCD59",
              "#35B779",
              "#1F9E89",
              "#26828F",
              "#31698E",
            ]}
          />
        </div>

        <IoMdClose
          className="text-red-500 hover:opacity-60 absolute top-4 right-4 cursor-pointer hover:scale-105 duration-150"
          onClick={() => {
            setOpenModalAngin(false);
          }}
        />
      </Modal>

      {/* modal suhu */}
      <Modal
        isOpen={openModalSuhu}
        setIsOpen={setOpenModalSuhu}
        className="max-w-[50vw] relative"
      >
        <div className="px-10 py-4">
          <p className="font-medium text-black pb-10 text-2xl">Suhu (C)</p>
          <div className="relative">
            <Chart
              data={dataSuhuLine.data}
              categories={isTahunan === "month" ? monthsShort : years}
              colors={["rgb(239, 68, 68)", "rgb(59, 130, 246)"]}
              line
            />
            {isTahunan === "year" && (
              <div className="pl-14 pr-3 text-xs flex absolute text-black/70 -bottom-1 w-full justify-between">
                {years.map((year, index) => (
                  <div key={index}>
                    {index === 0 ||
                    index === years.length - 1 ||
                    index % 5 === 0
                      ? year
                      : ""}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <IoMdClose
          className="text-red-500 hover:opacity-60 absolute top-4 right-4 cursor-pointer hover:scale-105 duration-150"
          onClick={() => {
            setOpenModalSuhu(false);
          }}
        />
      </Modal>

      {/* Modal Tutupan awan */}
      <Modal
        isOpen={openModalAwan}
        setIsOpen={setOpenModalAwan}
        className="max-w-[50vw] relative"
      >
        <div className="px-10 py-4">
          <p className="font-medium text-black pb-10 text-2xl">Tutupan Awan</p>
          <div className="relative">
            <Chart
              data={dataTutupanAwanLine.data}
              categories={isTahunan === "month" ? monthsShort : years}
              styleTitle={{
                fontSize: "14px",
                color: "rgb(251, 146, 60)",
              }}
              colors={[
                "rgb(30, 64, 175)",
                "rgba(34, 197, 94, .5)",
                "rgba(234, 179, 8, .5)",
                "rgba(239, 68, 68, .5)",
              ]}
              line
            />
            {isTahunan === "year" && (
              <div className="pl-14 pr-3 text-xs flex absolute text-black/70 -bottom-1 w-full justify-between">
                {years.map((year, index) => (
                  <div key={index}>
                    {index === 0 ||
                    index === years.length - 1 ||
                    index % 5 === 0
                      ? year
                      : ""}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <IoMdClose
          className="text-red-500 hover:opacity-60 absolute top-4 right-4 cursor-pointer hover:scale-105 duration-150"
          onClick={() => {
            setOpenModalAwan(false);
          }}
        />
      </Modal>

      <div className="flex items-center justify-between gap-2 mb-6 pb-4">
        <div className="flex items-center gap-2 text-xs md:text-sm lg:text-2xl text-main-500">
          <button onClick={() => navigate("/")}>
            <AiOutlineArrowLeft className="text-black" />
          </button>
          <p className="font-bold ">{lonLat.region}</p>
        </div>
      </div>

      <div className="flex justify-between pb-2 relative">
        <div className="flex items-center gap-4 text-xxs md:text-xs lg:text-sm">
          <button
            className={`text-black px-4 pt-1 pb-6 hover:opacity-60 duration-150 ${
              dataHistorisActive ? "border-b-[#1F8A70] border-b-4" : ""
            }`}
            onClick={() => {
              setDataHistorisActive(true);
            }}
          >
            Data Historis
          </button>
          <button
            className={`text-black px-4 pt-1 flex gap-1 items-center pb-6 hover:opacity-60 duration-150 ${
              !dataHistorisActive ? "border-b-[#1F8A70] border-b-4" : ""
            }`}
            onClick={() => {
              if (!user) {
                dispatch(setLoginPopup(true));
              } else if (user && !subscription) {
                navigate(
                  `/payment?long=${lonLat?.lon}&lat=${lonLat?.lat}&region=${lonLat?.region}`
                );
              } else if (user && subscription) {
                setDataHistorisActive(false);
              }
            }}
          >
            Data Prakiraan {subscription && user ? null : <AiOutlineLock />}
          </button>
          <div className="w-full border-b-2 absolute bottom-2" />
        </div>

        {/* drop down download */}
        <div className="">
          <Dropdown
            width={"100%"}
            position={"right-0"}
            customDropdown={""}
            title={
              <p className="text-xxs lg:text-sm flex items-center justify-between gap-2 border lg:py-1 text-black h-10 w-40 px-4 rounded bg-white">
                Download <IoIosArrowDown />
              </p>
            }
          >
            <div className="px-1 py-1 shadow border rounded  z-50 w-full bg-white">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "opacity-70 duration-150 text-black"
                        : "text-black font-medium"
                    } group  flex w-full gap-2 items-center text-xxs xl:text-xs rounded-md px-1 py-1 font-medium`}
                    onClick={() => {
                      handleDownlaodPdf();
                    }}
                  >
                    <FaRegFilePdf className="text-red-500" />
                    PDF
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "opacity-70 duration-150 text-black"
                        : "text-black font-medium"
                    } group  flex w-full gap-2 disabled:opacity-50 items-center text-xxs xl:text-xs rounded-md px-1 py-1 font-medium`}
                    disabled
                  >
                    <BsFiletypeCsv className="text-green-500" />
                    CSV <AiOutlineLock />
                  </button>
                )}
              </Menu.Item>
            </div>
          </Dropdown>
        </div>
      </div>

      {dataHistorisActive && (
        <select
          className="w-full border py-2 px-3 my-4 text-sm cursor-pointer font-medium"
          onChange={(e) => {
            setIsTahunan(e.target.value);
          }}
          defaultValue={isTahunan}
        >
          <option value={"month"}>Bulanan</option>
          <option value={"year"}>Tahunan</option>
        </select>
      )}

      <div id="downloadPdf capture-component">
        {dataHistorisActive ? (
          // Data Historis
          <div
            // className="flex flex-col lg:grid lg:grid-cols-2 text-sm gap-2"
            className="grid grid-cols-3 text-sm gap-4 detail-cols pb-8"
            ref={pdfRef}
          >
            {/* Maps */}
            <div className="shadow-lg min-h-[400px] rounded map-height bg-[#EBFFE4] box-shadow border-8 border-[#EBFFE4] relative overflow-hidden">
              <p className={`text-2xl pb-1`}>Maps</p>
              <div className="h-full">
                <DetailMap
                  center={
                    cookieCoordinate
                      ? [
                          parseFloat(cookieCoordinate.split(",")[0]),
                          parseFloat(cookieCoordinate.split(",")[1]),
                        ]
                      : [-2.1893, 117.9213]
                  }
                  zoom={13}
                  data={lonLat}
                />
              </div>
            </div>

            {/* potensi energi surya */}
            <div className="shadow-lg rounded min-h-[400px] col-span-2 w-full bg-[#EBFFE4] box-shadow p-4">
              <p className="text-2xl text-center">Potensi Energi Surya</p>
              <div className="relative">
                <Chart
                  data={dataPotensiBar.data}
                  categories={
                    isTahunan === "month"
                      ? monthsShort
                      : dataPotensiBar.categories
                  }
                  height={"350"}
                  title={"GHI (kWh/m2)"}
                  styleTitle={{
                    fontSize: "10px",
                    color: "#FF6B36",
                  }}
                  colors={["#FFA537", "rgba(249, 115, 22, 1)"]}
                  maxCount={7}
                  bar
                />
                {isTahunan === "year" && (
                  <div className="pl-14 pr-3 text-xs flex absolute text-black/70 -bottom-1 w-full justify-between">
                    {years.map((year, index) => (
                      <div key={index}>
                        {index === 0 ||
                        index === years.length - 1 ||
                        index % 5 === 0
                          ? year
                          : ""}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Table Grafik */}
            <div className="col-span-3">
              <div className="overflow-x-auto">
                <table className="table-auto w-full mt-5">
                  <thead className="text-sm">
                    <tr>
                      <th className="sticky left-0 bg-[#00AF50] px-20 py-3"></th>
                      {(isTahunan === "month" ? monthsShort : years).map(
                        (item, index) => (
                          <th
                            key={index}
                            className="bg-[#00AF50] px-8 py-3 font-normal"
                          >
                            {item}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-xs relative">
                    {tableDataHistoris.map((item, tableIndex) => (
                      <tr
                        key={tableIndex}
                        className={`${item.border ? "border-b-2" : ""}`}
                      >
                        <td
                          className={`sticky left-0 bg-[#EBFFE4] px-4 z-10 duration-150 cursor-pointer ${
                            item.for === "Tutupan Awan"
                              ? "font-medium"
                              : "font-bold"
                          }`}
                          onClick={() => {
                            if (
                              item.name === "Distribusi Arah Angin (m/s)" ||
                              item.for === "Distribusi Arah Angin (m/s)"
                            ) {
                              setOpenModalAngin(true);
                            } else if (
                              item.name === "Suhu (C)" ||
                              item.for === "Suhu (C)"
                            ) {
                              setOpenModalSuhu(true);
                            } else if (
                              item.name === "Tutupan Awan" ||
                              item.for === "Tutupan Awan"
                            ) {
                              setOpenModalAwan(true);
                            }
                          }}
                        >
                          <p>{item.name}</p>
                        </td>
                        {(isTahunan === "month" ? months : years).map(
                          (_, index, row) => (
                            <td
                              key={index}
                              className="bg-[#EBFFE4] px-[30.7px]"
                            >
                              <div className="text-[#4D4D4D] py-1">
                                {/* Distribusi arah angin table */}
                                {item.name === "Distribusi Arah Angin (m/s)" ? (
                                  <div className="flex flex-col gap-1 justify-center pt-4 items-center">
                                    <div className="flex gap-2 font-bold items-center text-base">
                                      <FaLocationArrow />
                                      <p className="text-xl">20</p>
                                    </div>
                                  </div>
                                ) : item.for ===
                                  "Distribusi Arah Angin (m/s)" ? (
                                  <div className="flex flex-col gap-1 justify-center py-2 items-center text-sm font-bold">
                                    20
                                  </div>
                                ) : item.name === "Suhu (C)" ? (
                                  <div className="h-[100px] relative flex justify-center items-end ">
                                    {index !== row.length - 1 && (
                                      <div className="absolute top-0 left-0 w-[130px]">
                                        <CustomLineChart
                                          data={item.data}
                                          start={index}
                                          finish={index + 2}
                                          color={"#DD2000"}
                                          maxHeight={1000}
                                          maxWeight={
                                            isTahunan === "month"
                                              ? 105 * item.data.length
                                              : 105 * item.data.length
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>
                                ) : item.for === "Suhu (C)" ? (
                                  <div className="flex flex-col gap-1 justify-center items-center text-sm font-bold">
                                    {item.data[index]
                                      ? item.data[index].value
                                      : 10}
                                  </div>
                                ) : item.name === "Tutupan Awan" ? (
                                  <div className="h-[100px] relative ">
                                    {index !== row.length - 1 && (
                                      <div className="absolute top-4 w-[130px]">
                                        <CustomLineChart
                                          data={item.data}
                                          start={index}
                                          finish={index + 2}
                                          color={"#1DB5DB"}
                                          maxWeight={
                                            isTahunan === "month"
                                              ? 105 * item.data.length
                                              : 105 * item.data.length
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>
                                ) : item.name === "High" ? (
                                  <div className="flex flex-col gap-1 justify-center items-center text-sm font-bold">
                                    {item.data[index]
                                      ? item.data[index].value
                                      : 10}
                                  </div>
                                ) : item.name === "Med" ? (
                                  <div className="flex flex-col gap-1 justify-center items-center text-sm font-bold">
                                    {item.data[index]
                                      ? item.data[index].value
                                      : 10}
                                  </div>
                                ) : (
                                  item.name === "Low" && (
                                    <div className="flex flex-col gap-1 justify-center items-center text-sm font-bold">
                                      {item.data[index]
                                        ? item.data[index].value
                                        : 10}
                                    </div>
                                  )
                                )}
                              </div>
                            </td>
                          )
                        )}
                      </tr>
                    ))}

                    {/* Add more rows here */}
                  </tbody>
                </table>
              </div>
            </div>

            {/* pergerakan matahari */}
            <div className="shadow-lg rounded w-full bg-[#EBFFE4] box-shadow p-4">
              <p className="text-2xl text-center">Pergerakan Matahari</p>
              <div className="relative">
                <p className="absolute -left-2 text-xs font-semibold text-black top-1/3">
                  LU
                </p>
                <p className="absolute -left-2 text-xs font-semibold text-black bottom-1/3">
                  LS
                </p>
                <Chart
                  data={dataPergerakanMatahariLine.data}
                  categories={
                    isTahunan === "month"
                      ? monthsShort
                      : dataPergerakanMatahariLine.categories
                  }
                  colors={["rgb(202, 138, 4)"]}
                  sizeMarker={12}
                  colorsMarker={["rgb(250, 204, 21)"]}
                  maxLineChartValue={40}
                  minLineChartValue={-40}
                  styleTitle={{
                    marginLeft: "1rem",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                  line
                />
                {isTahunan === "year" && (
                  <div className="pl-14 pr-3 text-xs flex absolute text-black/70 -bottom-1 w-full justify-between">
                    {years.map((year, index) => (
                      <div key={index}>
                        {index === 0 ||
                        index === years.length - 1 ||
                        index % 5 === 0
                          ? year
                          : ""}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Curah Hujan */}
            <div className="shadow-lg rounded w-full bg-[#EBFFE4] box-shadow p-4">
              <p className=" text-2xl text-center">Curah Hujan</p>
              <div className="relative">
                <Chart
                  data={dataCurahHujanBar.data}
                  categories={
                    isTahunan === "month"
                      ? monthsShort
                      : dataCurahHujanBar.categories
                  }
                  title={"Curah Hujan (mm)"}
                  styleTitle={{
                    fontSize: "10px",
                    color: "#5A9BD5",
                  }}
                  colors={["#40B7D5"]}
                  bar
                />
                {isTahunan === "year" && (
                  <div className="pl-14 pr-3 text-xs flex absolute text-black/70 -bottom-1 w-full justify-between">
                    {years.map((year, index) => (
                      <div key={index}>
                        {index === 0 ||
                        index === years.length - 1 ||
                        index % 5 === 0
                          ? year
                          : ""}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* index kebeningan */}
            <div className="shadow-lg rounded w-full bg-[#EBFFE4] box-shadow p-4">
              <p className="text-2xl text-center">Index Kebeningan</p>
              <div className="relative">
                <Chart
                  data={dataIndexKebeninganLine.data}
                  categories={
                    isTahunan === "month"
                      ? monthsShort
                      : dataIndexKebeninganLine.categories
                  }
                  colors={["rgb(59, 130, 246)", "rgb(34, 197, 94)"]}
                  minLineChartValue={0}
                  maxLineChartValue={1}
                  line
                />
                {isTahunan === "year" && (
                  <div className="pl-14 pr-3 text-xs flex absolute text-black/70 -bottom-1 w-full justify-between">
                    {years.map((year, index) => (
                      <div key={index}>
                        {index === 0 ||
                        index === years.length - 1 ||
                        index % 5 === 0
                          ? year
                          : ""}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Data Prakiraan
          <div className="pb-8">
            <div className="flex justify-between items-center">
              <p className="font-medium">
                {subscription?.package?.day} Days Forecast
              </p>
              <p className="text-sm">Diperbaharui tanggal 02/06/2023</p>
            </div>
            <div className="bg-[#EBFFE4] box-shadow rounded p-2 mt-2">
              <p className="text-center text-xl ">Potensi Energi Surya</p>
              <div className="grid grid-cols-4 mt-4 relative">
                {dataPotensi
                  .slice(slicePotensi.start, slicePotensi.finish)
                  .map((item, index) => (
                    <div key={index} className="text-center relative">
                      <div className="bg-[#00AF50] flex justify-between items-center">
                        {index === 0 ? (
                          <button
                            className="disabled:opacity-30 hover:opacity-30"
                            disabled={
                              item.name === dataPotensi[0].name ? true : false
                            }
                            onClick={() => {
                              setSlicePotensi({
                                start: slicePotensi.start - 4,
                                finish: slicePotensi.finish - 4,
                              });
                            }}
                          >
                            <IoIosArrowBack className="" />
                          </button>
                        ) : (
                          <div />
                        )}
                        <p className="">{item.name}</p>
                        {index === 3 ? (
                          <button
                            className="disabled:opacity-30 hover:opacity-30"
                            disabled={
                              item.name ===
                              dataPotensi[dataPotensi.length - 1].name
                                ? true
                                : false
                            }
                            onClick={() => {
                              setSlicePotensi({
                                start: slicePotensi.start + 4,
                                finish: slicePotensi.finish + 4,
                              });
                            }}
                          >
                            <IoIosArrowForward className="" />
                          </button>
                        ) : (
                          <div />
                        )}
                      </div>
                      <div className="border rounded-br rounded-bl">
                        <Chart
                          data={item.data}
                          categories={categoriesPrakiraan}
                          height={"200"}
                          styleTitle={{
                            fontSize: "10px",
                            color: "#FF6B36",
                          }}
                          colors={["#FFA537", "rgba(249, 115, 22, 1)"]}
                          maxCount={7}
                          columnWidth={80}
                          bar
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Table Prakiraan */}
            <div className="mb-4 box-shadow overflow-x-auto">
              <table className="table-auto w-full mt-5">
                <thead className="text-sm">
                  <tr>
                    <th className="sticky left-0 bg-[#00AF50] px-20 py-3"></th>
                    {[...new Array(subscription?.package?.day)].map(
                      (_, index) => (
                        <th
                          key={index}
                          className="bg-[#00AF50] px-8 py-3 font-normal"
                        >
                          {index + 1}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="text-xs relative">
                  {tableDataPrakiraan.map((item, tableIndex) => (
                    <tr
                      key={tableIndex}
                      className={`${item.border ? "border-b-2" : ""}`}
                    >
                      <td
                        className={`sticky left-0 bg-[#EBFFE4] px-4 z-10 duration-150 cursor-pointer ${
                          item.for === "Tutupan Awan"
                            ? "font-medium"
                            : "font-bold"
                        }`}
                        onClick={() => {
                          if (
                            item.name === "Distribusi Arah Angin (m/s)" ||
                            item.for === "Distribusi Arah Angin (m/s)"
                          ) {
                            setOpenModalAngin(true);
                          } else if (
                            item.name === "Suhu (C)" ||
                            item.for === "Suhu (C)"
                          ) {
                            setOpenModalSuhu(true);
                          } else if (
                            item.name === "Tutupan Awan" ||
                            item.for === "Tutupan Awan"
                          ) {
                            setOpenModalAwan(true);
                          }
                        }}
                      >
                        <p>{item.name}</p>
                      </td>
                      {[...new Array(subscription?.package?.day)].map(
                        (_, index, row) => (
                          <td key={index} className="bg-[#EBFFE4]">
                            <div className="text-[#4D4D4D] py-1">
                              {/* Distribusi arah angin table */}
                              {item.name === "Distribusi Arah Angin (m/s)" ? (
                                <div className="flex flex-col gap-1 justify-center pt-4 items-center">
                                  <div className="flex gap-2 font-bold items-center text-base">
                                    <FaLocationArrow />
                                    <p className="text-xl">20</p>
                                  </div>
                                </div>
                              ) : item.for === "Distribusi Arah Angin (m/s)" ? (
                                <div className="flex flex-col gap-1 justify-center py-2 items-center text-sm font-bold">
                                  20
                                </div>
                              ) : item.name === "Suhu (C)" ? (
                                <div className="h-[100px] relative ">
                                  {index !== row.length - 1 && (
                                    <div className="absolute top-0 left-0">
                                      <CustomLineChart
                                        data={item.data}
                                        start={index}
                                        finish={index + 2}
                                        color={"#DD2000"}
                                        maxWeight={
                                          (item.data.length === 3
                                            ? 160
                                            : item.data.length === 7
                                            ? 118
                                            : 75) * item.data.length
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              ) : item.for === "Suhu (C)" ? (
                                <div className="flex flex-col gap-1 justify-center items-center text-sm font-bold">
                                  {item.data[index]
                                    ? item.data[index].value
                                    : 10}
                                </div>
                              ) : item.name === "Tutupan Awan" ? (
                                <div className="h-[100px] relative flex justify-center items-end ">
                                  {index !== row.length - 1 && (
                                    <div className="absolute top-0 left-0 ">
                                      <CustomLineChart
                                        data={item.data}
                                        start={index}
                                        finish={index + 2}
                                        color={"#1DB5DB"}
                                        maxWeight={
                                          (item.data.length === 3
                                            ? 160
                                            : item.data.length === 7
                                            ? 118
                                            : 75) * item.data.length
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              ) : item.name === "High" ? (
                                <div className="flex flex-col gap-1 justify-center items-center text-sm font-bold">
                                  {item.data[index]
                                    ? item.data[index].value
                                    : 10}
                                </div>
                              ) : item.name === "Med" ? (
                                <div className="flex flex-col gap-1 justify-center items-center text-sm font-bold">
                                  {item.data[index]
                                    ? item.data[index].value
                                    : 10}
                                </div>
                              ) : item.name === "Low" ? (
                                <div className="flex flex-col gap-1 justify-center items-center text-sm font-bold">
                                  {item.data[index]
                                    ? item.data[index].value
                                    : 10}
                                </div>
                              ) : (
                                item.name === "Curah Hujan (mm)" && (
                                  <div className="h-[100px] relative overflow-hidden">
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                                      <CustomBarChart
                                        data={item.data[index]}
                                        height={130}
                                        width={60}
                                      />
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </td>
                        )
                      )}
                    </tr>
                  ))}

                  {/* Add more rows here */}
                </tbody>
              </table>
            </div>

            <div className="bg-[#EBFFE4] box-shadow rounded p-2 mt-2">
              <p className="text-center text-xl ">Indeks Kebeningan</p>
              <div className="grid grid-cols-4 mt-4 relative">
                {dataIndeksKebeningan
                  .slice(
                    sliceIndeksKebeningan.start,
                    sliceIndeksKebeningan.finish
                  )
                  .map((item, index) => (
                    <div key={index} className="text-center relative">
                      <div className="bg-[#00AF50] flex justify-between items-center">
                        {index === 0 ? (
                          <button
                            className="disabled:opacity-30 hover:opacity-30"
                            disabled={
                              item.name === dataIndeksKebeningan[0].name
                                ? true
                                : false
                            }
                            onClick={() => {
                              setSliceIndeksKebeningan({
                                start: sliceIndeksKebeningan.start - 4,
                                finish: sliceIndeksKebeningan.finish - 4,
                              });
                            }}
                          >
                            <IoIosArrowBack className="" />
                          </button>
                        ) : (
                          <div />
                        )}
                        <p className="">{item.name}</p>
                        {index === 3 ? (
                          <button
                            className="disabled:opacity-30 hover:opacity-30"
                            disabled={
                              item.name ===
                              dataIndeksKebeningan[
                                dataIndeksKebeningan.length - 1
                              ].name
                                ? true
                                : false
                            }
                            onClick={() => {
                              setSliceIndeksKebeningan({
                                start: sliceIndeksKebeningan.start + 4,
                                finish: sliceIndeksKebeningan.finish + 4,
                              });
                            }}
                          >
                            <IoIosArrowForward className="" />
                          </button>
                        ) : (
                          <div />
                        )}
                      </div>
                      <div className="border rounded-br rounded-bl">
                        <Chart
                          data={item.data}
                          categories={categoriesPrakiraan}
                          colors={["#1DB5DB"]}
                          gridColor={false}
                          line
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
