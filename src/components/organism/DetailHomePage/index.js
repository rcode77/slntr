import BarChart from "@components/molecule/Chart/BarChart";
import { setLocationParams } from "@redux/features/location/locationSlice";
import { setLoginPopup } from "@redux/features/login/loginSlice";
import { BiLock } from "react-icons/bi";
import Table from "../Table";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  getHistorisCurahHujan,
  getHistorisKecepatanAngin,
  getHistorisPotensi,
  getHistorisSuhuMaksimum,
} from "@hooks/DataHook";
import { AverageData } from "@hooks/ManipulationData";

const { useDispatch, useSelector } = require("react-redux");
const { useNavigate } = require("react-router-dom");

const months = [
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

const DetailHomePage = ({
  loadingSaveLocation,
  functionSavedLocation,
  savedLocation = [],
  handleDeleteLocation,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lonLat } = useSelector((state) => state.location);
  const { user, token } = useSelector((state) => state.auth);

  const isSavedLocation = useMemo(() => {
    // find location by lonlat
    if (!lonLat) return false;
    const lonToFixed = Number(parseFloat(lonLat.Lon).toFixed(5));
    const latToFixed = Number(parseFloat(lonLat.Lat).toFixed(5));
    const findLocation = savedLocation.find(
      (location) => location.lon === lonToFixed && location.lat === latToFixed
    );

    return findLocation;
  }, [lonLat, savedLocation.length]);

  // check payment
  const [listPayment, setListPayment] = useState([]);
  const [checkPayment, setCheckPayment] = useState(false);
  const [dataPayment, setDataPayment] = useState(null);

  // data rata rata historis
  const [dataSuhuMaksimum, setDataSuhuMaksimum] = useState(0);
  const [dataKecepatanAngin, setDataKecepatanAngin] = useState(0);
  const [dataCurahHujan, setDataCurahHujan] = useState(0);

  // data rata rata prakiraan
  const [dataGhi, setDataGhi] = useState([]);
  const [dataSuhu, setDataSuhu] = useState([]);
  const [dataTutupanAwan, setDataTutupanAwan] = useState([]);
  const [dataCurahHujanPrakiraan, setDataCurahHujanPrakiraan] = useState([]);
  const [dataIndeksKebeningan, setDataIndeksKebeningan] = useState([]);

  const [dataPotensiBar, setDataPotensiBar] = useState({
    data: [
      {
        name: "Potensi Energi Surya",
        data: [],
      },
    ],
    categories: [],
  });

  // get payment
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
    if (lonLat) {
      // set checking payment
      for (const payment of listPayment) {
        if (
          payment.lat === lonLat.Lat &&
          payment.lon === lonLat.Lon &&
          payment.status === "Success"
        ) {
          setDataPayment(payment);
          setCheckPayment(true);
          break;
        } else {
          setCheckPayment(false);
        }
      }

      const longitude = parseFloat(parseFloat(lonLat.Lon).toFixed(1));
      const lattitude = parseFloat(parseFloat(lonLat.Lat).toFixed(1));

      getHistorisPotensi(lattitude, longitude).then((res) =>
        setDataPotensiBar(res)
      );
      getHistorisSuhuMaksimum(lattitude, longitude).then((res) =>
        setDataSuhuMaksimum(
          res.data[0].data.length > 0 ? AverageData(res.data[0].data) : 0
        )
      );
      getHistorisKecepatanAngin(lattitude, longitude).then((res) =>
        setDataKecepatanAngin(
          res.data[0].data.length > 0 ? AverageData(res.data[0].data) : 0
        )
      );
      getHistorisCurahHujan(lattitude, longitude).then((res) =>
        setDataCurahHujan(
          res.data[0].data.length > 0 ? AverageData(res.data[0].data) : 0
        )
      );
    }
  }, [lonLat, listPayment]);

  // data table rata-rata historis
  const [dataRataRata, setDataRataRata] = useState([]);
  useEffect(() => {
    setDataRataRata([
      {
        id: 1,
        name: "Potensi Energi Surya",
        data:
          dataPotensiBar.data.length > 0
            ? AverageData(dataPotensiBar.data[0].data)
            : 0,
        satuan: <p>kWh/m&sup2;</p>,
      },
      {
        id: 3,
        name: "Suhu Maksimum",
        data: dataSuhuMaksimum,
        satuan: "°C",
      },
      {
        id: 4,
        name: "Kecepatan Angin",
        data: dataKecepatanAngin,
        satuan: "m/s",
      },
      {
        id: 5,
        name: "Curah Hujan",
        data: dataCurahHujan / 30,
        satuan: "mm",
      },
    ]);
  }, [dataPotensiBar, dataCurahHujan, dataKecepatanAngin]);

  // data column table rata-rata historis
  const columnsHistoris = [
    {
      name: <p className="text-xs py-1">Data</p>,
      selector: (row) => <div className="text-xs">{row.name}</div>,
    },
    {
      name: <p className="text-xs text-center py-1">Nilai rata-rata tahunan</p>,
      selector: (row) => (
        <div className="text-xs text-center flex justify-center gap-1">
          {typeof row.data === "number" ? row.data.toFixed(1) : row.data}{" "}
          {row.satuan}
        </div>
      ),
    },
  ];

  // data table rata-rata prakiraan
  const [dataRataRataPrakiraan, setDataRataRataPrakiraan] = useState([
    {
      id: 1,
      name: "GHI",
      data: 0,
      satuan: <p>kWh/m&sup2;</p>,
    },
    {
      id: 2,
      name: "Suhu",
      data: 0,
      satuan: "°C",
    },
    {
      id: 3,
      name: "Tutupan Awan",
      data: 0,
      satuan: "m/s",
    },
    {
      id: 4,
      name: "Curah Hujan",
      data: 0,
      satuan: "mm",
    },
    {
      id: 5,
      name: "PV Output",
      data: 0,
      satuan: "W/m2",
    },
  ]);

  // get data from API
  useEffect(() => {
    if (dataPayment && checkPayment) {
      const longitude = parseFloat(parseFloat(dataPayment.lon).toFixed(1));
      const latitude = parseFloat(parseFloat(dataPayment.lat).toFixed(1));

      getDailyPrakiraan("ghi-harian", longitude, latitude, "GHI").then((res) =>
        setDataGhi(res.length > 0 ? res.slice(0, dataPayment.paket) : res)
      );
      getDailyPrakiraan("temperature-harian", longitude, latitude, "GHI").then(
        (res) =>
          setDataSuhu(res.length > 0 ? res.slice(0, dataPayment.paket) : res)
      );
      getDailyPrakiraan(
        "tutupan-awan-total-harian",
        longitude,
        latitude,
        "GHI"
      ).then((res) =>
        setDataTutupanAwan(
          res.length > 0 ? res.slice(0, dataPayment.paket) : res
        )
      );
      getDailyPrakiraan("curah-hujan-harian", longitude, latitude, "GHI").then(
        (res) =>
          setDataCurahHujanPrakiraan(
            res.length > 0 ? res.slice(0, dataPayment.paket) : res
          )
      );
      getDailyPrakiraan("pv-output-harian", longitude, latitude, "GHI").then(
        (res) =>
          setDataIndeksKebeningan(
            res.length > 0 ? res.slice(0, dataPayment.paket) : res
          )
      );
    }
  }, [dataPayment, checkPayment, listPayment]);

  const getRataRataPrakiraan = (data) => {
    const sumArray = data.map((setData) =>
      setData.data[0].data.reduce((acc, value) => acc + value, 0)
    );
    const averageArray = sumArray.map((sum) =>
      parseFloat(parseFloat(sum / data[0].data[0].data.length).toFixed(1))
    );
    const sum = averageArray.reduce((acc, value) => acc + value, 0);
    return parseFloat(parseFloat(sum / averageArray.length).toFixed(1));
  };

  useEffect(() => {
    if (
      dataGhi.length > 0 &&
      dataSuhu.length > 0 &&
      dataTutupanAwan.length > 0 &&
      dataCurahHujanPrakiraan.length > 0 &&
      dataIndeksKebeningan.length > 0
    ) {
      const ghi = dataGhi.length !== 1 ? getRataRataPrakiraan(dataGhi) : "-";
      const suhu = dataSuhu.length !== 1 ? getRataRataPrakiraan(dataSuhu) : "-";
      const tutupanAwan =
        dataTutupanAwan.length !== 1
          ? getRataRataPrakiraan(dataTutupanAwan)
          : "-";
      const curahHujan =
        dataCurahHujanPrakiraan.length !== 1
          ? getRataRataPrakiraan(dataCurahHujanPrakiraan)
          : "-";
      const indeksKebeningan =
        dataIndeksKebeningan.length !== 1
          ? getRataRataPrakiraan(dataIndeksKebeningan)
          : "-";

      setDataRataRataPrakiraan([
        {
          id: 1,
          name: "GHI",
          data: ghi,
          satuan: <p>kWh/m&sup2;</p>,
        },
        {
          id: 2,
          name: "Suhu",
          data: suhu,
          satuan: "°C",
        },
        {
          id: 3,
          name: "Tutupan Awan",
          data: tutupanAwan,
          satuan: "m/s",
        },
        {
          id: 4,
          name: "Curah Hujan",
          data: curahHujan,
          satuan: "mm",
        },
        {
          id: 5,
          name: "PV Output",
          data: indeksKebeningan,
          satuan: "W/m2",
        },
      ]);
    }
  }, [
    dataGhi,
    dataSuhu,
    dataTutupanAwan,
    dataCurahHujanPrakiraan,
    dataIndeksKebeningan,
  ]);

  const columnPrakiraan = [
    {
      name: <p className="text-xs py-1">Data</p>,
      selector: (row) => <div className="text-xs">{row.name}</div>,
    },
    {
      name: <p className="text-xs text-center py-1">Nilai rata-rata</p>,
      selector: (row) => {
        return (
          <div className="">
            {checkPayment ? (
              <div className=" text-xs text-center flex justify-center gap-1">
                {typeof row.data === "number" ? row.data.toFixed(1) : row.data}{" "}
                {row.satuan}
              </div>
            ) : (
              <div className=" text-xs text-center flex justify-center gap-1">
                -
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex h-full overflow-auto md:h-full md:flex-col md:items-center md:justify-center">
      <div className="shadow-xl flex-col gap-4 py-3 px-4 flex md:justify-between w-full h-full  xl:col-span-1">
        <div className="flex flex-col justify-center items-center gap-1">
          <div className="text-center mb-2 text-black">
            <p className="font-bold text-lg md:text-4xl font-mono">
              {lonLat?.KABUPATEN}
            </p>
            <p className="text-sm md:text-lg tracking-widest mt-2">
              {lonLat?.PROVINSI}
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 xl:flex flex-col gap-2 md:gap-4 overflow-auto max-h-[50%] md:max-h-[65vh] md:px-[2%]">
          <div className="rounded box-shadow w-full h-full pt-2 px-2 col-span-3 bg-[#EBFFE4]">
            <p className="text-base pt-2 font-bold text-black text-center">
              Potensi Energi Surya
            </p>
            <BarChart
              data={dataPotensiBar.data}
              categories={months}
              title={"kWh/m²"}
              styleTitle={{
                fontSize: "10px",
                color: "#FF6B36",
              }}
              colors={["#FFA537"]}
              yaxis={{
                max: 7,
                tickAmount: 14,
              }}
            />
          </div>
          <div className="grid grid-cols-1 lg::grid-cols-2 col-span-3 xl:flex flex-col gap-4 mb-4">
            <div className="w-full box-shadow h-full text-sm runded overflow-hidden">
              <Table
                data={dataRataRata}
                column={columnsHistoris}
                overflow={false}
              />
            </div>
            <div
              className={`shadow-lg box-shadow rounded w-full h-full text-sm relative group ${
                !checkPayment && "cursor-pointer"
              }`}
              onClick={() => {
                if (!user) {
                  dispatch(setLoginPopup(true));
                } else if (!checkPayment) {
                  navigate(
                    `/payment?long=${lonLat?.Lon}&lat=${lonLat?.Lat}&region=${lonLat?.KABUPATEN}&province=${lonLat?.PROVINSI}`
                  );
                  dispatch(
                    setLocationParams({
                      long: lonLat.Lon,
                      lat: lonLat.Lat,
                      region: lonLat.KABUPATEN,
                      province: lonLat.PROVINSI,
                      utc: lonLat.UTC,
                    })
                  );
                }
              }}
            >
              {!checkPayment && (
                <div className="text-slate-700 top-1/2 left-1/2 absolute z-10 -translate-x-1/2 ">
                  <BiLock className="w-6 h-6 duration-300 group-hover:scale-125" />
                </div>
              )}

              <div className="">
                <div className={`${checkPayment ? "" : "opacity-50"}`}>
                  <Table
                    data={dataRataRataPrakiraan}
                    column={columnPrakiraan}
                    overflow={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-col lg:flex-row w-full text-xs lg:px-4 xl:text-sm font-semibold">
          <button
            id="detail-2"
            className="bg-[#00672E] w-full py-2 rounded-md text-white hover:opacity-75 duration-150"
            onClick={() => {
              navigate(
                `/detail/data-historis?long=${lonLat?.Lon}&lat=${lonLat?.Lat}&region=${lonLat?.KABUPATEN}&province=${lonLat?.PROVINSI}`
              );
              dispatch(
                setLocationParams({
                  long: lonLat.Lon,
                  lat: lonLat.Lat,
                  region: lonLat.KABUPATEN,
                  province: lonLat.PROVINSI,
                  utc: lonLat.UTC,
                })
              );
            }}
          >
            Detail
          </button>
          <button
            id="detail-3"
            className={` w-full ${
              isSavedLocation
                ? "bg-slate-200 hover:opacity-60 duration-150"
                : "bg-white text-[#00672E] border-[#00672E] hover:text-main-800 hover:border-main-800 duration-150"
            } border disabled:opacity-50 py-2 rounded-md `}
            onClick={() => {
              if (!user) {
                dispatch(setLoginPopup(true));
              } else {
                if (!isSavedLocation) {
                  functionSavedLocation();
                } else {
                  handleDeleteLocation(isSavedLocation.id);
                }
              }
            }}
            disabled={loadingSaveLocation ? true : false}
          >
            {isSavedLocation ? "Tersimpan" : "Simpan Lokasi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailHomePage;

const getDailyPrakiraan = async (nameIndex, lon, lat, title, sliceFinish) => {
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_URL_API}/search/new_prakiraan`,
      {
        distance: "10km",
        lat: lat,
        lon: lon,
        nameindex: nameIndex,
        time: "harian",
        datetime: "03-01-2023",
      }
    );

    const separatedData = {};

    data.forEach((item) => {
      const { date, jam, value } = item;
      const dateKey = date.split("/").join(" - "); // Convert date format to use dashes instead of slashes

      if (!separatedData[dateKey]) {
        separatedData[dateKey] = {
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
        data: [
          {
            name: title,
            data: [],
          },
        ],
        hour: [],
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
