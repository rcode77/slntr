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
import MapLayouts from "./MapLayout2";

const Maps = ({ center, selectedLocation, pos }) => {
  // const [center, setCenter] = useState([-2.1893, 117.9213]);
  const [mid, setMid] = useState(null);
  const [selectProv, setSelectProv] = useState(null);
  const [selectKab, setSelectKab] = useState(null);
  const [zoom, setZoom] = useState(6);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lonLat } = useSelector((state) => state.location);

  const mapRef = useRef(null);

  return (
    <>
      <MapContainer
        center={[-2.5893, 117.9213]}
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
        <MapLayouts
          setMid={setMid}
          mid={mid}
          zoom={zoom}
          mapRef={mapRef}
          pos={pos}
        />
        <ZoomControl position="topright" />
      </MapContainer>
    </>
  );
};

export default Maps;
