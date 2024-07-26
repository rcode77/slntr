import { Fragment, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setSurveyPopup } from "@redux/features/login/loginSlice";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import ToastHook from "@hooks/Toast";
import Cookies from "js-cookie";
import { setUser } from "@redux/features/auth/authSlice";
import LoginImage from "@assets/login.svg";
import BMKG from "@assets/bmkg.png";
import LoginNew from "@assets/LoginNew.png";
import SILENTERA from "@assets/silentera.png";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SurveyModal = () => {
  const dispatch = useDispatch();
  const { surveyPopup } = useSelector((state) => state.popup);
  const { failedToast, successToast } = ToastHook();
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState({
    job: "Tidak/Belum Bekerja",
    gender: "",
    age: "< 15 Tahun",
    message: "",
  });

  const gender = [
    {
      id: "survey-checkbox-laki-laki",
      value: "Laki-laki",
    },
    {
      id: "survey-checkbox-perempuan",
      value: "Perempuan",
    },
  ];

  const umur = [
    "< 15 Tahun",
    "16 - 25 Tahun",
    "26 - 35 Tahun",
    "36 - 59 Tahun",
    "> 60 Tahun",
  ];

  const selectPekerjaan = [
    "Tidak/Belum Bekerja",
    "Pelajar/Mahasiswa",
    "Pegawai Negeri Sipil",
    "Tentara Nasional Indonesia",
    "Kepolisian RI",
    "Karyawan Honorer",
    "Karyawan BUMN",
    "Karyawan BUMD",
    "Pensiunan",
    "Petani/Pekebun",
    "Peternak",
    "Nelayan",
    "Sektor Konstruksi",
    "Sektor Pertanian/Perkebunan",
    "Sektor Industri",
    "Sektor Kesehatan",
    "Sektor Pendidikan",
    "Sektor Energi",
    "Peneliti",
    "Guru/Dosen",
    "Konsultan",
    "Dokter/Tenaga Medis",
    "Wartawan",
    "Pengacara/Notaris",
    "Penyiar TV/Radio",
    "Wiraswasta",
    "Arsitek",
    "Seniman",
    "Mekanik",
    "Pemuka Agama",
    "Sistem Analisis",
    "Disainer",
    "Musisi",
    "Mengurus Rumah Tangga",
    "Programmer",
    "Agen Travel",
    "Agen Property",
    "Buruh",
    "Sopir",
    "Petugas Kebersihan",
    "Juru Masak",
    "Event Organizer",
    "Penulis",
    "Blogger",
    "Pembuat Konten",
    "Apoteker",
    "Psikiater",
    "Bidan/Perawat",
  ];

  const submitSurvey = async (e) => {
    e?.preventDefault();

    if (inputValue.gender === "") {
      failedToast("Jenis Kelamin tidak boleh kosong");
    } else if (inputValue.message === "") {
      failedToast("Informasi tidak boleh kosong");
    } else {
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_URL_API}/survey`,
          {
            pekerjaan: inputValue.job,
            jenis_kelamin: inputValue.gender,
            umur: inputValue.age,
            informasi: inputValue.message,
          },
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        successToast("Survey Terkirim");
        Cookies.set("survey", "done");
        dispatch(setSurveyPopup(false));
      } catch (error) {
        console.log(error);
        failedToast("Survey Gagal Dikirim");
      }
    }
  };

  return (
    <Transition appear show={surveyPopup} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          dispatch(setSurveyPopup(false));
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
                className={`text-xs lg:text-base py-4 md:py-0 w-[60vh] transform overflow-hidden rounded-xl xl:rounded-xl bg-[#f8f8f8] text-left align-middle shadow-xl transition-all`}
              >
                <div className={``} id="modal-survey-pengguna">
                  <div className="h-full w-full py-7 px-7">
                    <p className="text-3xl font-extrabold pb-7 ">
                      Survey Pengguna
                    </p>

                    <div className="bg-white py-4 px-7 rounded-xl">
                      <p className="font-semibold py-2">Pekerjaan</p>
                      <select
                        id="survey-select-pekerjaan"
                        className="border-slate-300 border w-full py-2 px-5 rounded-lg  focus:border-green-600 focus:border-2"
                        required
                        onChange={(e) =>
                          setInputValue({
                            ...inputValue,
                            job: e.target.value,
                          })
                        }
                      >
                        {selectPekerjaan.map((pekerjaan, index) => (
                          <option
                            key={index}
                            value={pekerjaan}
                            className="hover:bg-green-200"
                          >
                            {pekerjaan}
                          </option>
                        ))}
                      </select>

                      <p className="font-semibold pt-3">Jenis Kelamin</p>
                      <div className="flex items-center gap-3 h-10">
                        {gender.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 h-10"
                          >
                            <input
                              id={item.id}
                              name="gender"
                              type="radio"
                              value={item.value}
                              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 checked:ring-green-500 checked:border-green-500 rounded checked:bg-green-600"
                              onChange={(e) =>
                                setInputValue({
                                  ...inputValue,
                                  gender: e.target.value,
                                })
                              }
                            />
                            <label
                              key={index}
                              htmlFor="gender"
                              className=" text-gray-900"
                            >
                              {item.value}
                            </label>
                          </div>
                        ))}
                      </div>

                      <p className="font-semibold py-2">Umur</p>
                      <select
                        id="survey-select-umur"
                        required
                        className="border-slate-300 border w-full py-2 px-5 rounded-lg focus:border-green-600 focus:border-2"
                        onChange={(e) =>
                          setInputValue({
                            ...inputValue,
                            age: e.target.value,
                          })
                        }
                      >
                        {umur.map((umur, index) => (
                          <option
                            key={index}
                            value={umur}
                            className="hover:text-green-200"
                          >
                            {umur}
                          </option>
                        ))}
                      </select>

                      <p className="font-semibold pt-4">Informasi Energi</p>
                      <div className="pt-4">
                        <textarea
                          id="survey-textarea-informasi"
                          rows={3}
                          className="rounded-lg py-2 px-3 resize-none w-full border-slate-300 border focus:text-black text-black focus:border-green-600 focus:border-2"
                          placeholder="Pesan"
                          onChange={(e) =>
                            setInputValue({
                              ...inputValue,
                              message: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 w-full justify-end pt-5">
                      <button
                        id="survey-button-lewati"
                        className="text-black w-[50%] font-semibold hover:opacity-60 bg-transparent px-8 py-2 rounded-md duration-150"
                        onClick={() => {
                          dispatch(setSurveyPopup(false));
                        }}
                      >
                        Lewati
                      </button>
                      <button
                        id="survey-button-kirim"
                        className="bg-green-600 w-[50%] font-semibold text-white border border-transparent hover:opacity-60 px-8 py-2 rounded-md duration-150"
                        onClick={submitSurvey}
                      >
                        Kirim
                      </button>
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

export default SurveyModal;
