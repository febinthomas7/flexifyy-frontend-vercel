import React, { useState, useCallback, useContext } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { debounce } from "../../debounce";
import axios from "axios";
import Card from "../../components/Card";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import MoreInfoComponent from "../../components/MoreInfoComponent";
import { LoadingComponentForMovieAndSeries } from "../../components/LoadingComponent";
import { AiOutlineLoading } from "react-icons/ai";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import { ImSpinner6 } from "react-icons/im";
import { Watching } from "../../utils";
import { Watch } from "../../Context";
import { useSearchParams, useNavigate } from "react-router-dom";
const Anime = () => {
  const [moreInfo, setMoreInfo] = useState(false);
  const [moreInfoData, setMoreInfoData] = useState();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();
  const { userContinueList, setUserContinueList } = useContext(Watch);

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

  const fetchProjects = (page = 1) =>
    fetch(`${import.meta.env.VITE_BASE_URL}/api/anime?page=${page}`).then(
      (res) => res.json()
    );

  const { data, isFetching } = useQuery({
    queryKey: ["Anime", page],
    queryFn: () => fetchProjects(page),
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
  const fetchSearchResults = useCallback(
    debounce((query) => {
      const options = {
        method: "GET",
        url: `${import.meta.env.VITE_BASE_URL}/api/search/anime`,
        params: { search: query },
      };

      axios.request(options).then((response) => {
        setSearchResults(response);
        setLoading(false);
      });
    }, 500),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setLoading(true);
    if (value === "") {
      setSearchResults([]);
    } else {
      fetchSearchResults(value);
    }
  };

  const handleItemClick = (e) => {
    Watching(e, "anime", "anime", userContinueList, setUserContinueList);
    navigation(`/anime/${e?.embed_url?.split("anime/")[1]}`);
  };

  const handleKeyDown = (e) => {
    Watching(e, "anime", "anime", userContinueList, setUserContinueList);
    navigation(`/anime/${e?.embed_url?.split("anime/")[1]}`);
  };

  return (
    <>
      <ToastContainer />
      <Helmet>
        <title>Anime - Flexifyy</title>
        <meta name="description" content="Explore new Anime" />
      </Helmet>
      <Header />

      <div className="bg-[#0b0b0b] w-full  flex flex-col ">
        <header className="flex flex-col   p-4 bg-[#b01818b0] text-white mt-[100px]">
          <input
            aria-label="Search for anime"
            type="text"
            value={search}
            onChange={handleInputChange}
            autoFocus
            placeholder="Search For Anime"
            className="w-full px-4 py-2 text-sm border text-black  z-30  shadow-md shadow-[#7a7979] border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          />
        </header>

        <div className="overflow-hidden">
          {searchResults && searchResults?.data?.length > 0 ? (
            <ul className="absolute w-full mt-2 bg-[#535353f7] border border-gray-300 rounded-md shadow-md z-10 max-h-[300px] overflow-auto">
              {searchResults?.data.map((e, index) => (
                <li
                  key={index}
                  onClick={() => handleItemClick(e)} // Handle clicks
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex gap-2 items-center"
                  tabIndex={0} // Make it focusable
                  onKeyDown={(event) => handleKeyDown(event, e)} // Handle keyboard events
                >
                  <img
                    src={e.thumbnail_url} // Adjust the key based on your data structure
                    alt={e.title}
                    className="w-10 h-10 mr-4 rounded-md object-cover"
                  />
                  {e.title}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {loading && search !== "" && (
          <div className="text-white justify-center flex py-2">
            {" "}
            <ImSpinner6 className="animate-spin" />
          </div>
        )}

        {moreInfo && (
          <MoreInfoComponent
            closeinfo={closeinfo}
            type={"tv"}
            mode={"tv"}
            moreInfoData={moreInfoData}
            MoreInfo={MoreInfo}
          />
        )}
        <div className="w-full h-full flex-wrap flex text-sm text-white gap-4 sm:gap-8 justify-center mx-auto items-start py-20 sm:px-2">
          {isFetching ? (
            <LoadingComponentForMovieAndSeries />
          ) : Array.isArray(data) && data.length > 0 ? (
            data.map((anime, index) => {
              return (
                <Card
                  key={index}
                  movie={anime}
                  type={"anime"}
                  mode={"anime"}
                  MoreInfo={(e) => MoreInfo(e, anime)}
                />
              );
            })
          ) : (
            <div>No valid data available.</div> // Display a fallback message if data is empty or not an array
          )}
        </div>
        <div className="flex justify-center items-center gap-3 py-3">
          <button
            className={`text-white w-auto p-2 ${
              page === 1 ? "bg-red-400 hidden cursor-not-allowed" : "bg-red-600"
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

export default Anime;
