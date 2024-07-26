import Breadcrumbs from "@components/molecule/Breadcrumbs";
import React, { useState } from "react";
import Shortcut from "@components/molecule/About/Shortcut";
import GuideShort from "@components/molecule/About/GuideShort";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";

import one from "@assets/1.png";
import two from "@assets/2.png";
import three from "@assets/3.png";
import four from "@assets/4.png";
import five from "@assets/5.png";
import six from "@assets/6.png";
import seven from "@assets/7.png";
import eight from "@assets/8.png";
import nine from "@assets/9.png";
import ten from "@assets/10.png";
import Footer from "@components/organism/Footer";

const UserGuide = () => {
  const [name, setName] = useState("Memilih Lokasi Pada Peta yang Disediakan");
  const [section, setSection] = useState(0);
  const [all, setAll] = useState(false);

  return (
    <div className="bg-white" id="top">
      <div className="lg:text-[2.5rem] xs:py-5 xs:text-3xl font-bold text-[#1F8A70] lg:py-10 lg:pl-16 xs:pl-7">
        <p className="lg:pb-3">PETUNJUK</p>
        <p>PENGGUNA</p>
      </div>
      <div className="bg-[#D5D5D5]">
        <div className="lg:pl-16 xs:pl-7 py-3">
          <Breadcrumbs name={`Petunjuk Pengguna`} />
        </div>
      </div>
      <div className="xs:px-7 lg:pl-16 py-3 lg:flex pb-10">
        <div className="xs:w-full lg:w-[60%]">
          {/* Memilih Lokasi Pada Peta yang Disediakan */}
          {section === 0 && all !== true && (
            <div>
              <p className="text-3xl font-semibold py-5">
                Memilih Lokasi Pada Peta yang Disediakan
              </p>
              <div>
                <center>
                  <img src={one} alt={one} className="lg:scale-90 lg:-ml-10" />
                </center>
              </div>
              <p className="py-3">
                Anda dapat memilih lokasi pada pilihan Provinsi dan Kabupaten
                yang telah disediakan, atau memilih lokasi secara langsung pada
                peta dengan klik daerah yang anda inginkan.
              </p>
            </div>
          )}

          {/* Melihat Detail Data Historis */}
          {section === 1 && all !== true && (
            <div>
              <p className="text-3xl font-semibold py-5">
                Melihat Detail Data Historis
              </p>
              <div>
                <center>
                  <img src={two} alt={two} className="lg:scale-90 lg:-ml-10" />
                </center>
              </div>
              <p className="pt-3 pb-5">
                Setelah memilih lokasi, <i>overview</i> data pada lokasi
                tersebut akan terlihat, jika ingin melihat detail dari data
                tersebut anda dapat klik tombol “Detail”.
              </p>
              <div>
                <center>
                  <img src={three} alt={three} className="lg:-ml-10" />
                </center>
              </div>
              <p className="py-3">
                Detail data historis dari lokasi yang anda pilih akan terlihat
                setelah klik tombol detail. Anda dapat mengunduh data, juga
                mengganti periode waktu data yang di inginkan.
              </p>
            </div>
          )}

          {/* Mengakses Data Premium */}
          {section === 2 && all !== true && (
            <div>
              <p className="text-3xl font-semibold py-5">
                Mengakses Data Premium
              </p>
              <div>
                <center>
                  <img src={four} alt={four} className="lg:-ml-10" />
                </center>
              </div>
              <p className="py-3">Klik menu Data Prakiraan</p>
              <div>
                <center>
                  <img
                    src={five}
                    alt={five}
                    className="lg:scale-90 lg:-ml-10"
                  />
                </center>
              </div>
              <div>
                <center>
                  <img src={six} alt={six} className="lg:scale-90 lg:-ml-10" />
                </center>
              </div>
              <p className="py-3">
                Untuk mengakses Data Prakiraan, anda harus <i>log in</i>{" "}
                terlebih dahulu. Jika anda belum memiliki akun untuk{" "}
                <i>log in</i>, anda bisa melakukan proses registrasi pada menu
                yang disediakan.
              </p>
              <div>
                <center>
                  <img
                    src={seven}
                    alt={seven}
                    className="lg:scale-90 lg:-ml-10"
                  />
                </center>
              </div>
              <p className="py-3">
                Setelah Login atau melakukan Registrasi Akun, anda akan
                diarahkan menuju menu <i>payment</i>. Di karenakan Data
                Prakiraan termasuk dalam kategori Data Premium, maka anda
                diwajibkan untuk melakukan <i>payment</i> untuk mengaksesnya.
              </p>
              <div>
                <center>
                  <img src={eight} alt={eight} className="lg:-ml-10" />
                </center>
              </div>
              <p className="py-3">
                Setelah melakukan <i>payment</i>, anda bisa mengakses Data
                Prakiraan dan mengunduh data tersebut dalam bentuk PDF atau CSV
              </p>
            </div>
          )}

          {/* Menyimpan Lokasi */}
          {section === 3 && all !== true && (
            <div>
              <p className="text-3xl font-semibold py-5">Menyimpan Lokasi</p>
              <div>
                <center>
                  <img
                    src={nine}
                    alt={nine}
                    className="lg:scale-90 lg:-ml-10"
                  />
                </center>
              </div>
              <p className="py-3">
                Anda dapat menyimpan Lokasi yang anda inginkan ke dalam
                <i> dashboard</i> anda dengan klik tombol “Simpan Lokasi”. Untuk
                menyimpan sebuah lokasi, anda harus melakukan Login terlebih
                dahulu.
              </p>
              <div>
                <center>
                  <img src={ten} alt={ten} className="lg:scale-90 lg:-ml-10" />
                </center>
              </div>
              <p className="py-3">
                Lokasi yang baru saja anda lihat dan lokasi yang telah anda
                simpan akan terlihat pada <i> dashboard</i> anda. Jika ingin
                melihat Data Historis dan Data Prakiraan pada sebuah lokasi di
                <i> dashboard</i> anda, anda dapat klik simbol detail di pojok
                kanan atas seperti tertera pada foto di atas.
              </p>
            </div>
          )}

          {/* Lihat Semua */}
          {all && (
            <div>
              {/* Memilih Lokasi Pada Peta yang Disediakan */}
              <div id="satu">
                <p className="text-3xl font-semibold py-5">
                  Memilih Lokasi Pada Peta yang Disediakan
                </p>
                <div>
                  <center>
                    <img
                      src={one}
                      alt={one}
                      className="lg:scale-90 lg:-ml-10"
                    />
                  </center>
                </div>
                <p className="py-3">
                  Anda dapat memilih lokasi pada pilihan Provinsi dan Kabupaten
                  yang telah disediakan, atau memilih lokasi secara langsung
                  pada peta dengan klik daerah yang anda inginkan.
                </p>
              </div>

              {/* Melihat Detail Data Historis */}
              <div id="dua">
                <p className="text-3xl font-semibold py-5">
                  Melihat Detail Data Historis
                </p>
                <div>
                  <center>
                    <img
                      src={two}
                      alt={two}
                      className="lg:scale-90 lg:-ml-10"
                    />
                  </center>
                </div>
                <p className="pt-3 pb-5">
                  Setelah memilih lokasi, <i>overview</i> data pada lokasi
                  tersebut akan terlihat, jika ingin melihat detail dari data
                  tersebut anda dapat klik tombol “Detail”.
                </p>
                <div>
                  <center>
                    <img src={three} alt={three} className="lg:-ml-10" />
                  </center>
                </div>
                <p className="py-3">
                  Detail data historis dari lokasi yang anda pilih akan terlihat
                  setelah klik tombol detail. Anda dapat mengunduh data, juga
                  mengganti periode waktu data yang di inginkan.
                </p>
              </div>

              {/* Mengakses Data Premium */}
              <div id="tiga">
                <p className="text-3xl font-semibold py-5">
                  Mengakses Data Premium
                </p>
                <div>
                  <center>
                    <img src={four} alt={four} className="lg:-ml-10" />
                  </center>
                </div>
                <p className="py-3">Klik menu Data Prakiraan</p>
                <div>
                  <center>
                    <img
                      src={five}
                      alt={five}
                      className="lg:scale-90 lg:-ml-10"
                    />
                  </center>
                </div>
                <div>
                  <center>
                    <img
                      src={six}
                      alt={six}
                      className="lg:scale-90 lg:-ml-10"
                    />
                  </center>
                </div>
                <p className="py-3">
                  Untuk mengakses Data Prakiraan, anda harus <i>log in</i>{" "}
                  terlebih dahulu. Jika anda belum memiliki akun untuk{" "}
                  <i>log in</i>, anda bisa melakukan proses registrasi pada menu
                  yang disediakan.
                </p>
                <div>
                  <center>
                    <img
                      src={seven}
                      alt={seven}
                      className="lg:scale-90 lg:-ml-10"
                    />
                  </center>
                </div>
                <p className="py-3">
                  Setelah Login atau melakukan Registrasi Akun, anda akan
                  diarahkan menuju menu <i>payment</i>. Di karenakan Data
                  Prakiraan termasuk dalam kategori Data Premium, maka anda
                  diwajibkan untuk melakukan <i>payment</i> untuk mengaksesnya.
                </p>
                <div>
                  <center>
                    <img src={eight} alt={eight} className="lg:-ml-10" />
                  </center>
                </div>
                <p className="py-3">
                  Setelah melakukan <i>payment</i>, anda bisa mengakses Data
                  Prakiraan dan mengunduh data tersebut dalam bentuk PDF atau
                  CSV
                </p>
              </div>

              {/* Menyimpan Lokasi */}
              <div id="empat">
                <p className="text-3xl font-semibold py-5">Menyimpan Lokasi</p>
                <div>
                  <center>
                    <img
                      src={nine}
                      alt={nine}
                      className="lg:scale-90 lg:-ml-10"
                    />
                  </center>
                </div>
                <p className="py-3">
                  Anda dapat menyimpan Lokasi yang anda inginkan ke dalam
                  <i> dashboard</i> anda dengan klik tombol “Simpan Lokasi”.
                  Untuk menyimpan sebuah lokasi, anda harus melakukan Login
                  terlebih dahulu.
                </p>
                <div>
                  <center>
                    <img
                      src={ten}
                      alt={ten}
                      className="lg:scale-90 lg:-ml-10"
                    />
                  </center>
                </div>
                <p className="py-3">
                  Lokasi yang baru saja anda lihat dan lokasi yang telah anda
                  simpan akan terlihat pada <i> dashboard</i> anda. Jika ingin
                  melihat Data Historis dan Data Prakiraan pada sebuah lokasi di
                  <i> dashboard</i> anda, anda dapat klik simbol detail di pojok
                  kanan atas seperti tertera pada foto di atas.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-10 justify-center items-center lg:-ml-10 pt-7">
            {all ? (
              <>
                <div
                  className={`text-2xl font-semibold text-slate-700 hover:text-black cursor-pointer`}
                  onClick={() => {
                    window.location.href = "#top";
                    setAll(false);
                  }}
                >
                  Lihat Per Halaman
                </div>
              </>
            ) : (
              <>
                <div
                  className={`text-3xl ${
                    section === 0
                      ? "opacity-50"
                      : "text-slate-600 hover:text-black cursor-pointer"
                  }`}
                  onClick={() => {
                    if (section > 0 && section < 4) {
                      setSection(section - 1);
                      window.scrollTo(0, 0);
                    }
                  }}
                >
                  <BsFillArrowLeftCircleFill />
                </div>
                <div
                  className={`text-2xl font-semibold text-slate-700 hover:text-black cursor-pointer`}
                  onClick={() => {
                    window.location.href = "#top";
                    setAll(true);
                  }}
                >
                  Lihat Semua
                </div>
                <div
                  className={`text-3xl ${
                    section === 3
                      ? "opacity-50"
                      : "text-slate-600 hover:text-black cursor-pointer"
                  }`}
                  onClick={() => {
                    if (section >= 0 && section < 3) {
                      setSection(section + 1);
                      window.scrollTo(0, 0);
                    }
                  }}
                >
                  <BsFillArrowRightCircleFill />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="xs:w-full xs:-mt-16 lg:-mt-0 lg:w-[40%]">
          <center>
            <GuideShort
              name={name}
              setName={setName}
              setSection={setSection}
              section={section}
              type={all}
            />
          </center>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserGuide;
