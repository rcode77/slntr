import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Toast = ({ message }) => {
  const { success, failed } = useSelector((state) => state.toast);
  const notifySuccess = () =>
    toast.success(success, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  const notifyFailed = () =>
    toast.error(failed, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  useEffect(() => {
    if (success || message?.includes("Success")) {
      notifySuccess();
    }
    if (failed || message?.includes("Error")) {
      notifyFailed();
    }
  }, [success, failed, message]);
  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default Toast;
