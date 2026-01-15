import React from "react";

export const LoadingComponentForScroll = () => {
  return (
    <>
      {Array.from({ length: 20 }, (_, i) => i)?.map((e) => (
        <div
          key={e}
          className=" w-[160px] h-[240px] sm:h-[265px] sm:w-[192px]  text-center animate-pulse  bg-[#0d1015ed] rounded "
        >
          <h1 className="invisible">
            LOADING......................................
          </h1>
        </div>
      ))}
    </>
  );
};

export const LoadingComponentForchatUsers = () => {
  return (
    <>
      {Array.from({ length: 20 }, (_, i) => i)?.map((e) => (
        <div
          key={e}
          className=" w-full h-[50px] text-center animate-pulse  p-6 bg-[#0d1015ed] rounded "
        ></div>
      ))}
    </>
  );
};

export const LoadingComponentForchatMessages = () => {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => i)?.map((e, index) => (
        <div
          key={index}
          className={`p-2 ${index % 2 == 0 ? "text-right" : ""}`}
        >
          <div>
            <div
              className={` rounded-xl text-white animate-pulse  inline-block bg-[#0d1015ed] px-20 py-6 relative min-w-[50px] text-left  ${
                index % 2 == 0
                  ? " rounded-xl rounded-br-none"
                  : " rounded-xl rounded-bl-none"
              }`}
            ></div>
          </div>
        </div>
      ))}
    </>
  );
};

export const LoadingComponentForCastAndCrew = () => {
  return (
    <>
      {Array.from({ length: 20 }, (_, i) => i)?.map((e) => (
        <div
          key={e}
          className=" w-[112px] h-[112px] text-center animate-pulse   bg-[#0d1015ed] rounded-full "
        >
          <h1 className="invisible">
            LOADING......................................
          </h1>
        </div>
      ))}
    </>
  );
};

export const LoadingComponentForMovieAndSeries = () => {
  return (
    <>
      {Array.from({ length: 20 }, (_, i) => i)?.map((e) => (
        <div
          key={e}
          className=" w-[160px] h-[240px] sm:h-[265px] animate-pulse  sm:w-[192px]  text-center   bg-[#0d1015ed] rounded "
        ></div>
      ))}
    </>
  );
};
