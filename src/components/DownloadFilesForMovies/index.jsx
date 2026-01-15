import { useEffect, useState } from "react";
import axios from "axios";

const DownloadFilesForMovies = ({ id }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/download/movie`,
          { params: { id } }
        );
        setFiles(response.data);
      } catch (err) {
        console.error("Error fetching files:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [id]);

  if (files === null || typeof files === "undefined") {
    setIsLoading(false);
    return;
  } else {
    return (
      <>
        <div className="flex gap-3  flex-wrap justify-center items-baseline">
          {files.length <= 0 ? null : (
            <h1 className="text-white flex justify-center items-center gap-3">
              Download:
            </h1>
          )}

          {isLoading &&
            Array.from({ length: 4 }, (_, i) => i).map((e) => {
              return (
                <div
                  key={e}
                  className="py-1 px-2 h-[32px] w-[59px] bg-[#0d1015ed] rounded-lg text-transparent"
                >
                  {e}
                </div>
              );
            })}
          {files.length <= 0
            ? null
            : files?.map((e, index) => {
                return (
                  <div
                    className="py-1 px-2  bg-[#0d1015ed] rounded-lg cursor-pointer text-white hover:bg-slate-700"
                    key={index}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a href={e.url}>{e.quality}</a>
                    <span className="uppercase">.{e?.type}</span>
                  </div>
                );
              })}
        </div>
      </>
    );
  }
};

export default DownloadFilesForMovies;
