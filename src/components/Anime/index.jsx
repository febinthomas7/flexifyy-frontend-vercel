import ScrollComponent from "../ScrollComponent";
import { useQuery } from "@tanstack/react-query";
const Anime = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["trendinganime"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BASE_URL}/api/trendinganime`).then((res) =>
        res.json()
      ),
    staleTime: 300000,
  });

  return (
    <ScrollComponent
      data={Array.isArray(data) ? data : []}
      heading={"Anime"}
      type={"anime"}
      mode={"anime"}
      loading={isFetching}
    />
  );
};

export default Anime;
