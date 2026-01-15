import { useQuery } from "@tanstack/react-query";
import ScrollComponent from "../ScrollComponent";

const UpcomingMovies = () => {
  const selectedLanguage = localStorage.getItem("language");
  const selectedCountry = localStorage.getItem("country");
  const selectedGenre = localStorage.getItem("genre");
  const { isPending, data } = useQuery({
    queryKey: ["ScrollUpcomingNovies"],
    queryFn: () =>
      fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/upcomingmovies?lang=${selectedLanguage}&country=${selectedCountry}&genreid=${selectedGenre}`
      ).then((res) => res.json()),
    staleTime: 300000,
  });
  return (
    <ScrollComponent
      data={data || []}
      heading={"New Movies"}
      type={"movie"}
      mode={"movie"}
      loading={isPending}
    />
  );
};

export default UpcomingMovies;
