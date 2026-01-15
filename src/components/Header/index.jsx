import { useState, useEffect, useCallback, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { debounce } from "../../debounce";
import axios from "axios";
import SearchBox from "../SearchBox";
import { RxCross1 } from "react-icons/rx";
import { IoMdHome } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { VscThreeBars } from "react-icons/vsc";
import { MdLocalMovies } from "react-icons/md";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { BsEmojiSunglasses } from "react-icons/bs";
import { LuPersonStanding } from "react-icons/lu";

import { FaTv } from "react-icons/fa";
import { Watch } from "../../Context";
import FallBack2 from "../FallBack2";

const Header = () => {
  const [bgcolor, setBgColor] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const { profileDelete } = useContext(Watch);
  const navigation = useLocation();

  const nav = [
    {
      path: "/home",
      label: "Home",
      icon: <IoMdHome />,
    },
    {
      path: "/movie",
      label: "Movies",
      icon: <MdLocalMovies />,
    },
    {
      path: "/tv",
      label: "TvShows",
      icon: <FaTv />,
    },
    // {
    //   path: "/anime",
    //   label: "Anime",
    //   icon: <BsEmojiSunglasses />,
    // },
    {
      path: "/person",
      label: "Person",
      icon: <LuPersonStanding />,
    },
    {
      path: "/chat",
      label: "Chat",
      icon: <IoChatboxEllipsesOutline />,
    },
    {
      path: "/myprofile",
      label: "My Profile",
      icon: <CgProfile />,
    },
  ];

  const fetchSearchResults = useCallback(
    debounce((query) => {
      const options = {
        method: "GET",
        url: `${import.meta.env.VITE_BASE_URL}/api/search`,
        params: { search: query },
      };

      axios.request(options).then((response) => {
        setSearchResults(response.data);
      });
    }, 500),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value === "") {
      setSearchResults([]);
    } else {
      fetchSearchResults(value);
    }
  };
  const openSearch = () => {
    document.body.classList.toggle("scroll");
    if (isOpen == true) {
      setSearchResults([]);
      setSearch("");
    }
    setIsOpen(!isOpen);
  };

  const handleWindowListener = useCallback(() => {
    if (window.scrollY > 60) {
      setBgColor(true);
    } else {
      setBgColor(false);
    }
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handleWindowListener);

    return () => {
      window.removeEventListener("scroll", handleWindowListener);
    };
  }, []);

  useEffect(() => {
    setAvatarUrl(localStorage.getItem("avatar"));
  }, [localStorage.getItem("avatar"), profileDelete]);

  return (
    <>
      {isOpen && (
        <SearchBox
          value={search}
          onchange={handleInputChange}
          searchResults={searchResults}
          set={openSearch}
          setSearchResults={setSearchResults}
        />
      )}

      <header
        className={` text-white px-2 sm:px-4 z-40 flex justify-between fixed w-full ${
          bgcolor ? "bg-[#000000db]" : "bg-[#00000000]"
        } items-center duration-75 ease-in`}
      >
        <Link to="/home">
          <div className="logo   flex justify-center items-center text-[15px]">
            {/* <img src="/logo.png" alt="" className="w-[100px] " /> */}
            <FallBack2 />
          </div>
        </Link>

        <nav className="hidden md:flex space-x-4">
          {nav
            ?.filter((e) => e.path !== "/myprofile")
            .map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`hover:text-[#b01818] font-semibold ${
                  navigation.pathname == item.path
                    ? "text-[#b01818]"
                    : "text-[#c5c5c5c1]"
                } `}
              >
                {item.label}
              </Link>
            ))}
        </nav>

        <div className="flex items-center space-x-4">
          <div
            onClick={openSearch}
            className={`w-[34px]  h-[34px] flex justify-center items-center cursor-pointer outline outline-2 outline-offset-2 ${
              isOpen ? "outline-[red]" : "outline-[#c5c5c5c1]"
            }  bg-black group   rounded-full`}
          >
            <IoIosSearch className="text-[20px] text-[#ededed] group-hover:text-white group-hover:scale-105" />
          </div>
          <Link to="/myprofile" className="max-[490px]:hidden">
            <img
              alt="Profile"
              src={avatarUrl || localStorage.getItem("avatar")}
              onError={(e) => {
                e.target.src = "/no_image.svg";
              }}
              className={`w-9 h-9  object-contain rounded-full outline outline-2 outline-offset-2 ${
                navigation.pathname === "/myprofile"
                  ? "outline-[red]"
                  : "outline-[#c5c5c5c1] "
              } bg-white cursor-pointer`}
            />
          </Link>
          <nav className="flex flex-col justify-center items-center  md:hidden relative">
            {dropDown ? (
              <RxCross1
                className="text-[20px]"
                onClick={() => setDropDown(!dropDown)}
              />
            ) : (
              <VscThreeBars
                className="text-[20px]"
                onClick={() => setDropDown(!dropDown)}
              />
            )}

            {dropDown && (
              <div className="absolute  top-6 flex flex-col gap-4 bg-black p-4 rounded">
                {nav.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`hover:text-[#b01818] block font-semibold rounded-full ${
                      navigation.pathname == item.path
                        ? "text-[#b01818]"
                        : "text-[#c5c5c5c1]"
                    } `}
                  >
                    {item.icon}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
