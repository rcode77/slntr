import Shortcut from "@components/molecule/About/Shortcut";
import Breadcrumbs from "@components/molecule/Breadcrumbs";
import Footer from "@components/organism/Footer";
import React from "react";

const Silentera = () => {
  return (
    <div className="bg-white">
      <div className="lg:text-[2.5rem] xs:py-5 xs:text-3xl font-bold text-[#1F8A70] lg:py-10 lg:pl-16 xs:pl-7">
        <p className="lg:pb-3">TENTANG</p>
        <p>SILENTERA</p>
      </div>
      <div className="bg-[#D5D5D5]">
        <div className="lg:pl-16 xs:pl-7 py-3">
          <Breadcrumbs name={`SILENTERA`} />
        </div>
      </div>
      <div className="xs:px-7 lg:pl-16 py-3 lg:flex pb-10">
        <div className="xs:w-full lg:w-[60%]">
          <p className="text-3xl font-semibold py-5">Apa itu SILENTERA</p>
          <p className="py-3">
            SILENTERA merupakan sebuah inovasi layanan data informasi potensi
            energi baru terbarukan (EBT) di Indonesia, berbasis <i>platform </i>
            interaktif yang dikembangkan oleh Pusat Layanan Informasi Iklim
            Terapan BMKG. Informasi dalam <i>platform</i> SILENTERA dapat
            digunakan bagi pemangku kebijakan, industri penyedia EBT, analis
            energi, dan masyarakat umum. SILENTERA menyediakan informasi
            ringkasan iklim dan prakiraan yang merupakan informasi penting dalam
            pengembangan energi terbarukan di Indonesia.
          </p>
          <p className="py-3">
            SILENTERA menyediakan layanan terintegrasi berupa analisis iklim dan
            rekomendasi yang disajikan dalam bentuk spasial dan grafik. Beberapa
            keunggulan produk SILENTERA, yaitu:
          </p>
          <div className="w-full">
            <div className="flex">
              <div className="xs:w-[10%] lg:w-[5%] pl-3">
                <p className="pt-3 pb-1">1.</p>
              </div>
              <div className="xs:w-[90%] lg:w-[95%]">
                <p className="pt-3 pb-1">
                  Informasi yang lebih akurat dan terpercaya. Dalam proses
                  pengembangannya menggunakan data input pengamatan langsung di
                  lapangan yang dilakukan oleh BMKG pada titik-titik stasiun
                  yang tersebar di seluruh wilayah Indonesia;
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="xs:w-[10%] lg:w-[5%] pl-3 ">
                <p className="py-1">2.</p>
              </div>
              <div className="xs:w-[90%] lg:w-[95%]">
                <p className="py-1">
                  Data historis iklim dengan periode yang panjang dapat menjadi
                  informasi yang tepat untuk mengidentifikasi lokasi potensial
                  pembangunan pembangkit listrik berbasis energi terbarukan di
                  Indonesia;
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="xs:w-[10%] lg:w-[5%] pl-3 ">
                <p className="py-1">3.</p>
              </div>
              <div className="xs:w-[90%] lg:w-[95%]">
                <p className="py-1">
                  Mendukung aktivitas operasional energi terbarukan dengan
                  meningkatkan efisiensi melalui penyediaan prakiraan resolusi
                  tinggi;
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="xs:w-full xs:-mt-16 lg:-mt-0 lg:w-[40%]">
          <center>
            <Shortcut name="Tentang Silentera" />
          </center>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Silentera;
