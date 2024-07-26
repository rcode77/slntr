import { useState, useEffect, Fragment } from "react";
import { TablePagination } from "@components/organism/Table";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { formatDate } from "node-format-date";

export default function History() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const SuccessNotif = (msg) => toast.success(msg);
  const ErrorNotif = (msg) => toast.error(msg);

  const historyColumn = [
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
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Tanggal</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {formatDate(row.created_at)}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">
          Tipe Paket
        </p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row.paket} Hari
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Lokasi</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row.region}, long {row.lon}, lat {row.lat}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Status</p>
      ),
      selector: (row) => (
        <div
          className={`2xl:text-lg xl:text-xs font-normal ${
            row.status === "Cancel" && "text-[#DD2000]"
          } ${row.status === "Success" && "text-[#00AF50]"} ${
            row.status === "Pending" && "text-yellow-500"
          }`}
        >
          {row.status}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Aksi</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          <select
            defaultValue={""}
            className="bg-black text-white rounded-md px-6"
            onChange={(e) => updateStatus(e.target.value, row.id)}
          >
            <option value="">Pilih Aksi</option>
            <option value="Success">Success</option>
            <option value="Cancel">Cancel</option>
            <option value="Hapus" className="text-red-500">
              Hapus
            </option>
          </select>
        </div>
      ),
    },
  ];

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  const updateStatus = (val, id) => {
    if (val === "Cancel") {
      setCancel(id);
    } else if (val === "Success") {
      setSuccess(id);
    } else if (val === "Hapus") {
      setIsOpen(true);
      setId(id);
    }
  };

  const setSuccess = async (id) => {
    try {
      await axios
        .put(
          process.env.REACT_APP_URL_API + "/payment/" + id,
          {
            status: "Success",
          },
          config
        )
        .then((data) => {
          SuccessNotif("Sukses update status pembayaran");
          getData();
        });
    } catch (error) {
      console.log(error);
      ErrorNotif("Gagal update status pembayaran");
    }
  };

  const setCancel = async (id) => {
    try {
      await axios
        .put(
          process.env.REACT_APP_URL_API + "/payment/" + id,
          {
            status: "Cancel",
          },
          config
        )
        .then((data) => {
          SuccessNotif("Sukses update status pembayaran");
          getData();
        });
    } catch (error) {
      console.log(error);
      ErrorNotif("Gagal update status pembayaran");
    }
  };

  const delData = async () => {
    try {
      await axios
        .delete(process.env.REACT_APP_URL_API + "/payment/admin/" + id, config)
        .then((data) => {
          setIsOpen(false);
          SuccessNotif("Sukses menghapus data");
          getData();
        });
    } catch (error) {
      console.log(error);
      ErrorNotif("Gagal menghapus data");
    }
  };

  const getData = async () => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_URL_API + "/payment/all",
        config
      );

      const sortedData = data.sort((a, b) => {
        const keyA = new Date(a.created_at),
          keyB = new Date(b.created_at);

        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });

      setData(
        sortedData.map((item) => ({
          ...item,
          name: item.name.includes("(?)")
            ? item.name.replace("(?)", " ")
            : item.name,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const downloadPayment = async () => {
    const url = `${process.env.REACT_APP_URL_API}/paymentcsv`;

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
          anchor.download = `riwayat.csv`;

          anchor.click();

          URL.revokeObjectURL(anchor.href);
          SuccessNotif("Berhasil mengunduh data riwayat pembelian");
        } else {
          ErrorNotif("Gagal mengunduh data riwayat pembelian");
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
    getData();
  }, []);

  useEffect(() => {
    if (search) {
      let newData = data?.filter((val) => {
        let input = search?.toLowerCase();
        return val?.name?.toLowerCase().includes(input);
      });

      setData(newData);
    } else {
      getData();
    }
  }, [search]);

  return (
    <div className="2xl:mt-8">
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
                      Apa Anda yakin akan menghapus data?
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
                      onClick={delData}
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

      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-4xl py-3 m-0">
          Data Riwayat Pembelian
        </h1>
        <div className="flex gap-3 items-center">
          <button
            className="rounded-lg px-8 py-2 text-white bg-[#00672E] hover:opacity-60"
            onClick={() => downloadPayment()}
          >
            Unduh Data
          </button>
          <div className="group relative w-52">
            <input
              className="focus:outline-none appearance-none w-full text-sm leading-6 placeholder:italic placeholder:text-white text-white rounded-t-md py-1 px-2 shadow-sm bg-[#009571]"
              type="text"
              aria-label="Search"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />

            <svg
              width="20"
              height="20"
              fill="currentColor"
              className="absolute right-3 top-1/2 -mt-2.5 text-white pointer-events-none "
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              />
            </svg>
          </div>
        </div>
      </div>
      <ToastContainer />

      <TablePagination items={data} column={historyColumn} ItemsPerPage={12} />
    </div>
  );
}
