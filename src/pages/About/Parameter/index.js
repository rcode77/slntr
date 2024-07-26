import Shortcut from "@components/molecule/About/Shortcut";
import Breadcrumbs from "@components/molecule/Breadcrumbs";
import Footer from "@components/organism/Footer";
import TableAbout from "@components/organism/Table/TableAbout/TableAbout";
import React from "react";
import { useState } from "react";

const Parameter = () => {
  const [data, setData] = useState([
    {
      id: 1,
      parameter: "Potensi Energi Matahari (GHI)",
      satuan: "kWh/m",
      deskripsi: "",
    },
    {
      id: 2,
      parameter: "Radiasi Matahari",
      satuan: `W/m`,
      deskripsi: "",
    },
    {
      id: 3,
      parameter: "Lama Penyinaran",
      satuan: "Jam",
      deskripsi: "",
    },
    {
      id: 4,
      parameter: "Indeks Kebeningan",
      satuan: "-",
      deskripsi: "",
    },
    {
      id: 5,
      parameter: "Suhu Udara",
      satuan: "°C",
      deskripsi:
        "Tinggi rendahnya suhu udara lingkungan dapat berdampak pada efisiensi produksi listrik dari panel surya. Pada beberapa kondisi, bahkan diperlukan usaha untuk mendinginkan sistem panel surya agar efisiensi produksi listrik dapat tercapai.",
    },
    {
      id: 6,
      parameter: "Curah Hujan",
      satuan: "mm",
      deskripsi: "",
    },
    {
      id: 7,
      parameter: "Kecepatan Angin",
      satuan: "m/s",
      deskripsi:
        "Menggambarkan kecepatan aliran udara dari tekanan tinggi ke tekanan rendah. Angin permukaan memiliki peran dalam menurunkan suhu dan kelembaban di suatu wilayah, sehingga profil kecepatan angin juga menentukan potensi energi matahari yang dapat diproduksi panel surya.",
    },
    {
      id: 8,
      parameter: "Arah Angin",
      satuan: "-",
      deskripsi:
        "Parameter arah angin menggambarkan dari arah mana sumber angin berasal. Arah angin dinyatakan dalam derajat (°), dengan arah utara digunakan sebagai acuan (0°). Arah angin juga dapat dinyatakan dalam bentuk mata angin (Utara-U, Timur-T), dsb.). Informasi arah angin digunakan sebagai petunjuk pergerakan awan, awan sendiri dapat menyebabkan terjadinya intermitensi pada proses produksi energi.",
    },
    {
      id: 9,
      parameter: "Tutupan Awan Total",
      satuan: "Persen",
      deskripsi: "",
    },
    {
      id: 10,
      parameter: "Tutupan Awan Rendah",
      satuan: "Persen",
      deskripsi:
        "Parameter yang menggambarkan persentase tutupan awan rendah yang menutupi langit. Awan rendah merupakan awan dengan ketinggian antara 0 - 2000 m.",
    },
    {
      id: 11,
      parameter: "Tutupan Awan Menengah",
      satuan: "Persen",
      deskripsi:
        "Parameter yang menggambarkan persentase tutupan awan menengah yang menutupi langit. Awan menengah merupakan awan dengan ketinggian antara 2000 - 6000 m.",
    },
    {
      id: 12,
      parameter: "Tutupan Awan Tinggi",
      satuan: "Persen",
      deskripsi:
        "Parameter yang menggambarkan persentase tutupan awan tinggi yang menutupi langit. Awan tinggi merupakan awan dengan ketinggian antara 6000 - 18000 m.",
    },
  ]);

  const columns = [
    {
      name: <p className="text-left py-1 md:pr-10">Parameter</p>,
      selector: (row) => <div className="">{row.parameter}</div>,
    },
    {
      name: <p className="text-left py-1 md:pr-10">Satuan</p>,
      selector: (row) => (
        <div className="gap-1">
          {row.id === 1 || row.id === 2 ? (
            <p>
              {row.satuan}
              <sup>2</sup>
            </p>
          ) : (
            row.satuan
          )}
        </div>
      ),
    },
    {
      name: <p className="py-1">Deskripsi</p>,
      selector: (row) => (
        <div className="gap-1">
          {row.id === 1 ? (
            <p>
              Akumulasi radiasi global yang diterima pada permukaan horizontal
              bumi (<i>global horizontal irradiance</i>) selama satu hari.
            </p>
          ) : row.id === 2 ? (
            <p>
              Jumlah radiasi gelombang pendek yang mencapai permukaan horizontal
              bumi baik secara langsung (<i>direct</i>) maupun tidak langsung (
              <i>diffuse</i>). Tidak seluruh radiasi matahari masuk dan mencapai
              permukaan bumi. Sebagian ada yang diserap dan dipantulkan kembali
              ke angkasa oleh awan maupun partikel di atmosfer (aerosol).
              Radiasi yang tidak dipantulkan dan tidak diserap itulah yang
              terukur sebagai radiasi matahari
            </p>
          ) : row.id === 3 ? (
            <p>
              Durasi bersinarnya matahari dihitung dalam satuan waktu (jam).
              Hanya radiasi dengan intensitas lebih dari 120 W/m<sup>2</sup>{" "}
              yang dicatat durasinya.
            </p>
          ) : row.id === 4 ? (
            <p>
              Indeks untuk menggambarkan kondisi kebersihan/kebeningan atmosfer
              yang digunakan untuk menggambarkan kondisi perawanan dalam satu
              hari. Indeks kebeningan memiliki rentang nilai 0 – 1, dimana 0
              menandakan kondisi atmosfer yang sepenuhnya tertutup (
              <i>overcast</i>) dalam satu hari penuh, sementara 1 menandakan
              kondisi atmosfer yang sepenuhnya bersih tanpa tutupan awan (
              <i>clear sky</i>) atau partikel yang dapat menghalangi sinar
              matahari.
            </p>
          ) : row.id === 6 ? (
            <p>
              Parameter yang menggambarkan ketinggian air hujan yang terkumpul
              pada sebuah luasan datar 1 m<sup>2</sup>, dengan asumsi tidak ada
              air yang terserap maupun mengalir. Dalam kegiatan operasional
              energi surya, air hujan membantu membersihkan debu-debu yang ada
              pada permukaan panel surya.
            </p>
          ) : row.id === 9 ? (
            <p>
              Parameter yang menggambarkan persentase tutupan awan yang menutupi
              langit. Diasumsikan awan pada masing-masing ketinggian tumpang
              tindih (<i>overlap</i>) satu sama lain, sehingga penentuan
              didasarkan pada total awan yang dapat diamati dari permukaan bumi
              tanpa memperhatikan jenis ketinggian awan tersebut.
            </p>
          ) : (
            row.deskripsi
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white">
      <div className="lg:text-[2.5rem] xs:py-5 xs:text-3xl font-bold text-[#1F8A70] lg:py-10 lg:pl-16 xs:pl-7">
        {/* <p>DOKUMENTASI</p> */}
        <p>PARAMETER</p>
      </div>
      <div className="bg-[#D5D5D5]">
        <div className="lg:pl-16 xs:pl-7 py-3">
          <Breadcrumbs name={`Parameter`} />
        </div>
      </div>
      <div className="xs:px-7 lg:pl-16 py-3 lg:flex pb-10">
        <div className="xs:w-full lg:w-[60%] pt-8">
          <TableAbout data={data} column={columns} maxHeight={"400px"} />
        </div>
        <div className="xs:w-full xs:-mt-16 lg:-mt-0 lg:w-[40%]">
          <center>
            <Shortcut name="Parameter" />
          </center>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Parameter;
