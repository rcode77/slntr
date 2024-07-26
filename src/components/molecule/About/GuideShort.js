import React from "react";
import { useNavigate } from "react-router-dom";

const GuideShort = ({ name, setSection, setName, section, type, setAll }) => {
  const navigate = useNavigate();

  const data = [
    {
      name: "Memilih Lokasi Pada Peta yang Disediakan",
      url: "/about/silentera",
    },
    { name: "Melihat Detail Data Historis", url: "/about/data-provided" },
    { name: "Mengakses Data Premium", url: "/about/user-guide" },
    { name: "Menyimpan Lokasi", url: "/about/parameter" },
  ];

  return (
    <div className="bg-[#D9D9D9] xs:h-auto lg:h-48 w-[80%] p-7 rounded-xl mt-28">
      <p className="text-left font-bold text-lg">Petunjuk Pengguna</p>
      <div className="py-2">
        {data.map((item, index) => (
          <p
            className={`text-left pl-3 hover:underline cursor-pointer ${
              index === section ? "underline" : ""
            }`}
            key={index}
            onClick={() => {
              if (type === true) {
                if (index === 0) {
                  window.location.href = "#satu";
                } else if (index === 1) {
                  window.location.href = "#dua";
                } else if (index === 2) {
                  window.location.href = "#tiga";
                } else if (index === 3) {
                  window.location.href = "#empat";
                }
              } else {
                window.scrollTo(0, 0);
                setName(item.name);
                setSection(index);
              }
            }}
          >
            {index + 1}. {item.name};
          </p>
        ))}
      </div>
    </div>
  );
};

export default GuideShort;
