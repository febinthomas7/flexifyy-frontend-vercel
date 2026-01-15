import ScrollComponent from "../ScrollComponent";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

const fetchRecommendations = async () => {
  const url = `${
    import.meta.env.VITE_BASE_URL
  }/auth/user-recommendation?id=${localStorage.getItem("userId")}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  const data = await response.json();
  return data.recommendations;
};

const Recommendation = () => {
  const {
    data: recommendations = [],
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["userRecommendations"],
    queryFn: () => fetchRecommendations(),
    staleTime: 300000,
  });

  if (isError) {
    console.log("Error fetching recommendations:", error.message);
    return <div>Error loading recommendations</div>;
  }

  return (
    <ScrollComponent
      data={recommendations}
      heading={"Recommendation"}
      loading={isFetching}
    />
  );
};

export default Recommendation;
