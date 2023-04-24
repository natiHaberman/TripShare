import React, { useState } from "react";
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

  return (
    <div className="map-container">
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

    </div>
  );
};