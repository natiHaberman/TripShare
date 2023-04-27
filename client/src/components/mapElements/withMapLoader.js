import React, { useState, useEffect } from "react";
import LoadingSpinner from "../UIElements/LoadingSpinner/LoadingSpinner";
import { Loader } from "@googlemaps/js-api-loader";

export const withMapLoader = (WrappedComponent) => {
  return (props) => {
    const [mapsApiLoaded, setMapsApiLoaded] = useState(false);

    // Load Google Maps API
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
      <>
        {mapsApiLoaded ? (
          <WrappedComponent {...props} />
        ) : (
          <LoadingSpinner asOverlay />
        )}
      </>
    );
  };
};
