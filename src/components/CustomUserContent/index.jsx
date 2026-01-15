import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";
import Languages from "../../Languages.json";
import Country from "../../Country.json";
import Genres from "../../Genre.json";
const FilterComponent = () => {
  const [filters, setFilters] = useState({
    language: "",
    country: "",
    genre: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Function to send data to backend
  const postFiltersToBackend = async () => {
    if (!filters.language && !filters.country && !filters.genre) {
      handleError("Please select at least one filter.");
      return;
    }
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/auth/customContent?userId=${localStorage.getItem("userId")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filters),
        }
      );

      const result = await response.json();
      console.log("Backend Response:", result);
      handleSuccess("Filters applied successfully!");
      localStorage.setItem("country", result?.data.country);
      localStorage.setItem("genre", result?.data.genre);
      localStorage.setItem("language", result?.data.language);
    } catch (error) {
      console.error("Error sending filters:", error);
      handleError("Failed to apply filters.");
    }
  };

  return (
    <section className="flex flex-col gap-4 p-4 md:pt-4 md:pb-8 md:px-8 bg-black   text-white w-full mx-auto">
      <ToastContainer />
      <div className="flex flex-col bg-[#0b0b0b] p-4 md:pt-4 md:pb-8 md:px-8 shadow-md gap-3">
        <h1 className="text-2xl font-bold text-white group-hover:underline decoration-2 duration-150 ease-in underline-offset-2">
          Custom Preference
        </h1>

        <div className=" flex justify-between  ">
          {/* Language Select */}
          <div>
            <label className="block mb-1">Language</label>
            <select
              name="language"
              value={filters.language}
              onChange={handleChange}
              className="p-2 rounded bg-black w-full"
            >
              <option value="">Select Language</option>
              {Languages.map((lang, index) => (
                <option key={index} value={lang.iso}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Genre Select */}
          <div>
            <label className="block mb-1">Genre</label>
            <select
              name="genre"
              value={filters.genre}
              onChange={handleChange}
              className="p-2 rounded bg-black w-full"
            >
              <option value="">Select Genre</option>
              {Genres?.map((genre, index) => (
                <option key={index} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* Country Select */}
          <div>
            <label className="block mb-1">Country</label>
            <select
              name="country"
              //   value={filters.country}
              onChange={handleChange}
              className="p-2 rounded bg-black w-full"
            >
              <option value="">Select Country</option>
              {Country?.map((country, index) => (
                <option key={index} value={country.iso}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={postFiltersToBackend}
          className="mt-2 p-3 hover:scale-105 bg-red-600 text-white font-bold rounded-lg transition w-full"
        >
          Save
        </button>
      </div>

      {/* Apply Filters Button */}
    </section>
  );
};

export default FilterComponent;
