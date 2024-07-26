import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineLock } from "react-icons/ai";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";
import { FaLocationArrow, FaRegFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoginPopup } from "@redux/features/login/loginSlice";
import Dropdown from "@components/molecule/Dropdown";
import { Menu } from "@headlessui/react";
import { BsFiletypeCsv } from "react-icons/bs";
import CustomBarChart from "@components/molecule/Chart/CustomChart/CustomeBarChart";
import LineChartCustome from "@components/molecule/Chart/CustomChart/ApexLineCustomeChart";
import LineChart from "@components/molecule/Chart/LineChart";

import axios from "axios";
import DetailMap from "@components/molecule/Map/DetailMap";
import WindowSize from "@hooks/windowSize";
import Skeleton from "react-loading-skeleton";

import BMKG from "@assets/bmkg.png";
import SILENTERA from "@assets/silentera.png";

const TestMonitoring = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const windowSize = WindowSize();
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
    updatedAt: "",
    date: "",
  });

  useEffect(() => {
    const long = parseFloat(urlParams.get("long"));
    const lat = parseFloat(urlParams.get("lat"));
    const region = urlParams.get("region");
    const province = urlParams.get("province");
    const utc = urlParams.get("utc") || 7;
    const updatedAt = urlParams.get("updated");
    const date = urlParams.get("date");

    setLonLat({
      lon: parseFloat(parseFloat(long).toFixed(1)),
      lat: parseFloat(parseFloat(lat).toFixed(1)),
      region: region,
      province: province,
      utc: parseInt(utc),
      updatedAt: updatedAt,
      date: date,
    });
  }, []);

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

  // select option table data
  const [tableDataOption, setTableDataOption] = useState(0);
  const [updated, setUpdated] = useState(null);

  useEffect(() => {
    const getLastMonth = () => {
      const date = new Date();

      // get total days 1 month left
      const previousMonth = date.getMonth(); // Get the month of the date after subtracting one month
      const previousYear = date.getFullYear(); // Get the year of the date after subtracting one month

      const totalDaysInMonth = new Date(
        previousYear,
        previousMonth,
        0
      ).getDate();

      date.setMonth(previousMonth - 1); // Subtract one month from the current date

      // get date 1 month left
      const day = date.getDate().toString().padStart(2, "0");
      const month = (previousMonth + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString();

      const formattedDate = `${day} - ${month} - ${year}`;

      return {
        lastMonth: formattedDate,
        totalDays: totalDaysInMonth,
        day: day,
        month: `0${(parseInt(month) - 1).toString()}`,
        year: year,
      };
    };

    const monthData = getLastMonth();
    setUpdated(monthData.lastMonth);

    if (lonLat.lon && lonLat.lat) {
      getPrakiraanMonitoring(
        lonLat.lon,
        lonLat.lat,
        monthData.day,
        monthData.month,
        monthData.year,
        "GHI",
        "ghi-harian"
      ).then((res) => setDataGhi(res));
      getPrakiraanMonitoring(
        lonLat.lon,
        lonLat.lat,
        monthData.day,
        monthData.month,
        monthData.year,
        "PV Output",
        "pv-output-harian"
      ).then((res) => setDataIndeksKebeningan(res));
      getPrakiraanMonitoring(
        lonLat.lon,
        lonLat.lat,
        monthData.day,
        monthData.month,
        monthData.year,
        "Arah Angin",
        "arah-angin-harian"
      ).then((res) => setDataArahAngin(res));
      getPrakiraanMonitoring(
        lonLat.lon,
        lonLat.lat,
        monthData.day,
        monthData.month,
        monthData.year,
        "Angin",
        "kecepatan-angin-harian"
      ).then((res) => setDataKecepatanAngin(res));
      getPrakiraanMonitoring(
        lonLat.lon,
        lonLat.lat,
        monthData.day,
        monthData.month,
        monthData.year,
        "Angin Maksimum",
        "kecepatan-angin-maksimum-harian"
      ).then((res) => setDataKecepatanAnginMaksimum(res));
      getPrakiraanMonitoring(
        lonLat.lon,
        lonLat.lat,
        monthData.day,
        monthData.month,
        monthData.year,
        "Suhu",
        "temperature-harian"
      ).then((res) => setDataSuhu(res));
      getPrakiraanMonitoring(
        lonLat.lon,
        lonLat.lat,
        monthData.day,
        monthData.month,
        monthData.year,
        "Tutupan Awan Total",
        "tutupan-awan-total-harian"
      ).then((res) => setDataTutupanAwanTotal(res));
      getPrakiraanMonitoring(
        lonLat.lon,
        lonLat.lat,
        monthData.day,
        monthData.month,
        monthData.year,
        "Tutupan Awan Tinggi",
        "tutupan-awan-tinggi-harian"
      ).then((res) => setDataTutupanAwanTinggi(res));
      getPrakiraanMonitoring(
        lonLat.lon,
        lonLat.lat,
        monthData.day,
        monthData.month,
        monthData.year,
        "Tutupan Awan Tinggi",
        "tutupan-awan-menengah-harian"
      ).then((res) => setDataTutupanAwanMenengah(res));
      getPrakiraanMonitoring(
        lonLat.lon,
        lonLat.lat,
        monthData.day,
        monthData.month,
        monthData.year,
        "Tutupan Awan Tinggi",
        "tutupan-awan-rendah-harian"
      ).then((res) => setDataTutupanAwanRendah(res));
      getPrakiraanMonitoring(
        lonLat.lon,
        lonLat.lat,
        monthData.day,
        monthData.month,
        monthData.year,
        "Tutupan Awan Tinggi",
        "curah-hujan-harian"
      ).then((res) => setDataCurahHujan(res));
    }
  }, [lonLat]);

  const [newHour, setNewHour] = useState([]);

  const [dataChartGhi, setDataChartGhi] = useState([]);

  const [dataChartPv, setDataChartPv] = useState([]);

  useEffect(() => {
    if (dataGhi.length > 0 || dataIndeksKebeningan.length > 0) {
      //  setDataGhi((prev) => prev.slice(slicePotensi.start, slicePotensi.finish))
      const ghi = dataGhi.slice(slicePotensi.start, slicePotensi.finish);
      const pv = dataIndeksKebeningan.slice(
        sliceIndeksKebeningan.start,
        sliceIndeksKebeningan.finish
      );

      setDataChartGhi(ghi);
      setNewHour(
        ghi
          .map((item) => item.hour.map((hr) => `${hr}||${item.name}`))
          .reduce((acc, cur) => acc.concat(cur), [])
      );
      setDataChartPv(pv);
    }
  }, [
    slicePotensi.finish,
    dataGhi,
    dataIndeksKebeningan,
    sliceIndeksKebeningan.finish,
  ]);

  useEffect(() => {
    if (
      currentTime &&
      dataArahAngin.length > 0 &&
      dataKecepatanAngin.length > 0 &&
      dataSuhu.length > 0 &&
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
      // setTableData([]);
    }
  }, [
    currentTime,
    dataIndeksKebeningan,
    tableDataOption,
    dataArahAngin,
    dataKecepatanAngin,
    dataSuhu,
    dataCurahHujan,
    dataTutupanAwanTotal,
    dataTutupanAwanTinggi,
    dataTutupanAwanMenengah,
  ]);

  return (
    <div className="font-poppins bg-[#F7FFF4] px-[2%] pt-4 2xl:container mx-auto">
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
            Monitoring
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
              Data Monitoring
            </button>
            <div className="w-full border-b-2 absolute bottom-2" />
          </div>
        </div>

        <div id="downloadPdf capture-component">
          <div className="pb-8">
            <div className="flex justify-between items-center">
              <p className="font-medium">Monitoring</p>
              <p className="text-sm">Diperbaharui tanggal {updated}</p>
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

            <div className="bg-[#EBFFE4] box-shadow rounded p-2 mt-4">
              <p className="text-center text-xl ">
                Global Horizontal Irradiance (GHI)
              </p>
              <div className="flex mt-4 relative">
                {/* Chart */}
                <div
                  className={`absolute -bottom-4 z-[5] w-full ${
                    dataChartGhi.length === 0 && "hidden"
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
                      return i % 3 === 0 ? `${f.split("||")[0]}` : "";
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
                {dataChartGhi.map((item, index) => (
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
                    <div className="border rounded-br rounded-bl h-[200px]"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Prakiraan */}
            {tableData.length === 0 ? (
              <div className="w-full flex col-span-3 my-4 flex-col ">
                <Skeleton className="py-2" />
                <Skeleton className="py-10 mt-1" />
                <Skeleton className="py-16 mt-0.5" />
                <Skeleton className="py-20 mt-0.5" />
              </div>
            ) : (
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
                            {item2 ? item2 : 0}
                          </div>
                        ) : item.id === 10 ? (
                          <div className="flex flex-col w-[60px] h-full justify-center items-center text-sm font-bold">
                            <CustomBarChart
                              width="100%"
                              data={item2}
                              height={"130"}
                              maxCount={5}
                              enabled={false}
                            />
                            <p className="text-xs text-black/60">{item2}</p>
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

            <div className="bg-[#EBFFE4] box-shadow rounded p-2 mt-2">
              <p className="text-center text-xl ">PV Output</p>
              <div className="flex mt-4 relative">
                {/* Chart */}
                <div
                  className={`absolute -bottom-4 z-[5] w-full ${
                    dataChartPv.length === 0 && "hidden"
                  }`}
                >
                  <LineChart
                    data={[
                      {
                        name: "Pv Output",
                        data: dataChartPv
                          .map((item) => item.data[0].data)
                          .reduce((acc, cur) => acc.concat(cur), []),
                      },
                    ]}
                    categories={newHour.map((f, i) => {
                      return i % 3 === 0 ? `${f.split("||")[0]}` : "";
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
                    <div className="border rounded-br rounded-bl h-[200px]"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestMonitoring;

const getPrakiraanMonitoring = async (
  longitude,
  latitude,
  day,
  month,
  year,
  title,
  nameindex
) => {
  const url = `${process.env.REACT_APP_URL_API}/search/histori/bulanan`;
  const body = {
    distance: "10km",
    lat: latitude,
    lon: longitude,
    year: year,
    month: month,
    day: day,
    nameindex: nameindex,
  };

  try {
    const response = await axios.post(url, body);

    const separatedData = {};

    response.data.forEach((item) => {
      const { date, jam, value } = item;
      const dateKey = date.split("/").join(" - "); // Convert date format to use dashes instead of slashes

      if (!separatedData[dateKey]) {
        separatedData[dateKey] = {
          curentTime: 0,
          data: [
            {
              name: title,
              data: [],
            },
          ],
          hour: [],
          isCustomeColor: false,
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
        curentTime: 0,
        data: [
          {
            name: "-",
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
