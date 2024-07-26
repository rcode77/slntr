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
import LineChartCustome from "@components/molecule/Chart/CustomChart/ApexLineCustomeChart";
import axios from "axios";
import BMKG from "@assets/bmkg.png";
import SILENTERA from "@assets/silentera.png";
import LineChart from "@components/molecule/Chart/LineChart";
import BarChart from "@components/molecule/Chart/BarChart";
import MatahariLineChart from "@components/molecule/Chart/CustomChart/MatahariLineChart";

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

const TestHistoris = () => {
  const pdfRef = useRef();
  const urlParams = new URLSearchParams(window.location.search);

  // const [subscription, setSubscription] = useState(null);

  const { token, user } = useSelector((state) => state.auth);

  // data potensi exacly should get from API
  const [lonLat, setLonLat] = useState({
    lon: 0,
    lat: 0,
    region: "",
    province: "",
    data: "tahunan",
  });

  const [sliceIndex, setSliceIndex] = useState({
    start: 0,
    end: 12,
  });

  const [isTahunan, setIsTahunan] = useState("month");
  const [years, setYears] = useState([]);

  // get payment data

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
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchPayment();
    }
  }, [token]);

  useEffect(() => {
    const long = parseFloat(urlParams.get("long"));
    const lat = parseFloat(urlParams.get("lat"));
    const region = urlParams.get("region");
    const province = urlParams.get("province");
    const data = urlParams.get("data") ? urlParams.get("data") : "bulanan";
    const start = urlParams.get("start") ? urlParams.get("start") : 0;
    const end = urlParams.get("end") ? urlParams.get("end") : 12;

    setLonLat({
      lon: parseFloat(parseFloat(long)?.toFixed(1)),
      lat: parseFloat(parseFloat(lat)?.toFixed(1)),
      region: region,
      province: province,
      data: data,
      start: start,
      end: end,
    });

    setSliceIndex({
      start: parseInt(start),
      end: parseInt(end),
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
      if (lonLat.data === "bulanan") {
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
      } else if (lonLat.data === "tahunan") {
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
  }, [lonLat]);

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
        const data = await getDataWindrose(
          monthWindrose,
          lonLat.lon,
          lonLat.lat
        );

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

  // table data historis
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (
      dataSuhuRataRataLine?.data[0]?.data?.length === 12 &&
      dataSuhuMaximumLine &&
      dataTutupanAwanTotal &&
      dataTutupanAwanTinggi &&
      dataTutupanAwanMenegah &&
      dataTutupanAwanRendah &&
      dataHistorisKecepatanAngin.data[0].data.length > 0 &&
      lonLat.data === "bulanan"
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
          name: "Maksimum (°C)",
          data: months.map((month, index) =>
            dataSuhuMaximumLine.data[0].data[index]?.toFixed(1)
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
      lonLat.data === "tahunan" &&
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
          name: "Angin (m/s)",
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
          name: "Kecepatan Maksimum (m/s)",
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
          name: "Maksimum (°C)",
          data: years.map((year, index) =>
            parseFloat(dataSuhuMaximumLine.data[0].data[index])
          ),
          border: true,
        },
        {
          id: 6,
          name: "Tutupan Awan (%)",
          data: years.map((year, index) =>
            parseFloat(parseFloat(dataTutupanAwanTotal.data[index]))
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
    dataSuhuRataRataLine,
    dataTutupanAwanMenegah,
    dataTutupanAwanRendah,
    dataTutupanAwanTinggi,
    dataTutupanAwanTotal,
    dataHistorisKecepatanAngin,
    lonLat,
  ]);

  return (
    <div className="font-poppins bg-[#F7FFF4] px-[2%] pt-4  2xl:container mx-auto">
      {/* Content */}
      <div>
        <div className="mb-10 flex justify-between">
          <div className="w-[49px] h-[59px]">
            <img src={BMKG} alt="bmkg" />
          </div>
          <div className="w-[215px] h-[81px]">
            <img src={SILENTERA} alt="silentera" />
          </div>
        </div>

        <div className="flex justify-between gap-2 mb-6 pb-4">
          <div className="flex gap-2 text-xs md:text-sm lg:text-2xl text-main-500">
            {/* <button onClick={() => navigate("/")}>
              <AiOutlineArrowLeft className="text-black" />
            </button> */}
            <p className="font-bold ">{lonLat.region}</p>
          </div>
          <p className="font-bold text-main-500 text-2xl absolute -translate-x-1/2 left-1/2 mt-10">
            {lonLat.data === "bulanan" ? "Bulanan" : "Tahunan"}
          </p>
          <div className="font-medium text-sm text-slate-600">
            <p>Bujur: {lonLat.lon}°</p>
            <p>Lintang: {lonLat.lat}°</p>
          </div>
        </div>

        <div className="flex justify-between pb-2 relative">
          <div className="flex items-center gap-4 text-xxs md:text-xs lg:text-sm">
            <button
              className={`text-black px-4 pt-1 pb-6 border-b-[#1F8A70] border-b-4 hover:opacity-60 duration-150`}
            >
              Data Historis
            </button>
            <div className="w-full border-b-2 absolute bottom-2" />
          </div>
        </div>

        <div id="">
          <div
            // className="flex flex-col lg:grid lg:grid-cols-2 text-sm gap-2"
            className="grid grid-cols-3 text-sm gap-4 detail-cols pb-8"
            ref={pdfRef}
          >
            {/* Maps */}
            <div className="shadow-lg min-h-[400px] rounded map-height bg-[#EBFFE4] box-shadow border-8 border-[#EBFFE4] relative overflow-hidden">
              <p className={`text-2xl pb-1`}>Maps</p>
              <div className="h-full">
                {user?.status !== "Admin" && (
                  <DetailMap
                    center={[
                      parseFloat(urlParams.get("lat")),
                      parseFloat(urlParams.get("long")),
                    ]}
                    zoom={13}
                    data={lonLat}
                  />
                )}
              </div>
            </div>

            {/* potensi energi surya */}
            <div className="shadow-lg rounded min-h-[400px] col-span-2 w-full bg-[#EBFFE4] box-shadow p-4">
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
                {lonLat.data === "tahunan" && (
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
            <div className="w-full flex col-span-3 my-4 flex-col bg-[#EBFFE4] rounded box-shadow overflow-hidden">
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
                          item.data.length > 12
                            ? item.data.slice(sliceIndex.start, sliceIndex.end)
                            : item.data
                        }
                        colors={item.id === 4 ? "#DD2000" : "#1DB5DB"}
                      />
                    </div>
                  ) : null}
                  <div
                    className={`w-[15%] text-xs pt-2 font-bold pl-4 ${
                      index === 0 ? "bg-[#00AF50] py-2" : ""
                    }  ${
                      item.id === 4 || item.id === 6 || item.id === 2
                        ? "cursor-pointer hover:opacity-70 duration-150"
                        : ""
                    }}`}
                  >
                    {item.name}
                  </div>
                  {(item.data.length > 12
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

            {/* pergerakan matahari */}
            <div
              className={`shadow-lg rounded w-full bg-[#EBFFE4] box-shadow p-4 ${
                lonLat.data === "tahunan" ? "hidden" : "inline-block"
              }`}
            >
              <p className="text-sm font-medium text-center">
                Sudut Optimum Kemiringan Panel Surya
              </p>
              <div className="relative">
                <p className="absolute -left-2 text-xs font-semibold text-black top-1/3">
                  LU
                </p>
                <p className="absolute -left-2 text-xs font-semibold text-black bottom-1/3">
                  LS
                </p>
                {lonLat.data === "bulanan" && (
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
                )}
              </div>
            </div>

            <div
              className={`${
                lonLat.data === "bulanan"
                  ? "grid-cols-2 col-span-2"
                  : "grid-cols-2 col-span-3"
              } grid gap-4`}
            >
              {/* Curah Hujan */}
              <div className="shadow-lg rounded w-full bg-[#EBFFE4] box-shadow p-4">
                <p className=" text-2xl text-center">Curah Hujan</p>
                <div className="relative">
                  <BarChart
                    data={dataCurahHujanBar.data}
                    categories={
                      lonLat.data === "bulanan"
                        ? monthsShort
                        : dataCurahHujanBar.categories
                    }
                    title={"Curah Hujan (mm)"}
                    styleTitle={{
                      fontSize: "10px",
                      color: "#5A9BD5",
                    }}
                    colors={["#40B7D5"]}
                    height={"300"}
                    showGrid
                    yaxis={
                      lonLat.data === "bulanan" && {
                        max: 450,
                        tickAmount: 18,
                      }
                    }
                  />
                  {lonLat.data === "tahunan" && (
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
                <p className="text-2xl text-center">Indeks Kebeningan</p>
                <div className="relative">
                  <LineChart
                    data={dataIndexKebeninganLine.data}
                    categories={
                      lonLat.data === "bulanan"
                        ? monthsShort
                        : dataIndexKebeninganLine.categories
                    }
                    colors={["rgb(59, 130, 246)", "rgb(34, 197, 94)"]}
                    minLineChartValue={0}
                    maxLineChartValue={1}
                    height={"300"}
                    floating={lonLat.data === "bulanan" ? false : true}
                    line
                  />
                  {lonLat.data === "tahunan" && (
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

export default TestHistoris;
