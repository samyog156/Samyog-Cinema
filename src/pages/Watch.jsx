import { useParams } from "react-router-dom";
import movies from "../Movies";
import { Heart, Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getWishlist, saveWishlist } from "../wishlist";
import CustomVideoPlayer from "../CustomVideoPlayer";

export default function Watch() {
  const { id } = useParams();

  const [wishlist, setWishlist] = useState([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const movie = movies.find((m) => String(m.id) === String(id));

  if (!movie)
    return <div className="text-white p-10">Movie not found</div>;

  return (
    <div className="bg-black text-white min-h-screen">

      {/* ================= HERO BACKDROP ================= */}
      {!showPlayer && (
        <div className="relative w-full h-[85vh]">

          <img
            src={
              movie.backdrop_path?.startsWith("http")
                ? movie.backdrop_path
                : "https://image.tmdb.org/t/p/original" +
                  movie.backdrop_path
            }
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/40 flex items-end">

            <div className="p-10 max-w-3xl">

              <h1 className="text-5xl font-extrabold mb-4">
                {movie.title}
              </h1>

              <p className="text-gray-300 max-w-xl mb-6">
                {movie.overview}
              </p>

              <div className="flex items-center gap-4">

                <button
                  onClick={() => setShowPlayer(true)}
                  className="bg-white text-black px-6 py-2 rounded flex items-center gap-2 font-semibold hover:scale-105 transition"
                >
                  <Play size={18} />
                  Play
                </button>

                <button
                  onClick={() => {
                    const current = getWishlist();
                    const exists = current.some(
                      (m) => String(m.id) === String(movie.id)
                    );

                    const updated = exists
                      ? current.filter((m) => String(m.id) !== String(movie.id))
                      : [...current, movie];

                    setWishlist(updated);
                    saveWishlist(updated);
                  }}
                  className="flex items-center gap-2"
                >
                  <Heart
                    className={
                      wishlist.some((m) => String(m.id) === String(movie.id))
                        ? "text-red-500 fill-red-500"
                        : "text-white"
                    }
                  />
                  Wishlist
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= PLAYER ================= */}
      {showPlayer && (
        <div className="pt-6 px-6">
          <div className="max-w-7xl mx-auto">

            <CustomVideoPlayer
              ref={playerRef}
              src={movie.videoUrl}
            />

          </div>
        </div>
      )}

      {/* ================= SUGGESTIONS ================= */}
      <div className="max-w-7xl mx-auto px-6 mt-10">

        <h2 className="text-2xl font-bold mb-5">
          You May Also Like
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">

          {movies
            .filter(
              (m) =>
                m.id !== movie.id &&
                m.genre?.some((g) =>
                  movie.genre?.includes(g)
                )
            )
            .slice(0, 12)
            .map((m) => (
              <div
  key={m.id}
  className="cursor-pointer group w-full"
                onClick={() =>
                  (window.location.href = `/watch/${m.id}`)
                }
              >

                <img
  src={
    m.poster_path?.startsWith("http")
      ? m.poster_path
      : "https://image.tmdb.org/t/p/w500" + m.poster_path
  }
  className="w-full aspect-[2/3] object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
/>
                <p className="mt-2 text-sm text-gray-300 line-clamp-1">
                  {m.title}
                </p>

              </div>
            ))}

        </div>

      </div>

    </div>
  );
}