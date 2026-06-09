import { useParams } from "react-router-dom";
import movies from "../Movies";
import { Heart, Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getWishlist, saveWishlist } from "../wishlist";
import CustomVideoPlayer from "../CustomVideoPlayer";


export default function Watch() {
  const { id } = useParams();
  const movie = movies.find((m) => String(m.id) === String(id));

  const [wishlist, setWishlist] = useState([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const playerRef = useRef(null);
  const [useIframe, setUseIframe] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [activeSeason, setActiveSeason] = useState(1);
  const [activeEpisode, setActiveEpisode] = useState({ season: 1, ep: 1 });
  const [menuMode, setMenuMode] = useState(null);

  const playingSeason = activeEpisode.season;
  const playingEp = activeEpisode.ep;

  const currentSeason = movie?.seasons?.find(
    (s) => s.season === activeSeason
  );

  const currentVideo =
    currentSeason?.episodes?.find(
      (e) => e.ep === activeEpisode.ep
    ) || currentSeason?.episodes?.[0];

  useEffect(() => {
    if (movie?.type === "Series") {
      setActiveSeason(1);
      setActiveEpisode({ season: 1, ep: 1 });
    }
  }, [movie]);

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  useEffect(() => {
    return () => {
      setShowPlayer(false);
    };
  }, []);

  if (!movie)
    return <div className="text-white p-10">Movie not found</div>;

  return (
    <div className="bg-black text-white min-h-screen">

      {/* ================= HERO BACKDROP ================= */}
      {!showPlayer && (
        <div className="relative w-full h-[30vh] md:h-[100vh] overflow-hidden">

          <img
            src={
              movie.backdrop_path?.startsWith("http")
                ? movie.backdrop_path
                : "https://image.tmdb.org/t/p/original" + movie.backdrop_path
            }
            className="
              absolute inset-0 w-full h-full object-contain bg-black
              md:object-cover
              object-[center_10%]
            "
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex items-end">
            <div className="p-6 md:p-10 max-w-3xl pb-4">

              <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
                {movie.title}
              </h1>

              <p className="hidden md:block text-gray-300 max-w-xl mb-6">
                {movie.overview}
              </p>

              <div className="flex items-center gap-4">

                <button
                  onClick={() => setShowPlayer(true)}
                  className="
                    bg-white text-black px-6 py-2 rounded flex items-center gap-2 font-semibold
                    hover:bg-red-600 hover:text-white transition
                  "
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
                  className="flex items-center gap-2 text-sm md:text-base"
                >
                  <Heart
                    className={
                      wishlist.some((m) => String(m.id) === String(movie.id))
                        ? "text-white fill-white"
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

      {/* ================= SEASONS / EPISODES MENU ================= */}
      {showPlayer &&
        movie.type === "Series" &&
        movie.seasons?.length > 0 && (
          <div className="absolute top-3 left-3 md:left-10 z-50">

            <button
              onClick={() => {
                if (menuMode === "seasons" || menuMode === "episodes") {
                  setMenuMode(null);
                } else {
                  setMenuMode("seasons");
                }
              }}
              className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
            >
              Seasons
            </button>

            {/* SEASONS MENU */}
            {menuMode === "seasons" && (
              <div className="mt-2 bg-black/95 border border-white/10 rounded-lg p-2 w-48 shadow-2xl">
                <div className="max-h-56 overflow-y-auto custom-vertical-slider pr-2">
                  {movie.seasons.map((s) => {
                    const isSeasonActive = playingSeason === s.season;
                    return (
                      <button
                        key={s.season}
                        onClick={() => {
                          setActiveSeason(s.season);
                          setMenuMode("episodes");
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 transition ${
                          isSeasonActive
                            ? "bg-red-600 text-white"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                      >
                        Season {s.season}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EPISODES MENU */}
            {menuMode === "episodes" && (
              <div className="mt-2 bg-black/95 border border-white/10 rounded-lg p-2 w-56 shadow-2xl">

                <button
                  onClick={() => setMenuMode("seasons")}
                  className="text-left w-full mb-2 px-2 py-1 text-sm text-white/80 hover:text-white"
                >
                  ← Season {activeSeason}
                </button>

                <div className="max-h-56 overflow-y-auto custom-vertical-slider pr-2">
                  {movie.seasons
                    .find((s) => s.season === activeSeason)
                    ?.episodes.map((ep) => {
                      const isActive =
                        playingSeason === activeSeason &&
                        playingEp === ep.ep;
                      return (
                        <button
                          key={ep.ep}
                          onClick={() => {
                            setActiveEpisode({ season: activeSeason, ep: ep.ep });
                            setMenuMode(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 transition ${
                            isActive
                              ? "bg-red-600 text-white"
                              : "bg-white/10 text-gray-300 hover:bg-white/20"
                          }`}
                        >
                          Episode {ep.ep}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

          </div>
        )}

      {/* ================= PLAYER ================= */}
      {showPlayer && (
        <div className="pt-1 px-0 md:px-6">
          <div className="w-full max-w-[100vw] md:max-w-7xl mx-auto px-2 md:px-0">

            <div className="w-full md:w-auto scale-[1.05] md:scale-100 origin-top relative">

              {!useIframe && currentVideo?.videoUrl ? (
                <CustomVideoPlayer
                  key={currentVideo.videoUrl}
                  src={currentVideo.videoUrl}
                />
              ) : (
                <iframe
                  src={currentVideo?.backupIframe}
                  className="
                    w-[340px] h-[220px]
                    md:w-full md:h-[75vh]
                    rounded-lg mx-auto
                  "
                  allowFullScreen
                />
              )}

              {/* ================= TITLE + INFO ================= */}
              <div className="mt-3 md:mt-2 px-1 md:px-0">

                {/* TITLE ROW with heart inline */}
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {movie.title}
                  </h1>
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
                  >
                    <Heart
                      size={24}
                      className={
                        wishlist.some((m) => String(m.id) === String(movie.id))
                          ? "text-white fill-white"
                          : "text-white"
                      }
                    />
                  </button>
                </div>

                {/* SEASON + EPISODE LABEL */}
                {movie.type === "Series" && (
                  <p className="text-sm text-gray-400 mt-1">
                    Season {playingSeason} &nbsp;·&nbsp; Episode {playingEp}
                  </p>
                )}

                {/* BACKUP PLAYER MESSAGE */}
                <div className="text-sm text-gray-400 mt-2 flex items-center gap-1 flex-wrap">
                  {!currentVideo?.videoUrl ? (
                    <span className="text-red-500 font-semibold">
                      Playing Backup Player
                    </span>
                  ) : useIframe ? (
                    <>
                      <span>Using backup player.</span>
                      <button
                        onClick={() => setUseIframe(false)}
                        className="text-blue-500 font-semibold hover:underline"
                      >
                        Switch to main player
                      </button>
                    </>
                  ) : (
                    <>
                      <span>If the video fails to load, try</span>
                      <button
                        onClick={() => setUseIframe(true)}
                        className="text-red-500 font-semibold hover:underline"
                      >
                        backup player
                      </button>
                      .
                    </>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= SUGGESTIONS ================= */}
      <div className="max-w-7xl mx-auto px-6 mt-10">

        <h2 className="text-2xl font-bold mb-5">
          You May Also Like
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-4">
          {movies
            .filter(
              (m) =>
                m.id !== movie.id &&
                m.genre?.some((g) => movie.genre?.includes(g))
            )
            .slice(0, 12)
            .map((m) => (
              <div
                key={m.id}
                className="cursor-pointer group relative transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                onClick={() => (window.location.href = `/watch/${m.id}`)}
              >
                <div className="relative rounded-md overflow-hidden shadow-md">
                  <div className="absolute top-2 left-2 z-10 bg-white text-black px-2 py-1 rounded text-[10px] font-bold">
                    {m.type}
                  </div>
                  <img
                    src={
                      m.poster_path?.startsWith("http")
                        ? m.poster_path
                        : "https://image.tmdb.org/t/p/w500" + m.poster_path
                    }
                    className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <p className="mt-1 text-[12px] md:text-sm text-gray-300 line-clamp-1">
                  {m.title}
                </p>
              </div>
            ))}
        </div>

      </div>

    </div>
  );
}