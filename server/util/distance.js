const googleMapsClient = require("@google/maps").createClient({
    key: process.env.API_KEY,
    Promise: Promise,
  });
  
  const getDistanceMatrix = async (origin, destination) => {
 
    const result = await googleMapsClient
      .distanceMatrix({
        origins: [origin],
        destinations: [destination],
        mode: "driving",
      })
      .asPromise();
    console.log("Result: ", result)
  
    if (result.json.status !== 'OK') {
        console.log("Error: ", result.json.status)
      throw new Error("Failed to fetch distance matrix from Google API");
    }
    
    const element = result.json.rows[0].elements[0];
    console.log("Element: ", element)
    return {
      distance: element.distance,
      duration: element.duration,
    };
  };

  module.exports = getDistanceMatrix;