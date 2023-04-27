import React, { useRef, useEffect } from "react";

const Map = (props) => {

  // Create a reference to the map DOM element
  const mapRef = useRef();

  // Initialize the map and set up directions when the component mounts or origin/destination props change
  useEffect(() => {

    // Create a new Google Maps instance
    const map = new window.google.maps.Map(
      mapRef.current,
      {
        center: { lat: 0, lng: 0 },
        zoom: 8,
      },
      []
    );

    // Create the directions service and renderer
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Create the geocoder to convert addresses to lat/lng coordinates
    const geocoder = new window.google.maps.Geocoder();

    // Function to calculate and display a route between two lat/lng coordinates
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

    // If origin and destination props are provided, geocode the addresses and display the route
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
