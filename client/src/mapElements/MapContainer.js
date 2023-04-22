import React, { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import MapInput from "./MapInput";
import Map from "./Map";
import DatePicker from "../UIElements/DatePicker";
import "./MapContainer.css";

export const MapContainer = ({
  onOriginSelected,
  onDestinationSelected,
  departureTime,
  setDepartureTime,
  timeChosen,
  setTimeChosen,
}) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [mapsApiLoaded, setMapsApiLoaded] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyBGgUqz9Q8vmcihjfNcH3KEzCtAaM_A5A4",
      version: "weekly",
      libraries: ["places", "drawing"],
    });

    loader
      .load()
      .then(() => {
        setMapsApiLoaded(true);
      })
      .catch((error) => {
        console.error("Error loading Google Maps API:", error);
      });
  }, []);

  return (
    <div className="map-container">
      {mapsApiLoaded && (
        <>
          <div className="map-inputs">
            <DatePicker
              className={`departure-time${
                timeChosen ? " departure-time-selected" : ""
              }`}
              onChange={(date) => {
                setDepartureTime(date);
                setTimeChosen(true);
              }}
              departureTime={departureTime}
            />
            <MapInput
              placeholder="Origin"
              value={origin}
              setValue={setOrigin}
              onPlaceSelected={onOriginSelected}
              className="location-input"
            />
            <MapInput
              placeholder="Destination"
              value={destination}
              setValue={setDestination}
              onPlaceSelected={onDestinationSelected}
              className="location-input"
            />
          </div>
            <Map className="map" origin={origin} destination={destination} />
        </>
      )}
    </div>
  );
};
