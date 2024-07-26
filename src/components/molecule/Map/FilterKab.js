import React, { useEffect, useRef, useState } from "react";
import dataKab from "@data/datakab.json";
import {
  setLocationKab,
  setLocationFilter,
} from "@redux/features/location/locationSlice";
import { useDispatch } from "react-redux";

const FilterKab = ({ condition, setSelect }) => {
  const [center, setCenter] = useState("");
  const [dataFilter, setDataFilter] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (condition !== null) {
      let newArray = dataKab.filter((item) => {
        return condition.slice(0, 2) === item.id.slice(0, 2);
      });
      setDataFilter(newArray);
    }
  }, [condition]);

  return (
    <>
      <div className="flex flex-col gap-1 rounded shadow-lg overflow-hidden text-black/80">
        {/* <label htmlFor="provFilter">Pilih Provinsi</label> */}
        <select
          name="kabFilter"
          id="map-filter-kabupaten"
          className={`w-30 md:w-40 h-[2rem] lg:h-[2.25rem] px-3 focus:outline-none cursor-pointer`}
          onChange={(e) => {
            setSelect(e.target.value);
            dispatch(setLocationKab(e.target.value));
            dispatch(setLocationFilter(true));
          }}
        >
          <option value="" selected disabled>
            Kabupaten
          </option>

          {dataFilter?.map((item, index) => (
            <option value={item.nama} key={index} className="cursor-pointer">
              {item.nama}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default FilterKab;
