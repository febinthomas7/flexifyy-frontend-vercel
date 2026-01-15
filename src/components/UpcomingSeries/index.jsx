import { useQuery } from "@tanstack/react-query";
import ScrollComponent from "../ScrollComponent";

const UpcomingSeries = () => {
  const { isPending, data } = useQuery({
    queryKey: ["ScrollUpcomingSeries"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BASE_URL}/api/upcomingseries`).then((res) =>
        res.json()
      ),
    staleTime: 300000,
  });
  return (
    <ScrollComponent
      data={data || []}
      heading={"New Series"}
      type={"tv"}
      mode={"tv"}
      loading={isPending}
    />
  );
};

export default UpcomingSeries;
