import React, { useEffect, useState, useContext } from "react";
import { MessagingContext } from "../../MessageContext";
const LoggedInDevices = () => {
  const [loading, setLoading] = useState(true);
  const [deviceDetail, setDeviceDetail] = useState();
  const { socket, online } = useContext(MessagingContext);
  const logged = async () => {
    setLoading(true);
    try {
      const url = `${
        import.meta.env.VITE_BASE_URL
      }/auth/device-details?userid=${localStorage.getItem("userId")}`;

      const response = await fetch(url);
      const result = await response.json();
      setDeviceDetail(result?.user.devicedetails);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    logged();
  }, []);

  return (
    <section className={`my-list  bg-black  text-white p-4 md:p-8`}>
      <div className=" bg-[#0b0b0b] relative py-4 text-white px-8  w-full">
        <h2 className="text-2xl  font-bold text-white group-hover/item:underline decoration-2 duration-150 ease-in underline-offset-2  ">
          Logged in Details
        </h2>
        {loading ? (
          <div className="flex items-center justify-center w-full   animate-pulse  bg-[#0d1015ed] rounded h-10 p-2 mt-2">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="pt-3  w-full">
            <ul className="flex flex-col gap-2 text-sm divide-y divide-gray-300">
              {deviceDetail?.map((session, index) => {
                const dateObject = new Date(session?.updatedAt);

                let hours = dateObject.getHours();
                let month = dateObject.getMonth();

                let day = dateObject.getDate();
                let year = dateObject.getFullYear();
                const minutes = dateObject
                  .getMinutes()
                  .toString()
                  .padStart(2, "0");

                // Determine AM or PM
                const ampm = hours >= 12 ? "pm" : "am";

                // Convert hours to 12-hour format and remove leading zero
                hours = hours % 12 || 12;

                const time = `${hours}:${minutes} ${ampm}`;
                const date = `${day}/${month + 1}/${year}`;
                return (
                  <li key={index}>
                    Device: {`${session.device}/${session.browser}`}, Time:{" "}
                    {time} , Date: {date}
                    ,Location: {`${session.state}/${session.country}`}
                  </li>
                );
              })}
            </ul>
            {deviceDetail?.length <= 0 && (
              <div className="text-center text-sm">
                sign in again to update session
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default LoggedInDevices;
