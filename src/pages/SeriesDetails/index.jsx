import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowSmallLeft } from "react-icons/hi2";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { IoReorderThreeOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
const SeriesDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigation = useNavigate();

  const servers = [
    {
      name: "Server 1",
      url: `https://vidsrc.xyz/embed/tv/${id}`,
    },
    {
      name: "Server 2",
      url: `https://www.2embed.cc/embedtvfull/${id}`,
    },
    {
      name: "Server 3",
      url: `https://www.vidking.net/embed/tv/${id}/1/1?autoPlay=true&nextEpisode=true&episodeSelector=true`,
    },
  ];

  const [server, setServer] = useState(servers[0]?.url);
  const [isOpen, setIsOpen] = useState(false);
  const goBack = () => {
    if (location.key !== "default") {
      navigation(-1);
    } else {
      navigation("/");
    }
    document.body.classList.remove("scroll");
  };
  return (
    <div className="w-full h-screen bg-[#000000f4] flex flex-col gap-4  items-center justify-center  bg-no-repeat bg-center overflow-y-auto p-6 relative bg-[url('/bgImage.svg')]">
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
        <div className="absolute right-5 sm:right-10 top-20 bg-[#22222284] z-10 w-[250px] p-4 shadow-2xl rounded-md">
          <h2 className="text-white font-bold text-sm">Select Server</h2>
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
    </div>
  );
};

export default SeriesDetails;
