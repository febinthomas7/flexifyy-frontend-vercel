import ScrollComponent from "../ScrollComponent";
import { useContext, useEffect } from "react";
import { Watch } from "../../Context";
import { useQuery } from "@tanstack/react-query";

const fetchUserWatchlist = async () => {
  const url = `${
    import.meta.env.VITE_BASE_URL
  }/auth/userlist?userId=${localStorage.getItem("userId")}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch watchlist");
  }

  const result = await response.json();
  const watchlist = result.watchlist || [];
  localStorage.setItem("userList", JSON.stringify(watchlist));
  return watchlist;
};

const Mylist = () => {
  const { deleteWatch, userList, setUserList } = useContext(Watch);

  const {
    data: watchlist = [],
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userWatchlist"],
    queryFn: fetchUserWatchlist,
    staleTime: 300000, // Cache data for 5 minutes
  });

  // Sync fetched data with context
  useEffect(() => {
    if (watchlist.length) {
      setUserList(watchlist);
    }
  }, [watchlist, setUserList]);

  // Refetch when `deleteWatch` changes
  useEffect(() => {
    refetch();
  }, [deleteWatch]);

  return (
    <section className="my-list bg-black text-white p-4 md:p-8">
      <ScrollComponent
        data={userList || []}
        heading={"Added PlayList"}
        loading={isFetching}
        page={"mylist"}
      />

      {!isFetching && userList?.length === 0 && !isError ? (
        <div className="text-white w-full h-[361px] flex flex-col justify-center items-center bg-[#0b0b0b] rounded">
          <img src="userNotLogggedIn.webp" alt="No Items" />
          <h1 className="capitalize">nothing added yet</h1>
        </div>
      ) : null}
      {isError && (
        <div className="text-red-500">
          Error loading your playlist. Please try again later.
        </div>
      )}
    </section>
  );
};

export default Mylist;
