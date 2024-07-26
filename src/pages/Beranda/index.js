import { BiLock } from "react-icons/bi";
import { useEffect, useState } from "react";
import Table from "@components/organism/Table";
import Map from "@components/molecule/Map/Map";
import Chart from "@components/molecule/Chart/Chart";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setLoginPopup } from "@redux/features/login/loginSlice";
import { AverageData } from "@hooks/ManipulationData";
import {
  getHistorisCurahHujan,
  getHistorisKecepatanAngin,
  getHistorisPotensi,
  getHistorisSuhuMaksimum,
  getHistorisSuhuRataRata,
  savedAllLocation,
} from "@hooks/DataHook";
import {
  setLoadingMap,
  setLocationParams,
  setLonLat,
  setSavedLoc,
} from "@redux/features/location/locationSlice";
import Legend2 from "@components/molecule/Map/Legend2";
import averagePotentMonthly from "@data/avgbulananprovinsi.json";
import averagePotentYearly from "@data/avgtahunanprovinsi.json";
import ToastHook from "@hooks/Toast";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
  IoIosClose,
  IoMdOpen,
} from "react-icons/io";
import Cookies from "js-cookie";
import CsvToJson from "@hooks/csvConvert";
import Joyride from "react-joyride";

import DataGhi from "@data/prakiraan/ghi.csv";
import DataSuhu from "@data/prakiraan/suhu.csv";
import DataTutupanAwan from "@data/prakiraan/tutupanawan.csv";
import DataCurahHujan from "@data/prakiraan/curahhujan.csv";
import DataIndexKebeingan from "@data/prakiraan/prakiraanIndex.csv";
import ModalDelete from "@components/molecule/Modal/ModalDelete";
import WindowSize from "@hooks/windowSize";
import BarChart from "@components/molecule/Chart/BarChart";
import { AiOutlineLoading } from "react-icons/ai";
import DetailHomePage from "@components/organism/DetailHomePage";
import { setUser } from "@redux/features/auth/authSlice";

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

