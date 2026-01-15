import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LoggedInDevices from "../../components/LoggedInDevices";
import Mylist from "../../components/Mylist";
import Profile from "../../components/Profile";
import { Helmet } from "react-helmet";
import FilterComponent from "../../components/CustomUserContent";
import { ToastContainer } from "react-toastify";

const ProfilePage = () => {
  return (
    <>
      <ToastContainer />

      <Helmet>
        <title>Profile - Flexifyy</title>
        <meta name="description" content="user profile" />
      </Helmet>
      <Header />
      <Profile />

      <Mylist />
      {/* <FilterComponent /> */}
      <LoggedInDevices />
      <Footer />
    </>
  );
};

export default ProfilePage;
