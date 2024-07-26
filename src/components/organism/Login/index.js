import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoginPopup,
  setRegisterPopup,
} from "@redux/features/login/loginSlice";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import ToastHook from "@hooks/Toast";
import { setUser } from "@redux/features/auth/authSlice";
import LoginImage from "@assets/login.svg";
import BMKG from "@assets/bmkg.png";
import LoginNew from "@assets/LoginNew.png";
import SILENTERA from "@assets/silentera.png";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoginModal = () => {
  const dispatch = useDispatch();
  const { loginPopup, registerPopup } = useSelector((state) => state.popup);
  const { failedToast, successToast } = ToastHook();
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isReShowPassword, setIsReShowPassword] = useState(false);
  const [inputLoginValue, setInputLoginValue] = useState({
    email: "",
    password: "",
  });
  const [inputRegisterValue, setInputRegisterValue] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_URL_API}/login`,
        {
          email: inputLoginValue.email,
          password: inputLoginValue.password,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const name = data.user.name.includes("(?)")
        ? data.user.name.replaceAll(" ", "").split("(?)")
        : data.user.name;
      const firstName = typeof name === "object" ? name[0] : name;
      const lastName = typeof name === "object" ? name[1] : "";

      successToast(`Hello ${firstName}`);

      setInputLoginValue({
        email: "",
        password: "",
      });

      dispatch(
        setUser({
          login: {
            user: {
              ...data.user,
              firstName: firstName,
              lastName: lastName,
              initialFirstName: firstName.charAt(0).toUpperCase(),
              initialLastName: lastName.charAt(0).toUpperCase(),
              imgUrl: data.profil_images ? parseInt(data.profil_images) : null,
            },
            token: data.authorisation.token,
          },
        })
      );

      dispatch(setLoginPopup(false));
      dispatch(setRegisterPopup(false));

      setLoading(false);
      data?.user?.status === "Admin"
        ? navigate("/dashboard")
        : navigate("/beranda");
    } catch (error) {
      setLoading(false);
      failedToast(error ? error?.response?.data?.message : "Gagal Login");
      console.log(error);
    }
  };

  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (
      inputRegisterValue.password !== inputRegisterValue.password_confirmation
    ) {
      failedToast("Password doesn't match");
      return;
    } else {
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_URL_API}/register`,
          {
            name: `${inputRegisterValue.firstName}(?)${inputRegisterValue.lastName}`,
            email: inputRegisterValue.email,
            password: inputRegisterValue.password,
          },
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const name = data.userid.name.includes("(?)")
          ? data.userid.name.replaceAll(" ", "").split("(?)")
          : data.userid.name;
        const firstName = typeof name === "object" ? name[0] : name;
        const lastName = typeof name === "object" ? name[1] : "";

        successToast("Register Sukses");
        setTimeout(() => {
          successToast(`Hello ${firstName}`);
        }, 1000);
        dispatch(
          setUser({
            login: {
              user: {
                ...data.userid,
                firstName: firstName,
                lastName: lastName,
                initialFirstName: firstName.charAt(0).toUpperCase(),
                initialLastName: lastName.charAt(0).toUpperCase(),
              },
              token: data.authorisation.token,
            },
          })
        );
        setLoading(false);
        // dispatch(setLoginPopup(false));
        dispatch(setRegisterPopup(false));
        navigate("/beranda");
      } catch (error) {
        setLoading(false);
        failedToast(error?.response?.data?.message || "Gagal Register");
        console.log(error);
      }
    }
  };

  return (
    <Transition
      appear
      show={loginPopup ? loginPopup : registerPopup}
      as={Fragment}
    >
      <Dialog
        as="div"
        id={loginPopup ? "modal-login" : "modal-register"}
        className="relative z-10"
        onClose={() => {
          dispatch(setLoginPopup(false));
          dispatch(setRegisterPopup(false));
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`text-xs lg:text-base py-4 md:py-0 w-full xl:w-[85vw] md:max-w-[80vw] xl:max-w-[70vw] transform overflow-hidden rounded-lg xl:rounded bg-white text-left align-middle shadow-xl transition-all`}
              >
                <div
                  className={`${
                    loginPopup
                      ? "h-full md:h-[70vh] lg:h-[80vh]"
                      : "h-full md:h-[80vh] lg:h-[80vh]"
                  } `}
                >
                  <div className="grid col-span-1 md:grid-cols-2 font-poppins h-full w-full">
                    {loginPopup ? (
                      // Login Popup
                      <div className="order-2 md:order-1 flex flex-col h-full w-full justify-center px-[10%] relative">
                        <div className="flex justify-center items-center gap-2 mb-2 md:mb-8">
                          <div className="w-[36px] h-[53px] md:w-[56px] md:h-[73px]">
                            <img src={BMKG} alt="bmkg" />
                          </div>
                          <div className="w-[45%] pb-2 md:hidden">
                            <img src={SILENTERA} alt="silentera" />
                          </div>
                        </div>
                        <div className="mb-4 font-bold text-center text-main-500 text-base md:text-2xl xl:text-3xl">
                          SILENTERA
                        </div>
                        <form
                          onSubmit={handleLogin}
                          className="mt:mt-4 xl:mt-8 flex flex-col gap-4 xl:gap-6 text-xs md:text-sm"
                        >
                          <label className="relative" id="input-login-email">
                            <p className="text-slate-500 font-semibold">
                              Email
                            </p>
                            <input
                              type="email"
                              className="bg-[#F4F4F4] rounded-[10px] w-full py-2 px-4 border focus:outline-main-500"
                              placeholder="Email"
                              required
                              value={inputLoginValue.email}
                              onChange={(e) => {
                                setInputLoginValue({
                                  ...inputLoginValue,
                                  email: e.target.value,
                                });
                              }}
                            />
                            {/* <FiMail className="absolute text-slate-500 left-3 top-3" /> */}
                          </label>
                          <label className="relative" id="input-login-password">
                            <p className="text-slate-500 font-semibold">
                              Password
                            </p>
                            <input
                              className="bg-[#F4F4F4] rounded-[10px] w-full py-2 px-4 border focus:outline-main-500"
                              placeholder="Password"
                              type={isShowPassword ? "text" : "password"}
                              required
                              value={inputLoginValue.password}
                              onChange={(e) => {
                                setInputLoginValue({
                                  ...inputLoginValue,
                                  password: e.target.value,
                                });
                              }}
                            />
                            {/* <BiLock className="absolute text-slate-500 left-3 top-3" /> */}
                            <div
                              className="cursor-pointer hover:opacity-50 opacity-70 duration-150 absolute right-3 translate-y-1/4 top-1/2"
                              onClick={() => setIsShowPassword(!isShowPassword)}
                            >
                              {isShowPassword ? <FiEyeOff /> : <FiEye />}
                            </div>
                          </label>
                          <div className="flex flex-col w-full justify-center mx-auto">
                            <button
                              className="mt-2 text-xs bg-main-500 flex justify-center items-center text-white font-medium py-2 rounded-md shadow hover:opacity-80 duration-150 disabled:opacity-50"
                              disabled={loading}
                              id="btn-login-submit"
                            >
                              {loading ? (
                                <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
                              ) : (
                                "Masuk"
                              )}
                            </button>
                          </div>
                        </form>
                        <div className="text-xs flex flex-col gap-2 items-center justify-center mt-4 md:mt-8">
                          <p className="md:flex">Belum punya akun?</p>
                          <button
                            className=" text-main-500 hover:opacity-80 duration-150 w-1/2 py-2 rounded-lg disabled:opacity-50 font-semibold"
                            onClick={() => {
                              dispatch(setRegisterPopup(true));
                              dispatch(setLoginPopup(false));
                            }}
                            disabled={loading}
                            id="btn-login-register"
                          >
                            Daftar Sekarang
                          </button>
                        </div>
                      </div>
                    ) : registerPopup ? (
                      // Register Ppup
                      <div className="order-2 xl:order-1 flex flex-col h-full w-full justify-center px-[10%] relative">
                        <div className="flex justify-center items-center gap-2 mb-2 md:mb-6">
                          <div className="w-[36px] h-[53px] md:w-[56px] md:h-[73px]">
                            <img src={BMKG} alt="bmkg" />
                          </div>
                          <div className="w-[45%] pb-2 md:hidden">
                            <img src={SILENTERA} alt="silentera" />
                          </div>
                        </div>
                        <div className="mb-4 font-bold text-center text-main-500 text-base md:text-2xl xl:text-3xl">
                          SILENTERA
                        </div>
                        {/* <div>
                          <p className="font-semibold">Register new Account</p>
                          <p className="text-xs text-black/70">Welcome!</p>
                        </div> */}
                        <form
                          onSubmit={handleRegister}
                          className="md: mt-4 flex flex-col gap-2 md:gap-3 text-xs md:text-sm"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <label
                              className="relative"
                              id="input-register-firstname"
                            >
                              <p className="text-slate-500 font-semibold ">
                                Nama Depan
                              </p>
                              <input
                                className="bg-[#F4F4F4] rounded-[10px] w-full py-2 pr-2 pl-4 lg: border focus:outline-main-500 placeholder:text-xs xl:placeholder:text-base text-xs"
                                placeholder=""
                                required={true}
                                value={inputRegisterValue.firstName}
                                onChange={(e) => {
                                  setInputRegisterValue({
                                    ...inputRegisterValue,
                                    firstName: e.target.value,
                                  });
                                }}
                              />
                              {/* <BsSortAlphaDownAlt className="absolute text-slate-500 left-3 top-3" /> */}
                            </label>
                            <label
                              className="relative"
                              id="input-register-lastname"
                            >
                              <p className="text-slate-500 font-semibold ">
                                Nama Belakang
                              </p>
                              <input
                                className="bg-[#F4F4F4] rounded-[10px] w-full py-2 pr-2 pl-4 lg:text-sm border focus:outline-main-500 placeholder:text-xs xl:placeholder:text-base"
                                // placeholder="Last Name"
                                required
                                value={inputRegisterValue.lastName}
                                onChange={(e) => {
                                  setInputRegisterValue({
                                    ...inputRegisterValue,
                                    lastName: e.target.value,
                                  });
                                }}
                              />
                              {/* <BiRename className="absolute text-slate-500 left-3 top-3" /> */}
                            </label>
                          </div>
                          <label className="relative" id="input-register-email">
                            <p className="text-slate-500 font-semibold">
                              Email
                            </p>
                            <input
                              className="bg-[#F4F4F4] rounded-[10px] w-full py-2 px-4 lg:text-sm border focus:outline-main-500 placeholder:text-xs xl:placeholder:text-base"
                              placeholder="Email"
                              value={inputRegisterValue.email}
                              required
                              type="email"
                              onChange={(e) => {
                                setInputRegisterValue({
                                  ...inputRegisterValue,
                                  email: e.target.value,
                                });
                              }}
                            />
                            {/* <FiMail className="absolute text-slate-500 left-3 top-3" /> */}
                          </label>
                          <label
                            className="relative"
                            id="input-register-password"
                          >
                            <p className="text-slate-500 font-semibold">
                              Password
                            </p>
                            <input
                              className="bg-[#F4F4F4] rounded-[10px] w-full py-2 px-4 lg:text-sm border focus:outline-main-500 placeholder:text-xs xl:placeholder:text-base"
                              placeholder="Password"
                              type={isShowPassword ? "text" : "password"}
                              required
                              onChange={(e) => {
                                setInputRegisterValue({
                                  ...inputRegisterValue,
                                  password: e.target.value,
                                });
                              }}
                            />
                            {/* <BiLock className="absolute text-slate-500 left-3 top-3" /> */}
                            <div
                              className="cursor-pointer hover:opacity-50 opacity-70 duration-150 absolute right-3 top-1/2"
                              onClick={() => setIsShowPassword(!isShowPassword)}
                            >
                              {isShowPassword ? <FiEyeOff /> : <FiEye />}
                            </div>
                          </label>
                          <label
                            className="relative"
                            id="input-register-confirm-password"
                          >
                            <p className="text-slate-500 font-semibold">
                              Konfirmasi Password
                            </p>
                            <input
                              className="bg-[#F4F4F4] rounded-[10px] w-full py-2 px-4 lg:text-sm border focus:outline-main-500 placeholder:text-xs xl:placeholder:text-base"
                              placeholder="Konfirmasi Password"
                              type={isReShowPassword ? "text" : "password"}
                              required
                              onChange={(e) => {
                                setInputRegisterValue({
                                  ...inputRegisterValue,
                                  password_confirmation: e.target.value,
                                });
                              }}
                            />
                            {/* <BiLock className="absolute text-slate-500 left-3 top-3" /> */}
                            <div
                              className="cursor-pointer hover:opacity-50 opacity-70 duration-150 absolute right-3 top-1/2"
                              onClick={() =>
                                setIsReShowPassword(!isReShowPassword)
                              }
                            >
                              {isReShowPassword ? <FiEyeOff /> : <FiEye />}
                            </div>
                          </label>
                          <button
                            className="mt-2 text-xs bg-main-500 flex justify-center items-center text-white font-medium py-2 rounded-md shadow hover:opacity-80 duration-150 disabled:opacity-50"
                            disabled={loading}
                            id="btn-register-submit"
                          >
                            {loading ? (
                              <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
                            ) : (
                              "Daftar"
                            )}
                          </button>
                        </form>
                        <div
                          className="text-xs flex-col flex gap-2 items-center justify-center mt-2 lg:mt-8 disabled:opacity-50"
                          disabled={loading}
                        >
                          <p className="flex">Sudah mempunyai akun?</p>
                          <button
                            className="text-main-500 font-semibold disabled:opacity-50"
                            onClick={() => {
                              dispatch(setLoginPopup(true));
                              dispatch(setRegisterPopup(false));
                            }}
                            disabled={loading}
                            id="btn-register-login"
                          >
                            Masuk disini
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="order-2 xl:order-1 flex flex-col h-full w-full justify-center px-[10%] relative"></div>
                    )}

                    <div className="hidden md:flex order-1 md:order-2 text-center md:text-left flex-col justify-center items-center px-4 bg-[#EBFFE4] relative">
                      <div className="w-[153px] h-[49px] absolute top-4 right-4">
                        <img src={SILENTERA} alt="silentera" />
                      </div>
                      <div className="w-full flex justify-center relative">
                        <img
                          src={LoginNew}
                          alt="silentera"
                          className="z-10 w-[70%] md:w-[90%] xl:w-[70%]"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-poppins font-semibold text-center text-[#1F8A70] px-[20%] mt-10">
                          Temukan informasi dan layanan terbaru yang kami
                          sediakan. Selamat menjelajah!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LoginModal;
