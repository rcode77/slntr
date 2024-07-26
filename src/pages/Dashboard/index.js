import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@redux/features/auth/authSlice";

// component
import Sidebar from "@components/organism/Sidebar";
import NavbarAdmin from "@components/organism/NavbarAdmin";
import { TablePagination } from "@components/organism/Table";
import { Upload } from "@components/organism/Upload";
import ManageUser from "@components/organism/ManageUser";
import History from "@components/organism/History";
import ToastHook from "@hooks/Toast";
import { Dialog, Transition } from "@headlessui/react";
import "./Dashboard.module.css";
import SurveyAdmin from "@components/organism/SurveyAdmin";

export default function Dashboard() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("Dashboard");
  const [upload, setUpload] = useState(false);
  const [dataHistory, setDataHistory] = useState([]);
  const [dataForecast, setDataForecast] = useState([]);
  const [isPrakiraan, setIsPrakiraan] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [prepData, setPrepData] = useState({
    bulan: "00",
    jenis: "",
    tahun: "00",
    tanggal: "00",
    typename: "",
  });
  const [isHistory, setIsHistory] = useState(true);

  const [typeSet, setTypeSet] = useState("");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const { successToast, failedToast } = ToastHook();

  const column = [
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Nama</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row.name}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Tipe</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row.type}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Ukuran</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row.size}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">
          Kesehatan
        </p>
      ),
      selector: (row) => (
        <div
          className={`2xl:text-lg xl:text-xs font-normal ${
            row.health === "green" && "text-green-500"
          } ${row.health === "yellow" && "text-yellow-500"} ${
            row.health === "red" && "text-red-500"
          }`}
        >
          {row.health === "green" && "Sehat"}{" "}
          {row.health === "yellow" && "Siaga"}
          {row.health === "red" && "Kritis"}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Status</p>
      ),
      selector: (row) => (
        <div
          className={
            row.status !== "Success"
              ? "2xl:text-lg xl:text-xs font-normal text-yellow-500"
              : "2xl:text-lg xl:text-xs font-normal text-green-500"
          }
        >
          {row.status === "Success" ? "Success" : "Pending"}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Aksi</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-white">
          <button
            className="bg-red-500 w-[5rem] rounded-md"
            onClick={() => {
              setIsOpen(true);
              setIsHistory(true);
              setPrepData({
                bulan: "00",
                jenis:
                  row.type === "Bulanan"
                    ? "historis-bulanan"
                    : "historis-tahunan",
                tahun: "00",
                tanggal: "00",
                typename: row.name,
              });
            }}
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  const columnPrakiraan = [
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Nama</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row.name}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Tipe</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row.type}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Ukuran</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row.size}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Tanggal</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row.time}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">
          Kesehatan
        </p>
      ),
      selector: (row) => (
        <div
          className={`2xl:text-lg xl:text-xs font-normal ${
            row.health === "green" && "text-green-500"
          } ${row.health === "yellow" && "text-yellow-500"} ${
            row.health === "red" && "text-red-500"
          }`}
        >
          {row.health === "green" && "Sehat"}
          {row.health === "yellow" && "Siaga"}
          {row.health === "red" && "Kritis"}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Status</p>
      ),
      selector: (row) => (
        <div
          className={
            row.status !== "Success"
              ? "2xl:text-lg xl:text-xs font-normal text-yellow-500"
              : "2xl:text-lg xl:text-xs font-normal text-green-500"
          }
        >
          {row.status === "Success" ? "Success" : "Pending"}
        </div>
      ),
    },
    // {
    //   name: (
    //     <p className="2xl:text-lg xl:text-sm font-medium text-black">Aksi</p>
    //   ),
    //   selector: (row) => (
    //     <div className="2xl:text-lg xl:text-xs font-normal text-white">
    //       <button
    //         className="bg-red-500 w-[5rem] rounded-md"
    //         onClick={() => {
    //           setIsOpen(true);
    //           setIsHistory(false);
    //           setPrepData({
    //             bulan: row.bulan,
    //             jenis: "prakiraan",
    //             tahun: row.tahun,
    //             tanggal: row.tanggal,
    //             typename: row.name,
    //           });
    //         }}
    //       >
    //         Hapus
    //       </button>
    //     </div>
    //   ),
    // },
  ];

  const delHistory = async () => {
    try {
      await axios
        .delete(process.env.REACT_APP_URL_API + "/deleteindex", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: prepData,
        })
        .then((data) => {
          getHistoryBulanan().then(() => getHistoryTahunan());
          setIsOpen(false);
          setPrepData({
            bulan: "00",
            jenis: "",
            tahun: "00",
            tanggal: "00",
            typename: "",
          });
          successToast("Sukses menghapus histori data");
        });
    } catch (error) {
      console.log(error);
      failedToast("Gagal menghapus histori data");
    }
  };

  const delForecast = async () => {
    try {
      await axios
        .delete(process.env.REACT_APP_URL_API + "/deleteindex", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: prepData,
        })
        .then((data) => {
          getForecast();
          setIsOpen(false);
          setPrepData({
            bulan: "00",
            jenis: "",
            tahun: "00",
            tanggal: "00",
            typename: "",
          });
          successToast("Sukses menghapus data prakiraan");
        });
    } catch (error) {
      console.log(error);
      failedToast("Gagal menghapus data prakiraan");
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    user?.status !== "Admin" && navigate("/");
  }, []);

  const getHistoryBulanan = async () => {
    try {
      await axios
        .get(process.env.REACT_APP_URL_API + "/historis-bulanan", config)
        .then((data) => {
          setDataHistory(
            data.data.map((item) => ({
              name: item.typename,
              size: item.size,
              health: item.health,
              status: item.status,
              type: "Bulanan",
            }))
          );
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getHistoryTahunan = async () => {
    try {
      await axios
        .get(process.env.REACT_APP_URL_API + "/historis-tahunan", config)
        .then((data) => {
          setDataHistory((prev) => [
            ...prev,
            ...data.data.map((item) => ({
              name: item.typename,
              size: item.size,
              health: item.health,
              status: item.status,
              type: "Tahunan",
            })),
          ]);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getHistoryTahunanFilter = async () => {
    try {
      await axios
        .get(process.env.REACT_APP_URL_API + "/historis-tahunan", config)
        .then((data) => {
          setDataHistory(
            data.data.map((item) => ({
              name: item.typename,
              size: item.size,
              health: item.health,
              status: item.status,
              type: "Tahunan",
            }))
          );
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getForecast = async () => {
    try {
      await axios
        .get(process.env.REACT_APP_URL_API + "/prakiraan", config)
        .then((data) => {
          setDataForecast(
            data.data.map((item) => ({
              name: item.typename,
              size: item.size,
              health: item.health,
              status: item.status,
              type: item.jenis,
              time: item.tanggal + "-" + item.bulan + "-" + item.tahun,
            }))
          );
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (title !== "Dashboard / tambah data") {
      setUpload(false);
    }
  }, [title]);

  useEffect(() => {
    getHistoryBulanan();
    getHistoryTahunan();
    getForecast();
  }, []);

  useEffect(() => {
    if (typeSet === "Bulanan") {
      setDataHistory([]);
      getHistoryBulanan();
    } else if (typeSet === "Tahunan") {
      setDataHistory([]);
      getHistoryTahunanFilter();
    } else if (typeSet === "Netral") {
      setDataHistory([]);
      getHistoryBulanan().then(() => getHistoryTahunan());
    }
  }, [typeSet]);

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

  return (
    <div className="h-full w-[100vw] flex flex-row bg-[#F7FFF4] box-border">
      <Sidebar setTitle={setTitle} title={title} />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Peringatan
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Apa Anda yakin akan menghapus <b>{prepData.typename}</b>?
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={isHistory ? delHistory : delForecast}
                    >
                      Hapus
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="h-[100vh] w-[82.5vw] xl:px-6 xl:py-3 2xl:px-6 2xl:pb-8 2xl:pt-5 fixed top-0 right-0 bg-[#F7FFF4] overflow-auto">
        <NavbarAdmin title={title} />

        <div className="min-h-[67.55vh]">
          {upload && (
            <Upload
              isPrakiraan={isPrakiraan}
              close={() => setTitle("Dashboard")}
            />
          )}

          {!upload && title.includes("Dashboard") && (
            <>
              <div className="flex items-center justify-between 2xl:mt-8">
                <h1
                  className="font-semibold text-4xl py-3 m-0"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  Data Historis
                </h1>
                <div className="flex items-center gap-3">
                  <select
                    className="bg-[#ffffff00] border-b border-slate-500"
                    onChange={(e) => setTypeSet(e.target.value)}
                    defaultValue="Netral"
                  >
                    <option value="Netral">Filter Type</option>
                    <option value="Netral">Semua</option>
                    <option value="Bulanan">Bulanan</option>
                    <option value="Tahunan">Tahunan</option>
                  </select>

                  <button
                    className="rounded-lg px-8 py-2 text-sm text-white bg-[#00672E] hover:opacity-60"
                    onClick={() => {
                      setUpload(true);
                      setIsPrakiraan(false);
                      setTitle("Dashboard / tambah data");
                    }}
                  >
                    Tambah Data
                  </button>
                </div>
              </div>
              <TablePagination
                items={dataHistory}
                column={column}
                ItemsPerPage={5}
              />

              <div className="flex items-center justify-between 2xl:mt-8">
                <h1 className="font-semibold text-4xl py-3">Data Prakiraan</h1>
                <button
                  className="rounded-lg px-8 py-2 text-sm text-white bg-[#00672E] hover:opacity-60"
                  onClick={() => {
                    setUpload(true);
                    setIsPrakiraan(true);
                    setTitle("Dashboard / tambah data");
                  }}
                >
                  Tambah Data
                </button>
              </div>
              <TablePagination
                items={dataForecast}
                column={columnPrakiraan}
                ItemsPerPage={5}
              />
            </>
          )}

          {title === "Kelola User" && <ManageUser />}

          {title === "Riwayat" && <History />}

          {title === "Survey" && <SurveyAdmin />}
        </div>
      </div>
    </div>
  );
}
