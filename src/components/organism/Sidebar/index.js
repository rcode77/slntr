import { useNavigate } from "react-router-dom";

// asset
import bmkg from "@assets/bmkg.png";
import silentera from "@assets/silentera.png";
import { BiHomeSmile, BiUser, BiHistory } from "react-icons/bi";
import { BsChevronRight } from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi";

export default function Sidebar({ setTitle, title }) {
  let navigate = useNavigate();

  return (
    <div className="h-[100vh] w-[17.5vw] 2xl:px-7 2xl:py-10 xl:px-4 xl:py-6 bg-white shadow-md fixed top-0 left-0">
      <div className="flex items-center justify-center gap-4 lg:gap-3 md:gap-2 mb-20 xl:mb-14">
        <img src={bmkg} alt="logo bmkg" className="md:w-10 md:h-12 w-8 h-10" />
        <img
          src={silentera}
          alt="logo silentera"
          className="md:h-10 h-9 w-full"
        />
      </div>

      {/* dashboard */}
      <div
        className={`rounded-xl ${
          title.includes("Dashboard")
            ? "bg-[#00AF50]"
            : "bg-white text-[#86A1AD]"
        } 2xl:mx-4 xl:mx-2 px-4 py-4 flex items-center justify-between hover:cursor-pointer`}
        onClick={() => {
          setTitle("Dashboard");
          navigate("/dashboard");
        }}
      >
        <div className="flex items-center gap-2">
          <BiHomeSmile className="text-xl" />
          <h1 className="text-lg font-medium">Dashboard</h1>
        </div>
        <BsChevronRight
          className={`text-xl ${
            title.includes("Dashboard") ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      {/* end of dashboard */}

      {/* manage user */}
      <div
        className={`rounded-xl ${
          title !== "Kelola User" ? "bg-white text-[#86A1AD]" : "bg-[#00AF50]"
        } 2xl:mx-4 xl:mx-2 px-4 py-4 flex items-center justify-between hover:cursor-pointer`}
        onClick={() => {
          setTitle("Kelola User");
          navigate("/dashboard");
        }}
      >
        <div className="flex items-center gap-2">
          <BiUser className="text-xl" />
          <h1 className="text-lg font-medium">Kelola User</h1>
        </div>

        <BsChevronRight
          className={`text-xl ${
            title === "Kelola User" ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      {/* end of manage user */}

      {/* riwayat */}
      <div
        className={`rounded-xl ${
          title !== "Riwayat" ? "bg-white text-[#86A1AD]" : "bg-[#00AF50]"
        } 2xl:mx-4 xl:mx-2 px-4 py-4 flex items-center justify-between hover:cursor-pointer`}
        onClick={() => {
          setTitle("Riwayat");
          navigate("/dashboard");
        }}
      >
        <div className="flex items-center gap-2">
          <BiHistory className="text-xl" />
          <h1 className="text-lg font-medium">Riwayat</h1>
        </div>

        <BsChevronRight
          className={`text-xl ${
            title === "Riwayat" ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      {/* end of riwayat */}

      {/* survey */}
      <div
        className={`rounded-xl ${
          title !== "Survey" ? "bg-white text-[#86A1AD]" : "bg-[#00AF50]"
        } 2xl:mx-4 xl:mx-2 px-4 py-4 flex items-center justify-between hover:cursor-pointer`}
        onClick={() => {
          setTitle("Survey");
          navigate("/dashboard");
        }}
      >
        <div className="flex items-center gap-2">
          <HiOutlineUserGroup className="text-xl" />
          <h1 className="text-lg font-medium">Survey</h1>
        </div>

        <BsChevronRight
          className={`text-xl ${
            title === "Survey" ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      {/* end of survey */}
    </div>
  );
}
