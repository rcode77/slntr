import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMapEvent,
  useMap,
  useMapEvents,
  ImageOverlay,
} from "react-leaflet";
import {
  setLocationFilter,
  setRealCoordinate,
} from "@redux/features/location/locationSlice";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as ELG from "esri-leaflet-geocoder";
import img from "@data/map.png";

import MarkerIcon from "@assets/marker.png";

import { useDispatch, useSelector } from "react-redux";
import { setLonLat } from "@redux/features/location/locationSlice";

const DetailMap = ({ zoom, center, data }) => {
  const { lonLat, location, locationFilter } = useSelector(
    (state) => state.location
  );
  const dispatch = useDispatch();

  const iconPerson = new L.Icon({
    iconUrl: MarkerIcon,
    iconAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(30, 40),
  });

  // const bounds = [
  //   [-11.5085669, 94.6030261576],
  //   [6.2182086834, 141.39385176],
  // ];

  const bounds = [
    [-11.2585669, 94.6530261576],
    [6.4582086834, 141.45385176],
  ];

  return (
    <>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: "100%", height: "100%", zIndex: 0 }}
        minZoom={5}
        attributionControl={false}
      >
        <TileLayer
          // url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=635oHCTIGdZ2lX8MtqJk"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // opacity={0.5}
          zIndex={10}
        />

        <Marker position={center} icon={iconPerson}>
          <Popup>
            <h3 className="font-bold">{data?.region}</h3>
            <div className="flex flex-col pt-2">
              <span className="m-0 pb-1">Latitude : {data?.lat}</span>
              <span className="m-0 p-0">Longitude : {data?.lon}</span>
            </div>
          </Popup>
        </Marker>

        <ImageOverlay
          url={img} // Provide the path to your TIFF file
          bounds={bounds} // Set the bounds of the TIFF map data
          opacity={0.5} // Adjust the opacity of the overlay
        />
      </MapContainer>
    </>
  );
};

export default DetailMap;
