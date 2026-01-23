import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { HiOutlineArrowSmallLeft } from "react-icons/hi2";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import { RxCross1, RxDoubleArrowUp, RxDoubleArrowDown } from "react-icons/rx";
import { IoCloudOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { FaPlay, FaPause } from "react-icons/fa";
import ScrollForCastAndCrew from "../../components/ScrollForCastAndCrew";
import axios from "axios";
import Genres from "../../Genre.json";
import { MdFormatListBulleted } from "react-icons/md";
const SeriesDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigation = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current values from URL or default to 1
  const season = searchParams.get("season") || "1";
  const episode = searchParams.get("episode") || "1";

  const mode = "tv";
  const [seeTrailer, setSeeTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState();
  const [credits, setCredits] = useState();
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(season);
  const [episodes, setEpisodes] = useState([]);

  // Defined inside component to stay reactive to season/episode changes
  const servers = [
    {
      name: "Server 1",
      url: `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`,
    },
    {
      name: "Server 2",
      url: `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
    },
    {
      name: "Server 3",
      url: `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?autoPlay=true&nextEpisode=true&episodeSelector=true`,
    },
  ];

  // Initialize server based on stored index preference
  const [server, setServer] = useState(() => {
    const savedIdx = localStorage.getItem("serverIndex") || 0;
    return servers[savedIdx]?.url || servers[0].url;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [details, setDetails] = useState(false);

  // Sync server URL when season or episode changes in the URL
  useEffect(() => {
    const savedIdx = localStorage.getItem("serverIndex") || 0;
    setServer(servers[savedIdx]?.url);
  }, [season, episode]);

  const fetchMovieById = async (id) => {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/single/series?id=${id}`,
    );
    if (!res.ok) throw new Error("Failed to fetch movie details");
    return res.json();
  };

  const { data } = useQuery({
    queryKey: ["seriesDetail", id],
    queryFn: () => fetchMovieById(id),
    enabled: !!id,
    staleTime: 300000,
  });

  // Fetch episodes when selected season changes
  useEffect(() => {
    if (!selectedSeason || !id) return;
    fetch(
      `${import.meta.env.VITE_BASE_URL}/api/season/episodes?id=${id}&season=${selectedSeason}`,
    )
      .then((res) => res.json())
      .then((res) => setEpisodes(res.episodes || []));
  }, [selectedSeason, id]);

  // Credits & Trailer fetching
  useEffect(() => {
    if (!data?.id) return;
    const commonParams = { id: data.id, mode };

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/credits`, {
        params: commonParams,
      })
      .then((res) => {
        setCredits(res.data);
        setCreditsLoading(false);
      })
      .catch(console.error);

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/trailer`, {
        params: commonParams,
      })
      .then((res) => setTrailerKey(res.data))
      .catch(console.error);
  }, [data?.id]);

  const goBack = () => {
    location.key !== "default" ? navigation(-1) : navigation("/");
    document.body.classList.remove("scroll");
  };

  // Sync local selectedSeason state with URL search params
  useEffect(() => {
    if (season) setSelectedSeason(season);
  }, [season]);

  return (
    <div className="w-full h-screen bg-[#000000f4] flex flex-col gap-4 overflow-hidden  items-center justify-center  bg-no-repeat bg-center  p-6 relative bg-[url('/bgImage.svg')]">
      <Helmet>
        <title>Flexifyy</title>
        <meta name="description" content="watch series" />
      </Helmet>
      <ToastContainer />

      <HiOutlineArrowSmallLeft
        onClick={goBack}
        className="text-white absolute left-5 sm:left-10 top-10 text-[35px] sm:text-[40px] cursor-pointer"
      />

      <div className="w-full h-[500px] md:h-[700px] sm:w-[80%] sm:h-[600px]  shadow-2xl  rounded-md overflow-hidden bg-[#17171784]">
        <iframe
          className="w-full h-full   rounded-md"
          src={server}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      <div onClick={() => setIsOpen(!isOpen)}>
        <IoCloudOutline className="text-white absolute right-5 sm:right-10 top-10 text-[35px] sm:text-[40px] cursor-pointer" />
      </div>

      {isOpen && (
        <div className="absolute right-5 bg-[#000000] top-20 z-10 w-[250px] p-4 shadow-2xl rounded-md  overflow-hidden">
          <h2 className="text-white font-bold text-sm ">Select Server</h2>
          <ul className="flex flex-col list-disc">
            {servers?.map((item, index) => (
              <li
                key={index}
                className={`flex items-center w-full h-10 p-2 cursor-pointer ${
                  item.url === server
                    ? "bg-blue-500 text-white"
                    : "text-gray-400"
                } hover:bg-gray-700 transition duration-200`}
                onClick={() => {
                  setServer(item.url);
                  localStorage.setItem("serverIndex", index);
                }}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div onClick={() => setDetails(!details)}>
        {details ? (
          <RxCross1 className="text-white absolute right-5 sm:right-10 top-20 text-[35px] sm:text-[40px] cursor-pointer" />
        ) : (
          <MdFormatListBulleted className="text-white absolute right-5 sm:right-10 top-20 text-[35px] sm:text-[40px] cursor-pointer" />
        )}
      </div>

      {details && (
        <div className="w-1/2 bg-[#000000] p-4 rounded-md absolute top-32 z-10 right-0 mr-10 shadow-2xl">
          <h1 className="text-white font-bold text-lg mb-4">Details</h1>

          {mode === "tv" && (
            <>
              <div className="mb-4">
                <label className="text-gray-400 text-sm block mb-1">
                  Select Season
                </label>
                <select
                  className="border border-gray-800 rounded p-2 cursor-pointer bg-black text-white w-full"
                  value={selectedSeason || ""}
                  onChange={(e) => {
                    const seasonValue = e.target.value;
                    setSelectedSeason(seasonValue);
                    setSearchParams({ season: seasonValue, episode: 1 });
                  }}
                >
                  <option value="" disabled>
                    Choose season
                  </option>
                  {data?.seasons?.map((s) => (
                    <option key={s.id} value={s.season_number}>
                      Season {s.season_number}
                    </option>
                  ))}
                </select>
              </div>

              {episodes.length > 0 && (
                <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
                  {episodes.map((ep) => (
                    <div
                      key={ep.id}
                      onClick={() =>
                        setSearchParams({
                          season: selectedSeason,
                          episode: ep.episode_number,
                        })
                      }
                      className={`border border-gray-800 rounded p-2 cursor-pointer transition ${
                        Number(episode) === ep.episode_number
                          ? "bg-[#111] border-red-600"
                          : "hover:bg-[#111]"
                      }`}
                    >
                      <h2 className="text-white text-sm font-semibold cursor-pointer hover:underline">
                        E{ep.episode_number} • {ep.name}
                      </h2>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-3">
                        {ep.overview || "No description available"}
                      </p>
                      <div className="text-[10px] text-gray-500 mt-1">
                        Runtime: {ep.runtime || "N/A"} min • Air: {ep.air_date}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* BOTTOM DRAWER (SAME UI) */}
      <div
        className={`absolute flex justify-center items-center bottom-0 z-10 w-full shadow-2xl  rounded-md h-full transition-transform duration-300 ease-out ${isDetailsOpen ? "translate-y-20" : "translate-y-[96%]"}`}
      >
        <div
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="flex justify-center bg-[#940000] w-full max-w-[800px] items-center z-10 rounded-t-full absolute top-0"
        >
          {isDetailsOpen ? (
            <RxDoubleArrowDown className="text-white p-2 text-[35px] sm:text-[40px] cursor-pointer" />
          ) : (
            <RxDoubleArrowUp className="text-white p-2 text-[35px] sm:text-[40px] cursor-pointer" />
          )}
        </div>
        <div className="h-full w-full max-w-[800px] bg-black mt-20 pb-28 p-4 overflow-auto">
          <div className="flex flex-col gap-6 mr-auto overflow-hidden bg-[#000000f4] rounded relative">
            <div className="w-full h-[420px] relative ">
              <img
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/fallback_bg.png";
                }}
                src={
                  data?.thumbnail ||
                  (data?.backdrop_path
                    ? `https://image.tmdb.org/t/p/w500/${data.backdrop_path}`
                    : "/fallback_bg.png")
                }
                alt={data?.title || data?.name}
              />
              <div className="absolute bottom-0 p-4">
                <h1 className="font-extrabold text-[20px] sm:text-[30px] invert drop-shadow-lg">
                  {data?.title || data?.name}
                </h1>
                <div className="text-white w-full flex flex-wrap gap-2">
                  {data?.genres?.map((e, index) => (
                    <h1
                      key={index}
                      className="before:content-['.'] text-[10px]"
                    >
                      {Genres.find((g) => g.id === e.id)?.name || ""}
                    </h1>
                  ))}
                </div>
              </div>
              {seeTrailer && trailerKey?.length > 0 && (
                <iframe
                  title="trailer"
                  className="w-full h-full object-contain absolute top-0"
                  src={`https://www.youtube.com/embed/${trailerKey[0]?.key}`}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              )}
            </div>
            <div className="w-full px-3">
              <button
                className="outline outline-1 font-semibold p-2 text-sm rounded gap-2 group text-white outline-red-700 flex justify-center text-center items-center"
                onClick={() => setSeeTrailer(!seeTrailer)}
              >
                Trailer{" "}
                {seeTrailer ? (
                  <FaPause className="group-hover:scale-105" />
                ) : (
                  <FaPlay className="group-hover:scale-105" />
                )}
              </button>
            </div>
            <div className="p-3">
              <p className="text-gray-500 text-justify text-sm">
                <span className="text-white">Description: </span>{" "}
                {data?.overview}
              </p>
            </div>
            {credits?.cast?.length > 0 && !data?.thumbnail && (
              <ScrollForCastAndCrew
                data={credits}
                loading={creditsLoading}
                heading={"cast"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesDetails;
