import { useState, useEffect, Fragment } from "react";
import { TablePagination } from "@components/organism/Table";
import { formatFullDate } from "node-format-date";
import axios from "axios";
import ToastHook from "@hooks/Toast";
import { useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [data, setData] = useState({
    id: "",
    name: "",
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
        <p className="2xl:text-lg xl:text-sm font-medium text-black">
          Nama Lengkap
        </p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row.name}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Email</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row.email}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">
          Tanggal Bergabung
        </p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {formatFullDate(row.created_at)}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Role</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row.status === "Admin" ? "Admin" : "Pelanggan"}
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
            className="bg-red-500 px-5 py-1 rounded-md"
            onClick={() => {
              setData({
                id: row.uuid,
                name: row.name,
              });
              setIsOpen(true);
            }}
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  const getUsersData = async () => {
    try {
      axios
        .get(process.env.REACT_APP_URL_API + "/users", config)
        .then(({ data }) => {
          setUsers(
            data.map((user) => ({
              ...user,
              name: user.name.includes("(?)")
                ? user.name.replace("(?)", " ")
                : user.name,
            }))
          );
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
          successToast("Berhasil menghapus data pengguna");
        });
    } catch (error) {
      console.log(error);
      setData({
        id: "",
        name: "",
      });
      failedToast("Gagal menghapus data pengguna");
    }
  };

  const downloadUser = async () => {
    const url = `${process.env.REACT_APP_URL_API}/usercsv`;

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
          anchor.download = `user.csv`;

          anchor.click();

          URL.revokeObjectURL(anchor.href);
          successToast("Berhasil mengunduh data pengguna");
        } else {
          failedToast("Gagal mengunduh data pengguna");
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
        <h1 className="font-semibold text-4xl pb-6">Daftar Pengguna</h1>
        <div>
          <button
            className="rounded-lg px-8 py-2 text-white bg-[#00672E] hover:opacity-60"
            onClick={() => downloadUser()}
          >
            Unduh Data
          </button>
        </div>
      </div>

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
                      Apa Anda yakin akan menghapus pengguna <b>{data.name}</b>?
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
                      onClick={delUser}
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

      <TablePagination items={users} column={column} ItemsPerPage={10} />
    </div>
  );
}
