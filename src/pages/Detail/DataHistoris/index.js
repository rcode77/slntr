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
import Cookies from "js-cookie";
import Dropdown from "@components/molecule/Dropdown";
import { Dialog, Menu } from "@headlessui/react";
import { BsFiletypeCsv } from "react-icons/bs";
import DetailMap from "@components/molecule/Map/DetailMap";
import Modal from "@components/molecule/Modal";
import Windrose from "@components/molecule/Chart/Windrose";
import LineChartCustome from "@components/molecule/Chart/CustomChart/ApexLineCustomeChart";
import axios from "axios";
import LineChart from "@components/molecule/Chart/LineChart";
import BarChart from "@components/molecule/Chart/BarChart";
import MatahariLineChart from "@components/molecule/Chart/CustomChart/MatahariLineChart";
import WindowSize from "@hooks/windowSize";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Joyride from "react-joyride";
import { setUser } from "@redux/features/auth/authSlice";

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

const DataHistoris = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pdfRef = useRef();
  const urlParams = new URLSearchParams(window.location.search);

  const { user, token } = useSelector((state) => state.auth);
  const { locationParams } = useSelector((state) => state.location);

  // data potensi exacly should get from API
  const [lonLat, setLonLat] = useState({
    lon: 0,
    lat: 0,
    region: "",
    province: "",
    utc: "",
  });

  const [isTahunan, setIsTahunan] = useState("month");
  const [years, setYears] = useState([]);

  // get payment data

  // checking payment
  const [subscription, setSubscription] = useState(false);
  const [listPayment, setListPayment] = useState([]);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_URL_API}/payment/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setListPayment(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchPayment();
    }
  }, [token]);

  useEffect(() => {
    if (locationParams) {
      return setLonLat({
        ...locationParams,
        lon: parseFloat(parseFloat(locationParams.long)?.toFixed(1)),
        lat: parseFloat(parseFloat(locationParams.lat)?.toFixed(1)),
      });
    } else {
      const long = parseFloat(urlParams.get("long"));
      const lat = parseFloat(urlParams.get("lat"));
      const region = urlParams.get("region");
      const province = urlParams.get("province");
      const utc = urlParams.get("utc");

      setLonLat({
        lon: parseFloat(parseFloat(long)?.toFixed(1)),
        lat: parseFloat(parseFloat(lat)?.toFixed(1)),
        region: region,
        province: province,
        utc: utc,
      });
    }
  }, []);

  useEffect(() => {
    if (listPayment.length > 0) {
      // set checking payment
      for (const payment of listPayment) {
        if (
          parseFloat(payment.lat.toFixed(1)) === lonLat.lat &&
          parseFloat(payment.lon.toFixed(1)) === lonLat.lon &&
          payment.status === "Success"
        ) {
          setSubscription(true);
          break;
        } else {
          setSubscription(false);
        }
      }
    }
  }, [listPayment, lonLat]);

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
        name: "Indeks Kebeningan",
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

  const [dataHistorisKecepatanAngin, setDataHistorisKecepatanAngin] =
    useState(null);

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
          setDataPergerakanMatahariLine({
            data: [
              {
                name: "Pergerakan Matahari",
                data: res.data[0].data.map((item, index) => ({
                  x: res.categories[index],
                  y: item,
                })),
              },
            ],
          })
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
        getDataTahunan(lonLat.lat, lonLat.lon, "kecepatan-angin-tahunan").then(
          (res) => setDataHistorisKecepatanAngin(res)
        );
        getDataTahunan(lonLat.lat, lonLat.lon, "arah-angin-tahunan").then(
          (res) => setDataHistorisAngin(res)
        );
        getDataTahunan(
          lonLat.lat,
          lonLat.lon,
          "kecepatan-angin-maksimum-tahunan"
        ).then((res) => setDataHistorisKecepatanAnginMaksimum(res));
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
            )?.toFixed(1)}/ms`,
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
            newData.push([
              windDirection[j][0],
              parseFloat(average?.toFixed(1)),
            ]);
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
          lonLat.lon,
          lonLat.lat
        );

        try {
          const data2 = await getDataWindrose(
            "juli, agustus, september, oktober, november, desember",
            lonLat.lon,
            lonLat.lat
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

  const windowSize = WindowSize();
  // table data historis
  const [tableData, setTableData] = useState([]);
  const [sliceIndex, setSliceIndex] = useState({
    start: 0,
    end: 12,
    for: 12,
  });

  const resetSliceIndex = () => {
    if (windowSize.width <= 768) {
      setSliceIndex({
        start: 0,
        end: 3,
        for: 3,
      });
    } else if (windowSize.width <= 1024) {
      setSliceIndex({
        start: 0,
        end: 6,
        for: 6,
      });
    } else {
      setSliceIndex({
        start: 0,
        end: 12,
        for: 12,
      });
    }
  };

  useEffect(() => {
    if (windowSize?.width) {
      resetSliceIndex();
    }
  }, [windowSize?.width]);

  useEffect(() => {
    if (
      dataSuhuRataRataLine?.data[0]?.data?.length === 12 &&
      dataSuhuMaximumLine &&
      dataTutupanAwanTotal &&
      dataTutupanAwanTinggi &&
      dataTutupanAwanMenegah &&
      dataTutupanAwanRendah &&
      dataHistorisKecepatanAngin &&
      dataHistorisAngin.data.length > 0 &&
      isTahunan === "month"
    ) {
      setTableData([
        {
          id: 1,
          name: "",
          data: [
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
          ],
          border: false,
        },
        {
          id: 2,
          name: "Angin (m/s)",
          data: months.map((month, index) =>
            dataHistorisKecepatanAngin.data[0].data[index]
              ? parseFloat(
                  dataHistorisKecepatanAngin.data[0].data[index]
                )?.toFixed(1)
              : 0
          ),
          dataDir: months.map((month, index) =>
            parseFloat(dataHistorisAngin.data[0].data[index])?.toFixed(1)
          ),
          border: false,
        },
        {
          id: 3,
          name: "Kecepatan Maksimum (m/s)",
          data: months.map((month, index) =>
            parseFloat(dataHistorisKecepatanAnginMaksimum.data[0].data[index])
          ),
          border: true,
        },
        {
          id: 4,
          name: "Suhu (°C)",
          data: months.map((month, index) =>
            parseFloat(dataSuhuRataRataLine.data[0].data[index]?.toFixed(1))
          ),
          border: false,
        },
        {
          id: 5,
          name: "Suhu Maksimum (°C)",
          data: months.map((month, index) =>
            parseFloat(dataSuhuMaximumLine.data[0].data[index])?.toFixed(1)
          ),
          border: true,
        },
        {
          id: 6,
          name: "Tutupan Awan (%)",
          data: months.map((month, index) =>
            // parseFloat(parseFloat(dataTutupanAwanTotal.data[index]))
            Math.round(parseFloat(dataTutupanAwanTotal.data[index]))
          ),
          border: false,
        },
        {
          id: 7,
          name: "Tinggi",
          data: months.map((month, index) =>
            // dataTutupanAwanTinggi.data[index]?.toFixed(1)
            Math.round(dataTutupanAwanTinggi.data[index])
          ),
          border: false,
        },
        {
          id: 8,
          name: "Menengah",
          data: months.map((month, index) =>
            // dataTutupanAwanMenegah.data[index]?.toFixed(1)
            Math.round(dataTutupanAwanMenegah.data[index])
          ),
          border: false,
        },
        {
          id: 9,
          name: "Rendah",
          data: months.map((month, index) =>
            // dataTutupanAwanRendah.data[index]?.toFixed(1)
            Math.round(dataTutupanAwanRendah.data[index])
          ),
          border: false,
        },
      ]);
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
      setTableData([
        {
          id: 1,
          name: "",
          data: years,
        },
        {
          id: 2,
          name: "Arah (m/s)",
          data: years.map((year, index) =>
            dataHistorisKecepatanAngin.data[0].data[index]
              ? parseFloat(
                  dataHistorisKecepatanAngin.data[0].data[index]
                )?.toFixed(1)
              : 0
          ),
          dataDir: years.map((year, index) =>
            dataHistorisAngin.data[0].data[index]
              ? parseFloat(dataHistorisAngin.data[0].data[index])?.toFixed(1)
              : null
          ),
          border: false,
        },
        {
          id: 3,
          name: "Kecepatan Maksimum",
          data: years.map((year, index) =>
            parseFloat(dataHistorisKecepatanAnginMaksimum.data[0].data[index])
          ),
          border: true,
        },
        {
          id: 4,
          name: "Suhu (°C)",
          data: years.map((year, index) =>
            parseFloat(dataSuhuRataRataLine.data[0].data[index])
          ),
          border: false,
        },
        {
          id: 5,
          name: "Suhu Maksimum (°C)",
          data: years.map((year, index) =>
            parseFloat(dataSuhuMaximumLine.data[0].data[index])
          ),
          border: true,
        },
        {
          id: 6,
          name: "Tutupan Awan (%)",
          data: years.map((year, index) =>
            // parseFloat(parseFloat(dataTutupanAwanTotal.data[index]))
            Math.round(dataTutupanAwanTotal.data[index])
          ),
          border: false,
        },
        {
          id: 7,
          name: "Tinggi",
          data: years.map((year, index) =>
            // parseFloat(dataTutupanAwanTinggi.data[index])
            Math.round(dataTutupanAwanTinggi.data[index])
          ),
          border: false,
        },
        {
          id: 8,
          name: "Menengah",
          data: years.map((year, index) =>
            // parseFloat(dataTutupanAwanMenegah.data[index])
            Math.round(dataTutupanAwanMenegah.data[index])
          ),
          border: false,
        },
        {
          id: 9,
          name: "Rendah",
          data: years.map((year, index) =>
            // parseFloat(dataTutupanAwanRendah.data[index])
            Math.round(dataTutupanAwanRendah.data[index])
          ),
          border: false,
        },
      ]);
    }
  }, [
    dataSuhuMaximumLine,
    dataHistorisKecepatanAngin,
    dataSuhuRataRataLine,
    dataTutupanAwanMenegah,
    dataTutupanAwanRendah,
    dataTutupanAwanTinggi,
    dataTutupanAwanTotal,
    dataHistorisAngin,
    isTahunan,
    sliceIndex,
  ]);

  const [openModalAngin, setOpenModalAngin] = useState(false);
  const [openModalSuhu, setOpenModalSuhu] = useState(false);
  const [openModalAwan, setOpenModalAwan] = useState(false);

  const [loadingDownloadPdf, setLoadingDownloadPdf] = useState(false);

  const handleDownloadPdf = async (
    longitude,
    latitude,
    region,
    province,
    fileName,
    data = "bulanan",
    start = 0,
    end = 12,
    wait = 20
  ) => {
    setLoadingDownloadPdf(true);
    const origin = window.location.origin;
    const uri = `${origin}/detail/test-historis?long=${longitude}&lat=${latitude}&region=${region}&province=${province}&data=${data}&start=${start}&end=${end}`;

    const body = {
      wait: wait,
      url: uri,
      filename: fileName,
      quality: 100,
    };

    let status = null;

    try {
      const response = await axios.post(process.env.REACT_APP_PDF, body, {
        responseType: "blob",
        headers: {
          "Content-Disposition": "attachment",
        },
      });

      // Menggunakan objek response untuk menangani respons
      const blob = new Blob([response.data], { type: "application/pdf" });
      const anchor = document.createElement("a");
      anchor.href = URL.createObjectURL(blob);
      anchor.download = `${fileName}.pdf`;
      anchor.click();
      URL.revokeObjectURL(anchor.href);
    } catch (error) {
      console.error("Error downloading the file:", error);
    } finally {
      setLoadingDownloadPdf(false);
    }
  };

  const handleDownloadCsv = async () => {
    const url = `${process.env.REACT_APP_URL_API}/historis/${
      isTahunan === "month" ? "bulanan" : "tahunan"
    }/csv?lon=${lonLat.lon}&lat=${lonLat.lat}&lokasi=${lonLat.region}`;

    let status = null;

    setLoadingDownloadPdf(true);
    fetch(url, {
      headers: {
        "Content-Disposition": "attachment",
      },
    })
      .then((response) => {
        status = response.status;
        return response.blob();
      })
      .then((blob) => {
        if (status === 200) {
          const anchor = document.createElement("a");
          anchor.href = URL.createObjectURL(blob);
          anchor.download = `${lonLat.region}.csv`;

          anchor.click();

          URL.revokeObjectURL(anchor.href);
        }
      })
      .catch((error) => {
        console.error("Error downloading the file:", error);
      })
      .finally(() => {
        setLoadingDownloadPdf(false);
      });
  };

  const [openModalDownloadPdfTahunan, setOpenModalDownloadPdfTahunan] =
    useState(false);

  const [sliceIndexDownloadPdf, setSliceIndexDownloadPdf] = useState({
    start: 0,
    finish: 12,
  });

  const handleTakeTour = async (tour) => {
    try {
      const data = await axios.post(
        `${process.env.REACT_APP_URL_API}/taketour`,
        {
          taketour: tour,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      dispatch(
        setUser({
          login: {
            user: { ...user, taketour: tour },
            token: token,
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const removeNumber = (inputString, numberToRemove) => {
    const regex = new RegExp(numberToRemove, "g");
    return inputString.replace(regex, "");
  };

  // const custom = {
  //   skip: (
  //     <button className="bg-red-600 rounded-md px-4 py-1.5">
  //       <strong className="text-white font-bold text-lg">Lewati</strong>
  //     </button>
  //   ),
  //   back: <strong className="text-[#004a14] font-bold px-3">Kembali</strong>,
  //   next: (
  //     <button className="bg-[#004a14] rounded-xl px-3 py-1">
  //       <strong className="text-white font-bold">Lanjutkan</strong>
  //     </button>
  //   ),
  //   last: (
  //     <button className="bg-[#004a14] rounded-xl px-3 py-1">
  //       <strong className="text-white font-bold">Selesai</strong>
  //     </button>
  //   ),
  // };

  const custom = {
    skip: (
      <button id="tour4-button-lewati">
        <strong>Lewati</strong>
      </button>
    ),
    back: <button id="tour4-button-lewati">Kembali</button>,
    next: <button id="tour4-button-lanjutkan">Lanjutkan</button>,
    last: <button id="tour4-button-lanjutkan">Selesai</button>,
  };

  // const [{ run, steps }, setSteps] = useState({
  //   run: true,
  //   steps: [
  //     {
  //       content: (
  //         <div>
  //           <h2>
  //             Data - data yang tersedia untuk diakses, tetapi untuk selain Data
  //             Historis harus berlangganan terlebih dahulu untuk mengaksesnya
  //           </h2>
  //           <p className="text-right -mb-7 mt-2 font-semibold">1 dari 6</p>
  //         </div>
  //       ),
  //       disableBeacon: true,
  //       placement: "bottom",
  //       target: "#historis-1",
  //       title: (
  //         <p className="text-2xl text-green-500 font-bold">Data Tersedia</p>
  //       ),
  //       locale: custom,
  //     },
  //     {
  //       content: (
  //         <div>
  //           <h2>Anda juga dapat mengunduh data dalam format csv maupun pdf</h2>
  //           <p className="text-right -mb-7 mt-2 font-semibold">2 dari 6</p>
  //         </div>
  //       ),
  //       placement: "bottom",
  //       target: "#historis-2",
  //       title: <p className="text-2xl text-green-500 font-bold">Unduh Data</p>,
  //       locale: custom,
  //     },
  //     {
  //       content: (
  //         <div>
  //           <h2>
  //             Pilihan untuk mengganti periode waktu data untuk ditampilkan
  //           </h2>

  //           <p className="text-right -mb-7 mt-2 font-semibold">3 dari 6</p>
  //         </div>
  //       ),
  //       placement: "bottom",
  //       target: "#historis-3",
  //       title: (
  //         <p className="text-2xl text-green-500 font-bold">
  //           Periode Waktu Data
  //         </p>
  //       ),
  //       locale: custom,
  //     },
  //     {
  //       content: (
  //         <div>
  //           <h2>
  //             Klik pada teks untuk melihat detail grafik distribusi arah angin
  //           </h2>
  //           <p className="text-right -mb-7 mt-2 font-semibold">4 dari 6</p>
  //         </div>
  //       ),
  //       placement: "right",
  //       target: "#historis-4",
  //       title: (
  //         <p className="text-2xl text-green-500 font-bold">
  //           Detail Grafik Angin
  //         </p>
  //       ),
  //       locale: custom,
  //     },
  //     {
  //       content: (
  //         <div>
  //           <h2>Klik pada teks untuk melihat detail grafik suhu</h2>
  //           <p className="text-right -mb-7 mt-2 font-semibold">5 dari 6</p>
  //         </div>
  //       ),
  //       placement: "right",
  //       target: "#historis-5",
  //       title: (
  //         <p className="text-2xl text-green-500 font-bold">
  //           Detail Grafik Suhu
  //         </p>
  //       ),
  //       locale: custom,
  //     },
  //     {
  //       content: (
  //         <div>
  //           <h2>Klik pada teks untuk melihat detail grafik tutupan awan</h2>
  //           <p className="text-right -mb-7 mt-2 font-semibold">6 dari 6</p>
  //         </div>
  //       ),
  //       placement: "right",
  //       target: "#historis-6",
  //       title: (
  //         <p className="text-2xl text-green-500 font-bold">
  //           Detail Grafik Tutupan Awan
  //         </p>
  //       ),
  //       locale: custom,
  //     },
  //   ],
  // });

  const [{ run, steps }, setSteps] = useState({
    run: true,
    steps: [
      {
        content: (
          <div>
            <h2>
              Data - data yang tersedia untuk diakses, tetapi untuk selain Data
              Historis harus berlangganan terlebih dahulu untuk mengaksesnya
            </h2>
            {/* <p className="text-right -mb-7 mt-2 font-semibold">1 dari 6</p> */}
          </div>
        ),
        disableBeacon: true,
        placement: "bottom",
        target: "#historis-1",
        title: "Data Tersedia",
        locale: custom,
      },
      {
        content: (
          <div>
            <h2>Anda juga dapat mengunduh data dalam format csv maupun pdf</h2>
            {/* <p className="text-right -mb-7 mt-2 font-semibold">2 dari 6</p> */}
          </div>
        ),
        placement: "bottom",
        target: "#historis-2",
        title: "Unduh Data",
        locale: custom,
      },
      {
        content: (
          <div>
            <h2>
              Pilihan untuk mengganti periode waktu data untuk ditampilkan
            </h2>

            {/* <p className="text-right -mb-7 mt-2 font-semibold">3 dari 6</p> */}
          </div>
        ),
        placement: "bottom",
        target: "#historis-3",
        title: "Periode Waktu Data",
        locale: custom,
      },
      {
        content: (
          <div>
            <h2>
              Klik pada teks untuk melihat detail grafik distribusi arah angin
            </h2>
            {/* <p className="text-right -mb-7 mt-2 font-semibold">4 dari 6</p> */}
          </div>
        ),
        placement: "right",
        target: "#historis-4",
        title: "Detail Grafik Angin",
        locale: custom,
      },
      {
        content: (
          <div>
            <h2>Klik pada teks untuk melihat detail grafik suhu</h2>
            {/* <p className="text-right -mb-7 mt-2 font-semibold">5 dari 6</p> */}
          </div>
        ),
        placement: "right",
        target: "#historis-5",
        title: "Detail Grafik Suhu",
        locale: custom,
      },
      {
        content: (
          <div>
            <h2>Klik pada teks untuk melihat detail grafik tutupan awan</h2>
            {/* <p className="text-right -mb-7 mt-2 font-semibold">6 dari 6</p> */}
          </div>
        ),
        placement: "right",
        target: "#historis-6",
        title: "Detail Grafik Tutupan Awan",
        locale: custom,
      },
    ],
  });

  return (
    <div className="font-poppins bg-[#F7FFF4] px-[2%] pt-10  2xl:container mx-auto">
      {/* Tour Historis */}
      {user
        ? user?.taketour.toString().includes("3") &&
          window.location.pathname.includes("/detail/data-historis") && (
            <Joyride
              continuous
              callback={(e) => {
                if (e.action === "reset") {
                  Cookies.set("tour-historis", "done");
                  if (user) {
                    let tour = user?.taketour.toString();
                    if (tour.includes("3")) {
                      if (tour.length > 1) {
                        const output = removeNumber(tour, "3");
                        handleTakeTour(parseInt(output));
                      } else {
                        handleTakeTour(0);
                      }
                    }
                  }
                }
              }}
              steps={steps}
              hideCloseButton
              scrollToFirstStep
              scrollOffset={150}
              showSkipButton
              showProgress
              disableOverlayClose={true}
              styles={{
                options: {
                  primaryColor: "#004a14",
                },
              }}
            />
          )
        : !Cookies.get("tour-historis") &&
          window.location.pathname.includes("/detail/data-historis") && (
            <Joyride
              continuous
              callback={(e) => {
                if (e.action === "reset") {
                  Cookies.set("tour-historis", "done");
                  if (user) {
                    let tour = user?.taketour.toString();
                    if (tour.includes("3")) {
                      if (tour.length > 1) {
                        const output = removeNumber(tour, "3");
                        handleTakeTour(parseInt(output));
                      } else {
                        handleTakeTour(0);
                      }
                    }
                  }
                }
              }}
              steps={steps}
              hideCloseButton
              scrollToFirstStep
              scrollOffset={150}
              showSkipButton
              showProgress
              disableOverlayClose={true}
              styles={{
                options: {
                  primaryColor: "#004a14",
                },
              }}
            />
          )}

      {/* Modal */}
      <Modal
        isOpen={openModalAngin}
        setIsOpen={setOpenModalAngin}
        className="md:max-w-[50vw] relative rounded"
      >
        <div className="px-10 py-4">
          <p className="font-medium text-blue-500 pb-10">Arah (m/s)</p>
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
        className="md:max-w-[50vw] relative rounded"
      >
        <div className="px-10 py-4">
          <p className="font-medium text-black pb-10 text-2xl">Suhu °C</p>
          <div className="relative">
            <LineChart
              data={dataSuhuLine.data}
              categories={isTahunan === "month" ? monthsShort : years}
              colors={["rgb(239, 68, 68)", "rgb(59, 130, 246)"]}
              floating={isTahunan === "month" ? false : true}
              chart={{
                animations: {
                  enabled: false,
                },
              }}
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
        className="md:max-w-[50vw] relative rounded"
      >
        <div className="px-10 py-4">
          <p className="font-medium text-black pb-10 text-2xl">Tutupan Awan</p>
          <div className="relative">
            <LineChart
              data={dataTutupanAwanLine.data}
              categories={isTahunan === "month" ? monthsShort : years}
              styleTitle={{
                fontSize: "14px",
                color: "rgb(251, 146, 60)",
              }}
              minLineChartValue={0}
              maxLineChartValue={1}
              colors={[
                "rgb(30, 64, 175)",
                "rgba(34, 197, 94, .5)",
                "rgba(234, 179, 8, .5)",
                "rgba(239, 68, 68, .5)",
              ]}
              floating={isTahunan === "month" ? false : true}
              chart={{
                animations: {
                  enabled: false,
                },
              }}
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

      {/* Modal Open DownloadPdf Tahunan */}
      <Modal
        isOpen={openModalDownloadPdfTahunan}
        setIsOpen={setOpenModalDownloadPdfTahunan}
        className="md:max-w-[200px] relative rounded p-[0px]"
      >
        <div className="">
          <p className="border-b py-2 px-4 font-semibold">Download Pdf</p>
          <div className="flex flex-col gap-2 p-4">
            <div className="">
              <p className="font-medium text-sm pb-2 text-slate-700">Tahun</p>
              <div className="flex justify-between items-center gap-2">
                <button
                  className="hover:scale-125 hover:opacity-60 duration-150 disabled:hover:scale-100 disabled:hover:opacity-50 disabled:opacity-50"
                  onClick={() => {
                    setSliceIndexDownloadPdf({
                      ...sliceIndexDownloadPdf,
                      start: sliceIndexDownloadPdf.start - 12,
                      finish: sliceIndexDownloadPdf.finish - 12,
                    });
                  }}
                  disabled={sliceIndexDownloadPdf.start <= 0}
                >
                  <IoIosArrowBack className="" />
                </button>
                <p
                  className="border px-2 py-1 rounded text-black/80 font-medium
                 text-sm"
                >
                  {
                    years.slice(
                      sliceIndexDownloadPdf.start,
                      sliceIndexDownloadPdf.finish
                    )[0]
                  }{" "}
                  -{" "}
                  {
                    years.slice(
                      sliceIndexDownloadPdf.start,
                      sliceIndexDownloadPdf.finish
                    )[
                      years.slice(
                        sliceIndexDownloadPdf.start,
                        sliceIndexDownloadPdf.finish
                      ).length - 1
                    ]
                  }
                </p>
                <button
                  className="hover:scale-125 hover:opacity-60 duration-150 disabled:hover:scale-100 disabled:hover:opacity-50 disabled:opacity-50"
                  onClick={() => {
                    setSliceIndexDownloadPdf({
                      ...sliceIndexDownloadPdf,
                      start: sliceIndexDownloadPdf.start + 12,
                      finish: sliceIndexDownloadPdf.finish + 12,
                    });
                  }}
                  disabled={sliceIndexDownloadPdf.finish >= years.length}
                >
                  <IoIosArrowForward />
                </button>
              </div>

              <button
                className="bg-main-300 w-full mt-4 rounded text-white font-medium hover:opacity-80 duration-150"
                onClick={() => {
                  handleDownloadPdf(
                    lonLat.lon,
                    lonLat.lat,
                    lonLat.region,
                    lonLat.province,
                    `Historis-${lonLat.region}`,
                    isTahunan === "month" ? "bulanan" : "tahunan",
                    sliceIndexDownloadPdf.start,
                    sliceIndexDownloadPdf.finish,
                    isTahunan === "month" ? 20 : 15
                  );
                  setOpenModalDownloadPdfTahunan(false);
                }}
                disabled={loadingDownloadPdf}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Content */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-6 pb-4">
          <div className="flex items-center gap-2 text-base lg:text-2xl text-main-500">
            <button
              onClick={() => navigate(user ? "/beranda" : "/")}
              id="btn-detail-arrow-back"
            >
              <AiOutlineArrowLeft className="text-black" />
            </button>
            <p className="font-bold" id="text-detail-title">
              {lonLat.region}
            </p>
          </div>
        </div>

        <div className="flex justify-between pb-2 relative">
          <div
            id="historis-1"
            className="flex items-center gap-4 text-xs lg:text-sm"
          >
            <button
              className={`text-black px-4 pt-1 pb-6 border-b-[#1F8A70] border-b-4 hover:opacity-60 duration-150`}
              id="btn-detail-data-historis"
            >
              Data Historis
            </button>
            <button
              className={`text-black px-4 pt-1 flex gap-1 items-center pb-6 hover:opacity-60 duration-150`}
              onClick={() => {
                if (!user) {
                  dispatch(setLoginPopup(true));
                } else if (user && !subscription) {
                  navigate(
                    `/payment?long=${lonLat?.lon}&lat=${lonLat?.lat}&region=${lonLat?.region}&province=${lonLat?.province}`
                  );
                } else if (user && subscription) {
                  navigate(
                    `/detail/data-prakiraan?long=${lonLat?.lon}&lat=${lonLat?.lat}&region=${lonLat?.region}&province=${lonLat?.province}`
                  );
                }
              }}
              id="btn-detail-data-prakiraan"
            >
              Data Prakiraan {subscription && user ? null : <AiOutlineLock />}
            </button>
            <button
              className={`text-black px-4 pt-1 flex gap-1 items-center pb-6 hover:opacity-60 duration-150`}
              onClick={() => {
                if (!user) {
                  dispatch(setLoginPopup(true));
                } else if (user && !subscription) {
                  navigate(
                    `/payment?long=${lonLat?.lon}&lat=${lonLat?.lat}&region=${lonLat?.region}&province=${lonLat?.province}`
                  );
                } else if (user && subscription) {
                  navigate(
                    `/detail/data-monitoring?long=${lonLat?.lon}&lat=${lonLat?.lat}&region=${lonLat?.region}&province=${lonLat?.province}`
                  );
                }
              }}
              id="btn-detail-monitoring"
            >
              Monitoring {subscription && user ? null : <AiOutlineLock />}
            </button>
            <div className="w-full border-b-2 absolute bottom-2" />
          </div>

          {/* drop down download */}
          <div id="historis-2" className="">
            {loadingDownloadPdf ? (
              <div className="text-xs opacity-50 cursor-not-allowed lg:text-sm flex items-center justify-between gap-2 border lg:py-1 text-black h-10 w-40 px-4 rounded bg-white">
                Downloading...
              </div>
            ) : (
              <Dropdown
                width={"100%"}
                position={"right-0"}
                customDropdown={""}
                id="dropdown-detail-download"
                title={
                  <p className="text-xs lg:text-sm flex items-center justify-between gap-2 border lg:py-1 text-black h-10 w-40 px-4 rounded bg-white">
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
                        } group  flex w-full gap-2 items-center text-xs rounded-md px-1 py-2 font-medium`}
                        onClick={() => {
                          isTahunan === "month"
                            ? handleDownloadPdf(
                                lonLat.lon,
                                lonLat.lat,
                                lonLat.region,
                                lonLat.province,
                                `Historis-${lonLat.region}`,
                                isTahunan === "month" ? "bulanan" : "tahunan",
                                sliceIndex.start,
                                sliceIndex.end,
                                isTahunan === "month" ? 10 : 15
                              )
                            : setOpenModalDownloadPdfTahunan(true);
                        }}
                        id="btn-detail-download-pdf"
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
                        } group  flex w-full gap-2 disabled:opacity-50 items-center text-xs rounded-md px-1 py-2 font-medium`}
                        onClick={() => {
                          handleDownloadCsv();
                        }}
                        id="btn-detail-download-csv"
                      >
                        <BsFiletypeCsv className="text-green-500" />
                        CSV
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Dropdown>
            )}
          </div>
        </div>

        <select
          id="historis-3"
          // id="select-detail-periode"
          className="w-full border py-2 px-3 my-4 text-sm cursor-pointer font-medium"
          onChange={(e) => {
            setIsTahunan(e.target.value);
            resetSliceIndex();
          }}
          defaultValue={isTahunan}
        >
          <option id="historis-3-bulanan" value={"month"}>
            Bulanan
          </option>
          <option id="historis-3-tahunan" value={"year"}>
            Tahunan
          </option>
        </select>

        <div id="">
          <div
            // className="flex flex-col lg:grid lg:grid-cols-2 text-sm gap-2"
            className="grid grid-cols-3 text-sm gap-4 detail-cols pb-8"
            ref={pdfRef}
          >
            {/* Maps */}
            <div
              id="card-historis-maps"
              className="shadow-lg min-h-[250px] md:min-h-[400px] rounded map-height bg-[#EBFFE4] box-shadow border-8 border-[#EBFFE4] relative overflow-hidden"
            >
              <p className={`text-2xl pb-1`}>Maps</p>
              <div className="h-full">
                {user?.status !== "Admin" && (
                  <DetailMap
                    center={
                      urlParams.get("lat") && urlParams.get("long")
                        ? [
                            parseFloat(urlParams.get("lat")),
                            parseFloat(urlParams.get("long")),
                          ]
                        : [-6.2088, 106.8456]
                    }
                    zoom={13}
                    data={lonLat}
                  />
                )}
              </div>
            </div>

            {/* potensi energi surya */}
            <div
              id="card-historis-potensi"
              className="shadow-lg rounded min:h-[250px] md:min-h-[400px] col-span-2 w-full bg-[#EBFFE4] box-shadow p-4"
            >
              <p className="text-2xl text-center">Potensi Energi Surya</p>
              <div className="relative">
                <BarChart
                  data={dataPotensiBar.data}
                  categories={
                    isTahunan === "month"
                      ? monthsShort
                      : dataPotensiBar.categories
                  }
                  height={"350"}
                  title={"kWh/m²"}
                  styleTitle={{
                    fontSize: "10px",
                    color: "#FF6B36",
                  }}
                  colors={["#FFA537", "rgba(249, 115, 22, 1)"]}
                  yaxis={{
                    max: 7,
                    tickAmount: 14,
                  }}
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
            {tableData.length === 0 ? (
              <div className="w-full flex col-span-3 my-4 flex-col">
                <Skeleton className="py-2" />
                <Skeleton className="py-10 mt-1" />
                <Skeleton className="py-16 mt-0.5" />
                <Skeleton className="py-20 mt-0.5" />
              </div>
            ) : (
              <div
                id="table-historis"
                className="w-full flex col-span-3 my-4 flex-col bg-[#EBFFE4] rounded box-shadow overflow-hidden"
              >
                {tableData.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between pb-2 relative ${
                      item.border ? "border-b-2 border-[#D9D9D9]" : ""
                    }
            ${
              item.id === 4 || item.id === 6
                ? "h-[150px] flex items-center"
                : ""
            }
            `}
                  >
                    {/* carousel */}
                    {index === 0 && (
                      <div className="absolute w-[87.3%] top-3 right-0 flex justify-between items-center">
                        <button
                          className="disabled:opacity-50  duration-150 hover:scale-110"
                          disabled={sliceIndex.start === 0}
                          onClick={() => {
                            setSliceIndex({
                              ...sliceIndex,
                              start: sliceIndex.start - sliceIndex.for,
                              end: sliceIndex.end - sliceIndex.for,
                            });
                          }}
                        >
                          <IoIosArrowBack />
                        </button>
                        <button
                          className="disabled:opacity-50  duration-150 hover:scale-110"
                          disabled={item.data.length <= sliceIndex.end}
                          onClick={() => {
                            setSliceIndex({
                              ...sliceIndex,
                              start: sliceIndex.start + sliceIndex.for,
                              end: sliceIndex.end + sliceIndex.for,
                            });
                          }}
                        >
                          <IoIosArrowForward />
                        </button>
                      </div>
                    )}

                    {/* Chart */}
                    {item.id === 4 || item.id === 6 ? (
                      <div
                        className="absolute w-[79.5%]  top-0 right-[3%]"
                        style={{
                          padding: `0 ${
                            sliceIndex.end - sliceIndex.start === 3 &&
                            sliceIndex.for === 3
                              ? 50
                              : sliceIndex.end - sliceIndex.start === 6 &&
                                sliceIndex.for === 6
                              ? 20
                              : item.data.length <= sliceIndex.end
                              ? (sliceIndex.end - item.data.length) * 10
                              : 0
                          }px`,
                        }}
                      >
                        <LineChartCustome
                          height={100}
                          data={
                            item.data.length > sliceIndex.for
                              ? item.data.slice(
                                  sliceIndex.start,
                                  sliceIndex.end
                                )
                              : item.data
                          }
                          colors={item.id === 4 ? "#DD2000" : "#1DB5DB"}
                        />
                      </div>
                    ) : null}
                    <div
                      id={
                        item.id === 2
                          ? "historis-4"
                          : item.id === 4
                          ? "historis-5"
                          : item.id === 6
                          ? "historis-6"
                          : null
                      }
                      className={`w-[15%] text-xs pt-2 font-bold pl-4 ${
                        index === 0 ? "bg-[#00AF50] py-2" : ""
                      }  ${
                        item.id === 4 || item.id === 6 || item.id === 2
                          ? "cursor-pointer hover:opacity-70 duration-150"
                          : ""
                      }}`}
                      onClick={() => {
                        if (item.id === 2) {
                          setOpenModalAngin(true);
                        } else if (item.id === 4) {
                          setOpenModalSuhu(true);
                        } else if (item.id === 6) {
                          setOpenModalAwan(true);
                        }
                      }}
                    >
                      {item.name}
                    </div>
                    {(item.data.length > sliceIndex.for
                      ? item.data.slice(sliceIndex.start, sliceIndex.end)
                      : item.data
                    ).map((item2, index2) => (
                      <div
                        key={index2}
                        className={`flex-grow flex items-center flex-col justify-center ${
                          index === 0 ? `bg-[#00AF50] py-2 font-semibold` : ``
                        }`}
                      >
                        {item.id === 2 ? (
                          <div className="flex gap-1 w-[50px] justify-center pb-4 pt-2 items-center font-bold text-base">
                            <div className="rotate-[180deg]">
                              <div
                                style={{
                                  rotate: `${
                                    !item.dataDir.slice(
                                      sliceIndex.start,
                                      sliceIndex.end
                                    )[index2]
                                      ? `180deg`
                                      : `${parseFloat(
                                          item.dataDir.slice(
                                            sliceIndex.start,
                                            sliceIndex.end
                                          )[index2]
                                        )}deg`
                                  }`,
                                }}
                              >
                                <FaLocationArrow className="-rotate-45" />
                              </div>
                            </div>
                            <p className="">
                              {item2 ? parseFloat(item2)?.toFixed(1) : 0}
                            </p>
                          </div>
                        ) : item.id === 3 ? (
                          <div className="flex flex-col w-[40px] text-center gap-1 justify-center pb-4 pt-2 items-center text-sm font-medium">
                            {item2 ? parseFloat(item2)?.toFixed(1) : 0}
                          </div>
                        ) : item.id === 4 ? null : item.id === 5 ? (
                          <div className="flex flex-col gap-1 justify-center items-center text-sm font-bold">
                            {item2 ? parseFloat(item2)?.toFixed(1) : 0}
                          </div>
                        ) : item.id === 6 ? null : item.id === 7 ||
                          item.id === 8 ||
                          item.id === 9 ? (
                          <div className="gap-1 w-[30px] text-center text-sm font-bold">
                            {/* {item2 ? parseFloat(item2)?.toFixed(1) : 0} */}
                            {item2 ? item2 : 0}
                          </div>
                        ) : (
                          item2
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* pergerakan matahari */}
            <div
              id="card-historis-panel-surya"
              className={`shadow-lg rounded w-full bg-[#EBFFE4] box-shadow p-4 ${
                isTahunan === "year" ? "hidden" : "inline-block"
              }`}
            >
              <p className="text-sm font-medium text-center">
                Sudut Optimum Kemiringan Panel Surya
              </p>
              <div className="relative">
                <p className="absolute -left-2 text-xs font-semibold text-black top-1/3">
                  U
                </p>
                <p className="absolute -left-2 text-xs font-semibold text-black bottom-1/3">
                  S
                </p>

                <MatahariLineChart
                  data={dataPergerakanMatahariLine.data}
                  colors={["rgb(202, 138, 4)"]}
                  sizeMarker={1}
                  colorsMarker={["rgb(250, 204, 21)"]}
                  maxLineChartValue={35}
                  minLineChartValue={-35}
                  yasis={{
                    tickAmount: 14,
                  }}
                  height={"300"}
                  styleTitle={{
                    marginLeft: "1rem",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                  widthBorder={3}
                />
              </div>
            </div>

            <div
              className={`${
                isTahunan === "month"
                  ? "grid-cols-1 md:grid-cols-2 col-span-2 "
                  : "grid-cols-1 md:grid-cols-2 col-span-3"
              } grid gap-4`}
            >
              {/* Curah Hujan */}
              <div
                id="card-historis-curah-hujan"
                className="shadow-lg rounded w-full bg-[#EBFFE4] box-shadow p-4"
              >
                <p className=" text-2xl text-center">Curah Hujan</p>
                <div className="relative">
                  <BarChart
                    data={dataCurahHujanBar.data}
                    categories={
                      isTahunan === "month"
                        ? monthsShort
                        : dataCurahHujanBar.categories
                    }
                    title={isTahunan === "month" ? `mm/bulan` : `mm/tahun`}
                    styleTitle={{
                      fontSize: "10px",
                      color: "#5A9BD5",
                    }}
                    colors={["#40B7D5"]}
                    height={"300"}
                    showGrid
                    yaxis={
                      isTahunan === "month" && {
                        max: 450,
                        tickAmount: 18,
                      }
                    }
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
              <div
                id="card-historis-index-kebeningan"
                className="shadow-lg rounded w-full bg-[#EBFFE4] box-shadow p-4"
              >
                <p className="text-2xl text-center">Indeks Kebeningan</p>
                <div className="relative">
                  <LineChart
                    data={dataIndexKebeninganLine.data}
                    categories={
                      isTahunan === "month"
                        ? monthsShort
                        : dataIndexKebeninganLine.categories
                    }
                    colors={["rgb(59, 130, 246)", "rgb(34, 197, 94)"]}
                    minLineChartValue={0}
                    maxLineChartValue={1}
                    height={"300"}
                    floating={isTahunan === "month" ? false : true}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataHistoris;

const ModalChart = ({ data = [], categories = [], isTahunan, setState }) => {
  return (
    <div className="md:max-w-[50vw] relative rounded">
      <div className="px-10 py-4">
        <p className="font-medium text-black pb-10 text-2xl">Suhu °C</p>
        <div className="relative">
          <LineChart
            data={data}
            categories={categories}
            colors={["rgb(239, 68, 68)", "rgb(59, 130, 246)"]}
            floating={true}
          />
          {isTahunan === "year" && (
            <div className="pl-14 pr-3 text-xs flex absolute text-black/70 -bottom-1 w-full justify-between">
              oke
            </div>
          )}
        </div>
      </div>

      <IoMdClose
        className="text-red-500 hover:opacity-60 absolute top-4 right-4 cursor-pointer hover:scale-105 duration-150"
        onClick={() => {
          setState(false);
        }}
      />
    </div>
  );
};
