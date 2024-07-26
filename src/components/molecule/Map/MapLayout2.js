import React, { useEffect, useState, useRef } from "react";
import {
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMapEvent,
  useMap,
  MapContainer,
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

import "./Map.css";
import MarkerIcon from "@assets/marker.png";
import data from "@data/indonesia.json";
import kablite from "@data/kablite.json";
import averagePotent from "@data/jsonavgbulanan.json";
import output from "@data/test.json";
// import test from "@data/kab.json";
import img from "@data/map.png";

import { useDispatch, useSelector } from "react-redux";
import { setLonLat } from "@redux/features/location/locationSlice";

const MapLayouts = ({ mid, mapRef, setMid, selectedLocation, pos }) => {
  const { location, locationFilter, lonLat, savedLoc, defaultMap } =
    useSelector((state) => state.location);
  const dispatch = useDispatch();
  const [loc, setLoc] = useState({ lat: null, lng: null });
  const urlParams = new URLSearchParams(window.location.search);

  const [zoom, setZoom] = useState(6);
  const [selectCoord, setSelectCoord] = useState({ Lat: 0, Lon: 0 });
  const map = useMap();

  const arrayOfObj = Object.entries(averagePotent).map((e) => ({
    data: e[1],
    id: e[0],
  }));

  // const test = output.features.filter((item) => item.properties.avg !== 0);
  // console.log(test);

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
      : d >= 4.6
      ? "#be1333"
      : d >= 4.4 && d < 4.6
      ? "#e53f10"
      : d >= 4.2 && d < 4.4
      ? "#eb7348"
      : d >= 4 && d < 4.2
      ? "#f0992f"
      : d >= 3.8 && d < 4
      ? "#f7be28"
      : d >= 3.6 && d < 3.8
      ? "#fcde32"
      : d >= 3.4 && d < 3.6
      ? "#f9ee41"
      : d >= 3.2 && d < 3.4
      ? "#f9fa53"
      : d >= 3 && d < 3.2
      ? "#e1f67d"
      : "#bff1a5";
  };

  const changeColor = (layer, feature) => {
    layer.setStyle({
      weight: 0.3,
      opacity: 1,
      fillOpacity: 0.7,
      color: getColor(
        feature.properties.solarPotential,
        feature.properties.mhid
      ),
      fillColor: getColor(
        feature.properties.solarPotential,
        feature.properties.mhid
      ),
    });
  };

  const changeColor2 = (layer, feature) => {
    layer.setStyle({
      weight: 0.3,
      opacity: 1,
      fillOpacity: 0.7,
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

  const saveMarkers = (e, feature) => {
    dispatch(setRealCoordinate([e?.latlng.lat, e?.latlng.lng]));

    const newData = {
      id: feature.properties.mhid,
      Lat: e?.latlng.lat,
      Lon: e?.latlng.lng,
      KABUPATEN: feature.properties.KABKOT,
      PROVINSI: feature.properties.PROVINSI,
      // UTC: selectedLocation.utc ? selectedLocation.utc : null,
    };

    dispatch(setLonLat(newData));
    setSelectCoord(newData);
    Cookies.set("coordinate", [e?.latlng.lat, e?.latlng.lng]);
    setMid([e?.latlng.lat, e?.latlng.lng]);
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        // highlightFeature(e, feature);
        // layer
        //   .bindTooltip(
        //     `<div><strong className="font-bold">
        //         ${feature?.properties.PROVINSI}, ${feature?.properties.KABKOT}
        //       </strong>
        //       <div className="flex flex-col pt-2">
        //         <span className="m-0 pb-1">Latitude : ${parseFloat(
        //           e?.latlng.lat.toFixed(1)
        //         )}</span>
        //         <span className="m-0 p-0">Longitude : ${parseFloat(
        //           e?.latlng.lng.toFixed(1)
        //         )}</span>
        //       </div>
        //       <div className="flex flex-col pt-2">
        //         <p className="m-0 pb-1">GHI : ${
        //           feature.properties.avg ?? feature.properties.avg
        //         }</p>
        //       </div></div>`,
        //     {
        //       direction: "top",
        //       permanent: false,
        //       sticky: true,
        //       offset: [10, 0],
        //       className: "custom-tooltip",
        //     }
        //   )
        //   .openTooltip();
      },
      mouseout: (e) => {
        // resetHighlight(e, feature);
        // layer.unbindTooltip();
      },
      click: (e) => {
        saveMarkers(e, feature);
      },
    });

    layer.setStyle({
      weight: 0.3,
      fillOpacity: 0,
      opacity: 0,
      color: "black",
      fillColor: "white",
    });

    // if (feature.properties.avg) {
    //   changeColor2(layer, feature);
    // }

    // const matchingObj = arrayOfObj.find(
    //   (anotherObj) => anotherObj.id === feature.properties.mhid
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
  };

  const onEachFeature2 = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        // highlightFeature(e, feature);
        layer
          .bindTooltip(
            `<div>
            <div className="flex flex-col pt-2">
              <p className="m-0 pb-1">GHI : ${feature.properties.avg}</p>
            </div></div>`,
            {
              direction: "bottom",
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
        // saveMarkers(e, feature);
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
        url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
        apiKey:
          "AAPK007f3d10eb5540398b60e4a92054a5b1y8dg6rBWGwex2F4x7AjeoQJhWNQqZesbPgf5hlqge77cWOSDKe4rWKMZ1rdMZDiK",
      })
        .geocode()
        .text(address)
        .run((err, results, response) => {
          const { lat, lng } = results?.results[0].latlng;
          const text = results?.results[0].text;
          dispatch(setRealCoordinate([lat, lng]));
          setMid([lat, lng]);
          Cookies.set("coordinate", [lat, lng]);
          map.flyTo([lat, lng], 13);
          dispatch(setLocationFilter(false));

          let newData = {
            Lat: lat,
            Lon: lng,
            KABUPATEN: text.split(",")[0].toUpperCase(),
            PROVINSI: text.split(",").pop().toUpperCase(),
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
      dispatch(setRealCoordinate([selectedLocation.lat, selectedLocation.lon]));
      setMid([selectedLocation.lat, selectedLocation.lon]);
      Cookies.set("coordinate", [selectedLocation.lat, selectedLocation.lon]);
      map.flyTo([selectedLocation.lat, selectedLocation.lon], 13);
      dispatch(setSavedLoc(false));
      let newData = {
        Lat: selectedLocation.lat,
        Lon: selectedLocation.lon,
        KABUPATEN: selectedLocation.region,
        PROVINSI: selectedLocation.province,
      };
      dispatch(setLonLat(newData));
      setSelectCoord(newData);
    }

    if (defaultMap) {
      setMid(null);
      map.flyTo([-2.1893, 117.9213], 6);
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

  useEffect(() => {
    const handleZoomChange = () => {
      const currentZoom = map.getZoom();
      const zoomThreshold = 9;

      // if (currentZoom > zoomThreshold) {
      //   // Update the style of the GeoJSON layer to make it transparent
      //   map.eachLayer((layer) => {
      //     if (layer instanceof L.GeoJSON) {
      //       layer.setStyle({ fillOpacity: 0 });
      //     }
      //   });
      // } else {
      //   // Restore the original style of the GeoJSON layer
      //   map.eachLayer((layer) => {
      //     if (layer instanceof L.GeoJSON) {
      //       layer.setStyle({ fillOpacity: 0.7 });
      //     }
      //   });
      // }
    };

    map.on("zoomend", handleZoomChange);

    return () => {
      map.off("zoomend", handleZoomChange);
    };
  }, [map]);

  // const DisableHighlightOnZoom = () => {
  //   const map = useMap();

  //   useEffect(() => {
  //     const handleZoomChange = () => {
  //       const currentZoom = map.getZoom();
  //       const zoomThreshold = 9;

  //       if (currentZoom > zoomThreshold) {
  //         map.eachLayer((layer) => {
  //           if (layer instanceof L.GeoJSON) {
  //             layer.eachLayer((featureLayer) => {
  //               featureLayer.off("mouseover");
  //               featureLayer.off("mouseout");
  //             });
  //           }
  //         });
  //       } else {
  //         map.eachLayer((layer) => {
  //           if (layer instanceof L.GeoJSON) {
  //             layer.eachLayer((featureLayer) => {
  //               featureLayer.on({
  //                 mouseover: (e) => {
  //                   highlightFeature(e, featureLayer);
  //                 },
  //                 mouseout: (e) => {
  //                   resetHighlight(e, featureLayer);
  //                 },
  //               });
  //             });
  //           }
  //         });
  //       }
  //     };

  //     map.on("zoomend", handleZoomChange);

  //     return () => {
  //       map.off("zoomend", handleZoomChange);
  //     };
  //   }, [map]);

  //   return null;
  // };

  const markerRef = useRef(null);

  const onClickShowMarker = () => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const marker = markerRef.current;
    if (marker) {
      marker.openTooltip();
    }
  };

  function SetBounds({ coords }) {
    const map = useMapEvent("click", (e) => {
      map.flyTo(e.latlng, 13, {
        animate: true,
      });

      // onClickShowMarker();
    });

    return (
      <>
        {mid !== null && (
          <Marker position={coords} icon={iconPerson} ref={markerRef}>
            <Popup>
              <h3 className="font-bold">
                {selectCoord?.PROVINSI}, {selectCoord?.KABUPATEN}
              </h3>
              <div className="flex flex-col pt-2">
                <span className="m-0 pb-1">
                  Latitude : {parseFloat(selectCoord?.Lat.toFixed(1))}
                </span>
                <span className="m-0 p-0">
                  Longitude : {parseFloat(selectCoord?.Lon.toFixed(1))}
                </span>
              </div>
            </Popup>
          </Marker>
        )}
      </>
    );
  }

  if (loc.lat !== null) {
    map?.setView(loc, loc.z ? loc.z : 7, {
      animate: true,
    });
  }

  const bounds = [
    [-11.5085669, 94.6030261576],
    [6.2182086834, 141.39385176],
  ];

  useEffect(() => {
    setLoc({
      lat: parseFloat(urlParams.get("lat")),
      lng: parseFloat(urlParams.get("lon")),
      z: parseInt(urlParams.get("z")),
    });
  }, []);

  return (
    <>
      <TileLayer
        // url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=635oHCTIGdZ2lX8MtqJk"
        // url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // opacity={0.5}
        zIndex={10}
      />
      {loc.lat !== null && (
        <Marker
          // position={[pos.lat, pos.lng]}
          position={[loc.lat, loc.lng]}
          icon={iconPerson}
          ref={markerRef}
        ></Marker>
      )}
      <ImageOverlay
        url={img} // Provide the path to your TIFF file
        bounds={bounds} // Set the bounds of the TIFF map data
        opacity={0.7} // Adjust the opacity of the overlay
      />
      {/* <GeoJSON data={kablite} onEachFeature={onEachFeature} /> */}
      {/* <GeoJSON data={output} onEachFeature={onEachFeature2} /> */}
      {/* <SetBounds coords={mid} /> */}
      {/* <DisableHighlightOnZoom /> */}
      {/* <Geocoder
        address={location}
        locationFilter={locationFilter}
        coords={mid}
      /> */}
      {/* <TileLayer
        url="https://cews.bmkg.go.id/cgi-bin/mapserv?map=bmkg&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=pem%2Cprov%2Ckabkot&date=2018-09-01&CRS=EPSG%3A3857&STYLES=&WIDTH=1671&HEIGHT=1071&BBOX=9066960.347455585%2C-2865397.8181473846%2C17241441.900385477%2C2373901.848631737"
        opacity={0.5}
        zIndex={10}
      /> */}
      {/* <TileLayer
        url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=635oHCTIGdZ2lX8MtqJk"
        opacity={0.5}
        zIndex={10}
      /> */}
    </>
  );
};

export default MapLayouts;
