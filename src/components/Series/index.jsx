import { useQuery } from "@tanstack/react-query";
import ScrollComponent from "../ScrollComponent";

const Series = () => {
  const selectedLanguage = localStorage.getItem("language");
  const selectedCountry = localStorage.getItem("country");
  const selectedGenre = localStorage.getItem("genre");
  const { data, isFetching } = useQuery({
    queryKey: ["ScrollSeries"],
    queryFn: () =>
      fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/series?lang=en&country=US&genreid=18`
      ).then((res) => res.json()),
    staleTime: 300000,
  });
  return (
    <ScrollComponent
      data={data?.results || []}
      heading={"Series"}
      type={"tv"}
      mode={"tv"}
      loading={isFetching}
    />
  );
};

export default Series;
