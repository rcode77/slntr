import React, { createRef, useEffect, useMemo, useRef, useState } from "react";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";
import LineChart from "@components/molecule/Chart/LineChart";

import Data from "./data.json";

import axios from "axios";
import { useSelector } from "react-redux";
import { set } from "nprogress";

const Test = () => {
  const data = useMemo(() => Data, []);
  const { locationParams } = useSelector((state) => state.location);

  // data potensi exacly should get from API
  const [lonLat, setLonLat] = useState({
    long: 112.9,
    lat: -1,
    region: "KABUPATEN KATINGAN",
    province: "KALIMANTAN TENGAH",
    utc: 7,
    lon: 113,
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
    if (locationParams) {
      return setLonLat({
        ...locationParams,
        lon: parseFloat(parseFloat(locationParams.long)?.toFixed(1)),
        lat: parseFloat(parseFloat(locationParams.lat)?.toFixed(1)),
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

  // data dummy BMKG still hard file
  // GHI
  const [dataGhi, setDataGhi] = useState([]);
  const [newGhi, setNewGhi] = useState([]);
  const [newGhi2, setNewGhi2] = useState([]);
  const [newHour, setNewHour] = useState([]);

  const currentDate = new Date();

  const currentTime = currentDate
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .split(":")[0];

  const [bulanan] = useState([
    "bulan-1",
    "bulan-2",
    "bulan-3",
    "bulan-4",
    "bulan-5",
    "bulan-6",
    "bulan-7",
  ]);

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
    }
  }, [lonLat]);

  useEffect(() => {
    if (lonLat.lon && lonLat.lat) {
      getDailyPrakiraan(
        "ghi-harian",
        lonLat.lon,
        lonLat.lat,
        parseInt(currentTime),
        "GHI"
      ).then((res) => setDataGhi(res.slice(0, dataPayment?.paket)));
      getDailyPrakiraan(
        "ghi-harian",
        lonLat.lon,
        lonLat.lat,
        parseInt(currentTime),
        "GHI"
      ).then((res) => {
        const slicePotensi = res.slice(0, dataPayment?.paket);
        setNewHour(
          slicePotensi
            .map((item) => item.hour)
            .reduce((acc, cur) => acc.concat(cur), [])
        );
        setNewGhi(slicePotensi);
      });
      getDailyPrakiraan(
        "ghi-harian",
        lonLat.lon,
        lonLat.lat,
        parseInt(currentTime),
        "GHI",
        true
      ).then((res) => {
        const slicePotensi = res.slice(0, dataPayment?.paket);
        setNewGhi2(slicePotensi);
      });
    }
  }, [lonLat, dataPayment]);

  // console.log(
  //   newGhi
  //     .slice(slicePotensi.start, slicePotensi.finish)
  //     .map((item) => item.data[0].data)
  //     .reduce((acc, cur) => acc.concat(cur), [])
  // );

  const [chartGhi, setChartGhi] = useState([]);
  useEffect(() => {
    setChartGhi([
      {
        name: "GHI",
        data: newGhi2
          .slice(slicePotensi.start, slicePotensi.finish)
          .map((item) => item.data[0].data)
          .reduce((acc, cur) => acc.concat(cur), []),
      },
    ]);
  }, [slicePotensi]);

  console.log(chartGhi);

  return (
    <div className="font-poppins bg-[#F7FFF4] px-[2%] pt-10  2xl:container mx-auto">
      <div className="flex items-center justify-between gap-2 mb-6 pb-4">
        <div className="flex items-center gap-2 text-base lg:text-2xl text-main-500">
          <p className="font-bold ">{lonLat.region}</p>
        </div>
      </div>

      <div>
        <div className="bg-[#EBFFE4] box-shadow rounded p-2 mt-4">
          <p className="text-center text-xl ">Curent Chart</p>
          <div className="flex mt-4 relative">
            {dataGhi
              .slice(slicePotensi.start, slicePotensi.finish)
              .map((item, index) => (
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
                          item?.name === dataGhi[0]?.name ? true : false
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
                    <p className="">{item?.name}</p>
                    {index === slicePotensi.for - 1 ? (
                      <button
                        className="disabled:opacity-30 hover:opacity-30"
                        disabled={
                          item?.name === dataGhi[dataGhi.length - 1]?.name
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
                  <div className="border rounded-br rounded-bl">
                    <div className={`relative h-[200px]`}>
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
                        minLineChartValue={0}
                        maxLineChartValue={800}
                        gridColor={false}
                        height={"200"}
                        title={"kWh/m²"}
                        styleTitle={{
                          fontSize: "10px",
                          color: "#FF6B36",
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
                        annotations={{
                          xaxis: [
                            {
                              x: `${
                                item.isCustomeColor ? item.curentTime : 50
                              }`,
                              strokeDashArray: 0,
                              borderColor: "rgb(239, 68, 68)",
                              borderWidth: 2,
                              label: {
                                style: {
                                  color: "#fff",
                                  background: "rgb(239, 68, 68)",
                                },
                                text: "Saat ini",
                              },
                            },
                          ],
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
          <p className="text-center text-xl mt-4">Continues Chart</p>
          <div className="flex relative">
            {/* chart */}
            <div className="absolute -bottom-3 w-full z-30">
              <LineChart
                data={[
                  {
                    name: "GHI",
                    data: newGhi
                      .slice(slicePotensi.start, slicePotensi.finish)
                      .map((item) => item.data[0].data)
                      .reduce((acc, cur) => acc.concat(cur), []),
                  },
                ]}
                categories={newHour}
                gridColor={false}
                height={"200"}
                title={"kWh/m²"}
                styleTitle={{
                  fontSize: "10px",
                  color: "#FF6B36",
                }}
                colors={["#FFA537", "rgba(249, 115, 22, 1)"]}
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
                      // function transformData(originalData) {
                      //   const transformedData = [];

                      //   originalData.forEach((item) => {
                      //     const { name, data, treeHours } = item;
                      //     data[0].data.forEach((value) => {
                      //       transformedData.push({
                      //         name: name,
                      //         treeHours: treeHours,
                      //         data: value,
                      //       });
                      //     });
                      //   });

                      //   return transformedData;
                      // }

                      // const dataSlice = newGhi.slice(
                      //   slicePotensi.start,
                      //   slicePotensi.finish
                      // );

                      // const transformedData = transformData(dataSlice);

                      // const data = dataSlice
                      //   .map((item) => item.data[0].data)
                      //   .reduce((acc, cur) => acc.concat(cur), []);

                      return `Pukul ${newHour[dataPointIndex]}.00`;
                    },
                  },
                }}
                // annotations={{
                //   xaxis: [
                //     {
                //       x: 6,
                //       strokeDashArray: 0,
                //       borderColor: "rgb(239, 68, 68)",
                //       borderWidth: 2,
                //       label: {
                //         style: {
                //           color: "#fff",
                //           background: "rgb(239, 68, 68)",
                //         },
                //         text: "Saat ini",
                //       },
                //     },
                //   ],
                // }}
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

            {newGhi
              .slice(slicePotensi.start, slicePotensi.finish)
              .map((item, index) => (
                <div
                  key={index}
                  className={`text-center relative ${
                    index === 0 ? "w-[115%]" : "w-[100%]"
                  }`}
                >
                  {/* Carousel */}
                  <div className="bg-[#00AF50] flex justify-between items-center">
                    {index === 0 ? (
                      <button
                        className="disabled:opacity-30 hover:opacity-30"
                        disabled={
                          item?.name === dataGhi[0]?.name ? true : false
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

                  <div className="border rounded-br rounded-bl">
                    <div className={`h-[200px]`}></div>
                  </div>
                </div>
              ))}
          </div>
          <p className="text-center text-xl mt-4">
            Continues Chart with custome API
          </p>
          <div className="flex relative">
            {/* chart */}
            <div className="absolute -bottom-3 w-full z-30">
              <LineChart
                data={[
                  {
                    name: "GHI",
                    data: newGhi2
                      .slice(slicePotensi.start, slicePotensi.finish)
                      .map((item) => item.data[0].data)
                      .reduce((acc, cur) => acc.concat(cur), []),
                  },
                ]}
                categories={
                  newHour.length > 15
                    ? newHour.map((f, i) => (i % 3 === 0 ? f : ""))
                    : newHour
                }
                gridColor={false}
                height={"200"}
                title={"kWh/m²"}
                styleTitle={{
                  fontSize: "10px",
                  color: "#FF6B36",
                }}
                colors={["#FFA537", "rgba(249, 115, 22, 1)"]}
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
                      return `Pukul ${newHour[dataPointIndex]}.00`;
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

            {newGhi
              .slice(slicePotensi.start, slicePotensi.finish)
              .map((item, index) => (
                <div
                  key={index}
                  className={`text-center relative ${
                    index === 0 ? "w-[115%]" : "w-[100%]"
                  }`}
                >
                  {/* Carousel */}
                  <div className="bg-[#00AF50] flex justify-between items-center">
                    {index === 0 ? (
                      <button
                        className="disabled:opacity-30 hover:opacity-30"
                        disabled={item.name === dataGhi[0].name ? true : false}
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

                  <div className="border rounded-br rounded-bl">
                    <div className={`h-[200px]`}></div>
                  </div>
                </div>
              ))}
          </div>

          <p className="text-center text-xl mt-4">Continues Chart</p>
          <div className="flex relative">
            {/* chart */}
            <div className="absolute -bottom-3 w-full z-30">
              <LineChart
                data={[
                  {
                    name: "GHI",
                    data: newGhi2
                      .slice(slicePotensi.start, slicePotensi.finish)
                      .map((item) => item.data[0].data)
                      .reduce((acc, cur) => acc.concat(cur), []),
                  },
                ]}
                categories={
                  newHour.length > 15
                    ? newHour.map((f, i) => (i % 3 === 0 ? f : ""))
                    : newHour
                }
                gridColor={false}
                height={"200"}
                title={"kWh/m²"}
                styleTitle={{
                  fontSize: "10px",
                  color: "#FF6B36",
                }}
                colors={["#FFA537", "rgba(249, 115, 22, 1)"]}
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
                      return `Pukul ${newHour[dataPointIndex]}.00`;
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

            {newGhi
              .slice(slicePotensi.start, slicePotensi.finish)
              .map((item, index) => (
                <div
                  key={index}
                  className={`text-center relative ${
                    index === 0 ? "w-[115%]" : "w-[100%]"
                  }`}
                >
                  {/* Carousel */}
                  <div className="bg-[#00AF50] flex justify-between items-center">
                    {index === 0 ? (
                      <button
                        className="disabled:opacity-30 hover:opacity-30"
                        disabled={item.name === dataGhi[0].name ? true : false}
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

                  <div className="border rounded-br rounded-bl">
                    <div className={`h-[200px]`}></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;

const getDailyPrakiraan = async (
  nameIndex,
  lon,
  lat,
  curentTime,
  title,
  newData
) => {
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_URL_API}/search/new_prakiraan`,
      {
        distance: "10km",
        lat: -1,
        lon: 112.9,
        nameindex: nameIndex,
        time: "harian",
        datetime: "03-01-2023",
      }
    );

    const separatedData = {};

    // (newData ? newData : data).forEach((item) => {
    data.forEach((item) => {
      const { date, jam, value } = item;
      const dateKey = date.split("/").join(" - "); // Convert date format to use dashes instead of slashes

      if (!separatedData[dateKey]) {
        separatedData[dateKey] = {
          curentTime: curentTime,
          treeHours: false,
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

    // Function to fill missing hours and data with average values
    function fillMissingHoursAndData(obj) {
      const { data, hour } = obj;
      const newData = [];
      const newHour = [];

      // Convert hour array elements to numbers
      const hours = hour.map(Number);

      // Loop through each hour (from 0 to 23) and fill in missing hours and data
      for (let i = 0; i <= 23; i++) {
        const index = hours.indexOf(i);
        if (index !== -1) {
          // If the hour exists, push the data as it is
          newData.push(data[0].data[index]);
          newHour.push(hour[index]);
          obj.treeHours = false;
        } else {
          // If the hour is missing, calculate the average of surrounding data points
          const prevHour = hours.filter((h) => h < i).pop();
          const nextHour = hours.filter((h) => h > i).shift()
            ? hours.filter((h) => h > i).shift()
            : 0;
          const prevIndex = hours.indexOf(prevHour);
          const nextIndex = hours.indexOf(nextHour);

          const prevData = parseFloat(data[0].data[prevIndex]);
          const nextData = parseFloat(data[0].data[nextIndex]);

          // Calculate the average data for the missing hour
          const averageData = (prevData + nextData) / 2;
          newData.push(averageData);
          newHour.push(i.toString());
          obj.treeHours = true;
        }
      }

      // Update the object with the modified data and hour
      obj.data[0].data = newData;
      obj.hour = newHour;
    }

    // // Loop through the data array and apply the function to each object
    newData && formattedData.forEach(fillMissingHoursAndData);

    console.log(formattedData);

    return formattedData;
  } catch (error) {
    console.log(error);
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
