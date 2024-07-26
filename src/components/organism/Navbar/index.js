import { Menu } from "@headlessui/react";
import {
  setLoginPopup,
  setRegisterPopup,
} from "@redux/features/login/loginSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "@components/molecule/Dropdown";
import axios from "axios";
import ToastHook from "@hooks/Toast";
import { logout } from "@redux/features/auth/authSlice";
import { AiOutlineCloseCircle, AiOutlineInfoCircle } from "react-icons/ai";
import BMKG from "@assets/bmkg.png";
import SILENTERA from "@assets/silentera.png";
import { BiLogOut, BiUserCircle } from "react-icons/bi";
import { BsInfo } from "react-icons/bs";
import WindowSize from "@hooks/windowSize";
import { IoMdClose } from "react-icons/io";
import { FaRegBell } from "react-icons/fa";
import { AvatarProfile } from "@hooks/AvatarProfile";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navbarRef = useRef(null);

  const { successToast } = ToastHook();

  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_URL_API}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      successToast(data.message);

      navigate("/");

      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  };

  // check validation token on first render
  useEffect(() => {
    const checkToken = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_URL_API}/verifytoken`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } catch (error) {
        console.log(error);
        dispatch(logout());
      }
    };

    if (user) {
      checkToken();
    }
  }, [user]);

  const [isSubscribe, setIsSubscribe] = useState(true);
  const [isClosedSubscribe, setIsClosedSubscribe] = useState(false);

  // check show subscribe navbar
  useEffect(() => {
    setIsSubscribe(
      window.location.pathname === "/detail" && !token ? false : true
    );
  }, [token, window.location.pathname]);

  const [isCollapse, setIsCollapse] = useState(false);

  return (
    <div className="relative z-10">
      <nav
        className={`fixed top-0 z-10 duration-150 w-full shadow-lg py-1 md:py-0  bg-white `}
        ref={navbarRef}
        id="navbar"
      >
        <div className="flex px-[2%]  items-center justify-between w-full">
          <div
            className="cursor-pointer flex items-center py-0 md:py-1.5 gap-3 xs:my-1 my-2"
            onClick={() => navigate(user ? "/beranda" : "/")}
          >
            <img src={BMKG} alt="BMKG" className="md:w-10 md:h-12 w-8 h-10" />
            <img
              src={SILENTERA}
              alt="SILENTERA"
              width={"100%"}
              className="md:h-10 h-9 w-auto"
            />
          </div>
          {user ? (
            <div className="flex gap-4">
              <button
                className="bg-main-500 text-xs text-white border border-transparent hover:opacity-60 px-8 py-1 rounded-md  duration-150"
                onClick={() => {
                  navigate("/about");
                }}
                id="btn-nav-about-navigate"
              >
                Tentang
              </button>
              <Dropdown
                id=" dropdown-nav-avatar-profile"
                width={"100%"}
                position={"right-[76px]"}
                customDropdown={""}
                title={
                  <div className="">
                    {user?.imgUrl ? (
                      <img
                        src={
                          AvatarProfile.find(
                            (avatar) => avatar.id === user?.imgUrl
                          )?.source
                        }
                        alt="profile"
                        className="w-10 h-10 shadow-sm shadow-main-300 rounded-full object-cover inline-block"
                      />
                    ) : (
                      <p className="font-medium text-sm w-10 h-10 rounded-full bg-green-500 flex items-center justify-center cursor-pointer hover:opacity-80 duration-150 text-white">
                        {user?.initialFirstName}
                        {user?.initialLastName}
                      </p>
                    )}
                  </div>
                }
              >
                <div className="px-1 py-1 shadow border rounded z-50 w-[110px] bg-white">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active
                            ? "duration-150 bg-main-500 text-white"
                            : "text-black font-medium"
                        } group py-2  flex justify-between w-full gap-1 items-center text-xxs xl:text-xs rounded-md px-1 font-medium`}
                        onClick={() => {
                          navigate("/list-subscription");
                        }}
                        id="btn-nav-subscription-navigate"
                      >
                        <FaRegBell /> Langganan
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active
                            ? "duration-150 bg-main-500 text-white"
                            : "text-black font-medium"
                        } group py-2  flex justify-between w-full gap-1 items-center text-xxs xl:text-xs rounded-md px-1 font-medium`}
                        onClick={() => {
                          navigate("/profile");
                        }}
                        id="btn-nav-profile-navigate"
                      >
                        <BiUserCircle /> Profile
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active
                            ? "duration-150 bg-main-500 text-white"
                            : "text-black font-medium"
                        } group py-2  flex justify-between w-full gap-1 items-center text-xxs xl:text-xs rounded-md px-1 font-medium`}
                        onClick={() => {
                          handleLogout();
                        }}
                        id="btn-nav-logout-navigate"
                      >
                        <BiLogOut /> Keluar
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Dropdown>
            </div>
          ) : (
            <div className="">
              <div className="gap-2 text-xs hidden md:flex ">
                <button
                  id="step-4"
                  className="bg-main-500 text-white border border-transparent hover:opacity-60 px-8 py-2 rounded-md  duration-150"
                  onClick={() => {
                    navigate("/about");
                  }}
                >
                  Tentang
                </button>
                <button
                  id="step-3"
                  className="text-main-500 hover:opacity-60 border border-main-500 px-8 py-2 rounded-md duration-150"
                  onClick={() => {
                    // dispatch(setRegisterPopup(true));
                    dispatch(setLoginPopup(true));
                  }}
                >
                  Masuk
                </button>
              </div>
              <div className="flex md:hidden">
                <input
                  hidden=""
                  className="check-icon hidden"
                  id="check-icon"
                  name="check-icon"
                  type="checkbox"
                  onChange={() => {
                    setIsCollapse(!isCollapse);
                  }}
                />

                {/* Humberger Menu */}
                <label className="icon-menu" htmlFor="check-icon">
                  <div className="w-full border-[1.5px] border-main-500 rounded-[0.5rem]"></div>
                  <div className="w-[60%] border-[1.5px] border-main-500 rounded-[0.5rem]"></div>
                </label>

                <div
                  className={`absolute p-4 top-0 w-[100vw] h-[100vh] bg-white duration-150  ${
                    isCollapse
                      ? "right-0 duration-300"
                      : "right-[100%] duration-300"
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="text-main-500 font-bold text-base">
                      SILENTERA
                    </div>
                    <div className="font-bold z-30">
                      <IoMdClose
                        className="w-6 h-6 cursor-pointer hover:opacity-70 duration-150 text-main-500"
                        onClick={() => {
                          setIsCollapse(false);
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-base font-medium h-[85vh] text-slate-700 mt-8">
                    <div className="border-b pb-1">
                      <p
                        onClick={() => {
                          setIsCollapse(false);
                          navigate("/about");
                        }}
                      >
                        Tentang Silentera
                      </p>
                    </div>
                    <div className="border-b text-main-500 pb-1 mt-4">
                      <p
                        onClick={() => {
                          dispatch(setLoginPopup(true));
                          setIsCollapse(false);
                        }}
                        className="cursor-pointer"
                      >
                        Masuk
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {!isSubscribe && (
          <div
            className={`bg-[#FFD290] py-0.5 z-30 shadow-lg relative ${
              isClosedSubscribe && "hidden"
            }`}
          >
            <p className="text-[#EC5B5B] text-sm font-bold text-center z-50">
              Upgrade to full subcription!
            </p>
            <div
              className="cursor-pointer hover:opacity-50 duration-150"
              onClick={() => {
                setIsClosedSubscribe(true);
              }}
            >
              <AiOutlineCloseCircle className="text-red-500 w-4 h-4 text-xl absolute right-16 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
