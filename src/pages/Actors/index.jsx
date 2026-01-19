import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { LoadingComponentForMovieAndSeries } from "../../components/LoadingComponent";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import { Link, useSearchParams } from "react-router-dom";

const Actors = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from searchParams or set defaults
  const page = Number(searchParams.get("page")) || 1;

  const updateSearchParams = (key, value) => {
    setSearchParams((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);
      updatedParams.set(key, value);
      return updatedParams;
    });
  };

  // Example event handlers
  const handlePageChange = (newPage) => updateSearchParams("page", newPage);

  const fetchMovies = (page = 1) =>
    fetch(`${import.meta.env.VITE_BASE_URL}/api/actors?page=${page}`).then(
      (res) => res.json(),
    );

  const { data, isFetching } = useQuery({
    queryKey: ["person", page],
    queryFn: () => fetchMovies(page),
    placeholderData: keepPreviousData,
    staleTime: 300000,
  });

  return (
    <>
      <ToastContainer />
      <Helmet>
        <title>person - Flexifyy</title>
        <meta name="description" content="Explore new movies" />
      </Helmet>
      <Header />

      <div className="bg-black w-full  flex flex-col ">
        <div className="w-full h-full flex-wrap flex text-sm text-white gap-4 sm:gap-8  justify-center mx-auto  items-start py-20 sm:px-2">
          {isFetching ? (
            <LoadingComponentForMovieAndSeries />
          ) : (
            <div className="mt-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {data?.results.map((credit, index) => (
                  <Link to={`/person/${credit?.id}`} key={index}>
                    <div
                      key={index}
                      className="bg-[#0b0b0b] hover:scale-105  duration-100 ease-in p-2 rounded-lg shadow-md flex flex-col items-center text-center"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w200${credit?.profile_path}`}
                        onError={(e) => {
                          e.target.src =
                            "/fallback_poster-removebg-preview.png";
                        }}
                        alt={credit?.title || credit?.name}
                        className="w-full h-64 object-cover rounded-md mb-2"
                      />
                      <p className="text-lg font-semibold truncate">
                        {credit?.title || credit?.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {data?.results.length <= 0 && (
          <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <h2 className="text-4xl font-semibold mb-4">Actor Not Found</h2>
            <p className="text-lg mb-6 text-center">
              Sorry, we couldn’t find the actor you were looking for. <br />
              Try searching again or browse popular actors.
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

export default Actors;
