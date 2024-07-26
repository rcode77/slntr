import React, { useEffect, useRef, useState } from "react";
import MapLayout from "./MapLayout";
import { useMap, MapContainer, ZoomControl, useMapEvent } from "react-leaflet";
import Filter from "@components/molecule/Map/Filter";
import FilterKab from "@components/molecule/Map/FilterKab";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineLeft } from "react-icons/ai";
import { FaAngleLeft } from "react-icons/fa";
import {
  setDefaultMap,
  setLonLat,
} from "@redux/features/location/locationSlice";

const Map = ({
  center,
  selectedLocation,
  height,
  savedLocation,
  deleteLoc,
  setDeleteLoc,
  tourLoc,
  setTourLoc,
}) => {
  // const [center, setCenter] = useState([-2.1893, 117.9213]);
  const [mid, setMid] = useState(null);
  const [selectProv, setSelectProv] = useState(null);
  const [selectKab, setSelectKab] = useState(null);
  const [zoom, setZoom] = useState(5);
  const [ghi, setGhi] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lonLat } = useSelector((state) => state.location);

  const mapRef = useRef(null);

  return (
    <>
      {lonLat !== null ? (
        <div
          id="detail-1"
          className="flex shadow-lg items-center top-4 left-10 cursor-pointer font-medium md:text-sm lg:text-base absolute z-10 bg-white m-0 rounded-lg p-3"
          onClick={() => {
            // window.location.href = "/";
            dispatch(setDefaultMap(true));
            setGhi(0);
          }}
        >
          <button>
            <FaAngleLeft className="font-extrabold text-xl" />
          </button>
        </div>
      ) : (
        <div
          id="step-2"
          className="flex gap-2 top-2 md:top-1 left-2 md:left-3 lg:top-4 lg:left-8 items-center text-xs font-medium md:text-sm lg:text-base absolute z-10"
        >
          <Filter setSelect={setSelectProv} />
          <FilterKab condition={selectProv} setSelect={setSelectKab} />
          {/* <BiSun /> */}
        </div>
      )}
      <MapContainer
        center={mid !== null ? mid : center}
        zoom={zoom}
        style={{ width: "100%", height: "100%", zIndex: 0 }}
        minZoom={5}
        // whenCreated={(map) => {
        //   mapRef.current = map;
        // }}
        ref={mapRef}
        zoomControl={false}
        attributionControl={false}
      >
        <MapLayout
          setMid={setMid}
          mid={mid}
          zoom={zoom}
          mapRef={mapRef}
          selectedLocation={selectedLocation}
          setGhi={setGhi}
          ghi={ghi}
          savedLocation={savedLocation}
          deleteLoc={deleteLoc}
          setDeleteLoc={setDeleteLoc}
          tourLoc={tourLoc}
          setTourLoc={setTourLoc}
        />
        <ZoomControl position="topright" />
      </MapContainer>
    </>
  );
};

export default Map;
