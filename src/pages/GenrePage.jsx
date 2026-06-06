import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function GenrePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { movies = [], title = "Category" } = location.state || {};

  return (
    <div className="bg-black min-h-screen text-white">

      {/* HEADER */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="hover:scale-110 transition"
        >
          <ArrowLeft />
        </button>

        <h1 className="text-2xl md:text-3xl font-bold">
          {title}
        </h1>
      </div>

      {/* GRID (smaller cards) */}
      <div className="px-6 py-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-2 md:gap-4 md:pt-8 md:pl-3">

        {movies.map((m) => (
          <div
            key={m.id}
            onClick={() => navigate(`/watch/${m.id}`)}
            className="cursor-pointer group relative transition-all duration-300 hover:scale-105 hover:-translate-y-1"
          >

            {/* POSTER */}
            <div className="relative rounded-md overflow-hidden shadow-md">

              {/* TYPE BADGE */}
<div className="absolute top-2 left-2 z-10 bg-white text-black px-3 py-1 rounded text-xs font-bold">
  {m.type}
</div>

              {/* SMALLER VERTICAL POSTER */}
              <img
                src={
                  m.poster_path?.startsWith("http")
                    ? m.poster_path
                    : "https://image.tmdb.org/t/p/w500" + m.poster_path
                }
                className="
                  w-full
                  aspect-[2/3]
                  object-cover
                  transition-transform duration-300
                  group-hover:scale-105
                "
              />

              {/* hover overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
            </div>

            {/* TITLE */}
            <p className="text-[12px] mt-1 text-gray-300 line-clamp-1">
              {m.title}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}