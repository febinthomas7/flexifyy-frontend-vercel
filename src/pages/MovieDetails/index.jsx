import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowSmallLeft } from "react-icons/hi2";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { IoReorderThreeOutline } from "react-icons/io5";
import { RxCross1, RxDoubleArrowUp, RxDoubleArrowDown } from "react-icons/rx";
import { useQuery } from "@tanstack/react-query";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import ScrollForCastAndCrew from "../../components/ScrollForCastAndCrew";
import DownloadFilesForMovies from "../../components/DownloadFilesForMovies";
import axios from "axios";
import Genres from "../../Genre.json";

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigation = useNavigate();
  const mode = "movie";
  const [seeTrailer, setSeeTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState();
  const [credits, setCredits] = useState();
  const [creditsLoading, setCreditsLoading] = useState(true);

  const servers = [
    {
      name: "Server 1",
      url: `https://vidsrc.xyz/embed/movie/${id}`,
    },
    {
      name: "Server 2",
      url: `https://www.vidking.net/embed/movie/${id}`,
    },
    {
      name: "Server 3",
      url: `https://www.2embed.cc/embed/${id}`,
    },
    {
      name: "Server 4",
      url: `https://vidapi.xyz/embedmulti/movie/${id}`,
    },
  ];
  const [server, setServer] = useState(servers[0]?.url);
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchMovieById = async (id) => {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/single/movie?id=${id}`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch movie details");
    }

    return res.json();
  };

  const { data, isFetching } = useQuery({
    queryKey: ["movieDetail", id],
    queryFn: () => fetchMovieById(id),
    enabled: !!id, // IMPORTANT
    staleTime: 300000,
  });

  useEffect(() => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_BASE_URL}/api/credits`,
      params: {
        id: data?.id || "8859",
        mode: mode,
      },
    };

    axios
      .request(options)
      .then((response) => {
        setCredits(response.data);
        setCreditsLoading(false);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [data?.id]);

  useEffect(() => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_BASE_URL}/api/trailer`,
      params: {
        id: data?.id,
        mode: mode,
      },
    };

    axios
      .request(options)
      .then((response) => {
        setTrailerKey(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [data?.id]);

  const goBack = () => {
    if (location.key !== "default") {
      navigation(-1);
    } else {
      navigation("/");
    }
    document.body.classList.remove("scroll");
  };

  return (
    <div className="w-full h-screen bg-[#000000f4] overflow-hidden flex flex-col gap-4  items-center justify-center  bg-no-repeat bg-center  p-6 relative bg-[url('/bgImage.svg')]">
      <Helmet>
        <title>Flexifyy</title>
        <meta name="description" content="watch movie" />
      </Helmet>
      <ToastContainer />
      <HiOutlineArrowSmallLeft
        onClick={goBack}
        aria-label="Go back"
        className="text-white absolute left-5 sm:left-10 top-10 text-[35px] sm:text-[40px] cursor-pointer"
      />
      <div className="w-full h-[500px] md:h-[700px] sm:w-[80%] sm:h-[600px]  shadow-2xl  rounded-md overflow-hidden bg-[#17171784]">
        <iframe
          className="w-full h-full   rounded-md"
          src={server}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          onError={() => setServer(servers[1]?.url)}
        ></iframe>
      </div>
      <div onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <RxCross1 className="text-white absolute right-5 sm:right-10 top-10 text-[35px] sm:text-[40px] cursor-pointer" />
        ) : (
          <IoReorderThreeOutline className="text-white absolute right-5 sm:right-10 top-10 text-[35px] sm:text-[40px] cursor-pointer" />
        )}
      </div>
      {isOpen && (
        <div className="absolute right-5 bg-[#000000] top-20 z-10 w-[250px] p-4 shadow-2xl rounded-md  overflow-hidden">
          <h2 className="text-white font-bold text-sm ">Select Server</h2>
          <ul className="flex flex-col list-disc">
            {servers?.map((item, index) => (
              <li
                key={index}
                title={item.name}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setServer(item.url);
                  }
                }}
                className={`flex items-center w-full h-10 p-2 cursor-pointer ${
                  item.url === server
                    ? "bg-blue-500 text-white"
                    : "text-gray-400"
                } hover:bg-gray-700 transition duration-200`}
                onClick={() => setServer(item.url)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className={`absolute bottom-0 bg-black z-10 w-full shadow-2xl rounded-md h-full
    transition-transform duration-300 ease-out
    ${isDetailsOpen ? "translate-y-0" : "translate-y-[96%]"}
  `}
      >
        {" "}
        <div
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="flex justify-center bg-[#940000] w-full items-center z-10  absolute top-0"
        >
          {isDetailsOpen ? (
            <RxDoubleArrowDown className="text-white p-2  text-[35px] sm:text-[40px] cursor-pointer" />
          ) : (
            <RxDoubleArrowUp className="text-white  p-2  text-[35px] sm:text-[40px] cursor-pointer" />
          )}
        </div>
        <div className="h-full w-full pt-16 p-4 overflow-auto">
          <div className="  flex flex-col gap-6  overflow-hidden  bg-[#000000f4] rounded  relative">
            <div className="w-full h-[420px] relative ">
              {data?.thumbnail ||
              (mode || type || data?.media_type || data?.mode || data?.type) ==
                "anime" ? (
                <img
                  className="w-full h-full object-cover "
                  id="backdrop"
                  onError={(e) => {
                    e.target.src = "/fallback_bg.png";
                  }}
                  src={data?.thumbnail || data?.backdrop_path}
                  alt={data?.title || data?.name}
                />
              ) : (
                <img
                  className="w-full h-full object-cover "
                  id="backdrop"
                  onError={(e) => {
                    e.target.src = "/fallback_bg.png";
                  }}
                  src={`https://image.tmdb.org/t/p/w500/${data?.backdrop_path}`}
                  alt={data?.title || data?.name}
                />
              )}

              <div className="absolute bottom-0 p-4">
                <h1 className=" font-extrabold text-[20px] sm:text-[30px] invert drop-shadow-lg">
                  {data?.title || data?.name}
                </h1>

                <div className="text-white  w-full flex flex-wrap gap-2">
                  {data?.genres?.map((e, index) => {
                    const genreName =
                      Genres.find((g) => g.id === e.id)?.name || "";
                    return (
                      <h1
                        key={index}
                        className="before:content-['.'] text-[10px]"
                      >
                        {genreName}
                      </h1>
                    );
                  })}
                </div>
              </div>

              {seeTrailer &&
                trailerKey?.length > 0 &&
                trailerKey.map((e) => {
                  // Set the source URL conditionally based on the type
                  let videoSrc = "";
                  if (e.type === "Trailer" || e.type === "Teaser") {
                    videoSrc = `https://www.youtube.com/embed/${e.key}`;
                  } else {
                    videoSrc = `https://www.youtube.com/embed/${
                      e?.key || e[0]?.key
                    }`;
                  }

                  return (
                    <iframe
                      key={e.key || e[0]?.key}
                      type="text/html"
                      className="w-full h-full object-contain absolute top-0"
                      src={videoSrc}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  );
                })}
            </div>
            <div className="w-full px-3">
              <button
                className="outline outline-1 font-semibold p-2 text-sm rounded gap-2 group text-white outline-red-700 flex justify-center text-center items-center"
                onClick={() => setSeeTrailer(!seeTrailer)}
              >
                Trailer{" "}
                {seeTrailer ? (
                  <FaPause className=" group-hover:scale-105" />
                ) : (
                  <FaPlay className="group-hover:scale-105" />
                )}
              </button>
            </div>

            <div className="p-3">
              <p className="text-gray-500 text-justify text-sm">
                {" "}
                <span className="text-white">Description: </span>
                {data?.overview}
              </p>
            </div>
            {(data?.media_type || data?.mode || data?.type || mode || type) ==
              "movie" && <DownloadFilesForMovies id={data?.id} />}

            {credits?.cast.length != 0 && !data?.thumbnail ? (
              <ScrollForCastAndCrew
                data={credits}
                loading={creditsLoading}
                heading={"cast"}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
