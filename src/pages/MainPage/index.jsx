import { Link } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Helmet } from "react-helmet";
import FallBack2 from "../../components/FallBack2";

const MainPage = () => {
  return (
    <div className=" w-full h-svh flex justify-center items-center bg-black bg-cover bg-no-repeat bg-[url('/mainpage_bg.jpg')] backdrop-blur-sm">
      <Helmet>
        <title>Flexifyy</title>
        <meta
          name="description"
          content="Get info for all your movies ,series and watch it freely"
        />
        <meta
          name="keywords"
          content="movies, series , search movies and series , chat,share ,download movies"
        />
      </Helmet>
      <div className=" w-full h-svh flex justify-center items-center fixed bg-gradient-to-b from-[#000000ee] via-[#1c1c1c7f] to-black z-10"></div>
      <header
        className={` text-white sm:px-10 px-4 py-4 sm:py-2 z-50 flex top-0 justify-between  fixed w-full  items-center duration-75 ease-in`}
      >
        <Link to="/">
          <div className="logo   flex justify-center items-center">
            {/* <img src="/logo.png" alt="" className="w-[110px] sm:w-[180px] " /> */}
            <FallBack2 />
          </div>
        </Link>

        <Link to="/signin">
          <div className=" flex justify-center items-center cursor-pointer px-4 py-2 bg-red-700 group hover:scale-105 duration-75 ease-in  rounded">
            Sign In
          </div>
        </Link>
      </header>
      <div className="flex justify-center items-center h-full w-full z-40 backdrop-blur-sm">
        <div className=" p-8 rounded-lg shadow-lg w-full flex flex-col gap-3 sm:gap-6 text-white justify-center items-center relative">
          <h2 className="text-2xl sm:text-5xl font-extrabold text-center ">
            Unlimited movies, TV shows and more
          </h2>
          <h3 className="text-[12px] sm:text-[20px] ">
            Watch anywhere. Cancel anytime.
          </h3>
          <h3 className="text-[12px] sm:text-[20px] text-center">
            Ready to watch? Enter your email to create or restart your
            membership.
          </h3>
          <Link to="/signin">
            <button className=" relative flex justify-center items-center cursor-pointer px-6 py-2 bg-red-700 group duration-75 ease-in   hover:scale-105 rounded">
              Get Started
              <MdKeyboardArrowRight className="text-[30px] absolute invisible translate-x-[-5px] group-hover:translate-x-0 duration-75 ease-in-out group-hover:right-0 group-hover:visible" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
