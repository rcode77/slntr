import React, { useEffect, useState } from "react";

const color = [
  "#be1333",
  "#e53f10",
  "#eb7348",
  "#f0992f",
  "#f7be28",
  "#fcde32",
  "#f9ee41",
  "#f9fa53",
  "#e1f67d",
  "#bff1a5",
];

const colorRange = ["red", "yellow", "green", "blue"];

const value = [3.0, 3.4, 3.8, 4.2, 4.6];

const Legend = () => {
  return (
    <>
      <div className="flex flex-col px-4 py-4 bg-white w-80 rounded-lg shadow-lg">
        <p className="font-bold text-lg pb-4 text-emerald-500">Legenda</p>
        <div className="flex w-full">
          <div className={`bg-[#bff1a5] py-3 w-5 flex flex-row`}></div>
          <div className={`bg-[#e1f57d] py-3 w-5 flex flex-row`}></div>
          <div className={`bg-[#f9fa53] py-3 w-5 flex flex-row`}></div>
          <div className={`bg-[#f9ee31] py-3 w-5 flex flex-row`}></div>
          <div className={`bg-[#fcde32] py-3 w-5 flex flex-row`}></div>
          <div className={`bg-[#f7be28] py-3 w-5 flex flex-row`}></div>
          <div className={`bg-[#f0992f] py-3 w-5 flex flex-row`}></div>
          <div className={`bg-[#eb7338] py-3 w-5 flex flex-row`}></div>
          <div className={`bg-[#e53f10] py-3 w-5 flex flex-row`}></div>
          <div className={`bg-[#be1333] py-3 w-5 flex flex-row`}></div>
          <div className={`flex text-center items-center pl-3`}>
            <p className="text-xs">kWh/m2</p>
          </div>
        </div>
        <div className="flex w-full">
          {value.map((item, index) => (
            <p key={index} className="pl-[17px] pr-1">
              {item}
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default Legend;