const Beranda = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { failedToast, successToast } = ToastHook();
  const { lonLat, loadingMap } = useSelector((state) => state.location);
  const { user, token } = useSelector((state) => state.auth);

  const [savedLocation, setSavedLocation] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [deleteLoc, setDeleteLoc] = useState(false);
  const [tourLoc, setTourLoc] = useState(false);

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [deleteClicked, setDeleteClicked] = useState(null);

  // data rata-rata potensi energi surya per provinsi
  const avgPotentMonthly = Object.entries(averagePotentMonthly)?.map((e) => ({
    data: e[1],
    id: e[0],
  }));

  const avgPotentYearly = Object.entries(averagePotentYearly)?.map((e) => ({
    data: e[1],
    id: e[0],
  }));

  const mergedPotentProv = [];

  avgPotentMonthly.forEach((item1) => {
    const matchingObj = avgPotentYearly.find((item2) => item2.id === item1.id);
    if (matchingObj) {
      const mergedObj = {
        ...item1,
        yearly_averages: matchingObj.data.aggregations.monthly_averages.value,
      };
      mergedPotentProv.push(mergedObj);
    }
  });

  // remove redux data
  useEffect(() => {
    return () => {
      dispatch(setLonLat(null));
    };
  }, []);

  const [isLoadingSavedLocation, setIsLoadingSavedLocation] = useState(false);

  const handleSaveLocation = async () => {
    setIsLoadingSavedLocation(true);

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_URL_API}/savelocation`,
        {
          lat: lonLat.Lat,
          lon: lonLat.Lon,
          province: lonLat.PROVINSI,
          region: lonLat.KABUPATEN,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoadingSavedLocation(false);

      successToast(`Berhasil menyimpan lokasi ${data.region}`);

      getSavedLocation(token);
    } catch (error) {
      console.log(error);
      setIsLoadingSavedLocation(false);
      failedToast("Gagal menyimpan lokasi");
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_URL_API}/savelocation/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      getSavedLocation(token);
      setOpenModalDelete(false);
      successToast(`Berhasil menghapus lokasi`);
      setTimeout(() => {
        setDeleteLoc(true);
      }, 500);
    } catch (error) {
      console.log(error);
      failedToast("Gagal hapus lokasi");
    }
  };

  // get saved location

  const savedAllLoc = async (token) => {
    dispatch(setLoadingMap(true));
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
      if (data) {
        setTimeout(() => {
          dispatch(setLoadingMap(false));
          setTimeout(() => {
            setTourLoc(true);
          }, 1000);
        }, 500);
      }
      return data;
    } catch (error) {
      console.log(error);
      dispatch(setLoadingMap(false));
    }
  };

  const getSavedLoc = async (token) => {
    savedAllLoc(token).then((res) => {
      const data = res?.map((location) => {
        const isPayment = listPayment.find(
          (payment) =>
            payment.lat === location.lat && payment.lon === location.lon
        );

        return {
          ...location,
          isPayment: isPayment ? isPayment.status : false,
        };
      });

      setSavedLocation(
        data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      );
      setSelectedLocation(data[0]);
    });
  };

  const getSavedLocation = async (token) => {
    savedAllLocation(token).then((res) => {
      const data = res?.map((location) => {
        const isPayment = listPayment.find(
          (payment) =>
            payment.lat === location.lat && payment.lon === location.lon
        );

        return {
          ...location,
          isPayment: isPayment ? isPayment.status : false,
        };
      });

      setSavedLocation(
        data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      );
      setSelectedLocation(data[0]);
    });
  };

  const [listPayment, setListPayment] = useState([]);

  useEffect(() => {
    if (token) {
      getSavedLocation(token);
    }
  }, [token, lonLat, listPayment]);

  useEffect(() => {
    if (token) {
      getSavedLoc(token);
    }
  }, []);

  const [dataPotensiLogin, setDataPotensiLogin] = useState({
    data: [
      {
        name: "Potensi Energi Surya",
        data: [],
      },
    ],
    categories: [],
  });

  const [dataCurahHujanLogin, setDataCurahHujanLogin] = useState({
    data: [
      {
        name: "Curah Hujan",
        data: [],
      },
    ],
    categories: [],
  });

  // curah hujan
  const [dataSuhuRataRataLine, setDataSuhuRataRataLine] = useState(null);
  const [dataSuhuMaximumLine, setDataSuhuMaximumLine] = useState(null);

  const [dataSuhuLineLogin, setDataSuhuLineLogin] = useState({
    data: [
      {
        name: "Suhu",
        data: [],
      },
    ],
    categories: [],
  });

  useEffect(() => {
    if (selectedLocation) {
      const longitude = parseFloat(parseFloat(selectedLocation.lon).toFixed(1));
      const lattitude = parseFloat(parseFloat(selectedLocation.lat).toFixed(1));
      getHistorisPotensi(lattitude, longitude).then((res) =>
        setDataPotensiLogin(res)
      );
      getHistorisCurahHujan(lattitude, longitude).then((res) =>
        setDataCurahHujanLogin(res)
      );
      getHistorisSuhuRataRata(lattitude, longitude).then((res) => {
        setDataSuhuRataRataLine(res);
        setDataSuhuLineLogin({
          ...dataSuhuLineLogin,
          categories: res.categories,
        });
      });
      getHistorisSuhuMaksimum(lattitude, longitude).then((res) =>
        setDataSuhuMaximumLine(res)
      );
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (dataSuhuMaximumLine && dataSuhuRataRataLine) {
      setDataSuhuLineLogin({
        ...dataSuhuLineLogin,
        data: [dataSuhuMaximumLine.data[0], dataSuhuRataRataLine.data[0]],
      });
    }
  }, [dataSuhuRataRataLine, dataSuhuMaximumLine]);

  const [recentlyViewed, setRecentlyViewed] = useState(
    Cookies.get("recentlyViewed")
      ? JSON.parse(Cookies.get("recentlyViewed"))
      : []
  );

  // saved recent view when get redux
  useEffect(() => {
    const recentlyViewed = Cookies.get("recentlyViewed")
      ? JSON.parse(Cookies.get("recentlyViewed"))
      : [];

    if (user && lonLat) {
      const newRecently = [
        {
          ...lonLat,
          lon: lonLat.Lon,
          lat: lonLat.Lat,
          province: lonLat.PROVINSI,
          region: lonLat.KABUPATEN,
          UTC: lonLat.UTC,
        },
      ];

      const filteredData = newRecently.concat(
        recentlyViewed.filter(
          (item) =>
            !newRecently.some(
              (newItem) => newItem.lon === item.lon && newItem.lat === item.lat
            )
        )
      );

      if (filteredData.length > 2) {
        newRecently.pop();
      }

      setRecentlyViewed(filteredData);
      Cookies.set("recentlyViewed", JSON.stringify(newRecently));
    }
  }, [lonLat, user]);

  const [isShowMore, setIsShowMore] = useState(false);

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

  const [carousel, setCarousel] = useState(0);
  const [isShowLoginChart, setIsShowLoginChart] = useState(false);

  const [chartLoginData, setChartLoginData] = useState([]);

  useEffect(() => {
    if (dataSuhuLineLogin?.data.length === 2) {
      setChartLoginData([
        {
          id: 1,
          isFirstChart: true,
          colorChart: "#FFA537",
          title: "kWh/m²",
          colorTitle: "#FF6B36",
          data: dataPotensiLogin?.data,
          titleHead: "Potensi Energi Surya",
          selectedLocation: selectedLocation,
          type: "bar",
          gridColor: false,
        },
        {
          id: 2,
          isFirstChart: false,
          colorChart: "#40B7D5",
          title: "mm",
          colorTitle: "#40B7D5",
          data: dataCurahHujanLogin?.data,
          titleHead: "Curah Hujan",
          selectedLocation: selectedLocation,
          type: "bar",
          gridColor: false,
        },
        {
          id: 3,
          isFirstChart: false,
          colorChart: "rgb(239, 68, 68)",
          title: "Suhu",
          colorTitle: "rgb(239, 68, 68)",
          data: [dataSuhuLineLogin?.data[1]],
          titleHead: "Suhu",
          selectedLocation: selectedLocation,
          type: "line",
          gridColor: false,
        },
      ]);
    }
  }, [dataSuhuLineLogin]);

  const windowSize = WindowSize();

  if (!user) {
    navigate("/");
  }

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
      <button id="tour3-button-lewati">
        <strong>Lewati</strong>
      </button>
    ),
    back: <button id="tour3-button-lewati">Kembali</button>,
    next: <button id="tour3-button-lanjutkan">Lanjutkan</button>,
    last: <button id="tour3-button-lanjutkan">Selesai</button>,
  };

  // const [{ run, steps }, setSteps] = useState({
  //   run: true,
  //   steps: [
  //     {
  //       content: (
  //         <div>
  //           <h2>
  //             Kumpulan lokasi yang sudah disimpan, klik satu kali pada lokasi
  //             untuk melihat ringkasan grafik lokasi di pojok kanan layar, klik
  //             dua kali untuk masuk ke mode detail map
  //           </h2>
  //           <p className="text-right -mb-7 mt-2 font-semibold">1 dari 2</p>
  //         </div>
  //       ),
  //       disableBeacon: true,
  //       placement: "top",
  //       target: "#loc-1",
  //       title: (
  //         <p className="text-2xl text-green-500 font-bold">Lokasi Tersimpan</p>
  //       ),
  //       locale: custom,
  //     },
  //     {
  //       content: (
  //         <div>
  //           <h2>
  //             Tombol pintasan ke halaman detail data pada lokasi yang dipilih
  //           </h2>
  //           <p className="text-right -mb-7 mt-2 font-semibold">2 dari 2</p>
  //         </div>
  //       ),
  //       placement: "left",
  //       target: "#loc-2",
  //       title: (
  //         <p className="text-2xl text-green-500 font-bold">Pintasan Detail</p>
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
              Kumpulan lokasi yang sudah disimpan, klik satu kali pada lokasi
              untuk melihat ringkasan grafik lokasi di pojok kanan layar, klik
              dua kali untuk masuk ke mode detail map
            </h2>
            {/* <p className="text-right -mb-7 mt-2 font-semibold">1 dari 2</p> */}
          </div>
        ),
        disableBeacon: true,
        placement: "top",
        target: "#loc-1",
        title: "Lokasi Tersimpan",
        locale: custom,
      },
      {
        content: (
          <div>
            <h2>
              Tombol pintasan ke halaman detail data pada lokasi yang dipilih
            </h2>
            {/* <p className="text-right -mb-7 mt-2 font-semibold">2 dari 2</p> */}
          </div>
        ),
        placement: "left",
        target: "#loc-2",
        title: "Pintasan Detail",
        locale: custom,
      },
    ],
  });

  return (
    <main className="relative">
      {/* Tour Location */}
      {user
        ? user?.taketour?.toString().includes("2") &&
          tourLoc &&
          savedLocation?.length > 0 && (
            <Joyride
              continuous
              callback={(e) => {
                if (e.action === "reset") {
                  Cookies.set("tour-location", "done");
                  if (user) {
                    let tour = user?.taketour.toString();
                    if (tour.includes("2")) {
                      if (tour.length > 1) {
                        const output = removeNumber(tour, "2");
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
        : tourLoc &&
          savedLocation?.length > 0 &&
          !Cookies.get("tour-location") && (
            <Joyride
              continuous
              callback={(e) => {
                if (e.action === "reset") {
                  Cookies.set("tour-location", "done");
                  if (user) {
                    let tour = user?.taketour.toString();
                    if (tour.includes("2")) {
                      if (tour.length > 1) {
                        const output = removeNumber(tour, "2");
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

      {/* Modal Delete Location */}
      <ModalDelete
        isOpen={openModalDelete}
        setIsOpen={setOpenModalDelete}
        setDeleteClicked={setDeleteClicked}
        isPayment={deleteClicked?.isPayment}
        region={deleteClicked?.region}
        handleDelete={() => handleDeleteLocation(deleteClicked?.id)}
      />

      <div
        className={`w-full h-[91vh] overflow-hidden rounded grid  ${
          lonLat
            ? " grid-cols-1 md:grid-cols-3 bg-[#F7FFF4]"
            : "grid-cols-1 bg-white"
        }`}
      >
        <div
          className={` overflow-hidden col-span-2 z-0 ${
            lonLat || user
              ? `${lonLat ? "h-[35vh] md:h-full" : "h-full"}`
              : "pb-4 h-full"
          }`}
        >
          <div className={`relative h-full  bg-slate-200`}>
            {user?.status !== "Admin" && (
              <>
                {loadingMap ? (
                  <div className="h-full w-full flex justify-center items-center text-5xl">
                    <button
                      type="button"
                      className="flex justify-center items-center h-full w-full"
                      disabled
                    >
                      <AiOutlineLoading className="animate-spin text-5xl" />
                    </button>
                  </div>
                ) : (
                  <>
                    {user && (
                      <Map
                        center={
                          savedLocation?.length > 0
                            ? [-2.5893, 125.9213]
                            : [-2.5893, 118.9213]
                        }
                        selectedLocation={selectedLocation}
                        savedLocation={savedLocation}
                        deleteLoc={deleteLoc}
                        setDeleteLoc={setDeleteLoc}
                        tourLoc={tourLoc}
                        setTourLoc={setTourLoc}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Detail When Clicked Map */}
        {lonLat && (
          <DetailHomePage
            functionSavedLocation={handleSaveLocation}
            loadingSaveLocation={isLoadingSavedLocation}
            savedLocation={savedLocation}
            handleDeleteLocation={handleDeleteLocation}
          />
        )}
      </div>
      {!lonLat && !user ? (
        <div></div>
      ) : (
        !lonLat &&
        user && (
          <div className="">
            {/* Hidden when small size */}
            <div className="hidden md:flex">
              {/* Legend */}
              <div className="absolute bottom-0 -left-3 scale-75 xl:scale-100 xl:bottom-2 xl:right-2 xl:left-auto xl:hidden">
                <Legend2 width="w-[300px] xl:w-[350px]" />
              </div>

              {/* Saved and Recently Viewed */}
              <div className="absolute bottom-20 xl:bottom-2 left-6 flex gap-8">
                <div className="">
                  {recentlyViewed.length > 0 && (
                    <p className="text-xs xl:text-sm font-bold">
                      Terakhir dilihat
                    </p>
                  )}
                  <div className="flex gap-2 pt-2">
                    {recentlyViewed.length > 0 ? (
                      recentlyViewed.slice(0, 2)?.map((item, index) => (
                        <div
                          key={index}
                          className={`px-2 py-1 cursor-pointer hover:opacity-70 relative duration-150 rounded-md shadow ${
                            item.region === selectedLocation?.region
                              ? "bg-main-500 text-white"
                              : "bg-[#EBFFE4]"
                          }`}
                          onClick={() => {
                            setSelectedLocation({
                              ...item,
                              lat: item.Lat,
                              lon: item.Lon,
                            });
                            dispatch(setSavedLoc(true));
                            dispatch(
                              setLocationParams({
                                long: item.Lon,
                                lat: item.Lat,
                                region: item.KABUPATEN,
                                province: item.PROVINSI,
                                utc: item.UTC,
                              })
                            );
                          }}
                        >
                          <div className="flex-col text-xs xl:text-sm gap-1">
                            <p className="">{item.KABUPATEN}</p>
                            <div className="text-xs gap-2 flex justify-between">
                              <p className="">
                                {parseFloat(item.Lat).toFixed(1)}°
                              </p>
                              <p className="">
                                {parseFloat(item.Lon).toFixed(1)}°
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        className={`py-1 opacity-0 cursor-pointer hover:opacity-70 relative duration-150 rounded-md`}
                      >
                        -
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* saved location */}
              <div
                id="loc-1"
                className="absolute bottom-40 left-6 xl:bottom-2 xl:left-[40%] flex gap-8"
              >
                <div className="">
                  <div className="flex justify-between items-center">
                    {savedLocation.length > 0 && (
                      <p className="text-xs xl:text-sm font-bold">
                        Lokasi Tersimpan
                      </p>
                    )}
                    <p
                      className={`text-xxs text-black/80 font-medium cursor-pointer hover:text-black duration-150  gap-2 items-center ${
                        savedLocation.length > 2 ? "flex" : "hidden"
                      }`}
                      onClick={() => {
                        setIsShowMore(!isShowMore);
                      }}
                    >
                      Show {isShowMore ? "Less" : "More"}
                      <IoIosArrowUp
                        className={`${
                          isShowMore && "rotate-180"
                        } duration-150 rotate-0`}
                      />
                    </p>
                  </div>
                  {isShowMore && savedLocation.length > 2 ? (
                    <div className="grid grid-cols-2 max-h-[20vh] py-4 overflow-auto gap-2 bg-white rounded px-2">
                      {savedLocation?.map((item, index) => (
                        <div key={index} className="relative">
                          <IoIosClose
                            className={`absolute border-2 -top-1.5 -right-1.5 z-30 bg-white text-black rounded-full ${
                              savedLocation.length === 0 && "hidden"
                            }`}
                            onClick={() => {
                              if (item.isPayment) {
                                setOpenModalDelete(true);
                                setDeleteClicked(item);
                              } else {
                                handleDeleteLocation(item.id);
                              }
                            }}
                          />
                          <div
                            className={`px-2 py-1 cursor-pointer  border hover:opacity-70 relative duration-150 rounded-md shadow ${
                              item.id === selectedLocation?.id
                                ? "bg-main-500 text-white"
                                : "bg-[#EBFFE4]"
                            }`}
                            onClick={() => {
                              setSelectedLocation(item);
                            }}
                            onDoubleClick={(e) => {
                              dispatch(setSavedLoc(true));
                            }}
                          >
                            <div className="flex-col text-xs xl:text-sm gap-1">
                              <p className="">{item.region}</p>
                              <div className="text-xs gap-2 flex justify-between">
                                <p className="">
                                  {parseFloat(item.lat).toFixed(1)}°
                                </p>
                                <p className="">
                                  {parseFloat(item.lon).toFixed(1)}°
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-2">
                      {savedLocation.length > 0 ? (
                        savedLocation.slice(0, 2)?.map((item, index) => (
                          <div className="relative" key={index}>
                            <IoIosClose
                              className="absolute border-2 -top-1.5 cursor-pointer hover:scale-125 -right-1.5 bg-white z-30 text-black rounded-full"
                              onClick={() => {
                                if (item.isPayment) {
                                  setOpenModalDelete(true);
                                  setDeleteClicked(item);
                                } else {
                                  handleDeleteLocation(item.id);
                                }
                              }}
                            />
                            <div
                              className={`px-2 py-1 cursor-pointer hover:opacity-70 relative duration-150 rounded-md shadow ${
                                item.id === selectedLocation?.id
                                  ? "bg-main-500 text-white"
                                  : "bg-[#EBFFE4]"
                              }`}
                              onDoubleClick={(e) => {
                                dispatch(setSavedLoc(true));
                              }}
                              onClick={() => {
                                setSelectedLocation(item);
                              }}
                            >
                              <div className="flex-col text-xs xl:text-sm gap-1">
                                <p className="">{item.region}</p>
                                <div className="text-xs gap-2 flex justify-between">
                                  <p className="">
                                    {parseFloat(item.lat).toFixed(1)}°
                                  </p>
                                  <p className="">
                                    {parseFloat(item.lon).toFixed(1)}°
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={`py-1 opacity-0`}>-</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Chart when windows medium size */}
              <div
                className={`absolute top-3 2xl:top-4 right-2 flex-col justify-between gap-1.5  h-[89vh] overflow-hidden ${
                  savedLocation.length > 0 ? "flex" : "hidden"
                }`}
              >
                {chartLoginData.length > 0 &&
                  chartLoginData?.map((item, index) => (
                    <div key={index} className="h-full">
                      <ChartLogin
                        isFirstChart={item.isFirstChart}
                        colorChart={item.colorChart}
                        title={item.title}
                        colorTitle={item.colorTitle}
                        data={item.data}
                        titleHead={item.titleHead}
                        selectedLocation={item.selectedLocation}
                        gridColor={item.gridColor}
                        type={item.type}
                        width="w-auto xl:w-[350px]"
                        height={
                          windowSize?.height <= 750
                            ? "165"
                            : windowSize?.height <= 1000
                            ? "100%"
                            : "auto"
                        }
                      />
                    </div>
                  ))}
                <Legend2 width="w-[300px] xl:w-[350px] hidden xl:flex" />
              </div>
            </div>

            {/* Show When small size */}
            <div
              className={`md:hidden bg-white absolute bottom-0 w-full ${
                !isShowLoginChart
                  ? "h-[12vh] transition-heightDownUpLogin"
                  : "h-[75vh] transition-heightUpDownLogin"
              }`}
            >
              <div className="relative">
                <button
                  className={`bg-[#FFD35A] z-30 border-2 border-white absolute -bottom-3 left-1/2 -translate-x-1/2  text-black/60 flex justify-center items-center rounded-full w-6 h-6 `}
                  onClick={() => setIsShowLoginChart(!isShowLoginChart)}
                >
                  <IoIosArrowDown
                    className={`w-5 h-5 ${
                      isShowLoginChart ? "rotate-0" : "-rotate-180"
                    }`}
                  />
                </button>
              </div>

              {/* Chart */}
              <div className="relative h-[55%] overflow-hidden">
                <button
                  className="absolute right-0 top-1/2 disabled:opacity-50 z-30"
                  onClick={() => setCarousel(carousel + 1)}
                  disabled={carousel >= 2}
                >
                  <IoIosArrowForward />
                </button>
                <button
                  className="absolute left-0 top-1/2 disabled:opacity-50 z-30"
                  onClick={() => setCarousel(carousel - 1)}
                  disabled={carousel <= 0}
                >
                  <IoIosArrowBack />
                </button>
                {chartLoginData.length > 0 &&
                  chartLoginData?.map((item, index) => (
                    <div
                      key={index}
                      className={`px-6 py-4 absolute left-1/2 w-full`}
                      style={{
                        left: `${(index - carousel) * 100}%`,
                      }}
                    >
                      <ChartLogin
                        isFirstChart
                        colorChart={item.colorChart}
                        title={item.title}
                        colorTitle={item.colorTitle}
                        data={item.data}
                        titleHead={item.titleHead}
                        selectedLocation={item.selectedLocation}
                        className="bg-white border "
                        gridColor={item.gridColor}
                        type={item.type}
                        height="230"
                        width="w-full"
                      />
                    </div>
                  ))}
              </div>

              {/* Saved and Recently Viewed */}
              <div className={`px-6 ${isShowLoginChart ? "" : "hidden"}`}>
                <div>
                  {recentlyViewed.length > 0 && (
                    <p className="font-medium text-sm">Terakhir dilihat</p>
                  )}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {recentlyViewed.length > 0 ? (
                      recentlyViewed.slice(0, 2)?.map((item, index) => (
                        <div
                          key={index}
                          className={`px-2 py-1 cursor-pointer hover:opacity-70 relative duration-150 rounded-md shadow ${
                            item.region === selectedLocation?.region
                              ? "bg-main-500 text-white"
                              : "bg-[#EBFFE4]"
                          }`}
                          onClick={() => {
                            setSelectedLocation({
                              ...item,
                              lat: item.Lat,
                              lon: item.Lon,
                            });
                            dispatch(setSavedLoc(true));
                            dispatch(
                              setLocationParams({
                                long: item.Lon,
                                lat: item.Lat,
                                region: item.KABUPATEN,
                                province: item.PROVINSI,
                                utc: item.UTC,
                              })
                            );
                          }}
                        >
                          <div className="flex-col text-xs gap-1">
                            <p className="">{item.KABUPATEN}</p>
                            <div className="text-xs gap-2 flex justify-between">
                              <p className="">
                                {parseFloat(item.Lat).toFixed(1)}°
                              </p>
                              <p className="">
                                {parseFloat(item.Lon).toFixed(1)}°
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        className={`py-1 opacity-0 cursor-pointer hover:opacity-70 relative duration-150 rounded-md`}
                      >
                        -
                      </div>
                    )}
                  </div>
                </div>
                <div className="h-[18vh] overflow-y-auto mt-2">
                  <p>Lokasi Tersimpan</p>
                  <div className="grid grid-cols-2 gap-2">
                    {savedLocation?.map((item, index) => (
                      <div
                        key={index}
                        className={`relative border hover:opacity-70 duration-150 rounded-md shadow ${
                          item.id === selectedLocation?.id
                            ? "bg-main-500 text-white"
                            : "bg-[#EBFFE4]"
                        }`}
                      >
                        <IoIosClose
                          className={`absolute border-2 -top-1.5 -right-1.5 z-30 bg-white text-black rounded-full ${
                            savedLocation.length === 0 && "hidden"
                          }`}
                          onClick={() => {
                            if (item.isPayment) {
                              setOpenModalDelete(true);
                              setDeleteClicked(item);
                            } else {
                              handleDeleteLocation(item.id);
                            }
                          }}
                        />
                        <div
                          className={`px-2 py-1 cursor-pointer relative h-full`}
                          onClick={() => {
                            setSelectedLocation(item);
                            // dispatch(setSavedLoc(true));
                          }}
                          onDoubleClick={(e) => {
                            dispatch(setSavedLoc(true));
                          }}
                        >
                          <div className="flex-col flex justify-between h-full text-sm gap-1">
                            <p className="">{item.region}</p>
                            <div className="text-xs gap-2 flex justify-between">
                              <p className="">
                                {parseFloat(item.lat).toFixed(1)}°
                              </p>
                              <p className="">
                                {parseFloat(item.lon).toFixed(1)}°
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </main>
  );
};

export default Beranda;

const ChartLogin = ({
  isFirstChart,
  selectedLocation,
  colorTitle,
  title,
  colorChart,
  data,
  titleHead,
  type = "bar",
  gridColor,
  className = "bg-[#EBFFE4]",
  height = "200",
  width = "w-[350px]",
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div
      className={`shadow-lg ${className} w-full h-full relative overflow-hidden`}
    >
      <div className={`${width}  h-full `}>
        <div className="rounded w-full h-full flex flex-col justify-end">
          <div className="text-base absolute font-bold text-black left-1/2 top-3 -translate-x-1/2">
            <p className="text-xs">{titleHead}</p>
          </div>
          {isFirstChart && (
            <div
              id="loc-2"
              className="absolute right-2 top-2 cursor-pointer hover:opacity-60 duration-150 z-[5]"
              onClick={() => {
                navigate(
                  `/detail/data-historis?long=${selectedLocation?.lon}&lat=${selectedLocation?.lat}&region=${selectedLocation?.region}&province=${selectedLocation?.province}&utc=${selectedLocation?.utc}`
                );
                dispatch(
                  setLocationParams({
                    long: selectedLocation.lon,
                    lat: selectedLocation.lat,
                    region: selectedLocation.region,
                    province: selectedLocation.province,
                    utc: selectedLocation?.utc,
                  })
                );
              }}
            >
              <IoMdOpen />
            </div>
          )}
          <Chart
            data={data}
            categories={months}
            height={height}
            styleTitle={{
              fontSize: "10px",
              color: colorTitle,
            }}
            title={title}
            colors={[colorChart]}
            // maxCount={7}
            bar={type === "bar" ? true : false}
            line={type === "line" ? true : false}
            gridColor={gridColor}
          />
        </div>
      </div>
    </div>
  );
};
