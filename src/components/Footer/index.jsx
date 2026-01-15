import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const nav = [
    {
      path: "/home",
      name: "Home",
    },
    {
      path: "/tv",
      name: "TV Shows",
    },
    {
      path: "/movie",
      name: "Movies",
    },
    {
      path: "/person",
      name: "Person",
    },
    // {
    //   path: "/anime",
    //   name: "Anime",
    // },
  ];

  const socialMedia = [
    {
      path: "#",
      icon: <FaFacebookF />,
      name: "Facebook",
    },
    {
      path: "#",
      icon: <FaTwitter />,
      name: "Twitter",
    },
    {
      path: "#",
      icon: <FaYoutube />,
      name: "Youtube",
    },
    {
      path: "#",
      icon: <FaInstagram />,
      name: "Instagram",
    },
  ];

  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Logo and About */}
          <div className="mb-6 md:mb-0 md:w-1/2">
            <p className="mt-2 text-sm text-gray-400">
              Your ultimate destination for streaming movies and TV shows. Watch
              anywhere, anytime.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8 md:w-1/2 text-sm">
            {nav.map((item, index) => (
              <Link key={index} to={item.path}>
                <div className="hover:text-gray-400" title={item.name}>
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Social Media Links */}
        <div className="flex flex-wrap justify-center space-x-6 text-gray-400">
          {socialMedia.map((item, index) => (
            <Link key={index} to={item.path}>
              <div className="hover:text-gray-400" title={item.name}>
                {item.icon}
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center text-gray-500 text-sm mt-6">
          <p>
            &copy; {new Date().getFullYear()} flexifyy. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
