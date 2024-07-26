import React, { useEffect } from "react";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { RadioGroup } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";
import { BsCheckAll } from "react-icons/bs";
import dataProv from "@data/dataprov.json";
import dataKab from "@data/datakab.json";
import Radio from "@components/molecule/Radio";
import Cookies from "js-cookie";
import { setSuccess } from "@redux/features/toast/toastSlice";
import { useNavigate } from "react-router-dom";
import ToastHook from "@hooks/Toast";
import { FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Payment = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);

  const { token } = useSelector((state) => state.auth);
  const { locationParams } = useSelector((state) => state.location);

  const { successToast } = ToastHook();

  const [lonLat, setLonLat] = useState({
    lon: 0,
    lat: 0,
    region: "",
  });

  const [packageAvailable, setPackageAvailable] = useState([
    {
      id: "basic",
      name: "Basic",
      price: "14.000",
      duration: 3,
      description: [
        "Mendapat akses data prakiraan 3 Hari kedepan dengan radius 10km",
        "Download data prakiraan dalam bentuk CSV",
      ],
      disable: false,
      loding: false,
    },
    {
      id: "professional",
      name: "Professional",
      price: "25.000",
      duration: 7,
      description: [
        "Mendapat akses data prakiraan 7 Hari kedepan dengan radius 10km",
        "Download data prakiraan dalam bentuk CSV",
      ],
      disable: false,
      loading: false,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "40.000",
      duration: 14,
      description: [
        "Mendapat akses data prakiraan 14 Hari kedepan dengan radius 10km",
        "Download data prakiraan dalam bentuk CSV",
      ],
      disable: false,
      loading: false,
    },
    {
      id: "custom",
      name: "Custom",
      price: "-",
      duration: "-",
      description: ["Segera Hadir"],
      disable: true,
      loading: false,
    },
  ]);

  useEffect(() => {
    if (locationParams) {
      return setLonLat({
        ...locationParams,
        lon: locationParams.long,
      });
    } else {
      const long = parseFloat(urlParams.get("long"));
      const lat = parseFloat(urlParams.get("lat"));
      const region = urlParams.get("region");
      const provice = urlParams.get("province");

      return setLonLat({
        lon: long,
        lat: lat,
        region: region,
        provice: provice,
      });
    }
  }, [dataKab, locationParams]);

  const handleSubmit = (dayPackage) => {
    Cookies.set(
      "_subs",
      JSON.stringify({
        location: {
          name: lonLat.region,
          lon: lonLat.lon,
          lat: lonLat.lat,
        },
        package: {
          day: dayPackage,
        },
      })
    );

    successToast("Requested Success");
    setTimeout(() => {
      navigate(`/detail/data-historis${window.location.search}`);
    }, 3000);
  };

  const handleSaveLocation = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_URL_API}/savelocation`,
        {
          lat: lonLat.lat,
          lon: lonLat.lon,
          province: lonLat.province,
          region: lonLat.region,
        },
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

  const handleSubmitPayment = async (duration, index) => {
    setPackageAvailable((prev) => {
      return prev.map((pac, i) => {
        if (i === index) {
          return {
            ...pac,
            loading: true,
          };
        } else {
          return pac;
        }
      });
    });
    try {
      await axios.post(
        `${process.env.REACT_APP_URL_API}/payment`,
        {
          lat: lonLat.lat,
          lon: lonLat.lon,
          province: lonLat.province,
          region: lonLat.region,
          day: duration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPackageAvailable((prev) => {
        return prev.map((pac, i) => {
          if (i === index) {
            return {
              ...pac,
              loading: false,
            };
          } else {
            return pac;
          }
        });
      });

      handleSaveLocation();
      successToast("Request Berhasil");
      setTimeout(() => {
        navigate(`/detail/data-historis${window.location.search}`);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="py-4 px-7">
        <p className="text-3xl font-bold text-[#1F8A70]">Berlangganan</p>
        <p className="text-sm font-bold text-[#1F8A70]">
          Untuk mendapatkan akses lebih banyak data, berdasarkan lokasi yang
          telah dipilih.
        </p>
      </div>
      <div className="bg-[#73A9AD] my-4 mx-10 rounded-[17px] h-auto lg:h-[75vh]">
        <div className="h-full">
          <div className="flex justify-center items-center py-6">
            <p className="text-white text-4xl font-bold">Pilih Paket</p>
          </div>
          <div className="mt-8 pb-8 lg:pb-0 flex flex-col gap-4 md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-[10%] h-full lg:h-[50vh] items-center">
            {packageAvailable.map((pac, index) => (
              <div
                key={index}
                id={`card-sub-${pac.id}`}
                className={`bg-white lg:mb-0 h-[40vh] lg:h-full w-full relative ${
                  pac.disable && "opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="border-r h-[80%] top-10 absolute" />
                <div className="flex text-slate-600 justify-evenly h-full items-center flex-col">
                  <p
                    className="font-bold text-xl"
                    id={`text-sub-title-${pac.id}`}
                  >
                    {pac.name}
                  </p>
                  <div className="flex flex-col items-center w-full">
                    <p
                      className="font-bold text-2xl text-[#1F8A70]"
                      id={`text-sub-price-${pac.id}`}
                    >
                      IDR. {pac.price}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-center text-xs font-semibold">
                    <p
                      className="font-normal"
                      id={`text-sub-location-${pac.id}`}
                    >
                      {lonLat.region}
                    </p>
                    <div>
                      <p className="">
                        Longitude: {parseFloat(lonLat.lon).toFixed(1)}°
                      </p>
                      <p className="">
                        Langitude: {parseFloat(lonLat.lat).toFixed(1)}°
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start w-full pl-[10%] pr-5 flex-col gap-2">
                    {pac.description.map((desc, i) => (
                      <div
                        key={i}
                        className="flex gap-2 items-center justify-start w-full"
                        id={`text-sub-desc${i + 1}-${pac.id}`}
                      >
                        <div>
                          <FiCheckCircle className="text-[#1F8A70]" />{" "}
                        </div>
                        <p className="text-xs font-medium">{desc}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`border border-green-600 px-4 py-1 duration-150 w-28 flex justify-center items-center ${
                      !pac.disable
                        ? "hover:bg-[#1F8A70] hover:text-white"
                        : "cursor-not-allowed"
                    }`}
                    disabled={pac.disable || pac.loading}
                    onClick={() => {
                      // handleSubmit(pac.duration);
                      handleSubmitPayment(pac.duration, index);
                    }}
                    id={`btn-sub-${pac.id}`}
                  >
                    {pac.loading ? (
                      <AiOutlineLoading3Quarters className="animate-spin" />
                    ) : (
                      "Berlangganan"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
