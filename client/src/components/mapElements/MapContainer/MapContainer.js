import React, { useState } from "react";
import MapInput from "../MapInput";
import Map from "../Map";
import DatePicker from "../../UIElements/DatePicker";
import "./MapContainer.css";

// Custom component for new ride form with inputs for origin, destination, and departure time and map
export const MapContainer = ({
  onOriginSelected,
  onDestinationSelected,
  departureTime,
  setDepartureTime,
  timeChosen,
  setTimeChosen,
  handleSubmit
}) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  return (
    <div className="map-container">
          
          <form className="map-inputs" onSubmit={handleSubmit}>
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
            <Map className="map" origin={origin} destination={destination} />

            <div className="button-container">
            <button
              className="confirm-button"
              type="submit"
>
              Confirm
            </button>
          </div>
          </form>

    </div>
  );
};