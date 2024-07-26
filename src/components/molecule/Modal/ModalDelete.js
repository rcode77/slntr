import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { IoMdClose } from "react-icons/io";

const ModalDelete = ({
  isOpen,
  setIsOpen,
  className,
  children,
  isPayment,
  handleDelete,
  region,
  setDeleteClicked,
}) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setIsOpen(false);
            setDeleteClicked(null);
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
                  className={`${className} w-[400px] transform overflow-hidden rounded-md bg-white text-left align-middle shadow-xl transition-all`}
                >
                  <div className="text-sm py-4 font-poppins">
                    <div
                      className="
                    flex justify-between items-center px-4 pb-2"
                    >
                      <p className="text-base font-semibold">
                        {" "}
                        Hapus Lokasi {region}?
                      </p>
                      <div
                        className="cursor-pointer hover:text-black text-slate-600 duration-150"
                        onClick={() => {
                          setIsOpen(false);
                          setDeleteClicked(null);
                        }}
                      >
                        <IoMdClose className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="bg-[#FEECDE] border border-t-[#e88f4a] border-b-[#e88f4a]">
                      <p className="text-xs font-medium py-1.5 px-4 text-[#B9552C]">
                        Anda telah berlangganan dilokasi ini sebelumnya dengan
                        status pembayaran:{" "}
                        <span className="font-bold">{isPayment}</span>
                      </p>
                    </div>

                    <div className="pt-4 px-4 font-medium">
                      <p className="text-center">
                        Apakah Anda yakin Ingin menghapus Lokasi Ini?
                      </p>
                      <div className="flex gap-2 text-xs mt-4">
                        <button
                          className="bg-[#EF5351] text-white w-full py-2 rounded hover:opacity-60 duration-150"
                          onClick={() => {
                            handleDelete();
                          }}
                        >
                          Hapus
                        </button>
                        <button
                          className="border w-full py-2 rounded hover:border-black hover:text-slate-600 duration-150"
                          onClick={() => {
                            setIsOpen(false);
                            setDeleteClicked(null);
                          }}
                        >
                          Batal
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
    </>
  );
};

export default ModalDelete;
