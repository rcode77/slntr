import { useEffect, useState } from "react";
import Map from "@components/molecule/Map/Map";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLonLat } from "@redux/features/location/locationSlice";
import Legend2 from "@components/molecule/Map/Legend2";
import averagePotentMonthly from "@data/avgbulananprovinsi.json";
import averagePotentYearly from "@data/avgtahunanprovinsi.json";
import { IoIosArrowDown } from "react-icons/io";
import DetailHomePage from "@components/organism/DetailHomePage";
import Joyride from "react-joyride";
import Cookies from "js-cookie";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lonLat } = useSelector((state) => state.location);
  const { user } = useSelector((state) => state.auth);

  const [selectedLocation] = useState(null);
  const [expanded, setExpanded] = useState(true);

  const handleButtonClick = () => {
    setExpanded(!expanded);
  };

  // validate when user login
  useEffect(() => {
    if (user) {
      const admin = user.status === "Admin";
      admin ? navigate("/dashboard") : navigate("/beranda");
    }
  }, [user]);

  // data rata-rata potensi energi surya per provinsi
  const avgPotentMonthly = Object.entries(averagePotentMonthly).map((e) => ({
    data: e[1],
    id: e[0],
  }));

  const avgPotentYearly = Object.entries(averagePotentYearly).map((e) => ({
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

  // minimize welcome when clicked
  useEffect(() => {
    if (lonLat) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  }, [lonLat]);

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
      <button id="tour1-button-lewati">
        <strong>Lewati</strong>
      </button>
    ),
    back: <button id="tour1-button-lewati">Kembali</button>,
    next: <button id="tour1-button-lanjutkan">Lanjutkan</button>,
    last: <button id="tour1-button-lanjutkan">Selesai</button>,
  };

  const { surveyPopup } = useSelector((state) => state.popup);

  // const [{ run, steps }, setSteps] = useState({
  //   run: true,
  //   steps: [
  //     {
  //       content: (
  //         <div>
  //           <h2 className="font-semibold">
  //             Ayo ikuti tur singkat tentang SILENTERA!
  //           </h2>
  //         </div>
  //       ),
  //       locale: custom,
  //       placement: "center",
  //       target: "body",
  //     },
  //     {
  //       content: (
  //         <div>
  //           <h2>
  //             Klik daerah pada peta yang Anda ingin ketahui informasi mengenai
  //             energinya
  //           </h2>
  //           <p className="text-right -mb-7 mt-2 font-semibold">1 dari 4</p>
  //         </div>
  //       ),
  //       placement: "bottom",
  //       target: "#step-1",
  //       title: (
  //         <p className="text-2xl text-green-500 font-bold">Pilih Lokasi!</p>
  //       ),
  //       locale: custom,
  //     },
  //     {
  //       content: (
  //         <div>
  //           <h2>
  //             Anda juga dapat memilih lokasi dari filter Provinsi dan Kabupaten
  //             <p className="text-right -mb-7 mt-2 font-semibold">2 dari 4</p>
  //           </h2>
  //         </div>
  //       ),
  //       placement: "bottom",
  //       target: "#step-2",
  //       title: (
  //         <p className="text-2xl text-green-500 font-bold">
  //           Pilih Lokasi dari Filter!
  //         </p>
  //       ),
  //       locale: custom,
  //     },
  //     {
  //       content: (
  //         <div>
  //           <h2>
  //             Masuk atau buat akun untuk menyimpan lokasi yang sudah Anda pilih
  //             atau berlangganan untuk mendapatkan data premium
  //           </h2>
  //           <p className="text-right -mb-7 mt-2 font-semibold">3 dari 4</p>
  //         </div>
  //       ),
  //       placement: "bottom",
  //       target: "#step-3",
  //       title: (
  //         <p className="text-2xl text-green-500 font-bold">
  //           Masuk atau Buat Akun!
  //         </p>
  //       ),
  //       locale: custom,
  //     },
  //     {
  //       content: (
  //         <div>
  //           <h2>
  //             Silakan menuju bagian Tentang untuk lebih mengenal SILENTERA
  //           </h2>
  //           <p className="text-right -mb-7 mt-2 font-semibold">4 dari 4</p>
  //         </div>
  //       ),
  //       placement: "bottom",
  //       target: "#step-4",
  //       title: (
  //         <p className="text-2xl text-green-500 font-bold">
  //           Informasi Selengkapnya!
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
            <h2 className="font-semibold">
              Ayo ikuti tur singkat tentang SILENTERA!
            </h2>
          </div>
        ),
        locale: custom,
        placement: "center",
        target: "body",
      },
      {
        content: (
          <div>
            <h2>
              Klik daerah pada peta yang Anda ingin ketahui informasi mengenai
              energinya
            </h2>
            {/* <p className="text-right -mb-7 mt-2 font-semibold">1 dari 4</p> */}
          </div>
        ),
        placement: "bottom",
        target: "#step-1",
        title: "Pilih Lokasi!",
        locale: custom,
      },
      {
        content: (
          <div>
            <h2>
              Anda juga dapat memilih lokasi dari filter Provinsi dan Kabupaten
            </h2>
            {/* <p className="text-right -mb-7 mt-2 font-semibold">2 dari 4</p> */}
          </div>
        ),
        placement: "bottom",
        target: "#step-2",
        title: "Pilih Lokasi dari Filter!",
        locale: custom,
      },
      {
        content: (
          <div>
            <h2>
              Masuk atau buat akun untuk menyimpan lokasi yang sudah Anda pilih
              atau berlangganan untuk mendapatkan data premium
            </h2>
            {/* <p className="text-right -mb-7 mt-2 font-semibold">3 dari 4</p> */}
          </div>
        ),
        placement: "bottom",
        target: "#step-3",
        title: " Masuk atau Buat Akun!",
        locale: custom,
      },
      {
        content: (
          <div>
            <h2>
              Silakan menuju bagian Tentang untuk lebih mengenal SILENTERA
            </h2>
            {/* <p className="text-right -mb-7 mt-2 font-semibold">4 dari 4</p> */}
          </div>
        ),
        placement: "bottom",
        target: "#step-4",
        title: " Informasi Selengkapnya!",
        locale: custom,
      },
    ],
  });

  return (
    <main className="relative">
      {/* Tour 1 */}
      {!surveyPopup && !Cookies.get("tour-home") && (
        <Joyride
          continuous
          callback={(e) => {
            if (e.action === "reset") {
              Cookies.set("tour-home", "done");
            }
          }}
          run={run}
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

      <div
        className={`w-full h-[91vh] overflow-hidden rounded grid  ${
          lonLat
            ? " grid-cols-1 md:grid-cols-3 bg-[#F7FFF4]"
            : "grid-cols-1 bg-white"
        }`}
      >
        <div
          className={`overflow-hidden col-span-2 z-0 ${
            lonLat
              ? `${lonLat ? "h-[35vh] md:h-full" : "h-full"}`
              : "pb-4 h-full"
          }`}
        >
          <div
            id="step-1"
            className={`relative bg-white ${
              !expanded
                ? "h-full transition-heightUpDown"
                : "h-[75%] transition-heightDownUp"
            }`}
          >
            {!user && (
              <Map
                center={[-1.5893, 118.9213]}
                selectedLocation={selectedLocation}
              />
            )}

            <div
              className={`-bottom-2 scale-[.6] -left-10 xl:scale-100 xl:bottom-4 xl:left-8 ${
                lonLat ? "hidden" : "absolute"
              }`}
            >
              <Legend2 />
            </div>
            <button
              id="map-button-expand"
              className={`bg-[#FFD35A] border-2 border-white absolute -bottom-3 left-1/2 -translate-x-1/2  text-black/60 flex justify-center items-center rounded-full w-8 h-8 ${
                lonLat ? "hidden" : ""
              }`}
              onClick={handleButtonClick}
            >
              <IoIosArrowDown
                className={`w-5 h-5 ${expanded ? "rotate-0" : "-rotate-180"}`}
              />
            </button>
          </div>
          <div className={`py-4 px-[2%] ${lonLat ? "hidden" : ""}`}>
            <div className="">
              <div className="relative">
                <p className="xl:text-2xl text-center  md:text-left pt-6 xl:pt-0 font-bold py-1">
                  Selamat datang di SILENTERA
                </p>
                <p className="absolute left-1/2 top-0 -translate-x-1/2 font-medium text-center w-full text-xxs md:text-xs">
                  Pilih lokasi pada peta untuk mengetahui informasi energi lebih
                  rinci
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-8 xl:text-sm text-xs mt-2 md:mt-4 font-medium max-h-[13vh] md:h-full overflow-auto">
                <p className="">
                  Inovasi baru untuk sektor energi baru terbarukan (EBT) dari
                  Pusat Layanan Informasi Iklim Terapan BMKG. Berbasis{" "}
                  <i>platform </i>
                  interaktif dengan memanfaatkan keluaran model cuaca handal dan
                  data pengamatan insitu BMKG yang akurat, SILENTERA memberikan
                  informasi terbaik sesuai dengan kebutuhan pengguna energi.
                </p>
                <p className="">
                  Mulailah eksplorasi potensi energi surya di wilayah anda
                  dengan memilih lokasi pada peta yang telah disajikan. Anda
                  akan mendapatkan analisis mendalam, grafik, dan perkiraan
                  jangka panjang untuk merencanakan investasi energi surya
                  secara efektif. Bergabunglah bersama kami dan mari wujudkan
                  pembangunan masa depan Indonesia yang berkelanjutan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detail When Clicked Map */}
        {lonLat && <DetailHomePage />}
      </div>
    </main>
  );
};

export default Home;
