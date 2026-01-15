import { Link, createBrowserRouter } from "react-router-dom";
import { lazy, useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { MessagingContext } from "../MessageContext";
const Anime = lazy(() => import("../pages/Anime"));
const AnimeDetails = lazy(() => import("../pages/AnimeDetails"));
const MainPage = lazy(() => import("../pages/MainPage"));
const MovieDetails = lazy(() => import("../pages/MovieDetails"));
const SeriesDetails = lazy(() => import("../pages/SeriesDetails"));
const Login = lazy(() => import("../pages/Login"));
const Signin = lazy(() => import("../pages/Signin"));
const Home = lazy(() => import("../pages/Home"));
const Movie = lazy(() => import("../pages/Movie"));
const Profile = lazy(() => import("../pages/ProfilePage"));
const TVShowsPage = lazy(() => import("../pages/TvShows"));
const RequestReset = lazy(() => import("../pages/RequestReset"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const MessagingPage = lazy(() => import("../pages/MessagingPage"));
const PersonPage = lazy(() => import("../pages/Person"));
const Actors = lazy(() => import("../pages/Actors"));
const PageNotFound = lazy(() => import("../components/PageNotFound"));

const PrivateRoute = ({ children }) => {
  const Location = useLocation();

  const { setAuth, auth } = useContext(MessagingContext);

  useEffect(() => {
    setAuth(!auth);
  }, [Location.pathname]);

  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" replace={true} />;
};

const RefreshHandler = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  return !isAuthenticated ? children : <Navigate to="/home" replace={true} />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RefreshHandler>
        <MainPage />
      </RefreshHandler>
    ),
  },

  {
    path: "/login",
    element: (
      <RefreshHandler>
        <Login />
      </RefreshHandler>
    ),
  },
  {
    path: "/signin",
    element: (
      <RefreshHandler>
        <Signin />
      </RefreshHandler>
    ),
  },
  {
    path: "/home",
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
  },
  {
    path: "/movie",
    element: (
      <PrivateRoute>
        <Movie />
      </PrivateRoute>
    ),
  },
  {
    path: "/myprofile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/tv",
    element: (
      <PrivateRoute>
        <TVShowsPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/tv/:id",
    element: (
      <PrivateRoute>
        <SeriesDetails />
      </PrivateRoute>
    ),
  },
  {
    path: "/movie/:id",
    element: (
      <PrivateRoute>
        <MovieDetails />
      </PrivateRoute>
    ),
  },
  {
    path: "/anime",
    element: (
      <PrivateRoute>
        <Anime />
      </PrivateRoute>
    ),
  },
  {
    path: "/request_reset",
    element: (
      <RefreshHandler>
        <RequestReset />
      </RefreshHandler>
    ),
  },
  {
    path: "/reset_password",
    element: (
      <RefreshHandler>
        <ResetPassword />
      </RefreshHandler>
    ),
  },
  {
    path: "/anime/:id",
    element: (
      <PrivateRoute>
        <AnimeDetails />
      </PrivateRoute>
    ),
  },
  {
    path: "/person",
    element: (
      <PrivateRoute>
        <Actors />
      </PrivateRoute>
    ),
  },
  {
    path: "/person/:id",
    element: (
      <PrivateRoute>
        <PersonPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/chat",
    element: (
      <PrivateRoute>
        <MessagingPage />
      </PrivateRoute>
    ),
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
