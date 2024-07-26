import React, { useEffect, useRef, useState } from "react";
import Chart from "@components/molecule/Chart/Chart";
import { AiOutlineArrowLeft, AiOutlineLock } from "react-icons/ai";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";
import { FaLocationArrow, FaRegFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomBarChart from "@components/molecule/Chart/CustomChart/CustomeBarChart";
import LineChartCustome from "@components/molecule/Chart/CustomChart/ApexLineCustomeChart";
import LineChart from "@components/molecule/Chart/LineChart";

import axios from "axios";
import BarChart from "@components/molecule/Chart/BarChart";
import BMKG from "@assets/bmkg.png";
import SILENTERA from "@assets/silentera.png";
import DetailMap from "@components/molecule/Map/DetailMap";
import WindowSize from "@hooks/windowSize";
import Skeleton from "react-loading-skeleton";

const TestPrakiraan = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pdfRef = useRef();
  const windowSize = WindowSize();
  const urlParams = new URLSearchParams(window.location.search);
  // const subscription = Cookies.get("_subs")
  //   ? JSON.parse(Cookies.get("_subs"))
  //   : null;

  const { user, token } = useSelector((state) => state.auth);

  // data potensi exacly should get from API
  const [lonLat, setLonLat] = useState({
    lon: 0,
    lat: 0,
    region: "",
    province: "",
    isTahunan: "default",
    dayPackage: 3,
    updatedAt: "",
    date: "",
  });

  // checking payment
  const [subscription, setSubscription] = useState(true);
  const [listPayment, setListPayment] = useState([]);
  const [dataPayment, setDataPayment] = useState(null);

  const [months] = useState([
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
  ]);

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
    const long = parseFloat(urlParams.get("long"));
    const lat = parseFloat(urlParams.get("lat"));
    const region = urlParams.get("region");
    const province = urlParams.get("province");
    const isTahunan = urlParams.get("data") ? urlParams.get("data") : "default";
    const dayPackage = urlParams.get("package")
      ? urlParams.get("package")
      : "3";
    const updatedAt = urlParams.get("updated");
    const date = urlParams.get("date");

    setLonLat({
      lon: parseFloat(parseFloat(long).toFixed(1)),
      lat: parseFloat(parseFloat(lat).toFixed(1)),
      region: region,
      province: province,
      isTahunan: isTahunan,
      dayPackage: dayPackage,
      updatedAt: updatedAt,
      date: date,
    });
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
          const dateParts = payment.updated_at.split(" ")[0].split("-");
          const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

          setSubscription(true);
          setDataPayment({
            ...payment,
            updated: formattedDate,
          });
          break;
        } else {
          setSubscription(false);
        }
      }
    }
  }, [listPayment, lonLat]);

  const [slicePotensi, setSlicePotensi] = useState({
    start: 0,
    finish: 4,
    for: 4,
  });

  const resetSlicePotensi = () => {
    if (windowSize.width <= 768) {
      setSlicePotensi({
        start: 0,
        finish: 1,
        for: 1,
      });
    } else if (windowSize.width <= 1024) {
      setSlicePotensi({
        start: 0,
        finish: 2,
        for: 2,
      });
    } else {
      setSlicePotensi({
        start: 0,
        finish: 4,
        for: 4,
      });
    }
  };

  // data dummy BMKG still hard file
  // GHI
  const [dataGhi, setDataGhi] = useState([]);
  // ANGIN
  const [dataArahAngin, setDataArahAngin] = useState([]);
  const [dataKecepatanAngin, setDataKecepatanAngin] = useState([]);
  const [dataKecepatanAnginMaksimum, setDataKecepatanAnginMaksimum] = useState(
    []
  );

  // SUHU
  const [dataSuhu, setDataSuhu] = useState([]);
  // TUTUPAN AWAN
  const [dataTutupanAwan, setDataTutupanAwan] = useState([]);

  // TUTUPAN AWAN NEW
  const [dataTutupanAwanTotal, setDataTutupanAwanTotal] = useState([]);
  const [dataTutupanAwanTinggi, setDataTutupanAwanTinggi] = useState([]);
  const [dataTutupanAwanMenengah, setDataTutupanAwanMenengah] = useState([]);
  const [dataTutupanAwanRendah, setDataTutupanAwanRendah] = useState([]);

  const [dataIndeksKebeningan, setDataIndeksKebeningan] = useState([]);
  // CURAH HUJAN
  const [dataCurahHujan, setDataCurahHujan] = useState([]);
  const [sliceIndeksKebeningan, setSliceIndeksKebeningan] = useState({
    start: 0,
    finish: 4,
    for: 4,
  });

  const resetSliceIndeksKebeningan = () => {
    if (windowSize.width <= 768) {
      setSliceIndeksKebeningan({
        start: 0,
        finish: 1,
        for: 1,
      });
    } else if (windowSize.width <= 1024) {
      setSliceIndeksKebeningan({
        start: 0,
        finish: 2,
        for: 2,
      });
    } else {
      setSliceIndeksKebeningan({
        start: 0,
        finish: 4,
        for: 4,
      });
    }
  };

  const currentDate = new Date();

  const currentTime = currentDate
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .split(":")[0];

  // table data prakiraan
  const [tableData, setTableData] = useState([]);
  const [tableDataBulanan, setTableDataBulanan] = useState([]);
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
      resetSlicePotensi();
      resetSliceIndeksKebeningan();
    }
  }, [windowSize?.width]);

  const [bulanan] = useState([
    "bulan-1",
    "bulan-2",
    "bulan-3",
    "bulan-4",
    "bulan-5",
    "bulan-6",
    "bulan-7",
  ]);

  const [isTahunan, setIsTahunan] = useState("default");

  // select option table data
  const [tableDataOption, setTableDataOption] = useState(0);

  const [dataBulananGhi, setDataBulananGhi] = useState(null);
  const [dataBulananSuhu, setDataBulananSuhu] = useState(null);
  const [dataBulananIndex, setDataBulananIndex] = useState(null);

  useEffect(() => {
    if (
      subscription &&
      currentTime &&
      dataIndeksKebeningan.length > 0 &&
      dataArahAngin.length > 0 &&
      dataKecepatanAngin.length > 0 &&
      dataSuhu.length > 0 &&
      // dataTutupanAwan.length > 0 &&
      dataCurahHujan.length > 0 &&
      dataTutupanAwanTotal.length > 0 &&
      dataTutupanAwanTinggi.length > 0 &&
      dataTutupanAwanMenengah.length > 0 &&
      dataTutupanAwanRendah.length > 0
    ) {
      setTableData([
        {
          id: 1,
          name: (
            <select
              className="bg-[#00AF50] rounded border px-2 border-black/20 cursor-pointer"
              onChange={(e) => {
                setTableDataOption(e.target.value);
                resetSliceIndex();
              }}
            >
              {dataArahAngin.map((item, index) => (
                <option value={index}>{item.name}</option>
              ))}
            </select>
          ),
          data: dataArahAngin[tableDataOption].hour,
          border: false,
        },
        {
          id: 2,
          name: "Angin (m/s)",
          data: dataKecepatanAngin[tableDataOption].data[0].data.map((item) =>
            parseFloat(parseFloat(item).toFixed(1))
          ),
          dataDir: dataArahAngin[tableDataOption].data[0].data.map(
            (item) => item
          ),
          border: false,
        },
        {
          id: 3,
          name: "Kecepatan Maksimum (m/s)",
          data: dataKecepatanAnginMaksimum[tableDataOption].data[0].data.map(
            (item) => item
          ),
          border: true,
        },
        {
          id: 4,
          name: "Suhu (°C)",
          data: dataSuhu[tableDataOption].data[0].data.map((item) =>
            parseFloat(parseFloat(item).toFixed(1))
          ),
          border: true,
        },
        {
          id: 6,
          name: "Tutupan Awan (%)",
          data: dataTutupanAwanTotal[tableDataOption]?.data[0].data.map(
            (item) =>
              // parseFloat(parseFloat(item).toFixed(1))
              Math.round(item)
          ),
          border: false,
        },
        {
          id: 7,
          name: "Tinggi",
          data: dataTutupanAwanTinggi[tableDataOption]?.data[0].data.map(
            (item) =>
              // parseFloat(parseFloat(item).toFixed(1))
              Math.round(item)
          ),
          border: false,
        },
        {
          id: 8,
          name: "Menengah",
          data: dataTutupanAwanMenengah[tableDataOption]?.data[0].data.map(
            (item) =>
              // parseFloat(parseFloat(item).toFixed(1))
              Math.round(item)
          ),
          border: false,
        },
        {
          id: 9,
          name: "Rendah",
          data: dataTutupanAwanRendah[tableDataOption]?.data[0].data.map(
            (item) =>
              // parseFloat(parseFloat(item).toFixed(1))
              Math.round(item)
          ),
          border: true,
        },
        {
          id: 10,
          name: "Curah Hujan (mm)",
          data: dataCurahHujan[tableDataOption].data[0].data.map((item) =>
            parseFloat(parseFloat(item).toFixed(1))
          ),
          border: false,
        },
      ]);
    }

    if ((dataBulananGhi, dataBulananSuhu, dataBulananIndex)) {
      const now = new Date();
      const currentMonth = now.getMonth();

      let categoriesBulanan = [];

      for (let i = 0; i < bulanan.length; i++) {
        const targetMonthIndex = (currentMonth + i) % 12;
        const targetMonthName = months[targetMonthIndex];

        categoriesBulanan.push(targetMonthName);
      }

      setTableDataBulanan([
        {
          id: 1,
          name: <div />,
          data: categoriesBulanan,
          border: false,
        },
        {
          id: 2,
          name: "Suhu Maksimum (°C)",
          data: dataBulananSuhu?.data[0].data,
          border: true,
        },
      ]);
    }
  }, [
    subscription,
    currentTime,
    dataIndeksKebeningan,
    tableDataOption,
    dataArahAngin,
    dataKecepatanAngin,
    // dataTutupanAwan,
    dataSuhu,
    dataCurahHujan,
    dataBulananSuhu,
    dataBulananGhi,
    dataBulananIndex,
    dataTutupanAwanTotal,
    dataTutupanAwanTinggi,
    dataTutupanAwanMenengah,
  ]);

  const getDataPrakiraanBulanan = async (nameIndex, title) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_URL_API}/search/prakiraan`,
        {
          distance: "10km",
          lat: lonLat.lat,
          lon: lonLat.lon,
          nameindex: nameIndex,
          time: "bulanan",
          datetime: "03-01-2023",
        }
      );

      if (data?.error || data?.message) {
        return {
          data: [
            {
              name: title,
              data: bulanan.map((month) => 0),
            },
          ],
          categories: bulanan,
        };
      } else {
        let results =
          data.hits.hits.length > 0 || data.hits.hits[0]?._source
            ? data.hits.hits[0]._source
            : null;

        const filterCategories = Object.keys(results)
          .filter((f) => f !== "location" && f !== "Lon" && f !== "Lat")
          .sort();

        return {
          data: [
            {
              name: title,
              data: bulanan.map((month) =>
                parseFloat(parseFloat(results[month]).toFixed(1))
              ),
            },
          ],
          categories: bulanan,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (lonLat?.lon) {
      const now = new Date();
      const currentMonth = now.getMonth();

      let categoriesBulanan = [];

      for (let i = 0; i < bulanan.length; i++) {
        const targetMonthIndex = (currentMonth + i) % 12;
        const targetMonthName = months[targetMonthIndex];

        categoriesBulanan.push(targetMonthName);
      }

      getDataPrakiraanBulanan("potensi-bulanan", "Potensi Energi Surya").then(
        (res) =>
          setDataBulananGhi({
            data: res.data,
            categories: categoriesBulanan,
          })
      );
      getDataPrakiraanBulanan(
        "temperature-maximum-bulanan",
        "Temperatur Maksimum"
      ).then((res) =>
        setDataBulananSuhu({
          data: res.data,
          categories: categoriesBulanan,
        })
      );
      getDataPrakiraanBulanan("kebeningan-tahunan", "Indeks Kebeningan").then(
        (res) =>
          setDataBulananIndex({
            data: res.data,
            categories: categoriesBulanan,
          })
      );
    }
  }, [lonLat]);

  useEffect(() => {
    if (lonLat.lon && lonLat.lat && lonLat.date) {
      const outputDate = lonLat.date;

      getDailyPrakiraan(
        "ghi-harian",
        lonLat.lon,
        lonLat.lat,
        parseInt(currentTime),
        "GHI",
        lonLat.utc,
        outputDate
      ).then((res) => setDataGhi(res.slice(0, lonLat.dayPackage)));
      getDailyPrakiraan(
        "pv-output-harian",
        lonLat.lon,
        lonLat.lat,
        parseInt(currentTime),
        "PV Output",
        lonLat.utc,
        outputDate
      ).then((res) => setDataIndeksKebeningan(res.slice(0, lonLat.dayPackage)));
      getDailyPrakiraan(
        "kecepatan-angin-harian",
        lonLat.lon,
        lonLat.lat,
        parseInt(currentTime),
        "Data Angin",
        lonLat.utc,
        outputDate
      ).then((res) => setDataKecepatanAngin(res.slice(0, lonLat.dayPackage)));
      getDailyPrakiraan(
        "kecepatan-angin-maksimum-harian",
        lonLat.lon,
        lonLat.lat,
        parseInt(currentTime),
        "Data Angin Maksimum",
        lonLat.utc,
        outputDate
      ).then((res) =>
        setDataKecepatanAnginMaksimum(res.slice(0, lonLat.dayPackage))
      );
      getDailyPrakiraan(
        "arah-angin-harian",
        lonLat.lon,
        lonLat.lat,
        parseInt(currentTime),
        "Data Angin",
        lonLat.utc,
        outputDate
      ).then((res) => setDataArahAngin(res.slice(0, lonLat.dayPackage)));
      getDailyPrakiraan(
        "temperature-harian",
        lonLat.lon,
        lonLat.lat,
        parseInt(currentTime),
        "Suhu",
        lonLat.utc,
        outputDate
      ).then((res) => setDataSuhu(res.slice(0, lonLat.dayPackage)));
      getDailyPrakiraan(
        "tutupan-awan-total-harian",
        lonLat.lon,
        lonLat.lat,
        parseInt(currentTime),
        "Tutupan Awan Total",
        lonLat.utc,
        outputDate
      ).then((res) => setDataTutupanAwanTotal(res.slice(0, lonLat.dayPackage)));
      getDailyPrakiraan(
        "tutupan-awan-tinggi-harian",
        lonLat.lon,
        lonLat.lat,
        parseInt(currentTime),
        "Tutupan Awan Tinggi",
        lonLat.utc,
        outputDate
      ).then((res) =>
        setDataTutupanAwanTinggi(res.slice(0, lonLat.dayPackage))
      );
      getDailyPrakiraan(
        "tutupan-awan-menengah-harian",
        lonLat.lon,
        lonLat.lat,
        parseInt(currentTime),
        "Tutupan Awan Menengah",
        lonLat.utc,
        outputDate
      ).then((res) =>
        setDataTutupanAwanMenengah(res.slice(0, lonLat.dayPackage))
      );
      getDailyPrakiraan(
        "tutupan-awan-rendah-harian",
        lonLat.lon,
        lonLat.lat,
        parseInt(currentTime),
        "Tutupan Awan Rendah",
        lonLat.utc,
        outputDate
      ).then((res) =>
        setDataTutupanAwanRendah(res.slice(0, lonLat.dayPackage))
      );
      getDailyPrakiraan(
        "curah-hujan-harian",
        lonLat.lon,
        lonLat.lat,
        parseInt(currentTime),
        "Tutupan Awan Rendah",
        lonLat.utc,
        outputDate
      ).then((res) => setDataCurahHujan(res.slice(0, lonLat.dayPackage)));
    }
  }, [lonLat]);

  const [newHour, setNewHour] = useState([]);

  const [dataChartGhi, setDataChartGhi] = useState([]);
  const [isSameLenght, setIsSameLenght] = useState(true);
  const [curent, setCurent] = useState(null);

  const [dataChartPv, setDataChartPv] = useState([]);
  const [isSameLenghtPv, setIsSameLenghtPv] = useState(true);
  const [curentPv, setCurentPv] = useState(null);

  function checkLengthArray(array) {
    for (const obj of array) {
      if (obj.hour.length !== 24) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    if (dataGhi.length > 0) {
      //  setDataGhi((prev) => prev.slice(slicePotensi.start, slicePotensi.finish))
      const ghi = dataGhi.slice(slicePotensi.start, slicePotensi.finish);

      setDataChartGhi(ghi);
      setIsSameLenght(checkLengthArray(ghi));
      setNewHour(
        ghi
          .map((item) => item.hour.map((hr) => `${hr}||${item.name}`))
          .reduce((acc, cur) => acc.concat(cur), [])
      );
      setCurent(ghi.find((item) => item.isCustomeColor));
    }

    if (dataIndeksKebeningan?.length) {
      const pv = dataIndeksKebeningan?.slice(
        sliceIndeksKebeningan.start,
        sliceIndeksKebeningan.finish
      );

      setDataChartPv(pv);
      setIsSameLenghtPv(checkLengthArray(pv));
      setCurentPv(pv.find((item) => item.isCustomeColor));
    }
  }, [
    slicePotensi.finish,
    dataGhi,
    sliceIndeksKebeningan.finish,
    dataIndeksKebeningan,
  ]);

  return (
    <div className="font-poppins bg-[#F7FFF4] px-[2%] pt-4  2xl:container mx-auto">
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
          {lonLat?.isTahunan === "default"
            ? `${lonLat?.dayPackage} Hari`
            : "7 Bulan"}
        </p>
        <div className="font-medium text-sm text-slate-600">
          <p>Bujur: {lonLat.lon}°</p>
          <p>Lintang: {lonLat.lat}°</p>
        </div>
      </div>

      <div className="flex justify-between pb-2 relative">
        <div className="flex items-center gap-4 text-xxs md:text-xs lg:text-sm">
          <button
            className={`text-black px-4 pt-1 border-b-[#1F8A70] border-b-4 flex gap-1 items-center pb-6 hover:opacity-60 duration-150`}
          >
            Data Prakiraan
          </button>
          <div className="w-full border-b-2 absolute bottom-2" />
        </div>
      </div>

      <div id="downloadPdf capture-component">
        <div className="pb-8">
          <div className="flex justify-between items-center">
            <p className="font-medium">
              Prakiraan{" "}
              {lonLat.isTahunan === "default"
                ? `${lonLat.dayPackage} Hari`
                : "7 Bulan"}
            </p>
            <p className="text-sm">Diperbaharui tanggal {lonLat.updatedAt}</p>
          </div>

          {/* Maps Prakiraan */}
          <div className="h-[387] bg-[#EBFFE4] box-shadow mt-2 p-2">
            <div>
              <p className="text-xl">Maps</p>
            </div>
            <div className="h-[329px]">
              <DetailMap
                center={[
                  parseFloat(urlParams.get("lat")),
                  parseFloat(urlParams.get("long")),
                ]}
                zoom={13}
                data={lonLat}
              />
            </div>
          </div>

          {lonLat.isTahunan === "default" ? (
            <div className="bg-[#EBFFE4] box-shadow rounded p-2 mt-4">
              <p className="text-center text-xl ">
                Global Horizontal Irradiance (GHI)
              </p>
              <div className="flex mt-4 relative">
                {/* Chart */}
                <div
                  className={`absolute -bottom-3.5 z-[5] w-full ${
                    isSameLenght ? "" : "hidden"
                  }`}
                >
                  <LineChart
                    data={[
                      {
                        name: "GHI",
                        data: dataChartGhi
                          .map((item) => item.data[0].data)
                          .reduce((acc, cur) => acc.concat(cur), []),
                      },
                    ]}
                    categories={newHour.map((f, i) => {
                      const indexOf = newHour.findIndex(
                        (elemen) =>
                          elemen === `${curent?.curentTime}||${curent?.name}`
                      );
                      return `${curent?.curentTime}||${curent?.name}` === f
                        ? `${f.split("||")[0]}.`
                        : i % 3 === 0 &&
                          // `${curent?.curentTime}||${curent?.name}`
                          i !== indexOf - 1 &&
                          i !== indexOf + 1
                        ? f.split("||")[0]
                        : "";
                    })}
                    gridColor={false}
                    height={"200"}
                    title={"kWh/m²"}
                    styleTitle={{
                      fontSize: "10px",
                      color: "#FF6B36",
                    }}
                    colors={["#FFA537"]}
                    maxCount={7}
                    columnWidth={80}
                    xasis={{
                      axisBorder: {
                        show: false,
                      },
                      axisTicks: {
                        show: false,
                      },
                    }}
                    tooltip={{
                      x: {
                        formatter: (
                          seriesName,
                          { series, seriesIndex, dataPointIndex, w }
                        ) => {
                          return `Pukul ${
                            newHour[dataPointIndex].split("||")[0]
                          }.00`;
                        },
                      },
                    }}
                  />
                  <div className="absolute bottom-[25px] left-0.5 text-[8px] font-bold">
                    Jam (
                    {lonLat.utc === 7
                      ? "WIB"
                      : lonLat.utc === 8
                      ? "WITA"
                      : lonLat.utc === 9
                      ? "WIT"
                      : "Jam"}
                    )
                  </div>
                </div>

                {/* {dataGhi
                  .slice(slicePotensi.start, slicePotensi.finish) */}
                {dataChartGhi.map((item, index) => (
                  <div
                    key={index}
                    className={`text-center relative  ${
                      index === 0 ? "w-[112%]" : "w-[100%]"
                    }`}
                  >
                    {/* Carousel */}
                    <div className="bg-[#00AF50] flex justify-between items-center">
                      {index === 0 ? (
                        <button
                          className="disabled:opacity-30 hover:opacity-30"
                          disabled={
                            item.name === dataGhi[0].name ? true : false
                          }
                          onClick={() => {
                            setSlicePotensi({
                              ...slicePotensi,
                              start: slicePotensi.start - slicePotensi.for,
                              finish: slicePotensi.finish - slicePotensi.for,
                            });
                          }}
                        >
                          <IoIosArrowBack className="" />
                        </button>
                      ) : (
                        <div />
                      )}
                      <p className="">{item.name}</p>
                      {index === slicePotensi.for - 1 ? (
                        <button
                          className="disabled:opacity-30 hover:opacity-30"
                          disabled={
                            item.name === dataGhi[dataGhi.length - 1].name
                              ? true
                              : false
                          }
                          onClick={() => {
                            setSlicePotensi({
                              ...slicePotensi,
                              start: slicePotensi.start + slicePotensi.for,
                              finish: slicePotensi.finish + slicePotensi.for,
                            });
                          }}
                        >
                          <IoIosArrowForward className="" />
                        </button>
                      ) : (
                        <div />
                      )}
                    </div>
                    <div className="border rounded-br rounded-bl h-[200px]">
                      <div
                        className={`relative ${isSameLenght ? "hidden" : ""}`}
                      >
                        <LineChart
                          data={item.data}
                          categories={
                            item.hour.length > 15
                              ? item.hour.map((f, i) =>
                                  (i % 3 === 0 &&
                                    item.curentTime - 1 !== parseInt(f) &&
                                    item.curentTime + 1 !== parseInt(f) &&
                                    item.isCustomeColor) ||
                                  (i % 3 === 0 && !item.isCustomeColor) ||
                                  (item.curentTime === parseInt(f) &&
                                    item.isCustomeColor)
                                    ? f
                                    : ""
                                )
                              : item.hour
                          }
                          gridColor={false}
                          height={"200"}
                          title={"kWh/m²"}
                          styleTitle={{
                            fontSize: "10px",
                            color: "#FF6B36",
                          }}
                          yasis={{
                            max: 800,
                            tickAmount: 4,
                          }}
                          colors={["#FFA537", "rgba(249, 115, 22, 1)"]}
                          maxCount={7}
                          columnWidth={80}
                          curentTime={item.curentTime}
                          showYAxis={index === 0 ? true : false}
                          customColors={item.isCustomeColor ? "#FF0000" : false}
                          xasis={{
                            axisBorder: {
                              show: false,
                            },
                            axisTicks: {
                              show: false,
                            },
                          }}
                          tooltip={{
                            x: {
                              formatter: (
                                seriesName,
                                { series, seriesIndex, dataPointIndex, w }
                              ) => `Pukul ${item.hour[dataPointIndex]}.00`,
                            },
                          }}
                          chart={{
                            animations: {
                              enabled: index === 0 ? false : true,
                            },
                          }}
                        />
                        {index === 0 && (
                          <div className="absolute bottom-[9px] left-0.5 text-[8px] font-bold">
                            Jam (
                            {lonLat.utc === 7
                              ? "WIB"
                              : lonLat.utc === 8
                              ? "WITA"
                              : lonLat.utc === 9
                              ? "WIT"
                              : "Jam"}
                            )
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#EBFFE4] box-shadow rounded p-2 mt-4">
                <p className="text-center text-base font-medium ">
                  Potensi Energi Surya
                </p>
                <div className="relative">
                  <BarChart
                    data={dataBulananGhi.data}
                    categories={dataBulananGhi.categories}
                    title={"kWh/m²"}
                    styleTitle={{
                      fontSize: "10px",
                      color: "#FF6B36",
                    }}
                    colors={["#FFA537", "rgba(249, 115, 22, 1)"]}
                    height={"300"}
                    yaxis={{
                      max: 7,
                      tickAmount: 14,
                    }}
                  />
                </div>
              </div>
              <div className="bg-[#EBFFE4] box-shadow rounded p-2 mt-2">
                <p className="text-center text-base font-medium ">
                  Indeks Kebeningan
                </p>
                <div className="mt-4">
                  <LineChart
                    data={dataBulananIndex.data}
                    categories={dataBulananIndex.categories}
                    colors={["#1DB5DB"]}
                    gridColor={false}
                    minLineChartValue={0}
                    maxLineChartValue={1}
                    // floating={item.hour.length > 15 ? true : false}
                    height={"285"}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Table Prakiraan */}
          {tableData.length === 0 ? (
            <div className="w-full flex col-span-3 my-4 flex-col">
              <Skeleton className="py-2" />
              <Skeleton className="py-10 mt-1" />
              <Skeleton className="py-16 mt-0.5" />
              <Skeleton className="py-20 mt-0.5" />
            </div>
          ) : (
            <div className="w-full flex col-span-3 my-4 flex-col bg-[#EBFFE4] rounded box-shadow overflow-hidden">
              {isTahunan === "default"
                ? tableData.map((item, index) => (
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
                        className={`w-[15%] text-xs font-bold flex items-center pl-4 ${
                          index === 0 ? "bg-[#00AF50] py-2" : ""
                        }  ${
                          item.id === 4 || item.id === 6 || item.id === 2
                            ? "cursor-pointer hover:opacity-70 duration-150"
                            : ""
                        }}`}
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
                            <div className="flex w-[50px] gap-1 pt-4 items-center font-bold text-base">
                              <div
                                style={{
                                  rotate: `${
                                    !item.dataDir.slice(
                                      sliceIndex.start,
                                      sliceIndex.end
                                    )[index2]
                                      ? `0deg`
                                      : `-${parseFloat(
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
                              <p className="">
                                {item2 ? parseFloat(item2)?.toFixed(1) : 0}
                              </p>
                            </div>
                          ) : item.id === 3 ? (
                            <div className="flex flex-col w-[40px] gap-1 justify-center py-2 items-center text-sm font-medium">
                              {item2 ? parseFloat(item2)?.toFixed(1) : 0}
                            </div>
                          ) : item.id === 4 ? null : item.id === 5 ? (
                            <div className="flex flex-col gap-1 justify-center items-center text-sm font-bold">
                              {item2 ? parseFloat(item2)?.toFixed(1) : 0}
                            </div>
                          ) : item.id === 6 ? null : item.id === 7 ||
                            item.id === 8 ||
                            item.id === 9 ? (
                            <div className="text-center w-[30px] text-sm font-bold">
                              {/* {item2 ? parseFloat(item2)?.toFixed(1) : 0} */}
                              {item2 ? item2 : 0}
                            </div>
                          ) : item.id === 10 ? (
                            <div className="flex flex-col w-[60px] h-full justify-center items-center text-sm font-bold">
                              <CustomBarChart
                                width="100%"
                                data={item2}
                                height={"130"}
                                maxCount={5}
                              />
                              <p className="text-xs text-black/60">{item2}</p>
                            </div>
                          ) : (
                            item2
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                : tableDataBulanan.map((item, index) => (
                    <div
                      key={index}
                      className={`flex justify-between pb-2 relative ${
                        item.border ? "border-b-2 border-[#D9D9D9]" : ""
                      }
                  ${item.id === 2 ? "h-[150px] flex items-center" : ""}
                  `}
                    >
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
                      {item.id === 2 ? (
                        <div
                          className="absolute w-[79.5%]  top-0 right-[3%]"
                          style={{
                            padding: `0 30px`,
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
                            colors={"#DD2000"}
                          />
                        </div>
                      ) : null}
                      <div
                        className={`w-[15%] text-xs font-bold flex items-center pl-4 ${
                          index === 0 ? "bg-[#00AF50] py-2" : ""
                        }  cursor-pointer hover:opacity-70 duration-150`}
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
                          <div className="flex flex-col gap-1 justify-center items-center text-sm font-bold">
                            {item.id === 1 && item2}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
            </div>
          )}

          {/* index kebeningan */}
          {lonLat.isTahunan === "default" && (
            <div className="bg-[#EBFFE4] box-shadow rounded p-2 mt-2">
              <p className="text-center text-xl ">PV Output</p>
              <div className="flex mt-4 relative">
                {/* Chart */}
                <div
                  className={`absolute -bottom-4 z-[5] w-full ${
                    isSameLenghtPv ? "" : "hidden"
                  }`}
                >
                  <LineChart
                    data={[
                      {
                        name: "GHI",
                        data: dataChartPv
                          .map((item) => item.data[0].data)
                          .reduce((acc, cur) => acc.concat(cur), []),
                      },
                    ]}
                    categories={newHour.map((f, i) => {
                      const indexOf = newHour.findIndex(
                        (elemen) =>
                          elemen ===
                          `${curentPv?.curentTime}||${curentPv?.name}`
                      );
                      return `${curentPv?.curentTime}||${curentPv?.name}` === f
                        ? `${f.split("||")[0]}.`
                        : i % 3 === 0 && i !== indexOf - 1 && i !== indexOf + 1
                        ? f.split("||")[0]
                        : "";
                    })}
                    colors={["#1DB5DB"]}
                    gridColor={false}
                    // floating={item.hour.length > 15 ? true : false}
                    floating={false}
                    height={200}
                    xasis={{
                      axisBorder: {
                        show: false,
                      },
                      axisTicks: {
                        show: false,
                      },
                    }}
                    yasis={{
                      max: 200,
                      tickAmount: 4,
                    }}
                    tooltip={{
                      x: {
                        formatter: (
                          seriesName,
                          { series, seriesIndex, dataPointIndex, w }
                        ) => {
                          return `Pukul ${
                            newHour[dataPointIndex].split("||")[0]
                          }.00`;
                        },
                      },
                    }}
                  />
                  <div className="absolute bottom-[25px] left-0.5 text-[8px] font-bold">
                    Jam (
                    {lonLat.utc === 7
                      ? "WIB"
                      : lonLat.utc === 8
                      ? "WITA"
                      : lonLat.utc === 9
                      ? "WIT"
                      : "Jam"}
                    )
                  </div>
                </div>

                {dataChartPv.map((item, index) => (
                  <div
                    key={index}
                    className={`text-center relative ${
                      index === 0 ? "w-[112%]" : "w-[100%]"
                    }`}
                  >
                    {/* Carousel */}
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
                              ...sliceIndeksKebeningan,
                              start:
                                sliceIndeksKebeningan.start -
                                sliceIndeksKebeningan.for,
                              finish:
                                sliceIndeksKebeningan.finish -
                                sliceIndeksKebeningan.for,
                            });
                          }}
                        >
                          <IoIosArrowBack className="" />
                        </button>
                      ) : (
                        <div />
                      )}
                      <p className="">{item.name}</p>
                      {index === sliceIndeksKebeningan.for - 1 ? (
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
                              ...sliceIndeksKebeningan,
                              start:
                                sliceIndeksKebeningan.start +
                                sliceIndeksKebeningan.for,
                              finish:
                                sliceIndeksKebeningan.finish +
                                sliceIndeksKebeningan.for,
                            });
                          }}
                        >
                          <IoIosArrowForward className="" />
                        </button>
                      ) : (
                        <div />
                      )}
                    </div>
                    <div className="border rounded-br rounded-bl h-[200px]">
                      <div
                        className={`relative ${
                          isSameLenghtPv ? "hidden" : ""
                        } ${item.hour.length > 15 ? "" : ""}`}
                      >
                        <LineChart
                          data={item.data}
                          categories={
                            item.hour.length > 15
                              ? item.hour.map((f, i) =>
                                  (i % 3 === 0 &&
                                    item.curentTime - 1 !== parseInt(f) &&
                                    item.curentTime + 1 !== parseInt(f) &&
                                    item.isCustomeColor) ||
                                  (i % 3 === 0 && !item.isCustomeColor) ||
                                  (item.curentTime === parseInt(f) &&
                                    item.isCustomeColor)
                                    ? f
                                    : ""
                                )
                              : item.hour
                          }
                          title={"W/m²"}
                          styleTitle={{
                            fontSize: "10px",
                            color: "#1DB5DB",
                          }}
                          colors={["#1DB5DB"]}
                          gridColor={false}
                          showYAxis={index === 0 ? true : false}
                          // floating={item.hour.length > 15 ? true : false}
                          floating={false}
                          height={200}
                          xasis={{
                            axisBorder: {
                              show: false,
                            },
                            axisTicks: {
                              show: false,
                            },
                          }}
                          yasis={{
                            max: 200,
                            tickAmount: 4,
                          }}
                          tooltip={{
                            x: {
                              formatter: (
                                seriesName,
                                { series, seriesIndex, dataPointIndex, w }
                              ) => `Pukul ${item.hour[dataPointIndex]}.00`,
                            },
                          }}
                        />
                        {index === 0 && (
                          <div className="absolute bottom-6 left-0.5 text-[8px] font-bold">
                            Jam (
                            {lonLat.utc === 7
                              ? "WIB"
                              : lonLat.utc === 8
                              ? "WITA"
                              : lonLat.utc === 9
                              ? "WIT"
                              : "Jam"}
                            )
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPrakiraan;

const getDailyPrakiraan = async (
  nameIndex,
  lon,
  lat,
  curentTime,
  title,
  utc = 7,
  datePayment = "03-01-2023"
) => {
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_URL_API}/search/new_prakiraan`,
      {
        distance: "10km",
        lat: lat,
        lon: lon,
        nameindex: nameIndex,
        time: "harian",
        datetime: datePayment,
      }
    );

    const separatedData = {};

    data.forEach((item) => {
      const { date, jam, value } = item;
      const dateKey = date.split("/").join(" - "); // Convert date format to use dashes instead of slashes

      if (!separatedData[dateKey]) {
        separatedData[dateKey] = {
          curentTime: curentTime,
          data: [
            {
              name: title,
              data: [],
            },
          ],
          hour: [],
          isCustomeColor: getDate() === dateKey ? true : false,
          name: dateKey,
        };
      }

      separatedData[dateKey].data[0].data.push(
        parseFloat(parseFloat(value).toFixed(1))
      );
      separatedData[dateKey].hour.push(jam);
    });

    const formattedData = Object.values(separatedData);

    return formattedData;
  } catch (error) {
    console.log(error);
    return [
      {
        curentTime: curentTime,
        data: [
          {
            name: title,
            data: [0],
          },
        ],
        hour: ["-"],
        isCustomeColor: false,
        name: "-",
      },
    ];
  }
};

const getDate = () => {
  const date = new Date(); // Replace this with your Date object
  date.setDate(date.getDate());

  // Function to pad single digits with leading zeros
  function padWithZero(number) {
    return number.toString().padStart(2, "0");
  }

  // Get day, month, and year from the Date object
  const day = padWithZero(date.getDate());
  const month = padWithZero(date.getMonth() + 1); // Months are zero-based, so add 1
  const year = date.getFullYear();

  // Create the formatted date string
  return `${day} - ${month} - ${year}`;
};
