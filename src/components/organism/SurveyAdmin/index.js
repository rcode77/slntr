import { useState, useEffect, Fragment } from "react";
import { TablePagination } from "@components/organism/Table";
import axios from "axios";
import ToastHook from "@hooks/Toast";
import { useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { formatDate, formatTime } from "node-format-date";

export default function SurveyAdmin() {
  const [users, setUsers] = useState([]);
  const [data, setData] = useState({
    id: "",
    name: "",
  });
  const [idDetail, setIdDetail] = useState({
    created_at: "",
    pekerjaan: "",
    jenis_kelamin: "",
    umur: "",
    informasi: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const { successToast, failedToast } = ToastHook();
  const { token } = useSelector((state) => state.auth);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  const column = [
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Tanggal</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row?.created_at !== null ? formatDate(row.created_at) : "-"}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">
          Pekerjaan
        </p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row?.pekerjaan}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">
          Jenis Kelamin
        </p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row?.jenis_kelamin}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Umur</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row?.umur}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">
          Informasi
        </p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row?.informasi?.length > 20
            ? row.informasi.slice(0, 20) + "..."
            : row.informasi}
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
            className="bg-green-600 px-5 py-1 rounded-md hover:opacity-50"
            onClick={() => {
              setIdDetail(row);
              setIsOpen(true);
            }}
          >
            Lihat Detail
          </button>
          <ShowMore data={idDetail} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      ),
    },
  ];

  const getUsersData = async () => {
    try {
      axios
        .get(process.env.REACT_APP_URL_API + "/survey", config)
        .then(({ data }) => {
          setUsers(data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const delUser = async () => {
    try {
      axios
        .delete(process.env.REACT_APP_URL_API + "/delete/users/" + data.id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setData({
            id: "",
            name: "",
          });
          getUsersData();
          setIsOpen(false);
          successToast("Berhasil menghapus data survey");
        });
    } catch (error) {
      console.log(error);
      setData({
        id: "",
        name: "",
      });
      failedToast("Gagal menghapus data survey");
    }
  };

  const downloadSurvey = async () => {
    const url = `${process.env.REACT_APP_URL_API}/survey/csv`;

    let status = null;

    fetch(url, {
      headers: {
        "Content-Disposition": "attachment",
      },
    })
      .then((response) => {
        status = response.status;
        return response.blob();
      })
      .then((blob) => {
        if (status === 200) {
          const anchor = document.createElement("a");
          anchor.href = URL.createObjectURL(blob);
          anchor.download = `survey.csv`;

          anchor.click();

          URL.revokeObjectURL(anchor.href);
          successToast("Berhasil mengunduh data survey");
        } else {
          failedToast("Gagal mengunduh data survey");
        }
      })
      .catch((error) => {
        console.error("Error downloading the file:", error);
      })
      .finally(() => {
        //  setLoadingDownloadPdf(false);
      });
  };

  useEffect(() => {
    getUsersData();
  }, []);

  return (
    <div className="2xl:mt-8">
      <div className="flex justify-between">
        <h1 className="font-semibold text-4xl pb-6">Survey Pengunjung</h1>
        <div>
          <button
            className="rounded-lg px-8 py-2 text-white bg-[#00672E] hover:opacity-60"
            onClick={() => downloadSurvey()}
          >
            Unduh Data
          </button>
        </div>
      </div>

      <TablePagination items={users} column={column} ItemsPerPage={10} />
    </div>
  );
}

const ShowMore = ({ data, isOpen, setIsOpen }) => {
  return (
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
          <div className="fixed inset-0 bg-black bg-opacity-10" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-sm transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Detail Survey
                </Dialog.Title>
                <div className="mt-2 flex">
                  <p className="text-sm text-black w-[30%]">Tanggal</p>
                  <p className="text-sm text-black w-[70%]">
                    {`: ${formatDate(data?.created_at)}. ${formatTime(
                      data?.created_at
                    )} WIB`}
                  </p>
                </div>

                <div className="mt-2 flex">
                  <p className="text-sm text-black w-[30%]">Pekerjaan</p>
                  <p className="text-sm text-black w-[70%]">
                    {`: ${data?.pekerjaan}`}
                  </p>
                </div>

                <div className="mt-2 flex">
                  <p className="text-sm text-black w-[30%]">Jenis Kelamin</p>
                  <p className="text-sm text-black w-[70%]">
                    {`: ${data?.jenis_kelamin}`}
                  </p>
                </div>

                <div className="mt-2 flex">
                  <p className="text-sm text-black w-[30%]">Umur</p>
                  <p className="text-sm text-black w-[70%]">
                    {`: ${data?.umur}`}
                  </p>
                </div>

                <div className="mt-2 flex">
                  <p className="text-sm text-black w-[30%]">Informasi</p>
                  <p className="text-sm text-black w-[70%]">
                    {`: ${data?.informasi}`}
                  </p>
                </div>

                <div className="mt-4 flex justify-end gap-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Tutup
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
