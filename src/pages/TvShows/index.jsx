import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Card from "../../components/Card";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import MoreInfoComponent from "../../components/MoreInfoComponent";
import { LoadingComponentForMovieAndSeries } from "../../components/LoadingComponent";
import { AiOutlineLoading } from "react-icons/ai";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import Languages from "../../Languages.json";
import Country from "../../Country.json";
import { Link, useSearchParams } from "react-router-dom";
import Genres from "../../Genre.json";
const TvShowsPage = () => {
  const [moreInfo, setMoreInfo] = useState(false);
  const [moreInfoData, setMoreInfoData] = useState();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from searchParams or set defaults
  const page = Number(searchParams.get("page")) || 1;
  const selectedLanguage =
    searchParams.get("language") || localStorage.getItem("language") || "en";
  const selectedCountry =
    searchParams.get("country") || localStorage.getItem("country") || "US";
  const selectedGenre =
    searchParams.get("genre") || localStorage.getItem("genre") || "18";

  const updateSearchParams = (key, value) => {
    setSearchParams((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);
      updatedParams.set(key, value);
      return updatedParams;
    });
  };

  // Example event handlers
  const handlePageChange = (newPage) => updateSearchParams("page", newPage);
  const handleLanguageChange = (newLanguage) =>
    updateSearchParams("language", newLanguage);
  const handleCountryChange = (newCountry) =>
    updateSearchParams("country", newCountry);
  const handleGenreChange = (newGenre) => updateSearchParams("genre", newGenre);
  const fetchSeries = (page = 1) =>
    fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/api/series?page=${page}&lang=${selectedLanguage}&country=${selectedCountry}&genreid=${selectedGenre}`
    ).then((res) => res.json());

  const { data, isFetching } = useQuery({
    queryKey: [
      "Series",
      page,
      selectedLanguage,
      selectedCountry,
      selectedGenre,
    ],
    queryFn: () => fetchSeries(page),
    placeholderData: keepPreviousData,
    staleTime: 300000,
  });
  const MoreInfo = (e, movie) => {
    e.stopPropagation();
    setMoreInfo(true);
    document.body.classList.add("scroll");
    setMoreInfoData(movie);

    document.getElementById("backdrop").scrollIntoView();
  };

  const closeinfo = (e) => {
    e.stopPropagation();
    setMoreInfo(false);
    document.body.classList.remove("scroll");
  };

  return (
    <>
      <ToastContainer />
      <Helmet>
        <title>Tvshow - Flexifyy</title>
        <meta name="description" content="Explore new series" />
      </Helmet>
      <Header />
      <div className="bg-[#0b0b0b] w-full  flex flex-col ">
        <header className="flex flex-col  gap-2 sm:flex-row sm:justify-evenly sm:items-center p-4 bg-[#b01818b0] text-white mt-[100px]">
          {/* <h1 className="text-2xl font-bold">Tv Browser</h1> */}
          <div className="flex items-center">
            <label htmlFor="language" className="mr-2 text-sm">
              Select Language:
            </label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="p-2 bg-[#0b0b0b] border border-gray-600 text-white rounded-md"
            >
              {Languages.map((lang) => (
                <option key={lang.id} value={lang.iso}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <label htmlFor="language" className="mr-2 text-sm">
              Select Country:
            </label>
            <select
              id="country"
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="p-2 bg-[#0b0b0b] border border-gray-600 text-white rounded-md"
            >
              {Country.map((count) => (
                <option key={count.id} value={count.iso}>
                  {count.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <label htmlFor="genre" className="mr-2 text-sm">
              Select Genre:
            </label>
            <select
              id="genre"
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="p-2 bg-[#0b0b0b] border border-gray-600 text-white rounded-md"
            >
              {Genres.map((count, index) => (
                <option key={index} value={count.id}>
                  {count.name}
                </option>
              ))}
            </select>
          </div>
        </header>
        {moreInfo && (
          <MoreInfoComponent
            closeinfo={closeinfo}
            type={"tv"}
            mode={"tv"}
            moreInfoData={moreInfoData}
            MoreInfo={MoreInfo}
          />
        )}

        <div className="w-full h-full flex-wrap flex text-sm text-white gap-4 sm:gap-8  justify-center mx-auto  items-start py-20 sm:px-2">
          {isFetching ? (
            <LoadingComponentForMovieAndSeries />
          ) : (
            data?.results?.map((movie, index) => (
              <Card
                key={index}
                movie={movie}
                type={"tv"}
                mode={"tv"}
                MoreInfo={(e) => MoreInfo(e, movie)}
              />
            ))
          )}
        </div>

        {data?.results.length <= 0 && (
          <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <h2 className="text-4xl font-semibold mb-4">Series Not Found</h2>
            <p className="text-lg mb-6 text-center">
              Sorry, we couldn’t find the movie you were looking for. <br />
              Try searching again or browse popular movies.
            </p>
            <Link
              to="/"
              className="px-6 py-2 text-white bg-red-700 rounded hover:bg-red-500 transition duration-300"
            >
              Back to Home
            </Link>
          </div>
        )}

        {data?.results.length > 0 && (
          <div className="flex justify-center items-center gap-3 py-3">
            <button
              className={`text-white w-auto p-2 ${
                page === 1
                  ? "bg-red-400 hidden cursor-not-allowed"
                  : "bg-red-600"
              }  rounded`}
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <MdKeyboardArrowLeft />
            </button>
            <span className="text-white">
              {page} .... {data?.total_pages}
            </span>
            <button
              className={`text-white w-auto p-2 ${
                page === data?.total_pages
                  ? "bg-red-400 hidden cursor-not-allowed"
                  : "bg-red-600"
              }  rounded`}
              onClick={() => {
                handlePageChange(page + 1);
              }}
            >
              <MdKeyboardArrowRight />
            </button>
          </div>
        )}

        {isFetching ? (
          <span className="text-white flex justify-center gap-3 items-center ">
            {" "}
            Loading <AiOutlineLoading className="animate-spin" />
          </span>
        ) : null}

        <Footer />
      </div>
    </>
  );
};

export default TvShowsPage;
