import React, { useEffect, useRef } from "react";

// Custom input component for Google Maps autocomplete
const MapInput = ({ placeholder, value, setValue, onPlaceSelected }) => {
  const inputRef = useRef();

  useEffect(() => {
    if (window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current
      );
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
      e.stopPropagation();

      // Trigger a click event on the first suggestion in the dropdown
      const suggestion = document.querySelector(".pac-item");
      if (suggestion) {
        suggestion.click();
      }
    }
  };

  return (
    <form>
      <input
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyPress}
        className="location-input"
      />
    </form>
  );
};

export default MapInput;
