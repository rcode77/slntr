import React, { useEffect, useRef, useState } from "react";
import dataProv from "@data/dataprov.json";
import {
  setLocationProv,
  setUtcProv,
} from "@redux/features/location/locationSlice";
import { useDispatch } from "react-redux";

const Filter = ({ setSelect }) => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="flex flex-col gap-1 rounded shadow-lg overflow-hidden text-black/80">
        {/* <label htmlFor="provFilter">Pilih Provinsi</label> */}
        <select
          name="provFilter"
          id="map-filter-provinsi"
          className={`w-24 lg:w-40 h-[2rem] lg:h-[2.25rem] rounded-md px-3 focus:outline-none cursor-pointer`}
          onChange={(e) => {
            dispatch(setLocationProv(e.target.value.split(",")[1]));
            dispatch(setUtcProv(e.target.value.split(",")[2]));
            setSelect(e.target.value);
          }}
        >
          <option value="" selected disabled>
            Provinsi
          </option>

          {dataProv?.map((item, index) => (
            <option
              value={[item.id, item.nama, item.utc]}
              key={index}
              className="cursor-pointer"
            >
              {item.nama}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Filter;
