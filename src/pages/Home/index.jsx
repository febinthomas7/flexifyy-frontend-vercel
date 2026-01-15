import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Trending from "../../components/Trending";
import Footer from "../../components/Footer";
import Movies from "../../components/Movies";
import Series from "../../components/Series";
import UpcomingMovies from "../../components/UpcomingMovies";
import UpcomingSeries from "../../components/UpcomingSeries";
import Recommendation from "../../components/Recommendation";
import Continue from "../../components/Continue";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import Anime from "../../components/Anime";

const Home = () => {
  return (
    <div className="overflow-hidden bg-black text-white ">
      <ToastContainer />
      <Helmet>
        <title>Home - Flexifyy</title>
        <meta name="description" content="Explore movies and series" />
      </Helmet>
      <Header />
      <Hero />
      <Recommendation />
      <Continue />
      <Trending />
      <Movies />
      <Series />
      {/* <Anime /> */}
      <UpcomingMovies />
      <UpcomingSeries />
      <Footer />
    </div>
  );
};

export default Home;
