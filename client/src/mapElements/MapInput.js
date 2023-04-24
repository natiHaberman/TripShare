import React, { useEffect, useRef } from "react";

const MapInput = ({ placeholder, value, setValue, onPlaceSelected }) => {
  const inputRef = useRef();

  useEffect(() => {
    if (window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setValue(place.formatted_address);
        onPlaceSelected(place.formatted_address);
      });
    }
  }, [setValue, onPlaceSelected]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <input
      ref={inputRef}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyPress={handleKeyPress} 
    />
  );
};

export default MapInput;