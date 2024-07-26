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

const colors = [
  "bg-[#f4f346]",
  "bg-[#f4dc46]",
  "bg-[#f4c846]",
  "bg-[#f4b146]",
  "bg-[#f39d46]",
  "bg-[#f48646]",
  "bg-[#f47246]",
  "bg-[#f15943]",
  "bg-[#f44746]",
];

const value = [3.0, 3.2, 3.4, 3.6, 3.8, 4.0, 4.2, 4.4, 4.6];

const Legend2 = ({ width = "w-[250px]" }) => {
  return (
    <>
      <div
        id="map-float-legenda"
        className={`flex rounded-md shadow flex-col px-4 py-0.5  bg-[#EBFFE4] ${width}`}
      >
        <p className="text-base text-center pb-2 text-black font-medium">
          Legenda
        </p>
        <div className="flex ">
          {colors.map((color, index) => (
            <div key={index} className={`${color} py-3 w-14`}></div>
          ))}
        </div>
        <div className="flex justify-between text-xxs mt-1 font-medium">
          <p>
            3 kWh/m<sup>2</sup>
          </p>
          <p>
            5 kWh/m<sup>2</sup>
          </p>
        </div>
      </div>
    </>
  );
};

export default Legend2;
