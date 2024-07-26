// package
import { useEffect } from "react";
import { logout } from "@redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// component
import Dropdown from "@components/molecule/Dropdown";
import ToastHook from "@hooks/Toast";
import { Menu } from "@headlessui/react";

// asset
import { VscBellDot } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { BiLogOut } from "react-icons/bi";

export default function NavbarAdmin({ title }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { successToast } = ToastHook();

  const { user, token } = useSelector((state) => state.auth);
  const handleLogout = async () => {
    try {
      await axios
        .post(
          `${process.env.REACT_APP_URL_API}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        )
        .then(({ data }) => {
          successToast(data.message);
          dispatch(logout());
          navigate("/");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white rounded-xl xl:px-7 xl:py-5 shadow-lg flex items-center justify-between w-full">
      <h1 className="font-medium text-lg">{title}</h1>

      <div className="flex items-center gap-3 text-[#00AF50]">
        <VscBellDot className="text-2xl font-medium" />
        <h1 className="text-lg font-medium">
          Halo,{" "}
          <span className="text-[#BDD3DE]">{user ? user.name : "Admin"}</span>
        </h1>

        {!user && <CgProfile className="text-2xl font-medium" />}

        {user && (
          <Dropdown
            width={"100%"}
            position={"right-12"}
            customDropdown={""}
            title={
              <p className="font-medium text-sm w-10 h-10 rounded-full bg-green-500 flex items-center justify-center cursor-pointer hover:opacity-80 duration-150 text-white">
                {user.name[0].toUpperCase()}
              </p>
            }
          >
            <div className="px-1 py-1 shadow border rounded  z-50 w-[80px] bg-white">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "opacity-70 duration-150 text-black"
                        : "text-black font-medium"
                    } group  flex justify-between w-full gap-1 items-center text-xxs xl:text-xs rounded-md px-1 py-1 font-medium`}
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    <BiLogOut /> Keluar
                  </button>
                )}
              </Menu.Item>
            </div>
          </Dropdown>
        )}
      </div>
    </div>
  );
}

// function dropDown(){
//   return()
// }
