import React from "react";
import batter from "@assets/batter2.png";
import dataPrakiraan from "@assets/dataPrakiraan.png";
import dataHistoris from "@assets/dataHistoris.png";
import userGuide from "@assets/userguide.png";
import pGHI from "@assets/pGHI.png";
import pCurahHujan from "@assets/pCurahHujan.png";
import pDistribusiAngin from "@assets/pDistribusiAngin.png";
import pIndeksKebeningan from "@assets/pIndeksKebeningan.png";
import pKecepatanAngin from "@assets/pKecepatanAngin.png";
import pPergerakanMatahari from "@assets/pPergerakanMatahari.png";
import pSuhu from "@assets/pSuhu.png";
import pTutupanAwan from "@assets/pTutupanAwan.png";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoginPopup } from "@redux/features/login/loginSlice";
import Footer from "@components/organism/Footer";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
import { BiSolidSun } from "react-icons/bi";
import {
  BsCloudFog,
  BsCloudHaze,
  BsCloudHaze2Fill,
  BsCloudsFill,
  BsFillCloudRainFill,
  BsFillSunriseFill,
  BsSunFill,
  BsCloudFill,
} from "react-icons/bs";
import { FaTemperatureHalf } from "react-icons/fa6";
import { FiWind } from "react-icons/fi";

