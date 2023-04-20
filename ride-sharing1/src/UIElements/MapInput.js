import React, { useEffect, useRef } from "react";

const MapInput = ({ placeholder, value, setValue }) => {
  const inputRef = useRef();

  useEffect(() => {
    if (window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setValue(place.formatted_address);
      });
    }
  }, [setValue]);

  return (
    <input
      ref={inputRef}
      className="location-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default MapInput;