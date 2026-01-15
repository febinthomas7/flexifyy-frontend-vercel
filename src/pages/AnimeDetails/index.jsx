import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowSmallLeft } from "react-icons/hi2";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";

import { useQuery, keepPreviousData } from "@tanstack/react-query";

const AnimeDetails = () => {
  const { id } = useParams();
  const fetchProjects = (id) =>
    fetch(
      `${import.meta.env.VITE_BASE_URL}/api/episode?id=${
        id?.split("-episode")[0]
      }`
    ).then((res) => res.json());

  const { data, isFetching } = useQuery({
    queryKey: ["episodes", id],
    queryFn: () => fetchProjects(id),
    placeholderData: keepPreviousData,
  });

  const location = useLocation();
  const navigation = useNavigate();

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
        <meta name="description" content="watch anime" />
      </Helmet>
      <ToastContainer />

      <HiOutlineArrowSmallLeft
        onClick={goBack}
        className="text-white absolute left-5 sm:left-10 top-10 text-[35px] sm:text-[40px] cursor-pointer"
      />

      <div className="w-full h-[500px] md:h-[700px] sm:w-[80%] sm:h-[600px]  shadow-2xl  rounded-md overflow-hidden bg-[#17171784]">
        <iframe
          src={`https://vidapi.xyz/embed/anime/${id}`}
          className="w-full h-full   rounded-md"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      <div>
        <div className=" absolute right-0 w-full    shadow-2xl  rounded-md overflow-hidden bg-[#17171784]">
          <h1 className="text-white text-2xl font-bold text-center">
            Episodes
          </h1>
          <div className="flex w-full gap-2 p-5 flex-wrap justify-center">
            {data?.map((e, index) => {
              return (
                <Link to={`/anime/${e?.link_url}`} key={index}>
                  {" "}
                  <div className="text-black text-center p-2 bg-white rounded-md cursor-pointer duration-100 ease-in hover:scale-105">
                    Episode {e?.episode}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
