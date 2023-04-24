import React, { useRef, useEffect, useState } from "react";

const Map = (props) => {
  const mapRef = useRef();

  useEffect(() => {
    const map = new window.google.maps.Map(
      mapRef.current,
      {
        center: { lat: 0, lng: 0 },
        zoom: 8,
      },[]
    );
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const geocoder = new window.google.maps.Geocoder();

    const calculateAndDisplayRoute = (startLatLng, endLatLng) => {
      directionsService.route(
        {
          origin: startLatLng,
          destination: endLatLng,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    };

    if (props.origin && props.destination) {
      geocoder.geocode({ address: props.origin }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          const startLatLng = results[0].geometry.location;
          map.setCenter(startLatLng);

          geocoder.geocode(
            { address: props.destination },
            (results, status) => {
              if (status === window.google.maps.GeocoderStatus.OK) {
                const endLatLng = results[0].geometry.location;
                calculateAndDisplayRoute(startLatLng, endLatLng);
              }
            }
          );
        }
      });
    }
  }, [props.origin, props.destination]);

  return <div ref={mapRef} className="map"></div>;
};

export default Map;
