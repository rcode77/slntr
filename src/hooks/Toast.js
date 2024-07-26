import { setLoadingMap } from "@redux/features/location/locationSlice";
import { setFailed, setSuccess } from "@redux/features/toast/toastSlice";
import React from "react";
import { useDispatch } from "react-redux";

const ToastHook = () => {
  const dispatch = useDispatch();

  const successToast = (message) => {
    dispatch(
      setSuccess({
        message: message,
      })
    );
    setTimeout(() => {
      dispatch(
        setSuccess({
          message: null,
        })
      );
    }, 300);
  };

  const failedToast = (message) => {
    dispatch(
      setFailed({
        message: message,
      })
    );
    setTimeout(() => {
      dispatch(
        setFailed({
          message: null,
        })
      );
    }, 300);
  };

  const changeGlobalState = (props) => {
    dispatch(setLoadingMap(props));
  };

  return {
    successToast,
    failedToast,
    changeGlobalState,
  };
};

export default ToastHook;
