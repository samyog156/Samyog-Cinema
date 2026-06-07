import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function GenrePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { movies = [], title = "Genre" } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold border-l-4 border-red-600 pl-3">
          {title}
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="text-white hover:text-red-500"
        >
          <X size={24} />
        </button>
      </div>

      {/* GRID */}
      <div className="
        grid
        grid-cols-3
        sm:grid-cols-4
        md:grid-cols-5
        lg:grid-cols-6
        xl:grid-cols-7
        gap-3 md:gap-4
      ">
        {movies.map((m) => (
          <div
            key={m.id}
            onClick={() => navigate(`/watch/${m.id}`)}
            className="cursor-pointer group"
          >

            <div className="relative rounded-lg overflow-hidden shadow-lg group-hover:scale-105 transition">

              {/* TYPE */}
              <div className="absolute top-2 left-2 z-10 bg-white text-black px-2 py-1 rounded text-[10px] font-bold">
                {m.type}
              </div>

              <img
                src={
                  m.poster_path?.startsWith("http")
                    ? m.poster_path
                    : "https://image.tmdb.org/t/p/w500" + m.poster_path
                }
                className="w-full aspect-[2/3] object-cover"
              />
            </div>

            <p className="mt-2 text-[12px] md:text-sm text-gray-300 line-clamp-1">
              {m.title}
            </p>

          </div>
        ))}
      </div>
    </div>
  );
}