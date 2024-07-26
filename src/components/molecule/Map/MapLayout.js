import React, { useEffect, useState, useRef } from "react";
import {
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMapEvent,
  useMap,
  LayersControl,
  ImageOverlay,
} from "react-leaflet";
import {
  setDefaultMap,
  setLocationFilter,
  setRealCoordinate,
  setSavedLoc,
} from "@redux/features/location/locationSlice";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as ELG from "esri-leaflet-geocoder";
import Cookies from "js-cookie";
import Joyride from "react-joyride";
import img from "@data/map.png";

import "./Map.css";
import MarkerIcon from "@assets/marker.png";
import data from "@data/utcprov.json";
import kablite from "@data/kablite.json";
import averagePotent from "@data/jsonavgbulanan.json";
import output from "@data/output2.json";
// import test from "@data/kab.json";

import { useDispatch, useSelector } from "react-redux";
import { setLonLat } from "@redux/features/location/locationSlice";
import { getHistorisPotensi } from "@hooks/DataHook";
import { AverageData } from "@hooks/ManipulationData";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { setUser } from "@redux/features/auth/authSlice";

const MapLayout = ({
  mid,
  zoom,
  mapRef,
  setMid,
  selectedLocation,
  ghi,
  setGhi,
  savedLocation,
  deleteLoc,
  setDeleteLoc,
  tourLoc,
  setTourLoc,
}) => {
  const {
    locationKab,
    locationProv,
    utcProv,
    locationFilter,
    lonLat,
    savedLoc,
    defaultMap,
  } = useSelector((state) => state.location);
  const dispatch = useDispatch();
  const markerRef = useRef();
  const [mapBounds, setMapBounds] = useState(null);
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [listPayment, setListPayment] = useState([]);

  const fetchPayment = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_URL_API}/payment/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setListPayment(data);
    } catch (error) {
      console.log(error);
    }
  };

  const [selectCoord, setSelectCoord] = useState({ Lat: 0, Lon: 0 });
  const map = useMap();

  const { user, token } = useSelector((state) => state.auth);

  const location = useLocation();

  const arrayOfObj = Object.entries(averagePotent).map((e) => ({
    data: e[1],
    id: e[0],
  }));

  const iconPerson = new L.Icon({
    iconUrl: MarkerIcon,
    iconAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(35, 40),
  });

  const getColor = (d, e) => {
    return d === 0
      ? "black"
      : d >= 5
      ? "#be1333"
      : d >= 4.75 && d < 5
      ? "#e53f10"
      : d >= 4.5 && d < 4.75
      ? "#eb7348"
      : d >= 4.25 && d < 4.5
      ? "#f0992f"
      : d >= 4 && d < 4.25
      ? "#f7be28"
      : d >= 3.75 && d < 4
      ? "#fcde32"
      : d >= 3.5 && d < 3.75
      ? "#f9ee41"
      : d >= 3.25 && d < 3.5
      ? "#f9fa53"
      : d >= 3 && d < 3.25
      ? "#e1f67d"
      : "#bff1a5";
  };

  const changeColor = (layer, feature) => {
    layer.setStyle({
      weight: 0,
      opacity: 0,
      fillOpacity: 0,
    });
  };

  const changeColor2 = (layer, feature) => {
    layer.setStyle({
      weight: 0,
      opacity: 0,
      fillOpacity: 0,
      color: getColor(feature.properties.avg),
      fillColor: getColor(feature.properties.avg),
    });
  };

  const highlightFeature = (e, feature) => {
    let layer = e.target;

    layer.setStyle({
      weight: 1,
      color: "black",
      opacity: 0,
      fillOpacity: 0,
    });

    layer.bringToFront();
  };

  const resetHighlight = (e, feature) => {
    var layer = e.target;
    layer.setStyle({
      weight: 0.3,
      opacity: 1,
      fillOpacity: 0.7,
      color: getColor(feature.properties.solarPotential),
      fillColor: getColor(
        feature.properties.solarPotential,
        feature.properties.mhid
      ),
    });
    layer.bringToFront();
    // map.resetStyle(layer);
  };

  const findNearestCoordinate = (target, coordinates) => {
    let nearest = coordinates[0];
    let minDistance = calculateDistance(target, nearest);

    for (let i = 1; i < coordinates.length; i++) {
      let currentDistance = calculateDistance(target, coordinates[i]);

      if (currentDistance < minDistance) {
        nearest = coordinates[i];
        minDistance = currentDistance;
      }
    }

    return nearest;
  };

  const calculateDistance = (coord1, coord2) => {
    const lonDiff = coord1.Lon - coord2.Lon;
    const latDiff = coord1.Lat - coord2.Lat;
    return Math.sqrt(lonDiff * lonDiff + latDiff * latDiff);
  };

  // const saveMarkers2 = (e) => {
  //   ELG.reverseGeocode({
  //     url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
  //     apiKey:
  //       "AAPK007f3d10eb5540398b60e4a92054a5b1y8dg6rBWGwex2F4x7AjeoQJhWNQqZesbPgf5hlqge77cWOSDKe4rWKMZ1rdMZDiK",
  //   })
  //     .latlng(e.latlng)
  //     .run((err, results, response) => {
  //       console.log(results);
  //     });
  // };

  const saveMarkers = (e, feature) => {
    dispatch(setRealCoordinate([e?.latlng.lat, e?.latlng.lng]));

    getHistorisPotensi(e?.latlng.lat, e?.latlng.lng).then((res) =>
      setGhi(AverageData(res.data[0].data))
    );

    // setGhi(feature?.properties.avg);

    map.flyTo(e.latlng, 7, {
      animate: true,
    });

    let coord = {
      Lat: parseFloat(e.latlng.lat.toFixed(1)),
      Lon: parseFloat(e.latlng.lng.toFixed(1)),
    };

    const nearestCoordinate = findNearestCoordinate(coord, data);

    dispatch(
      setLonLat({
        KABUPATEN: !nearestCoordinate.KABUPATEN.includes("KOTA ")
          ? `KABUPATEN ${nearestCoordinate.KABUPATEN}`
          : `${nearestCoordinate.KABUPATEN}`,
        PROVINSI: nearestCoordinate.PROVINSI,
        Lat: e.latlng.lat,
        Lon: e.latlng.lng,
        UTC: nearestCoordinate.UTC,
      })
    );
    setSelectCoord({
      KABUPATEN: !nearestCoordinate.KABUPATEN.includes("KOTA ")
        ? `KABUPATEN ${nearestCoordinate.KABUPATEN}`
        : `${nearestCoordinate.KABUPATEN}`,
      PROVINSI: nearestCoordinate.PROVINSI,
      Lat: e.latlng.lat,
      Lon: e.latlng.lng,
      UTC: nearestCoordinate.UTC,
    });
    Cookies.set("coordinate", [e?.latlng.lat, e?.latlng.lng]);
    setMid([e?.latlng.lat, e?.latlng.lng]);

    // markerRef?.current?.openPopup();
  };

  useEffect(() => {
    if (markerRef) markerRef?.current?.openPopup();
  });

  // const onEachFeature = (feature, layer) => {
  //   layer.on({
  //     mouseover: (e) => {
  //       // highlightFeature(e, feature);
  //       // layer
  //       //   .bindTooltip(
  //       //     `<div><strong className="font-bold">
  //       //         ${feature?.properties.PROVINSI}, ${feature?.properties.KABKOT}
  //       //       </strong>
  //       //       <div className="flex flex-col pt-2">
  //       //         <span className="m-0 pb-1">Latitude : ${parseFloat(
  //       //           e?.latlng.lat.toFixed(1)
  //       //         )}</span>
  //       //         <span className="m-0 p-0">Longitude : ${parseFloat(
  //       //           e?.latlng.lng.toFixed(1)
  //       //         )}</span>
  //       //         <span className="m-0 p-0">GHI : ${ghi}
  //       //         </span>
  //       //       </div></div>`,
  //       //     {
  //       //       direction: "top",
  //       //       permanent: false,
  //       //       sticky: true,
  //       //       offset: [10, 0],
  //       //       className: "custom-tooltip",
  //       //     }
  //       //   )
  //       //   .openTooltip();
  //     },
  //     mouseout: (e) => {
  //       // resetHighlight(e, feature);
  //       // layer.unbindTooltip();
  //     },
  //     click: (e) => {
  //       saveMarkers(e, feature);
  //     },
  //   });

  //   const matchingObj = arrayOfObj.find(
  //     (anotherObj) => anotherObj.id === feature.properties.mhid
  //   );

  //   if (matchingObj) {
  //     feature.properties.solarPotential =
  //       typeof parseFloat(
  //         matchingObj.data.aggregations.monthly_averages.value
  //       ).toFixed(1) === "string"
  //         ? parseFloat(
  //             parseFloat(
  //               matchingObj.data.aggregations.monthly_averages.value
  //             ).toFixed(1)
  //           )
  //         : parseFloat(matchingObj.data.aggregations.monthly_averages.value);
  //   }

  //   changeColor(layer, feature);
  // };

  const onEachFeature2 = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        // highlightFeature(e, feature);
        layer
          .bindTooltip(
            `<div><strong className="font-bold">
                GHI: ${parseFloat(
                  feature.properties.avg.toFixed(1)
                )} kWh/m<sup>2</sup>
              </strong>
            </div>`,
            {
              direction: "top",
              permanent: false,
              sticky: true,
              offset: [10, 0],
              className: "custom-tooltip",
            }
          )
          .openTooltip();
      },
      mouseout: (e) => {
        // resetHighlight(e, feature);
        // layer.unbindTooltip();
      },
      click: (e) => {
        saveMarkers(e, feature);
      },
    });

    // const matchingObj = data.find(
    //   (anotherObj) => anotherObj.LAT === feature.properties.mhid
    // );

    // if (matchingObj) {
    //   feature.properties.solarPotential =
    //     typeof parseFloat(
    //       matchingObj.data.aggregations.monthly_averages.value
    //     ).toFixed(1) === "string"
    //       ? parseFloat(
    //           parseFloat(
    //             matchingObj.data.aggregations.monthly_averages.value
    //           ).toFixed(1)
    //         )
    //       : parseFloat(matchingObj.data.aggregations.monthly_averages.value);
    // }

    // changeColor(layer, feature);
    changeColor2(layer, feature);
  };

  function Geocoder({ address, locationFilter, coords }) {
    const map = useMap();

    if (locationFilter) {
      ELG.geocodeService({
        url: process.env.REACT_APP_GEO_MAP,
        apiKey: process.env.REACT_APP_MAP_KEY,
      })
        .geocode()
        .text(address)
        .run((err, results, response) => {
          const { lat, lng } = results?.results[0].latlng;
          let longitude, latitude;

          const isPayment = listPayment?.find(
            (item) => item?.region === locationKab
          );

          if (isPayment) {
            longitude = isPayment?.lon;
            latitude = isPayment?.lat;
          } else {
            longitude = lng;
            latitude = lat;
          }

          getHistorisPotensi(latitude, longitude).then((res) =>
            setGhi(AverageData(res.data[0].data))
          );

          dispatch(setRealCoordinate([latitude, longitude]));
          setMid([latitude, longitude]);
          Cookies.set("coordinate", [latitude, longitude]);
          map.flyTo([latitude, longitude], 7);
          markerRef?.current?.openPopup();

          dispatch(setLocationFilter(false));

          let newData = {
            Lat: latitude,
            Lon: longitude,
            KABUPATEN: locationKab,
            PROVINSI: locationProv,
            UTC: utcProv,
          };

          // map.eachLayer((layer) => {
          //   if (layer instanceof L.GeoJSON) {
          //     layer.eachLayer((featureLayer) => {
          //       if (!selectCoord.id) {
          //         let newArray = kablite.features.filter((item) => {
          //           return newData.KABUPATEN === item.properties.KABKOT;
          //         });

          //         newData.id = newArray[0].properties.mhid;
          //       }
          //     });
          //   }
          // });

          dispatch(setLonLat(newData));
          setSelectCoord(newData);
        });
    }

    if (savedLoc) {
      getHistorisPotensi(selectedLocation.lat, selectedLocation.lon).then(
        (res) => setGhi(AverageData(res.data[0].data))
      );
      dispatch(setRealCoordinate([selectedLocation.lat, selectedLocation.lon]));
      setMid([selectedLocation.lat, selectedLocation.lon]);
      Cookies.set("coordinate", [selectedLocation.lat, selectedLocation.lon]);
      map.flyTo([selectedLocation.lat, selectedLocation.lon], 7);
      dispatch(setSavedLoc(false));
      let newData = {
        Lat: selectedLocation.lat,
        Lon: selectedLocation.lon,
        KABUPATEN: selectedLocation.region,
        PROVINSI: selectedLocation.province,
        UTC: selectedLocation.utc ? selectedLocation.utc : null,
      };
      dispatch(setLonLat(newData));
      setSelectCoord(newData);
    }

    if (defaultMap) {
      setMid(null);
      if (user && savedLocation?.length > 0) {
        map.flyTo([-2.5893, 125.9213], 5);
        setTimeout(() => {
          setTourLoc(true);
        }, 500);
      } else if (user && savedLocation?.length === 0) {
        map.flyTo([-2.5893, 118.9213], 5);
      } else {
        map.flyTo([-1.5893, 118.9213], 5);
      }
      dispatch(setDefaultMap(false));
      dispatch(setLonLat(null));
    }

    return (
      <>
        {locationFilter && mid !== null ? (
          <Marker position={coords} icon={iconPerson} ref={markerRef}>
            <Popup>
              <h3 className="font-bold">
                {selectCoord?.PROVINSI}, {selectCoord?.KABUPATEN}
              </h3>
              <div className="flex flex-col pt-2">
                <span className="m-0 pb-1">Latitude : {selectCoord?.Lat}</span>
                <span className="m-0 p-0">Longitude : {selectCoord?.Lon}</span>
              </div>
            </Popup>
          </Marker>
        ) : (
          <></>
        )}
        {savedLoc ? (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lon]}
            icon={iconPerson}
            ref={markerRef}
          >
            <Popup>
              <h3 className="font-bold">
                {selectedLocation.province}, {selectedLocation.region}
              </h3>
              <div className="flex flex-col pt-2">
                <span className="m-0 pb-1">
                  Latitude : {selectedLocation.lat}
                </span>
                <span className="m-0 p-0">
                  Longitude : {selectedLocation.lon}
                </span>
              </div>
            </Popup>
          </Marker>
        ) : (
          <></>
        )}
      </>
    );
  }

  // window.addEventListener("resize", () => {
  //   setTimeout(() => {
  //     // console.log("resize map: ", this.map)
  //     // map.invalidateSize
  //     testMap.invalidateSize();
  //   }, 500);
  // });

  // useEffect(() => {
  //   const handleZoomChange = () => {
  //     const currentZoom = map.getZoom();
  //     const zoomThreshold = 9;

  //     if (currentZoom > zoomThreshold) {
  //       // Update the style of the GeoJSON layer to make it transparent
  //       map.eachLayer((layer) => {
  //         if (layer instanceof L.GeoJSON) {
  //           layer.setStyle({ fillOpacity: 0.3 });
  //         }
  //       });
  //     } else {
  //       // Restore the original style of the GeoJSON layer
  //       map.eachLayer((layer) => {
  //         if (layer instanceof L.GeoJSON) {
  //           layer.setStyle({ fillOpacity: 0.6 });
  //         }
  //       });
  //     }
  //   };

  //   map.on("zoomend", handleZoomChange);

  //   return () => {
  //     map.off("zoomend", handleZoomChange);
  //   };
  // }, [map]);

  // const bounds = [
  //   [-11.5085669, 94.6030261576],
  //   [6.2182086834, 141.39385176],
  // ];

  const bounds = [
    [-11.2585669, 94.6530261576],
    [6.4582086834, 141.45385176],
  ];

  function SetBounds({ coords }) {
    // const map = useMapEvent("click", (e) => {
    //   map.flyTo(e.latlng, 7, {
    //     animate: true,
    //   });
    // });

    return (
      <>
        {mid !== null && (
          <Marker position={coords} icon={iconPerson} ref={markerRef}>
            <Popup className="mypopup">
              <h3 className="font-bold text-sm">
                {selectCoord?.PROVINSI}, {selectCoord?.KABUPATEN}
              </h3>
              {/* <h3 className="font-bold py-2 text-[1.5rem]">{ghi} kWh/m2</h3> */}
              <div className="flex pt-2 font-semibold justify-between">
                <span className="m-0 p-0">
                  Longitude : {parseFloat(selectCoord?.Lon.toFixed(1))}
                </span>
                <span className="m-0 pb-1">
                  Latitude : {parseFloat(selectCoord?.Lat.toFixed(1))}
                </span>
              </div>
            </Popup>
          </Marker>
        )}
      </>
    );
  }

  const handleTakeTour = async (tour) => {
    try {
      const data = await axios.post(
        `${process.env.REACT_APP_URL_API}/taketour`,

        {
          taketour: tour,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      dispatch(
        setUser({
          login: {
            user: { ...user, taketour: tour },
            token: token,
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const removeNumber = (inputString, numberToRemove) => {
    const regex = new RegExp(numberToRemove, "g");
    return inputString.replace(regex, "");
  };

  // const custom = {
  //   skip: (
  //     <button className="bg-red-600 rounded-md px-4 py-1.5">
  //       <strong className="text-white font-bold text-lg">Lewati</strong>
  //     </button>
  //   ),
  //   back: <strong className="text-[#004a14] font-bold px-3">Kembali</strong>,
  //   next: (
  //     <button className="bg-[#004a14] rounded-xl px-3 py-1">
  //       <strong className="text-white font-bold">Lanjutkan</strong>
  //     </button>
  //   ),
  //   last: (
  //     <button className="bg-[#004a14] rounded-xl px-3 py-1">
  //       <strong className="text-white font-bold">Selesai</strong>
  //     </button>
  //   ),
  // };

  const custom = {
    skip: (
      <button id="tour2-button-lewati">
        <strong>Lewati</strong>
      </button>
    ),
    back: <button id="tour2-button-lewati">Kembali</button>,
    next: <button id="tour2-button-lanjutkan">Lanjutkan</button>,
    last: <button id="tour2-button-lanjutkan">Selesai</button>,
  };

  // const [{ run, steps }, setSteps] = useState({
  //   run: true,
  //   steps: [
  //     {
  //       content: (
  //         <div>
  //           <h2>Tombol untuk keluar dari mode detail map</h2>
  //           <p className="text-right -mb-7 mt-2 font-semibold">1 dari 3</p>
  //         </div>
  //       ),
  //       disableBeacon: true,
  //       placement: "bottom",
  //       target: "#detail-1",
  //       title: (
  //         <p className="text-2xl text-green-500 font-bold">Tombol Kembali</p>
  //       ),
  //       locale: custom,
  //     },
  //     {
  //       content: (
  //         <div>
  //           <h2>Melihat detail informasi lokasi yang dipilih</h2>
  //           <p className="text-right -mb-7 mt-2 font-semibold">2 dari 3</p>
  //         </div>
  //       ),
  //       placement: "top",
  //       target: "#detail-2",
  //       title: <p className="text-2xl text-green-500 font-bold">Menu Detail</p>,
  //       locale: custom,
  //     },
  //     {
  //       content: (
  //         <div>
  //           <h2>
  //             Menyimpan lokasi yang dipilih, namun membutuhkan otorisasi sebagai
  //             user
  //           </h2>
  //           <p className="text-right -mb-7 mt-2 font-semibold">3 dari 3</p>
  //         </div>
  //       ),
  //       placement: "top",
  //       target: "#detail-3",
  //       title: (
  //         <p className="text-2xl text-green-500 font-bold">Simpan Lokasi</p>
  //       ),
  //       locale: custom,
  //     },
  //   ],
  // });

  const [{ run, steps }, setSteps] = useState({
    run: true,
    steps: [
      {
        content: (
          <div>
            <h2>Tombol untuk keluar dari mode detail map</h2>
            {/* <p className="text-right -mb-7 mt-2 font-semibold">1 dari 3</p> */}
          </div>
        ),
        disableBeacon: true,
        placement: "bottom",
        target: "#detail-1",
        title: <p id="tour2-text-tittle">Tombol Kembali</p>,
        locale: custom,
      },
      {
        content: (
          <div>
            <h2>Melihat detail informasi lokasi yang dipilih</h2>
            {/* <p className="text-right -mb-7 mt-2 font-semibold">2 dari 3</p> */}
          </div>
        ),
        placement: "top",
        target: "#detail-2",
        title: <p id="tour2-text-tittle">Menu Detail</p>,
        locale: custom,
      },
      {
        content: (
          <div>
            <h2>
              Menyimpan lokasi yang dipilih, namun membutuhkan otorisasi sebagai
              user
            </h2>
            {/* <p className="text-right -mb-7 mt-2 font-semibold">3 dari 3</p> */}
          </div>
        ),
        placement: "top",
        target: "#detail-3",
        title: <p id="tour2-text-tittle">Simpan Lokasi</p>,
        locale: custom,
      },
    ],
  });

  window.onload = function () {
    map?.invalidateSize();
  };

  const [tour, setTour] = useState(false);

  useEffect(() => {
    const handleZoomChange = () => {
      map?.invalidateSize();

      setTimeout(() => {
        setTour(true);
      }, 1000);
    };

    map.on("zoomend", handleZoomChange);

    return () => {
      map.off("zoomend", handleZoomChange);
    };
  }, [map]);

  useEffect(() => {
    setTimeout(() => {
      map?.invalidateSize();
    }, 1000);
  }, [location]);

  useEffect(() => {
    if (deleteLoc) {
      if (savedLocation?.length === 0) {
        map.panTo([-2.5893, 118.9213]);
        setTourLoc(false);
      }

      setDeleteLoc(false);
    }
  }, [deleteLoc, savedLocation]);

  useEffect(() => {
    fetchPayment();
  }, []);

  return (
    <>
      {/* Tour Detail */}
      {user
        ? tour &&
          user?.taketour.toString().includes("1") && (
            <Joyride
              continuous
              callback={(e) => {
                if (e.action === "reset") {
                  Cookies.set("tour-detail", "done");
                  if (user) {
                    let tour = user?.taketour.toString();
                    if (tour.includes("1")) {
                      if (tour.length > 1) {
                        const output = removeNumber(tour, "1");
                        handleTakeTour(parseInt(output));
                      } else {
                        handleTakeTour(0);
                      }
                    }
                  }
                }
              }}
              steps={steps}
              hideCloseButton
              disableScrollParentFix={true}
              showSkipButton
              showProgress
              disableOverlayClose={true}
              styles={{
                options: {
                  primaryColor: "#004a14",
                },
              }}
            />
          )
        : tour &&
          !Cookies.get("tour-detail") && (
            <Joyride
              continuous
              callback={(e) => {
                if (e.action === "reset") {
                  Cookies.set("tour-detail", "done");
                  if (user) {
                    let tour = user?.taketour.toString();
                    if (tour.includes("1")) {
                      if (tour.length > 1) {
                        const output = removeNumber(tour, "1");
                        handleTakeTour(parseInt(output));
                      } else {
                        handleTakeTour(0);
                      }
                    }
                  }
                }
              }}
              steps={steps}
              hideCloseButton
              disableScrollParentFix={true}
              showSkipButton
              showProgress
              disableOverlayClose={true}
              styles={{
                options: {
                  primaryColor: "#004a14",
                },
              }}
            />
          )}

      <TileLayer
        // url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=635oHCTIGdZ2lX8MtqJk"
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // opacity={0.5}
        zIndex={10}
      />
      {mid !== null && (
        <Marker position={mid} icon={iconPerson} ref={markerRef}>
          <Popup id="map-popup-detail" className="mypopup">
            <h3 id="map-popup-location" className="font-bold text-sm">
              {selectCoord?.PROVINSI}, {selectCoord?.KABUPATEN}
            </h3>
            {ghi !== 0 && (
              <h3 className="font-bold py-2 text-[1.5rem]">
                {parseFloat(ghi.toFixed(1))} kWh/m<sup>2</sup>
              </h3>
            )}
            <div className="flex pt-2 font-semibold justify-between">
              <span className="m-0 p-0">
                Longitude : {parseFloat(selectCoord?.Lon.toFixed(1))}
              </span>
              <span className="m-0 pb-1">
                Latitude : {parseFloat(selectCoord?.Lat.toFixed(1))}
              </span>
            </div>
          </Popup>
        </Marker>
      )}
      <GeoJSON data={output} onEachFeature={onEachFeature2} />
      {/* <SetBounds coords={mid} /> */}
      <Geocoder
        address={locationKab}
        locationFilter={locationFilter}
        coords={mid}
      />
      <ImageOverlay
        url={img} // Provide the path to your TIFF file
        bounds={bounds} // Set the bounds of the TIFF map data
        opacity={0.7} // Adjust the opacity of the overlay
      />
      {/* <GeoJSON data={kablite} onEachFeature={onEachFeature2} /> */}
    </>
  );
};

export default MapLayout;
