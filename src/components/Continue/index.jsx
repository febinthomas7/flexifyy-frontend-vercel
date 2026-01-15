import ScrollComponent from "../ScrollComponent";
import { useContext, useEffect } from "react";
import { Watch } from "../../Context";
import { useQuery } from "@tanstack/react-query";

const fetchUserContinueList = async () => {
  const url = `${
    import.meta.env.VITE_BASE_URL
  }/auth/continueList?userId=${localStorage.getItem("userId")}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch continue watching list");
  }

  const result = await response.json();
  const continueList = result.continue || [];
  localStorage.setItem("userContinueList", JSON.stringify(continueList));
  return continueList;
};

const Continue = () => {
  const { deleteContinueWatch, userContinueList, setUserContinueList } =
    useContext(Watch);

  const {
    data: continueList = [],
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userContinueList"],
    queryFn: fetchUserContinueList,
    staleTime: 300000, // Cache data for 5 minutes
  });

  // Sync fetched data with context
  useEffect(() => {
    if (continueList.length) {
      setUserContinueList(continueList);
    }
  }, [continueList, setUserContinueList]);

  // Refetch when `deleteContinueWatch` changes
  useEffect(() => {
    refetch();
  }, [deleteContinueWatch]);

  return (
    <ScrollComponent
      data={userContinueList || []}
      heading={"Continue Watching"}
      loading={isFetching}
      page={"continue"}
    />
  );
};

export default Continue;
