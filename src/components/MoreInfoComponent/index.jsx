import { BsPlusCircle } from "react-icons/bs";
import { IoMdShareAlt } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import DownloadFilesForMovies from "../DownloadFilesForMovies";
import { LoadingComponentForMovieAndSeries } from "../LoadingComponent";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import axios from "axios";
import Card from "../Card";
import { Helmet } from "react-helmet";
import { MdDone } from "react-icons/md";
import Genres from "../../Genre.json";
import { LoadingComponentForchatUsers } from "../LoadingComponent";

import ScrollForCastAndCrew from "../ScrollForCastAndCrew";
import { Watch } from "../../Context";
import "react-toastify/dist/ReactToastify.css";
import { userData, add, Message, Watching } from "../../utils";
import { RxCross1 } from "react-icons/rx";
import {
  FacebookIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

const MoreInfoComponent = ({
  closeinfo,
  type,
  moreInfoData,
  mode,
  MoreInfo,
}) => {
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState(false);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [seeTrailer, setSeeTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState();
  const [credits, setCredits] = useState();
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const navigation = useNavigate();
  const {
    movieAdded,
    setUserList,
    userList,
    userContinueList,
    setUserContinueList,
  } = useContext(Watch);
  const addwatch = async (e) => {
    e.stopPropagation();
    setAdded(true);
    add(moreInfoData, type, mode, userList, setUserList, setAdded);
  };
  const sendMessage = (userId, userName) => {
    Message(userId, userName, moreInfoData, type, mode);
  };

  useEffect(() => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_BASE_URL}/api/credits`,
      params: {
        id: moreInfoData?.id || "8859",
        mode:
          moreInfoData?.media_type ||
          moreInfoData?.mode ||
          moreInfoData?.type ||
          mode ||
          type,
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
  }, [moreInfoData?.id]);

  useEffect(() => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_BASE_URL}/api/recommendations`,
      params: {
        id: moreInfoData?.id,
        mode:
          moreInfoData?.media_type ||
          moreInfoData?.mode ||
          moreInfoData?.type ||
          mode ||
          type,
      },
    };

    axios
      .request(options)
      .then((response) => {
        setMovieData(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [moreInfoData?.id]);

  useEffect(() => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_BASE_URL}/api/trailer`,
      params: {
        id: moreInfoData?.id,
        mode:
          moreInfoData?.media_type ||
          moreInfoData?.mode ||
          moreInfoData?.type ||
          mode ||
          type,
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
  }, [moreInfoData?.id]);

  useEffect(() => {
    const List = userList ? userList : [];

    const movieExists = Array.isArray(List)
      ? userList.some((element) =>
          element.id
            ? element.id === moreInfoData.id
            : element.title === moreInfoData.title
        )
      : false;

    setList(movieExists);
  }, [moreInfoData, movieAdded, userList]);
  const seeMore = (e) => {
    e.stopPropagation();
    navigation(
      `/${
        moreInfoData?.media_type ||
        type ||
        moreInfoData?.type ||
        moreInfoData?.mode
      }`
    );
    document.body.classList.remove("scroll");
  };
  const share = () => {
    userData(setLoading, setUsers);
    setOpen(true);
  };
  const shareUrl = `https://flexifyy.netlify.app/${type || mode}/${
    moreInfoData?.id || moreInfoData?.link_url
  }`;

  const watch = (m1, m2, m3, m4, m5) => {
    Watching(moreInfoData, type, mode, userContinueList, setUserContinueList);
    navigation(`/${m1 || m2 || m3 || m4}/${m5}`);
  };

  return (
    <div
      className="fixed w-full h-screen top-0 z-40 justify-center  flex shadow-md shadow-[black] bg-[#000000b3]"
      onClick={closeinfo}
    >
      <Helmet>
        <title>{moreInfoData?.title || moreInfoData?.name}</title>
        <meta property="og:image" content="/logo1.png" />
        <meta property="og:type" content="website" />
        <meta name="description" content={moreInfoData?.overview} />
      </Helmet>
      <div
        onClick={(e) => e.stopPropagation()}
        className=" w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] flex flex-col gap-6  overflow-x-hidden overflow-y-auto bg-[#000000f4] rounded mt-24 relative"
      >
        <div className="w-full h-[420px] relative ">
          {moreInfoData?.thumbnail ||
          (mode ||
            type ||
            moreInfoData?.media_type ||
            moreInfoData?.mode ||
            moreInfoData?.type) == "anime" ? (
            <img
              className="w-full h-full object-cover blur-[2px]"
              id="backdrop"
              onError={(e) => {
                e.target.src = "/fallback_bg.png";
              }}
              src={moreInfoData?.thumbnail || moreInfoData?.backdrop_path}
              alt={moreInfoData?.title || moreInfoData?.name}
            />
          ) : (
            <img
              className="w-full h-full object-cover blur-[2px]"
              id="backdrop"
              onError={(e) => {
                e.target.src = "/fallback_bg.png";
              }}
              src={`https://image.tmdb.org/t/p/w500/${moreInfoData?.backdrop_path}`}
              alt={moreInfoData?.title || moreInfoData?.name}
            />
          )}

          <div className="absolute bottom-0 p-4">
            <h1 className=" font-extrabold text-[20px] sm:text-[30px] invert drop-shadow-lg">
              {moreInfoData?.title || moreInfoData?.name}
            </h1>
            <div className="flex justify-between items-center text-[20px] py-3 text-[#c0c0c0]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    watch(
                      moreInfoData?.media_type,
                      type,
                      moreInfoData?.type,
                      moreInfoData?.mode,
                      moreInfoData?.id
                    )
                  }
                  type="button"
                  className="text-[15px] px-5 py-1 font-bold text-black rounded bg-white hover:bg-slate-100 drop-shadow-lg"
                >
                  Play
                </button>

                {list ? (
                  <MdDone
                    onClick={(e) => e.stopPropagation()}
                    className="hover:scale-105 hover:text-white cursor-pointer"
                    title="added "
                  />
                ) : (
                  <BsPlusCircle
                    onClick={addwatch}
                    className={`hover:scale-105 hover:text-white cursor-pointer ${
                      added === true ? "opacity-50 pointer-events-none" : ""
                    }`}
                    title="add"
                  />
                )}

                <IoMdShareAlt
                  className="hover:scale-105 hover:text-white cursor-pointer"
                  title="share"
                  onClick={share}
                />
              </div>

              {open && (
                <div className="w-full h-full bg-white text-black z-50 top-0 right-0 absolute overflow-y-auto overflow-x-hidden  flex flex-col ">
                  <div className="w-full h-11 bg-black text-white  ">
                    <RxCross1
                      onClick={() => setOpen(!open)}
                      className=" absolute top-3 right-3 cursor-pointer "
                    />{" "}
                  </div>

                  <div className="w-full h-16 flex justify-center gap-2 sm:gap-3 items-center bg-black p-2">
                    <FacebookShareButton
                      url={shareUrl}
                      title={`${moreInfoData.title || moreInfoData.name}`}
                      hashtag={"#Flexifyy"}
                      className="hover:scale-105"
                      media={
                        type == "anime"
                          ? moreInfoData?.thumbnail_url
                          : `https://image.tmdb.org/t/p/w400/${moreInfoData?.poster_path}`
                      }
                    >
                      <FacebookIcon size={28} round={true} />
                    </FacebookShareButton>

                    <WhatsappShareButton
                      url={shareUrl}
                      title={`${
                        moreInfoData.title ||
                        moreInfoData.name ||
                        "Check this out on Flexifyy!"
                      }`}
                      quote={`${
                        moreInfoData.title ||
                        moreInfoData.name ||
                        "Check this out on Flexifyy!"
                      }`}
                      hashtag={"#Flexifyy"}
                      className="hover:scale-105"
                      media={
                        type == "anime"
                          ? moreInfoData?.thumbnail_url
                          : `https://image.tmdb.org/t/p/w400/${moreInfoData?.poster_path}`
                      }
                    >
                      <WhatsappIcon size={28} round={true} />
                    </WhatsappShareButton>

                    <TelegramShareButton
                      url={shareUrl}
                      title={`${moreInfoData.title || moreInfoData.name}`}
                      hashtag={"#Flexifyy"}
                      className="hover:scale-105"
                      media={
                        type == "anime"
                          ? moreInfoData?.thumbnail_url
                          : `https://image.tmdb.org/t/p/w400/${moreInfoData?.poster_path}`
                      }
                    >
                      <TelegramIcon size={28} round={true} />
                    </TelegramShareButton>

                    <TwitterShareButton
                      url={shareUrl}
                      title={`${moreInfoData.title || moreInfoData.name}`}
                      hashtags={"#Flexifyy"}
                      className="hover:scale-105"
                      media={
                        type == "anime"
                          ? moreInfoData?.thumbnail_url
                          : `https://image.tmdb.org/t/p/w400/${moreInfoData?.poster_path}`
                      }
                    >
                      <TwitterIcon size={28} round={true} />
                    </TwitterShareButton>
                  </div>

                  <div className="w-full h-full bg-[#0e0e0e] text-white overflow-y-auto pt-2 pb-5 px-2 flex flex-col gap-3 overflow-x-hidden">
                    {loading && <LoadingComponentForchatUsers />}
                    {users?.map((e, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => sendMessage(e._id, e.name)}
                          title={e.name}
                          className={`w-full rounded p-3 flex gap-2 truncate bg-[#c4c4c475] items-center cursor-pointer sm:hover:scale-105`}
                        >
                          {e?.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="text-white  w-full flex flex-wrap gap-2">
              {moreInfoData?.genre_ids?.map((e, index) => {
                const genreName = Genres.find((g) => g.id === e)?.name || "";
                return (
                  <h1 key={index} className="before:content-['.'] text-[10px]">
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
            {moreInfoData?.overview}
          </p>
        </div>

        {credits?.cast.length != 0 && !moreInfoData?.thumbnail ? (
          <ScrollForCastAndCrew
            data={credits}
            loading={creditsLoading}
            heading={"cast"}
          />
        ) : null}

        {(moreInfoData?.media_type ||
          moreInfoData?.mode ||
          moreInfoData?.type ||
          mode ||
          type) == "movie" && <DownloadFilesForMovies id={moreInfoData?.id} />}

        {!moreInfoData?.thumbnail && (
          <div className="text-white capitalize text-center">
            Similar{" "}
            {moreInfoData?.media_type ||
              type ||
              mode ||
              moreInfoData?.type ||
              moreInfoData?.mode}
          </div>
        )}

        {!moreInfoData?.thumbnail && (
          <div className="w-full flex flex-wrap justify-center gap-6">
            {loading ? (
              <LoadingComponentForMovieAndSeries />
            ) : (
              movieData?.map((movie, index) => {
                return (
                  <Card
                    key={index}
                    movie={movie}
                    type={
                      movie?.media_type ||
                      type ||
                      moreInfoData?.type ||
                      moreInfoData?.mode
                    }
                    mode={mode || moreInfoData?.type || moreInfoData?.mode}
                    MoreInfo={(e) => MoreInfo(e, movie)}
                  />
                );
              })
            )}
          </div>
        )}

        <div className="w-full p-4 flex justify-center">
          {!moreInfoData?.thumbnail && (
            <div
              onClick={seeMore}
              className="bg-red-700 text-white rounded p-1 cursor-pointer"
            >
              see more
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoreInfoComponent;
