import { IoIosArrowForward } from "react-icons/io";
import { lazy, useContext, useState, useRef } from "react";
import { RxCrossCircled } from "react-icons/rx";
import {
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { LoadingComponentForScroll } from "../LoadingComponent";
import { LoadingComponentForMovieAndSeries } from "../LoadingComponent";
const MoreInfoComponent = lazy(() => import("../MoreInfoComponent"));
import Card from "../Card";

const ScrollComponent = ({ data, heading, type, mode, loading, page }) => {
  // console.log(mode, type);

  const [prevButtonVisible, setPrevButtonVisible] = useState(false);
  const [nextButtonVisible, setNextButtonVisible] = useState(true);
  const [moreInfo, setMoreInfo] = useState(false);
  const [moreInfoData, setMoreInfoData] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const explore = (e) => {
    e.stopPropagation();
    setIsOpen(true);
    document.body.classList.add("scroll");
  };

  const MoreInfo = (e, movie) => {
    e.stopPropagation();
    setMoreInfo(true);
    document.body.classList.add("scroll");
    setMoreInfoData(movie);
    setIsOpen(false);
    document.getElementById("backdrop")?.scrollIntoView(0);
  };
  const closeinfo = (e) => {
    e.stopPropagation();
    setMoreInfo(false);
    document.body.classList.remove("scroll");
  };
  const closeExplore = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    document.body.classList.remove("scroll");
  };

  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300; // Adjust this value based on your layout
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      if (direction === "next") {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });

        // Check if user has reached the end after scrolling
        setTimeout(() => {
          if (scrollRef.current.scrollLeft + clientWidth >= scrollWidth - 50) {
            setNextButtonVisible(false);
          } else {
            setNextButtonVisible(true);
            setPrevButtonVisible(true);
          }
        }, 300);
      } else if (direction === "prev") {
        setTimeout(() => {
          if (scrollRef.current.scrollLeft < 20) {
            setPrevButtonVisible(false);
          } else {
            setPrevButtonVisible(true);
            setNextButtonVisible(true);
          }
        }, 300);
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed w-full h-screen top-0 z-40 justify-center flex shadow-md shadow-[black] bg-[#000000b3]"
          onClick={closeExplore}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[80%] flex flex-wrap gap-6 justify-center rounded overflow-x-hidden overflow-y-auto bg-[#000000f4] p-10 mt-24 relative"
          >
            {/* <RxCrossCircled className="absolute right-4 top-4 text-gray-300 cursor-pointer hover:scale-105 hover:text-white z-30 text-[30px]" /> */}

            {loading ? (
              <LoadingComponentForMovieAndSeries />
            ) : (
              data?.map((movie, index) => {
                return (
                  <Card
                    key={index}
                    movie={movie}
                    type={movie?.media_type || type || movie?.type}
                    mode={mode || movie?.mode}
                    MoreInfo={(e) => MoreInfo(e, movie)}
                  />
                );
              })
            )}
          </div>
        </div>
      )}

      {moreInfo && (
        <MoreInfoComponent
          closeinfo={closeinfo}
          type={type || mode || moreInfoData?.media_type || moreInfoData?.type}
          mode={type || mode || moreInfoData?.media_type || moreInfoData?.type}
          moreInfoData={moreInfoData}
          MoreInfo={MoreInfo}
        />
      )}

      <section className=" bg-[#0b0b0b] relative py-4 text-white">
        <div className="flex items-baseline  group  px-8">
          {loading ? (
            <div className="w-[81px] h-[32px] bg-[#0d1015ed] rounded "></div>
          ) : (
            <div
              className="flex items-baseline cursor-pointer group/item"
              onClick={explore}
            >
              {data?.length > 0 && (
                <>
                  <h2 className="text-2xl  font-bold text-white group-hover/item:underline decoration-2 duration-150 ease-in underline-offset-2  ">
                    {heading}
                  </h2>
                  <span className="flex items-center text-[12px] invisible font-semibold  group-hover:visible text-[#b01818]">
                    <h1 className="group-hover:translate-x-4 duration-200 ease-in">
                      Explore All
                    </h1>

                    <IoIosArrowForward className="translate-x-1 group-hover:translate-x-4 duration-75 ease-in text-[14px]" />
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        <div
          title="prev"
          onClick={() => handleScroll("prev")}
          className={`h-[240px] sm:h-[264px] flex justify-center ${
            prevButtonVisible ? null : null
          }  items-center cursor-pointer absolute mt-[16px] left-0 w-[50px] z-30 bg-transparent group hover:bg-[#000000b1] rounded-r-xl`}
        >
          <MdOutlineKeyboardDoubleArrowLeft className="text-[25px] invisible group-hover:visible" />
        </div>
        <div
          title="next"
          onClick={() => handleScroll("next")}
          className={`h-[240px] sm:h-[264px] ${
            nextButtonVisible ? null : null
          }  flex justify-center right-0 mt-[16px] items-center cursor-pointer  absolute w-[50px] z-30 bg-transparent group hover:bg-[#000000b1] rounded-l-xl`}
        >
          <MdOutlineKeyboardDoubleArrowRight className="text-[25px] invisible group-hover:visible" />
        </div>

        <div
          ref={scrollRef}
          id="scroll"
          className="flex gap-2  overflow-x-auto i px-8 space-x-4 my-4  relative hide"
        >
          {loading ? (
            <LoadingComponentForScroll />
          ) : (
            data?.map((movie, index) => (
              <Card
                key={index}
                movie={movie}
                type={movie?.media_type || type || movie?.type}
                mode={mode || movie?.mode || movie?.media_type || type}
                MoreInfo={(e) => MoreInfo(e, movie)}
                page={page}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default ScrollComponent;
