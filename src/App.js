// Import necessary modules and styles
// https://www.javatpoint.com/react-axios

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

// Define the main component
function App() {
  // State to manage the input name
  const [name, setName] = useState("");
  // State to store country information
  const [countryInfo, setCountryInfo] = useState(null);
  // Ref to focus the input field
  const inputRef = useRef();

  // Function to fetch country information based on the input name
  const fetchCountryInfo = async () => {
    // Check if input name is empty or only contains spaces
    if (name.trim() === "") return;

    try {
      // Fetch nationality prediction from the API
      const response = await fetch(`https://api.nationalize.io?name=${name}`);
      const data = await response.json();

      // If there's a predicted country
      if (data.country.length > 0) {
        // Extract the country code
        const countryCode = data.country[0].country_id;

        // Fetch country details using the country code
        const countryResponse = await axios.get(
          `https://restcountries.com/v3/alpha/${countryCode}`
        );
        const countryData = countryResponse.data[0];

        // Update the country information state
        setCountryInfo({
          country_id: countryCode,
          country_name: countryData.name.common,
          probability: data.country[0].probability,
        });
      } else {
        // Reset the country information state if no prediction
        setCountryInfo(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Effect to focus the input field on component mount
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Render the component
  return (
    <div className="App">
      <h1>Nationality Predictor</h1>
      <input
        type="text"
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter a name"
      />
      <button onClick={fetchCountryInfo}>Predict Nationality</button>

      {/* Display the prediction result if available */}
      {countryInfo && (
        <div className="result">
          <h2>Prediction:</h2>
          <p>
            <b>Name: {name}</b>
          </p>
          <p>
            <b>Country of Origin: {countryInfo.country_name}</b>
          </p>
        </div>
      )}
    </div>
  );
}

// Export the component as the default export
export default App;
