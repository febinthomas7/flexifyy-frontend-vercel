import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { HiOutlineArrowSmallLeft } from "react-icons/hi2";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import { useState, useEffect, useRef } from "react";
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
  const isInternalUpdate = useRef(false);
  const season = searchParams.get("season") || "1";
  const episode = searchParams.get("episode") || "1";

  const mode = "tv";
  const [seeTrailer, setSeeTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState();
  const [credits, setCredits] = useState();
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(season);
  const [episodes, setEpisodes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        if (!event.data) return;
        const payload =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (payload.type === "PLAYER_EVENT") {
          const {
            event: playerEvent,
            season: msgSeason,
            episode: msgEpisode,
          } = payload.data;

          // When player starts next episode internally (play/timeupdate/ended)
          if (playerEvent === "play" || playerEvent === "timeupdate") {
            const newEp = String(msgEpisode);
            const newSea = String(msgSeason || season);

            // If the player is on a different episode than the URL
            if (newEp !== episode) {
              isInternalUpdate.current = true; // BLOCK the iframe refresh
              setSearchParams(
                { season: newSea, episode: newEp },
                { replace: true },
              );
            }
          }
        }
      } catch (e) {
        /* ignore */
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [season, episode, setSearchParams]);

  const servers = [
    {
      name: "Server 1",
      url: `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${season}&episode=${episode}&autoplay=1&autonext=1`,
    },
    {
      name: "Server 2",
      url: `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?autoPlay=true&nextEpisode=true`,
    },
    {
      name: "Server 3",
      url: `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}&autonext=1`,
    },
  ];

  const [server, setServer] = useState(() => {
    const savedIdx = localStorage.getItem("serverIndex") || 0;
    return servers[savedIdx]?.url || servers[0].url;
  });

  // Automatically switch iframe source when URL changes
  useEffect(() => {
    // If change came from message listener, do nothing to the iframe
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    // If change came from manual click, reload the iframe
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

  useEffect(() => {
    if (!selectedSeason || !id) return;
    fetch(
      `${import.meta.env.VITE_BASE_URL}/api/season/episodes?id=${id}&season=${selectedSeason}`,
    )
      .then((res) => res.json())
      .then((res) => setEpisodes(res.episodes || []));
  }, [selectedSeason, id]);

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
      });
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/trailer`, {
        params: commonParams,
      })
      .then((res) => setTrailerKey(res.data));
  }, [data?.id]);

  const goBack = () => {
    location.key !== "default" ? navigation(-1) : navigation("/");
    document.body.classList.remove("scroll");
  };

  useEffect(() => {
    if (season) setSelectedSeason(season);
  }, [season]);

  return (
    <div className="w-full h-screen bg-[#000000f4] flex flex-col gap-4 overflow-hidden items-center justify-center bg-no-repeat bg-center p-6 relative bg-[url('/bgImage.svg')]">
      <Helmet>
        <title>Flexifyy</title>
      </Helmet>
      <ToastContainer />

      <HiOutlineArrowSmallLeft
        onClick={goBack}
        className="text-white absolute left-5 top-10 text-[40px] cursor-pointer"
      />

      <div className="w-full h-[500px] md:h-[700px] sm:w-[80%] sm:h-[600px] shadow-2xl rounded-md overflow-hidden bg-[#17171784]">
        <iframe
          className="w-full h-full rounded-md"
          src={server}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      <div onClick={() => setIsOpen(!isOpen)}>
        <IoCloudOutline className="text-white absolute right-5 top-10 text-[40px] cursor-pointer" />
      </div>

      {isOpen && (
        <div className="absolute right-5 bg-black top-20 z-10 w-[250px] p-4 shadow-2xl rounded-md">
          <h2 className="text-white font-bold text-sm mb-2">Select Server</h2>
          <ul className="flex flex-col">
            {servers?.map((item, index) => (
              <li
                key={index}
                className={`p-2 cursor-pointer text-sm ${index == localStorage.getItem("serverIndex") ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800"}`}
                onClick={() => {
                  setServer(item.url);
                  localStorage.setItem("serverIndex", index);
                  setIsOpen(false);
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
          <RxCross1 className="text-white absolute right-5 top-20 text-[40px] cursor-pointer" />
        ) : (
          <MdFormatListBulleted className="text-white absolute right-5 top-20 text-[40px] cursor-pointer" />
        )}
      </div>

      {details && (
        <div className="w-1/2 bg-black p-4 rounded-md absolute top-32 z-10 right-0 mr-10 shadow-2xl border border-gray-800">
          <h1 className="text-white font-bold text-lg mb-4">Episodes</h1>
          <select
            className="bg-neutral-900 text-white w-full p-2 mb-4 rounded"
            value={selectedSeason}
            onChange={(e) => {
              setSelectedSeason(e.target.value);
              setSearchParams({ season: e.target.value, episode: 1 });
            }}
          >
            {data?.seasons?.map((s) => (
              <option key={s.id} value={s.season_number}>
                Season {s.season_number}
              </option>
            ))}
          </select>

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
                className={`border border-gray-800 rounded p-2 cursor-pointer transition ${Number(episode) === Number(ep.episode_number) ? "bg-[#111] border-red-600" : "hover:bg-[#111]"}`}
              >
                <h2 className="text-white text-sm font-semibold">
                  E{ep.episode_number} • {ep.name}
                </h2>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* METADATA DRAWER */}
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
            {(data?.media_type || data?.mode || data?.type || mode || type) ==
              "movie" && <DownloadFilesForMovies id={data?.id} />}
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
