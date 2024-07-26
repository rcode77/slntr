import { setLocationParams } from "@redux/features/location/locationSlice";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillWarning,
} from "react-icons/ai";
import { BiSad } from "react-icons/bi";
import { BsClockFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowForward, IoIosArrowUp } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// "Semua", "Success", "Pending", "Cancel"

const status = ["Semua", "Success", "Pending", "Cancel"];

function getIndonesianMonthName(date) {
  const months = [
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
  return months[date.getMonth()];
}

const ListSubscription = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [active, setActive] = useState(status[0]);
  const [listPayment, setListPayment] = useState(null);
  const [dataPayment, setDataPayment] = useState(null);

  const [loadingGetPayment, setLoadingGetPayment] = useState(false);

  useEffect(() => {
    function compareCreatedAt(a, b) {
      return new Date(b.created_at) - new Date(a.created_at);
    }

    // Fungsi untuk memisahkan data berdasarkan bulan
    function separateByMonth(data) {
      const separatedData = {};

      data.forEach((item) => {
        const createdDate = new Date(item.created_at);
        const monthYear = `${getIndonesianMonthName(
          createdDate
        )} ${createdDate.getFullYear()}`;

        if (!separatedData[monthYear]) {
          separatedData[monthYear] = [];
        }
        separatedData[monthYear].push(item);
      });

      return separatedData;
    }

    const fetchPayment = async () => {
      setLoadingGetPayment(true);
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_URL_API}/payment/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const options = {
          weekday: "long",
        };

        if (data.length > 0) {
          const res = data.map((item) => {
            const dateCreated = new Date(item.created_at);
            const hari = dateCreated.toLocaleDateString("id-ID", options);

            const createdAt = item.created_at.split(" ");
            const jam = createdAt[1];
            const tanggal = createdAt[0].split("-")[2];
            return { ...item, hari: hari, jam: jam, tanggal: tanggal };
          });

          res.sort(compareCreatedAt);

          const result = separateByMonth(res);

          setListPayment(result);
          setDataPayment(result);

          setLoadingGetPayment(false);
        } else {
          setListPayment(null);
          setDataPayment(null);

          setLoadingGetPayment(false);
        }
      } catch (error) {
        setLoadingGetPayment(false);
        console.log(error);
      }
    };

    if (token) {
      fetchPayment();
    }
  }, [token]);

  useEffect(() => {
    if (active !== "Semua") {
      const filteredData = {};
      const data = dataPayment;
      Object.keys(data).forEach((monthYear) => {
        const successPayments = data[monthYear].filter(
          (item) => item.status === active
        );
        if (successPayments.length > 0) {
          filteredData[monthYear] = successPayments;
        }
      });
      setListPayment(filteredData);
    } else {
      setListPayment(dataPayment);
    }
  }, [active]);

  if (!token) {
    navigate("/");
  }

  return (
    <div className="px-[2%] py-4 2xl:container mx-auto">
      <div className="flex flex-col gap-1">
        <p className="text-3xl font-bold text-[#1F8A70]">Daftar Langganan</p>
        <p className="text-sm font-bold text-[#1F8A70]">
          Lihat dan Cek Status Langganan Anda
        </p>
      </div>
      <div className="mt-8">
        {/* Button Filter */}
        <div className="flex mb-4 justify-between items-center">
          <div className="flex px-2 items-center">
            {status.map((stat, index) => (
              <div
                key={index}
                className="py-1 rounded"
                id={
                  index === 0
                    ? "button-sub-all"
                    : index === 1
                    ? "button-sub-all"
                    : index === 2
                    ? "button-sub-active"
                    : index === 3
                    ? "button-sub-pending"
                    : "button-sub-cancel"
                }
              >
                <button
                  className={`text-black px-4 pt-1 pb-6 border-b-4 hover:opacity-60 duration-150 ${
                    stat === active ? "border-b-[#1F8A70]" : ""
                  } `}
                  disabled={stat === active || !dataPayment}
                  onClick={() => setActive(stat)}
                >
                  {stat === "Success"
                    ? "Aktif"
                    : stat === "Pending"
                    ? "Menunggu"
                    : stat === "Cancel"
                    ? "Dibatalkan"
                    : stat}
                </button>
              </div>
            ))}
          </div>

          {/* <div className="bg-white border flex gap-2 px-2 items-center rounded shadow">
            {status.map((stat, index) => (
              <div key={index} className="py-1 rounded">
                <button
                  className={`font-medium py-1 px-3 border border-transparent rounded ${
                    stat === active
                      ? "bg-main-500 text-white rounded border-main-300"
                      : "text-main-300 hover:border-main-500 duration-150 hover:text-main-500"
                  } `}
                  disabled={stat === active || !dataPayment}
                  onClick={() => setActive(stat)}
                >
                  {stat === "Success"
                    ? "Aktif"
                    : stat === "Pending"
                    ? "Menunggu"
                    : stat === "Cancel"
                    ? "Dibatalkan"
                    : stat}
                </button>
              </div>
            ))}
          </div> */}
        </div>
        {/* End Button Filter */}

        {/* List */}
        <div className="h-[66vh] overflow-auto">
          {listPayment && !loadingGetPayment ? (
            Object.keys(listPayment).map((month, monthIndex) => (
              <div key={monthIndex} className="mt-4">
                <p
                  className="font-bold text-slate-900"
                  id={`text-list-sub-month-${monthIndex + 1}`}
                >
                  {month}
                </p>
                {listPayment[month].map((item, index) => (
                  <div
                    key={index}
                    id={`card-list-sub-${index + 1}`}
                    className=" rounded border-2 md:border mt-2 shadow-sm px-6 flex gap-4 items-center py-4 md:py-0 md:h-20"
                  >
                    <div
                      id={`text-list-sub-date-${index + 1}`}
                      className="flex items-center flex-col font-medium text-slate-600 text-sm"
                    >
                      <p>{item.hari}</p>
                      <p className="text-3xl font-bold text-main-500">
                        {item.tanggal}
                      </p>
                    </div>

                    <div className="border-r-2 w-2 h-14" />

                    {/* time and location */}
                    <div className="w-full h-full flex flex-col md:flex-row md:items-center justify-between">
                      <div className="w-full h-full flex flex-col md:flex-row md:items-center">
                        <div className="h-full flex flex-col justify-center gap-2 md:w-1/4">
                          <div className="flex gap-6 items-center text-sm text-slate-600">
                            <div
                              className="flex items-center gap-3"
                              id={`text-list-sub-time-${index + 1}`}
                            >
                              <BsClockFill />
                              <p className="font-medium text-slate-500">
                                {item.jam}
                              </p>
                            </div>
                            {/* <div className="">
                              <IoIosArrowForward className="w-3" />
                            </div> */}
                            {/* <div className="flex items-center gap-3">
                       
                              <p className="font-medium text-slate-500">
                                11.12
                              </p>
                            </div> */}
                          </div>
                          <div
                            id={`text-list-sub-location-${index + 1}`}
                            className="flex items-center gap-3 text-sm text-slate-600"
                          >
                            <FaLocationDot />
                            <p className="font-semibold text-slate-800 whitespace-nowrap w-full overflow-hidden text-ellipsis">
                              {item.region}
                            </p>
                          </div>
                        </div>
                        {/* end time and location */}

                        {/* longitude & lattitude */}
                        <div className="h-full flex flex-col justify-center mt-4 md:mt-0 gap-2 md:w-1/3 lg:w-1/4">
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <p className="font-medium text-slate-500 w-[80px]">
                              Garis Lintang
                            </p>
                            <p className="font-medium text-slate-700">
                              : {item.lat}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <p className="font-medium text-slate-500 w-[80px]">
                              Garis Bujur
                            </p>
                            <p className="font-medium text-slate-700">
                              : {item.lon}
                            </p>
                          </div>
                        </div>
                        {/* end longitude & lattitude */}

                        {/* Paket */}
                        <div className="h-full md:flex flex-col justify-center md:gap-2 mt-4 md:mt-0 hidden md:w-1/6 lg:1/4">
                          <div className="flex items-center md:gap-3 text-xs text-slate-600">
                            <p className="font-medium text-sm text-slate-500">
                              Paket
                            </p>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <p className="font-medium text-slate-700">
                              {item.paket} Hari
                            </p>
                          </div>
                        </div>
                        <div className="h-full flex flex-col justify-center mt-4 md:mt-0 gap-2 md:hidden">
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <p className="font-medium text-slate-500 w-[80px]">
                              Paket
                            </p>
                            <p
                              id={`text-list-sub-paket-${index + 1}`}
                              className="font-medium text-slate-700"
                            >
                              : {item.paket} Hari
                            </p>
                          </div>
                        </div>
                        {/* End Paket */}

                        {/* status */}
                        <div className="h-full flex mt-4 md:mt-0 md:flex-col md:justify-center gap-2 md:w-[100px]">
                          <div className="flex items-center gap-3 md:flex-col text-xs text-slate-600">
                            <p className="font-medium text-slate-500 w-[80px]">
                              Status
                            </p>
                            <div
                              className={`font-semibold lg:text-sm md:w-full flex  ${
                                item.status === "Success"
                                  ? "text-green-500"
                                  : item.status === "Pending"
                                  ? "text-yellow-500"
                                  : item.status === "Cancel"
                                  ? "text-red-500"
                                  : "text-slate-900"
                              } flex items-center gap-1 md:gap-2`}
                            >
                              <span className="text-slate-500 md:hidden">
                                :{" "}
                              </span>
                              {item.status === "Success" ? (
                                <AiFillCheckCircle />
                              ) : item.status === "Pending" ? (
                                <AiFillWarning />
                              ) : (
                                <AiFillCloseCircle />
                              )}
                              <p id={`text-list-sub-status-${index + 1}`}>
                                {item.status === "Success"
                                  ? "Aktif"
                                  : item.status === "Pending"
                                  ? "Menunggu"
                                  : item.status === "Cancel"
                                  ? "Dibatalkan"
                                  : item.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        className="flex justify-end mt-6 md:mt-0 items-center text-xs font-medium text-blue-500 hover:text-blue-700 duration-150 group"
                        onClick={() => {
                          navigate(
                            `/detail/data-historis?long=${item.lon}&lat=${item.lat}&region=${item.region}&province=${item.province}&utc=${item.utc}`
                          );
                          dispatch(
                            setLocationParams({
                              long: item.lon,
                              lat: item.lat,
                              region: item.region,
                              province: item.province,
                              utc: item?.utc,
                            })
                          );
                        }}
                        id={`btn-list-sub-more-${index + 1}`}
                      >
                        <p className="">Selengkapnya </p>
                        <IoIosArrowForward className="group-hover:translate-x-1/2 duration-150" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="h-full">
              <div className="font-medium flex flex-col gap-2 items-center justify-center h-full text-slate-600">
                <p id="text-sub-not-found">
                  Maaf, Data Langganan tidak ditemukan
                </p>
                <BiSad className="w-6 h-6" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListSubscription;
