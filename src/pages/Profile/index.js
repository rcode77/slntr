import { AvatarProfile } from "@hooks/AvatarProfile";
import ToastHook from "@hooks/Toast";
import { setUser } from "@redux/features/auth/authSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { failedToast, successToast } = ToastHook();

  const [userInputFormName, setUserInputFormName] = useState([]);
  const [userInputFormPassword, setUserInputFormPassword] = useState([]);

  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isSamePassword, setIsSamePassword] = useState(true);
  const [passwordLength, setPasswordLength] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (user) {
      const firstName = user.name.split("(?)")[0];
      const lastName = user.name.split("(?)")[1];

      setUserInputFormName([
        {
          title: "Nama Depan",
          value: firstName,
          required: true,
          disabled: false,
          key: "firstName",
        },
        {
          title: "Nama Belakang",
          value: lastName,
          required: true,
          disabled: false,
          key: "lastName",
        },
        {
          title: "Email",
          value: user?.email,
          required: true,
          disabled: true,
          key: "email",
        },
      ]);

      setUserInputFormPassword([
        {
          title: "Sandi Lama",
          value: "",
          required: true,
          disabled: false,
          showPassword: false,
          key: "oldPassword",
        },
        {
          title: "Sandi Baru",
          value: "",
          required: true,
          disabled: false,
          showPassword: false,
          key: "newPassword",
        },
        {
          title: "Konfirmasi Sandi Baru",
          value: "",
          required: true,
          disabled: false,
          showPassword: false,
          key: "confirmNewPassword",
        },
      ]);
    }
  }, [user]);

  const handleChangeProfile = async (e) => {
    setLoading(true);
    setPasswordLength("");
    e.preventDefault();
    const newData = {};

    userInputFormName.forEach((inp) => {
      newData[inp.key] = inp.value;
    });
    userInputFormPassword.forEach((inp) => {
      newData[inp.key] = inp.value;
    });

    if (newData.newPassword.length < 6) {
      setPasswordLength("Kata sandi minimal 6 karakter");
      setLoading(false);
      return;
    } else if (newData.newPassword !== newData.confirmNewPassword) {
      setIsSamePassword(false);
      setLoading(false);
      return;
    } else if (newData.oldPassword === newData.newPassword) {
      failedToast(`Sandi baru tidak boleh sama dengan sandi lama`);
      setLoading(false);
      return;
    } else {
      setIsSamePassword(true);

      const body = isChangePassword
        ? {
            name: `${newData.firstName}(?)${newData.lastName}`,
            password: newData.newPassword,
          }
        : {
            name: `${newData.firstName}(?)${newData.lastName}`,
          };

      // Chnage Profile Picture
      if (isChangePassword) {
        try {
          await axios.post(
            `${process.env.REACT_APP_URL_API}/login`,
            {
              email: user.email,
              password: newData.oldPassword,
            },
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          imageUrl && setLoadingImage(true);
          try {
            await axios.post(
              `${process.env.REACT_APP_URL_API}/user/upload`,
              {
                source: `${
                  imageUrl ? imageUrl.id : user.imgUrl ? user.imgUrl : "null"
                }`,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setLoadingImage(false);

            imageUrl && successToast(`Berhasil Mengganti Avatar`);

            try {
              const { data } = await axios.post(
                `${process.env.REACT_APP_URL_API}/edituser`,
                body,
                {
                  headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const name = data.user.name.includes("(?)")
                ? data.user.name.replaceAll(" ", "").split("(?)")
                : data.user.name;
              const firstName = typeof name === "object" ? name[0] : name;
              const lastName = typeof name === "object" ? name[1] : "";

              dispatch(
                setUser({
                  login: {
                    user: {
                      ...data.user,
                      firstName: firstName,
                      lastName: lastName,
                      initialFirstName: firstName.charAt(0).toUpperCase(),
                      initialLastName: lastName.charAt(0).toUpperCase(),
                      imgUrl: data.profil_images[0].source
                        ? parseInt(data.profil_images[0].source)
                        : data.profil_images[0].source,
                    },
                    token: data.authorisation.token,
                  },
                })
              );

              setLoading(false);
              successToast(`Berhasil Update User`);
            } catch (error) {
              setLoading(false);
              console.log(error);
            }
          } catch (error) {
            setLoading(false);
            setLoadingImage(false);
            imageUrl
              ? failedToast(`Gagal Mengganti Avatar`)
              : failedToast(`Gagal Update User`);
            console.log(error);
          }
        } catch (error) {
          failedToast(`Sandi lama salah`);
          setLoading(false);
          console.log(error);
        }
      } else {
        imageUrl && setLoadingImage(true);
        try {
          await axios.post(
            `${process.env.REACT_APP_URL_API}/user/upload`,
            {
              source: `${
                imageUrl ? imageUrl.id : user.imgUrl ? user.imgUrl : "null"
              }`,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setLoadingImage(false);
          imageUrl && successToast(`Berhasil Mengganti Avatar`);

          try {
            const { data } = await axios.post(
              `${process.env.REACT_APP_URL_API}/edituser`,
              body,
              {
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const name = data.user.name.includes("(?)")
              ? data.user.name.replaceAll(" ", "").split("(?)")
              : data.user.name;
            const firstName = typeof name === "object" ? name[0] : name;
            const lastName = typeof name === "object" ? name[1] : "";

            dispatch(
              setUser({
                login: {
                  user: {
                    ...data.user,
                    firstName: firstName,
                    lastName: lastName,
                    initialFirstName: firstName.charAt(0).toUpperCase(),
                    initialLastName: lastName.charAt(0).toUpperCase(),
                    imgUrl: data.profil_images[0].source
                      ? parseInt(data.profil_images[0].source)
                      : data.profil_images[0].source,
                  },
                  token: data.authorisation.token,
                },
              })
            );

            setLoading(false);
            successToast(`Berhasil Update User`);
          } catch (error) {
            setLoading(false);
            console.log(error);
          }
        } catch (error) {
          setLoadingImage(false);
          setLoading(false);
          imageUrl
            ? failedToast(`Gagal Mengganti Avatar`)
            : failedToast(`Gagal Update User`);
          console.log(error);
        }
      }

      setImageUrl(null);
    }
  };

  console.log(passwordLength);

  const [showAvatar, setShowAvatar] = useState(false);

  return (
    <div className="px-[2%] py-4 min-h-[91vh] 2xl:container mx-auto">
      <div className="flex flex-col gap-1">
        <p className="text-3xl font-bold text-[#1F8A70]">Profil</p>
        <p className="text-sm font-bold text-[#1F8A70]">Ubah Profil Anda </p>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 bg-[#EBFFE4] min-h-[75vh] py-4 px-6 shadow border rounded">
        <div className="flex flex-col items-center">
          {/* <p className="font-bold text-2xl">Foto Profil</p> */}
          <div className="flex items-center h-full justify-center flex-col gap-1 mt-8 lg:mt-0 relative">
            <div
              className={`font-medium text-[4rem] z-10 lg:text-[7rem] w-40 h-40 lg:w-72 lg:h-72 rounded-full overflow-hidden flex items-center justify-center duration-150 text-white relative ${
                imageUrl || user?.imgUrl
                  ? "bg-[#F7FFF4] shadow"
                  : "bg-green-500"
              } ${loading || loadingImage ? "" : "cursor-pointer"}`}
              onClick={() => {
                !loading && !loadingImage && setShowAvatar(!showAvatar);
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl.source}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  {user?.imgUrl ? (
                    <img
                      src={
                        AvatarProfile.find(
                          (avatar) => avatar.id === user?.imgUrl
                        )?.source
                      }
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <p className="">
                      {" "}
                      {user?.initialFirstName}
                      {user?.initialLastName}
                    </p>
                  )}
                </div>
              )}

              {loadingImage && (
                <div className="absolute w-full h-full bg-black opacity-50 flex items-center justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin w-6 h-6" />
                </div>
              )}
            </div>
            <div
              className={`absolute bg-[#F7FFF4] z-0 shadow rounded duration-700 ${
                showAvatar
                  ? "h-96 w-16 -right-24"
                  : "h-10 w-16 right-1/2 translate-x-1/2"
              }`}
            >
              <div className="h-full relative flex items-center flex-col">
                <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-thumb-rounded overflow-x-hidden flex flex-col gap-2 py-2">
                  {AvatarProfile.map((ava, idx) => (
                    <div
                      key={idx}
                      className={`cursor-pointer hover:scale-125 duration-150 hover:bg-slate-100 rounded-full ${
                        imageUrl?.id === ava.id ||
                        (!imageUrl && user?.imgUrl === ava.id)
                          ? `bg-slate-100 scale-125`
                          : "scale-100"
                      }}`}
                      onClick={() => {
                        setImageUrl(ava);
                      }}
                    >
                      <img src={ava.source} alt="avatar" />
                    </div>
                  ))}
                </div>
                <div
                  className={`absolute -translate-y-1/2 bg-white border outline hover:outline-none outline-[#EBFFE4] w-6 h-6 flex items-center justify-center rounded-full cursor-pointer hover:text-main-500 duration-150 ${
                    showAvatar ? "-left-4 top-1/2 z-0" : "-left-2 top-1/2 -z-10"
                  }`}
                  onClick={() => {
                    setShowAvatar(false);
                  }}
                >
                  <IoIosArrowBack className="opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <form
          className="flex flex-col mt-8 lg:mt-0 justify-between"
          onSubmit={handleChangeProfile}
        >
          <div>
            <p className="font-semibold text-3xl lg:text-xl text-center lg:text-left text-slate-800">
              Informasi Anda
            </p>

            <div className="mt-6">
              <p className="font-semibold mb-2 text-slate-800">
                Ubah Nama Pengguna
              </p>
              <div className=" grid grid-cols-2 gap-2">
                {userInputFormName.map((inp, idx) => (
                  <div
                    key={idx}
                    className={`${idx === 0 || idx === 1 ? "" : "col-span-2"} `}
                  >
                    <UserInput
                      title={inp.title}
                      value={inp.value}
                      required={inp.required}
                      disabled={inp.disabled}
                      onChange={(e) => {
                        const newInput = [...userInputFormName];
                        newInput[idx].value = e.target.value;
                        setUserInputFormName(newInput);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="flex justify-between items-center">
                <p className="font-semibold mb-2 cursor-pointer hover:opacity-80 duration-150 text-slate-800">
                  Ubah Sandi Pengguna
                </p>
                <input
                  type="checkbox"
                  className=""
                  value={isChangePassword}
                  onClick={(e) => {
                    setIsChangePassword(e.target.checked);
                  }}
                />
              </label>
              <div className=" grid grid-cols-2 gap-2">
                {userInputFormPassword.map((inp, idx) => (
                  <div key={idx} className={`col-span-2 relative`}>
                    <UserInput
                      title={inp.title}
                      classNameInput={`${
                        idx === 2 &&
                        !isSamePassword &&
                        "outline-red-500 outline hover:outline-red-500/50 duration-150 hover:outline"
                      }`}
                      type="password"
                      value={inp.value}
                      required={inp.required}
                      disabled={!isChangePassword}
                      showPassword={inp.showPassword}
                      onClickShowPassword={() => {
                        const newInput = [...userInputFormPassword];
                        newInput[idx].showPassword =
                          !newInput[idx].showPassword;
                        setUserInputFormPassword(newInput);
                      }}
                      onChange={(e) => {
                        const newInput = [...userInputFormPassword];
                        newInput[idx].value = e.target.value;
                        setUserInputFormPassword(newInput);
                      }}
                    />
                    {idx === 2 && !isSamePassword && (
                      <div className="absolute -bottom-6">
                        <p className="font-medium text-red-500/80 pt-2 text-xs">
                          *Kata sandi tidak sama
                        </p>
                      </div>
                    )}
                    {passwordLength && (
                      <div className="absolute -top-0.5 right-0">
                        <p className="font-medium text-red-500/80 pt-2 text-xs">
                          *Kata sandi minimal 6 karakter
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 lg:mt-0">
            <button
              className="bg-main-500 text-white font-semibold disabled:opacity-50 px-8 py-1.5 rounded"
              disabled={loading || loadingImage}
            >
              {loading || loadingImage ? (
                <AiOutlineLoading3Quarters className="animate-spin w-6 h-6" />
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

const UserInput = ({
  title = "Title Here",
  value,
  type = "text",
  required,
  placeholder,
  classNameInput,
  classNameTitle,
  onChange,
  onClickShowPassword,
  disabled,
  showPassword,
  children,
  ...props
}) => {
  return (
    <label className="relative">
      <p className={`text-slate-500 font-semibold pb-1 ${classNameTitle}`}>
        {title}
      </p>
      <input
        className={`rounded-[10px] w-full py-2 pr-2 pl-4 lg:border disabled:text-slate-600 font-medium focus:outline focus:outline-main-500 xl:placeholder:text-base ${classNameInput}`}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        type={showPassword ? "text" : type}
        {...props}
      />

      {type === "password" && (
        <div
          className="cursor-pointer hover:opacity-50 opacity-70 duration-150 absolute right-3 bottom-1"
          onClick={onClickShowPassword}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </div>
      )}

      {children}
    </label>
  );
};
