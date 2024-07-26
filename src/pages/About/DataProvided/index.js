import Shortcut from "@components/molecule/About/Shortcut";
import Breadcrumbs from "@components/molecule/Breadcrumbs";
import Footer from "@components/organism/Footer";
import React from "react";

const DataProvided = () => {
  return (
    <div className="bg-white">
      <div className="lg:text-[2.5rem] xs:py-5 xs:text-3xl font-bold text-[#1F8A70] lg:py-10 lg:pl-16 xs:pl-7">
        <p className="lg:pb-3">PRODUK TERSEDIA</p>
        <p>SILENTERA</p>
      </div>
      <div className="bg-[#D5D5D5]">
        <div className="lg:pl-16 xs:pl-7 py-3">
          <Breadcrumbs name={`Produk Tersedia`} />
        </div>
      </div>
      <div className="xs:px-7 lg:pl-16 py-3 lg:flex pb-10">
        <div className="xs:w-full lg:w-[60%]">
          <p className="text-3xl font-semibold py-5">Apa itu Data Historis</p>
          <p className="py-3">
            Data historis adalah ringkasan iklim selama 30 tahun terakhir
            (1991-2020) yang merupakan informasi penting dalam perencanaan
            pembangunan pembangkit listrik. Informasi ini digunakan sebagai
            referensi dasar dalam menentukan lokasi potensial pengembangan
            energi terbarukan di Indonesia.
          </p>
          <p className="py-3">
            Potensi energi di suatu wilayah dihitung dari penggabungan data
            pengamatan meteorologi dan data model <i>reanalysis</i> dengan
            resolusi tinggi. Data historis tersedia dalam skala waktu bulanan
            dan tahunan.
          </p>
          <p className="text-3xl font-semibold py-5">Apa itu Data Prakiraan</p>
          <p className="py-3">
            Informasi prakiraan energi surya ditampilkan dengan resolusi tinggi
            dalam dua skala waktu berbeda, yaitu harian dan bulanan. Prakiraan
            harian mencakup prakiraan tiap jam hingga 14 hari kedepan, sedangkan
            prakiraan bulanan berisi prakiraan kondisi umum tiap bulan untuk 7
            bulan ke depan.
          </p>
          <p className="py-3">
            Selain prakiraan radiasi untuk estimasi keluaran energi, disajikan
            juga prakiraan beberapa parameter meteorologi yang mendukung
            kegiatan operasional energi terbarukan, diantaranya suhu udara,
            arah, dan kecepatan angin serta hujan. Informasi prakiraan
            dihasilkan dari keluaran model cuaca yang telah mengalami proses
            evaluasi lebih lanjut.
          </p>
        </div>
        <div className="xs:w-full xs:-mt-16 lg:-mt-0 lg:w-[40%]">
          <center>
            <Shortcut name="Produk Tersedia" />
          </center>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DataProvided;