const About = () => {
  const { user, token } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  AOS.init();

  const dataGuide = [
    "Memilih Lokasi",
    "Akses Data Historis",
    "Akses Data Premium",
    "Menyimpan Lokasi",
  ];

  return (
    <div className="bg-[#F7FFF4]">
      {/* Overview */}
      <div className="xs:px-7 xl:flex w-full h-auto bg-white pb-[50px] xl:pt-[10px] xl:px-[50px]">
        <div className="xs:w-full md:pt-[100px] xl:w-[30%] xs:flex xs:justify-center xs:pt-[50px] xl:pt-10 xl:order-last">
          <img
            src={batter}
            alt={batter}
            className="xs:w-[70%] md:w-[60%] lg:w-[40%] xl:w-full xl:h-[330px] xl:pt-[50px] transition-fadeinout"
          />
        </div>
        <div className="xs:w-full xl:w-[65%] flex flex-col xl:justify-start xs:text-center xl:text-left">
          <p className="xl:text-4xl xs:text-xl xs:pt-14 md:pt-24 xl:pt-10 xs:pb-3">
            SILENTERA
          </p>
          <p className="xl:pt-[24px] xl:text-[58px] font-bold xs:text-xl xl:pb-8">
            GREEN ENERGY
          </p>
          <p className="xl:text-[58px] font-bold xs:text-xl xs:pb-3">
            SOLUTION FOR EVERYONE
          </p>
          <p className="xl:pt-[30px] xl:pb-6 font-medium xl:w-[90%]">
            SILENTERA merupakan sebuah inovasi layanan data informasi potensi
            energi baru terbarukan (EBT) di Indonesia, berbasis <i>platform </i>
            interaktif yang dikembangkan oleh Pusat Layanan Informasi Iklim
            Terapan BMKG. Informasi dalam <i>platform</i> SILENTERA dapat
            digunakan bagi pemangku kebijakan, industri penyedia EBT, analis
            energi, dan masyarakat umum. SILENTERA menyediakan informasi
            ringkasan iklim dan prakiraan yang merupakan informasi penting dalam
            pengembangan energi terbarukan di Indonesia.
          </p>
          <div className="flex xs:w-full xs:justify-center xl:justify-start xl:w-full py-7">
            <button
              className="xl:px-16 xs:px-12 md:px-16 py-3 bg-green-600 text-white font-medium hover:opacity-75"
              onClick={() => {
                if (user) {
                  navigate("/");
                } else {
                  navigate("/");
                  setTimeout(() => {
                    dispatch(setLoginPopup(true));
                  }, 500);
                }
              }}
            >
              <p>Mulai</p>
            </button>
            <button
              className="py-3 font-medium flex items-center xs:ml-7 xl:ml-10 z-[5px]"
              onClick={() => {
                navigate("/about/silentera");
                window.scrollTo(0, 0);
              }}
            >
              Selengkapnya
              <div className="w-full pl-3 mt-1 scale-125">
                <IoIosArrowForward />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Produk Tersedia */}
      <div className="w-full xs:pt-10 xl:pt-24 pb-20 bg-[#F7FFF4]">
        <p className="text-center xs:text-3xl xl:text-5xl font-medium">
          Produk Tersedia
        </p>
        <div className="w-full xl:flex py-10">
          <div className="flex flex-col xl:w-[50%] justify-start">
            <center>
              <img
                src={dataHistoris}
                alt={dataHistoris}
                className="xs:w-[60%] lg:w-[40%]"
                data-aos="zoom-out-right"
              />
              <p
                className="xl:text-4xl xs:text-2xl font-medium xl:py-8 xs:py-3"
                data-aos="flip-left"
              >
                Data Historis
              </p>
              <p className="w-[70%] font-medium" data-aos="flip-left">
                Data historis adalah ringkasan iklim selama 30 tahun terakhir
                (1991-2020) yang merupakan informasi penting dalam perencanaan
                pembangunan pembangkit listrik. Informasi ini digunakan sebagai
                referensi dasar dalam menentukan lokasi potensial pengembangan
                energi terbarukan di Indonesia.
              </p>
            </center>
          </div>
          <div className="flex flex-col xl:w-[50%]">
            <center>
              <img
                src={dataPrakiraan}
                alt={dataPrakiraan}
                className="xs:mt-14 lg:mt-0 xs:w-[60%] lg:w-[40%]"
                data-aos="zoom-out-left"
              />
              <p
                className="xl:text-4xl xs:text-2xl font-medium xl:py-8 xs:py-3"
                data-aos="flip-right"
              >
                Data Prakiraan
              </p>
              <p className="w-[70%] font-medium" data-aos="flip-right">
                Informasi prakiraan energi surya ditampilkan dengan resolusi
                tinggi dalam dua skala waktu berbeda, yaitu harian dan bulanan.
                Prakiraan harian mencakup prakiraan tiap jam hingga 14 hari
                kedepan, sedangkan prakiraan bulanan berisi prakiraan kondisi
                umum tiap bulan untuk 7 bulan ke depan.
              </p>
            </center>
          </div>
        </div>
        <center>
          <button
            className="px-16 py-3 bg-green-600 text-white font-medium hover:opacity-75"
            onClick={() => {
              navigate("/about/data-provided");
              window.scrollTo(0, 0);
            }}
          >
            Selengkapnya
          </button>
        </center>
      </div>

      {/* Petunjuk Pengguna */}
      <center>
        <div
          className="w-[90%] xs:h-[450px] xl:h-[700px] xl:py-12 bg-[#7FD9CA]"
          data-aos="fade-up"
        >
          <div className="w-full flex xl:py-5 h-full">
            <div className="flex flex-col xs:w-full md:w-[50%] xl:w-[50%] xl:pl-24 text-start">
              <p className="xs:text-2xl xs:text-center xl:text-[2.75rem] xl:text-start font-medium py-8">
                PETUNJUK PENGGUNA
              </p>
              {dataGuide.map((item) => (
                <div
                  className="flex items-center xs:pl-10 xl:pl-5 text-white"
                  data-aos="fade-right"
                >
                  <div className="bg-[#D9D9D9] rounded-full xs:w-4 xs:h-4 xl:w-7 xl:h-7"></div>
                  <p className="xs:text-2xl xl:text-4xl font-medium xs:py-3 xs:pl-3 xl:py-5 xl:pl-5">
                    {item}
                  </p>
                </div>
              ))}
              <center className="xs:w-full xl:w-[70%] py-10">
                <button
                  className="px-16 py-3 bg-green-600 text-white font-medium hover:opacity-75"
                  onClick={() => {
                    navigate("/about/user-guide");
                    window.scrollTo(0, 0);
                  }}
                >
                  Selengkapnya
                </button>
              </center>
            </div>
            <div className="flex flex-col xl:w-[50%] xs:w-[0%] md:w-[50%] items-center h-full">
              <center className="flex items-center h-full pr-5">
                <img src={userGuide} alt={userGuide} className="xl:scale-110" />
              </center>
            </div>
          </div>
        </div>
      </center>

      {/* Divider */}
      <center>
        <div className="bg-[#9F9494] w-[90%] h-1 my-10 opacity-50"></div>
      </center>

      {/* Dokumentasi Parameter */}
      <div className="w-full xl:pt-8 pb-20 flex flex-col" data-aos="zoom-in-up">
        <p className="text-center xs:text-2xl md:text-3xl xl:text-[2.5rem] font-semibold text-[#1F8A70] pb-5">
          PARAMETER
        </p>
        <div className="flex flex-col w-full mb-12 gap-3">
          <div
            className="flex gap-3 justify-center xs:text-sm md:text-lg xl:text-2xl font-semibold xs:flex-wrap"
            data-aos="fade-up"
          >
            <center className="group pt-12 pb-5 border-green-200 border-2 rounded-lg xs:w-[40%] lg:w-[20%] hover:scale-105 duration-500 hover:shadow-xl hover:border-none hover:bg-[#f6fbf4] cursor-pointer">
              <BsSunFill className="text-[140px] text-green-500 duration-300 bg-white p-7 shadow-xl rounded-xl" />
              <p className="pt-5">GHI</p>
            </center>
            <center className="group pt-12 pb-5 border-green-200 border-2 rounded-lg xs:w-[40%] lg:w-[20%] hover:scale-105 duration-500 hover:shadow-xl hover:border-none hover:bg-[#f6fbf4] cursor-pointer">
              <BsCloudsFill className="text-[140px] text-green-500 duration-300 bg-white p-7 shadow-xl rounded-xl" />
              <p className="pt-5">Tutupan Awan</p>
            </center>
            <center className="group pt-12 pb-5 border-green-200 border-2 rounded-lg xs:w-[40%] lg:w-[20%] hover:scale-105 duration-500 hover:shadow-xl hover:border-none hover:bg-[#f6fbf4] cursor-pointer">
              <BsCloudFog className="text-[140px] text-green-500 duration-300 bg-white p-7 shadow-xl rounded-xl" />
              <p className="pt-5">Indeks Kebeningan</p>
            </center>
            <center className="group pt-12 pb-5 border-green-200 border-2 rounded-lg xs:w-[40%] lg:w-[20%] hover:scale-105 duration-500 hover:shadow-xl hover:border-none hover:bg-[#f6fbf4] cursor-pointer">
              <BsFillSunriseFill className="text-[140px] text-green-500 duration-300 bg-white p-7 shadow-xl rounded-xl" />
              <p className="pt-5">Pergerakan Matahari</p>
            </center>
          </div>
          <div
            className="flex justify-center gap-3 xs:text-sm md:text-lg xl:text-2xl font-semibold xs:flex-wrap"
            data-aos="fade-up"
          >
            <center className="group pt-12 pb-5 border-green-200 border-2 rounded-lg xs:w-[40%] lg:w-[20%] hover:scale-105 duration-500 hover:shadow-xl hover:border-none hover:bg-[#f6fbf4] cursor-pointer">
              <BsFillCloudRainFill className="text-[140px] text-green-500 duration-300 bg-white p-7 shadow-xl rounded-xl" />
              <p className="pt-5">Curah Hujan</p>
            </center>
            <center className="group pt-12 pb-5 border-green-200 border-2 rounded-lg xs:w-[40%] lg:w-[20%] hover:scale-105 duration-500 hover:shadow-xl hover:border-none hover:bg-[#f6fbf4] cursor-pointer">
              <FaTemperatureHalf className="text-[140px] text-green-500 duration-300 bg-white p-7 shadow-xl rounded-xl" />
              <p className="pt-5">Suhu</p>
            </center>
            <center className="group pt-12 pb-5 border-green-200 border-2 rounded-lg xs:w-[40%] lg:w-[20%] hover:scale-105 duration-500 hover:shadow-xl hover:border-none hover:bg-[#f6fbf4] cursor-pointer">
              <BsCloudHaze2Fill className="text-[140px] text-green-500 duration-300 bg-white p-7 shadow-xl rounded-xl" />
              <p className="pt-5">Distribusi Arah Angin</p>
            </center>
            <center className="group pt-12 pb-5 border-green-200 border-2 rounded-lg xs:w-[40%] lg:w-[20%] hover:scale-105 duration-500 hover:shadow-xl hover:border-none hover:bg-[#f6fbf4] cursor-pointer">
              <FiWind className="text-[140px] text-green-500 duration-300 bg-white p-7 shadow-xl rounded-xl" />
              <p className="pt-5">Kecepatan Angin</p>
            </center>
          </div>
        </div>
        <center>
          <button
            className="px-16 py-3 bg-green-600 text-white font-medium hover:opacity-75"
            onClick={() => {
              navigate("/about/parameter");
              window.scrollTo(0, 0);
            }}
          >
            Selengkapnya
          </button>
        </center>
      </div>

      <Footer />
    </div>
  );
};

export default About;
