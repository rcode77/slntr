import React, { useState } from "react";
import { BiPhoneCall } from "react-icons/bi";
import { FiFacebook } from "react-icons/fi";
import { CiTwitter } from "react-icons/ci";
import { AiFillTwitterCircle, AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsFacebook, BsYoutube, BsInstagram } from "react-icons/bs";
import { TbPhoneCall } from "react-icons/tb";
import ToastHook from "@hooks/Toast";

const Footer = () => {
  const [loadingMessage, setLoadingMessage] = useState(false);
  const { failedToast, successToast } = ToastHook();

  const [input, setInput] = useState({
    email: "",
    pesan: "",
  });

  const submitMessage = () => {
    setLoadingMessage(true);

    setTimeout(() => {
      setInput({ email: "", pesan: "" });
      successToast(`Pesan Terkirim`);
      setLoadingMessage(false);
    }, 2000);
  };

  return (
    <footer className="bg-[#1F8A70] text-white py-12">
      <div className="flex xs:flex-wrap gap-2 justify-around px-6">
        {/* Contact */}
        <div className="gap-2 xs:w-full xl:w-[20%]">
          <p className="font-semibold xs:text-2xl md:text-3xl">KONTAK KAMI</p>
          <p className="text-lg text-white/80 pt-8">
            Kedeputian Bidang Klimatologi
          </p>
          <p className="text-lg text-white/80">Gedung B – Kantor BMKG Pusat</p>
          <p className="text-lg text-white/80">
            Jl. Angkasa I No.2, Kemayoran, Jakarta Pusat
          </p>
        </div>

        <div className="xs:w-full xl:w-[20%] xs:pt-7 xs:pb-10 xl:pt-0">
          {/* Call Center */}
          <div className="gap-2">
            <p className="font-semibold xs:text-xl md:text-2xl pb-3">
              CALL CENTER
            </p>
            <div className="gap-2 items-center flex">
              <TbPhoneCall className="text-3xl" />
              <p className="text-xl font-semibold">196</p>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex-row pt-4">
            <p className="font-semibold xs:text-xl md:text-2xl py-3">
              MEDIA SOSIAL
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/InfoBMKG/" target="_blank">
                <BsFacebook className="text-2xl" />
              </a>
              <a href="https://twitter.com/infoBMKG" target="_blank">
                <AiFillTwitterCircle className="text-[1.8rem]" />
              </a>
              <a href="https://www.youtube.com/user/infoBMKG" target="_blank">
                <BsYoutube className="text-2xl" />
              </a>
              <a href="https://www.instagram.com/infoBMKG/" target="_blank">
                <BsInstagram className="text-2xl pl-[2px]" />
              </a>
            </div>
          </div>
        </div>

        <div className="xs:w-full xl:w-[20%] float-right">
          {/* Email */}
          <div className="gap-2">
            <input
              className="focus:text-black text-black rounded-lg py-2 px-3 w-full"
              placeholder="*Email"
              required
              value={input.email}
              onChange={(e) => {
                setInput({
                  ...input,
                  email: e.target.value,
                });
              }}
            />
          </div>

          {/* Pesan */}
          <div className="pt-4">
            <textarea
              rows={3}
              className="rounded-lg py-2 px-3 resize-none w-full focus:text-black text-black"
              placeholder="Pesan"
              required
              value={input.pesan}
              onChange={(e) => {
                setInput({
                  ...input,
                  pesan: e.target.value,
                });
              }}
            />
          </div>

          <div className="pt-2">
            <button
              className="bg-[#00672E] font-semibold rounded-lg w-full p-2 flex justify-center items-center"
              onClick={() => submitMessage()}
            >
              {loadingMessage ? (
                <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
              ) : (
                "Hubungi Kami"
              )}
            </button>
          </div>
        </div>
      </div>
      {/* <center>
        <p className="pt-7 text-xl font-semibold">&copy; Copyright 2023</p>
      </center> */}
    </footer>
  );
};

export default Footer;
