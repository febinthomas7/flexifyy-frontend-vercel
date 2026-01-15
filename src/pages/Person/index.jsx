import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import ScrollComponent from "../../components/ScrollComponent";
import Header from "../../components/Header";
import axios from "axios";
import Footer from "../../components/Footer";
import { ToastContainer } from "react-toastify";
import { HiOutlineArrowSmallLeft } from "react-icons/hi2";

const Person = () => {
  const { id } = useParams();
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
  const [personDetails, setPersonDetails] = useState([]);
  const [cast, setCaste] = useState();
  const [crews, setCrews] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.remove("scroll");
  }, []);
  useEffect(() => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_BASE_URL}/api/person`,
      params: {
        id: id,
      },
    };

    axios
      .request(options)
      .then((response) => {
        setPersonDetails(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    setLoading(true);
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_BASE_URL}/api/combinedcredits`,
      params: {
        id: id,
      },
    };

    axios
      .request(options)
      .then((response) => {
        setLoading(false);
        setCaste(response.data.cast);
        setCrews(response.data.crew);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [id]);
  useEffect(() => {
    setLoading(true);
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_BASE_URL}/api/actors`,
      params: {
        id: "1",
      },
    };

    axios
      .request(options)
      .then((response) => {
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [id]);
  return (
    <div className="bg-black">
      <Helmet>
        <title>{`${personDetails?.name}`} - Flexifyy</title>
        <meta name="description" content="Explore new persons" />
      </Helmet>
      <HiOutlineArrowSmallLeft
        onClick={goBack}
        className="text-white absolute left-5 sm:left-10 top-10 text-[35px] sm:text-[40px] cursor-pointer"
      />
      <ToastContainer />

      {/* <Header /> */}

      <div className="pt-[80px] sm:pt-[110px]">
        <div className="max-w-4xl mx-auto p-4 bg-[#0b0b0b] text-white rounded-lg shadow-md ">
          <div className="flex flex-col md:flex-row items-center md:items-start ">
            {/* Profile Picture */}
            <img
              src={`https://image.tmdb.org/t/p/w400/${personDetails?.profile_path}`}
              onError={(e) => {
                e.target.src = "/fallback_poster-removebg-preview.png";
              }}
              alt={`${personDetails?.name}`}
              className="w-48 h-48 object-cover rounded-lg mb-4 md:mb-0 md:mr-6 border border-gray-600"
            />

            {/* Details Section */}
            <div className="flex-1">
              {/* Name */}
              <h2 className="text-2xl font-bold mb-2">
                {" "}
                {personDetails?.name}
              </h2>

              {/* Known For */}
              <p className="text-gray-400 text-sm mb-4">
                Known For: {personDetails?.known_for_department}
              </p>

              {/* Biography */}
              <p className="text-gray-200 mb-4"> {personDetails?.biography}</p>

              {/* Other Details */}
              <div className="grid grid-cols-2 gap-4 text-gray-400 text-sm">
                <div>
                  <p>
                    <strong>Gender: </strong>
                    {personDetails?.gender == "2"
                      ? "Male"
                      : personDetails?.gender == "1"
                      ? "Female"
                      : "Non-binary"}
                  </p>
                  <p>
                    <strong>Born: </strong>
                    {personDetails?.birthday}
                  </p>
                  <p>
                    <strong>Birthplace: </strong>
                    {personDetails?.place_of_birth}
                  </p>
                </div>
                {personDetails?.deathDate && (
                  <div>
                    <p>
                      <strong>Died: </strong> {personDetails?.deathDate}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ScrollComponent data={cast} heading={"Cast"} loading={loading} />
        {cast?.length <= 0 && <div className="w-full h-[180px]"></div>}
      </div>

      <div className="mt-8">
        <ScrollComponent data={crews} heading={"Crew"} loading={loading} />
        {crews?.length <= 0 && <div className="w-full h-[180px]"></div>}
      </div>
      <Footer />
    </div>
  );
};

export default Person;
