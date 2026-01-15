import { useState } from "react";
import Card from "../Card";
import { HiOutlineArrowSmallLeft } from "react-icons/hi2";
import MoreInfoComponent from "../MoreInfoComponent";
const SearchBox = ({ value, onchange, searchResults, set }) => {
  const [moreInfo, setMoreInfo] = useState(false);
  const [moreInfoData, setMoreInfoData] = useState();
  const MoreInfo = (e, movie) => {
    e.stopPropagation();
    setMoreInfo(true);
    setMoreInfoData(movie);
    document.getElementById("backdrop")?.scrollIntoView(0);
    document.body.classList.add("scroll");
  };
  const closeinfo = (e) => {
    e.stopPropagation();
    setMoreInfo(false);
  };

  return (
    <div className="fixed w-full h-screen   bg-[#2c2c2cd0] flex flex-col items-center z-50 hide">
      <HiOutlineArrowSmallLeft
        onClick={set}
        className="text-white absolute left-5 sm:left-5 top-5 text-[35px] sm:text-[40px] cursor-pointer"
      />

      {moreInfo && (
        <MoreInfoComponent
          closeinfo={closeinfo}
          moreInfoData={moreInfoData}
          MoreInfo={MoreInfo}
          mode={"movie"}
        />
      )}

      <input
        type="search"
        value={value}
        onChange={onchange}
        autoFocus
        placeholder="Search For Movies , TV Shows and Actors"
        className="w-[95%] px-4 py-2 text-sm border text-black fixed top-[80px] z-30  shadow-md shadow-[#7a7979] border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
      />

      <div className="w-full h-full flex flex-wrap gap-6 overflow-x-auto justify-center rounded border-t-2 border-[red] bg-black p-10 mt-[100px]">
        {searchResults?.length > 0 &&
          searchResults?.map((movie, index) => {
            return (
              <Card
                key={index}
                movie={movie}
                type={movie?.media_type}
                MoreInfo={(e) => MoreInfo(e, movie)}
              />
            );
          })}
      </div>
    </div>
  );
};

export default SearchBox;
