import React from "react";
import { useNavigate } from "react-router-dom";

const Shortcut = ({ name }) => {
  const navigate = useNavigate();

  const data = [
    { name: "Tentang Silentera", url: "/about/silentera" },
    { name: "Produk Tersedia", url: "/about/data-provided" },
    { name: "Petunjuk Pengguna", url: "/about/user-guide" },
    { name: "Parameter", url: "/about/parameter" },
  ];

  return (
    <div className="bg-[#D9D9D9] h-48 xs:w-[90%] lg:w-[70%] p-7 rounded-xl mt-28">
      <p className="text-left font-bold text-lg">Tentang</p>
      <div className="py-2">
        {data.map((item, index) => (
          <p
            className={`text-left pl-3 hover:underline cursor-pointer ${
              item.name === name ? "underline" : ""
            }`}
            key={index}
            onClick={() => navigate(item.url)}
          >
            {index + 1}. {item.name};
          </p>
        ))}
      </div>
    </div>
  );
};

export default Shortcut;
