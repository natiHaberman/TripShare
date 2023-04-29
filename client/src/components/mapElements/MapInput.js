import React, { useEffect, useRef } from "react";

// Custom input component for Google Maps autocomplete
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
      inputRef.current.blur(); // Remove focus from the input field
    }
    if (e.type === "click") {
      e.preventDefault();
      inputRef.current.blur(); // Remove focus from the input field
    }
  };

  return (
    <input
      ref={inputRef}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyPress} 
    />
  );
};

export default MapInput;