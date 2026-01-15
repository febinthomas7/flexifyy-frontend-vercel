import { useQuery } from "@tanstack/react-query";
import MoreInfoComponent from "../MoreInfoComponent";
import Genres from "../../Genre.json";
import { useEffect, useState } from "react";

const Hero = () => {
  const [moreInfoData, setMoreInfoData] = useState();
  const [moreInfo, setMoreInfo] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(slideNumber);

  const { data, isFetching } = useQuery({
    queryKey: ["topratedmovies"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BASE_URL}/api/topratedmovies`).then((res) =>
        res.json()
      ),
    staleTime: 300000,
  });

  const MoreInfo = (e, movie) => {
    e.stopPropagation();
    setMoreInfo(true);
    document.body.classList.add("scroll");
    setMoreInfoData(movie);

    document.getElementById("backdrop")?.scrollIntoView(0);
  };

  const closeinfo = (e) => {
    e.stopPropagation();
    setMoreInfo(false);
    document.body.classList.remove("scroll");
  };

  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const changeSlide = (index) => {
    setSlideNumber(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideNumber((prev) => (prev === 9 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayIndex(slideNumber);
    }, 200);

    return () => clearTimeout(timeout);
  }, [slideNumber]);

  return (
    <section className="w-[100%] h-[400px] sm:h-svh relative   ">
      {moreInfo && (
        <MoreInfoComponent
          closeinfo={closeinfo}
          type={"tv"}
          mode={"tv"}
          moreInfoData={moreInfoData}
          MoreInfo={MoreInfo}
        />
      )}
      {isFetching ? (
        <div className="w-full h-full bg-[#0d1015ed]  relative">
          <img
            className="w-full h-full blur "
            src="/fallback_bg-removebg.png"
            alt=""
          />

          <div className="absolute z-40 w-full h-[30px] flex  justify-center gap-4 items-center  bottom-0 right-0">
            {Array.from({ length: 6 }, (_, i) => i).map((e) => {
              return (
                <div
                  key={e}
                  className={`flex items-center justify-center w-[10px] h-[10px] bg-[#0d1015ed]  rounded-full cursor-pointer`}
                >
                  <a className="w-[10px] h-[10px]"></a>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div
            className={` w-[100%] overflow-auto scroll-smooth flex h-full snap-x hide`}
          >
            {data
              ?.filter((e, index) => index < 10)
              ?.map((e, index) => {
                const isVisible = slideNumber === index;
                return (
                  <img
                    key={index}
                    className={`w-full h-full flex-shrink-0 flex-grow-0 object-cover snap-center transition-opacity duration-700 ease-in-out ${
                      isVisible ? "opacity-100 " : "opacity-0 "
                    }`}
                    style={{
                      opacity: isVisible ? 1 : 0,
                      display: displayIndex === index ? "block" : "none",
                      transition: "opacity 0.7s ease-in-out",
                    }}
                    src={`https://image.tmdb.org/t/p/w500/${e?.backdrop_path}`}
                    alt={e?.title}
                    onError={(e) => {
                      e.target.src = "/fallback_bg-removebg.png";
                    }}
                  />
                );
              })}
          </div>
          <div className="absolute w-full h-[40px] flex  justify-center gap-4 items-center bg-black bottom-0  right-0">
            {arr?.map((e, index) => {
              return (
                <div
                  key={index}
                  onClick={() => changeSlide(index)}
                  className={`flex  pb-3 z-10 ${
                    slideNumber == index || (slideNumber == "" && index == 0)
                      ? "bg-red-700 w-[10px] h-[10px]"
                      : "bg-gray-600 w-[5px] h-[5px]"
                  }    rounded-full cursor-pointer`}
                ></div>
              );
            })}
          </div>
          <div className="absolute bottom-6 w-full h-full px-6 sm:pl-6 text-white bg-gradient-to-b from-[#1c1c1c4a] to-black">
            {data
              ?.filter((e, index) => index < 10)
              .map((movie, index) => {
                return (
                  <div
                    key={movie?.id}
                    className={`${
                      slideNumber == index || (slideNumber == "" && index == 0)
                        ? null
                        : "hidden"
                    } flex flex-col gap-1 sm:gap-3 px-6 sm:pl-6 left-0 absolute bottom-0 sm:bottom-6`}
                  >
                    <h1 className="text-[20px] sm:text-[40px]  font-extrabold">
                      {movie?.title || movie?.name}
                    </h1>
                    <p className="w-[300px] sm:w-full max-[420px]:truncate text-[12px] sm:text-[16px]">
                      {movie?.overview}
                    </p>
                    <div className="text-white  w-full flex flex-wrap gap-2">
                      {movie?.genre_ids?.map((e, index) => {
                        const genreName =
                          Genres.find((g) => g.id === e)?.name || "";
                        return (
                          <h1
                            key={index}
                            className="before:content-['.'] text-[10px] drop-shadow-lg hover:text-[#c0c0c0]"
                          >
                            {genreName}
                          </h1>
                        );
                      })}
                    </div>
                    <div
                      type="button"
                      onClick={(e) => MoreInfo(e, movie)}
                      className="text-[10px] p-1 sm:p-2 sm:text-[15px] rounded bg-red-700 w-fit hover:scale-105 text-white cursor-pointer"
                    >
                      moreInfo
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </section>
  );
};

export default Hero;
