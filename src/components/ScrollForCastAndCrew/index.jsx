import { useState, useRef, lazy } from "react";
import { RxCrossCircled } from "react-icons/rx";
import {
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";
import {
  LoadingComponentForCastAndCrew,
  LoadingComponentForScroll,
} from "../LoadingComponent";
import { LoadingComponentForMovieAndSeries } from "../LoadingComponent";
import { Link } from "react-router-dom";

const ScrollForCastAndCrew = ({ data, loading, heading }) => {
  const [prevButtonVisible, setPrevButtonVisible] = useState(false);
  const [nextButtonVisible, setNextButtonVisible] = useState(true);
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
      <section className=" bg-[#0b0b0b] relative py-4 text-white">
        <div className="flex items-baseline  group  px-8">
          <h2 className="text-2xl  capitalize font-bold text-white group-hover/item:underline decoration-2 duration-150 ease-in underline-offset-2  ">
            {heading || "Cast"}
          </h2>
        </div>

        <div
          title="prev"
          onClick={() => handleScroll("prev")}
          className={`h-[200px] flex justify-center ${
            prevButtonVisible ? null : "hidden"
          }  items-center cursor-pointer absolute mt-[16px] left-0 w-[50px] z-30 bg-transparent group hover:bg-[#000000b1] rounded-r-xl`}
        >
          <MdOutlineKeyboardDoubleArrowLeft className="text-[25px] invisible group-hover:visible" />
        </div>
        <div
          title="next"
          onClick={() => handleScroll("next")}
          className={`h-[200px] ${
            nextButtonVisible ? null : "hidden"
          }  flex justify-center right-0 mt-[16px] items-center cursor-pointer  absolute w-[50px] z-30 bg-transparent group hover:bg-[#000000b1] rounded-l-xl`}
        >
          <MdOutlineKeyboardDoubleArrowRight className="text-[25px] invisible group-hover:visible" />
        </div>

        <div
          ref={scrollRef}
          id="scrollbtn"
          className="flex gap-2  overflow-x-auto i px-8 space-x-4 my-4  relative hide"
        >
          {loading ? (
            <LoadingComponentForCastAndCrew />
          ) : (
            data?.cast
              .filter((e) => e.profile_path != null)
              .map((e, index) => (
                <div
                  key={index}
                  className="flex h-auto gap-3 flex-col cursor-pointer justify-center items-center"
                >
                  <div className="w-32 flex flex-col justify-center items-center gap-3">
                    <img
                      className="w-28 h-28 rounded-full object-cover"
                      src={`https://image.tmdb.org/t/p/w400/${e.profile_path}`}
                      alt={e.name}
                      loading="lazy"
                    />

                    <Link to={`/person/${e.id}`}>
                      <h1
                        className="text-white text-lg truncate w-28"
                        title={e.character || "character name"}
                      >
                        {e.character}
                      </h1>
                      <h1
                        className="text-gray-400 text-sm truncate"
                        title={e.name || "real name"}
                      >
                        {e.name}
                      </h1>
                    </Link>
                  </div>
                </div>
              ))
          )}
        </div>
      </section>
    </>
  );
};

export default ScrollForCastAndCrew;
