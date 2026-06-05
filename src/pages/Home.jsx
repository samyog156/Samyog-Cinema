import { useNavigate } from "react-router-dom";
import movies from "../Movies";
import { useEffect, useState } from "react";
import { getWishlist, saveWishlist } from "../wishlist";
import logo from "../assets/logo.png";
import GenrePage from "./GenrePage";



import {
  Play,
  Search,
  ChevronRight,
  Heart,
  X,
} from "lucide-react";


// MOVIE ROW
 const Row = ({ title, movies, onMovieClick, onMore }) => (
    <div className="px-6  mt-0 md:mt-0 relative z-0">

      {/* ROW HEADER */}
      <div className="flex items-center justify-between mb-4">

        <h2 className="text-2xl font-bold border-l-4 border-red-600 pl-3"
    style={{ fontFamily: "Inter, sans-serif" }}>
  {title}
</h2>

        <button
  onClick={() => onMore(title, movies)}
  className="flex items-center gap-1 text-gray-400 hover:text-white text-sm"
>
  More <ChevronRight size={16} />
</button>

      </div>

      {/* MOVIES */}
      <div className="flex gap-4 overflow-x-auto overflow-y-visible scroll-smooth no-scrollbar pb-10 pt-4 pl-4 relative z-0">

        {movies.map((m) => (
          <div
  key={m.id}
  onClick={() => onMovieClick(m)}
  className="min-w-[90px] md:min-w-[180px] cursor-pointer group relative z-10 transition-all duration-300 hover:scale-105 hover:-translate-y-2 shadow-2xl"
>

  {/* IMAGE WRAPPER */}
  <div className="relative rounded-lg overflow-hidden shadow-lg transition duration-300 group-hover:shadow-2xl">

    {/* TYPE BADGE */}
    <div className="absolute top-2 left-2 z-10 bg-white text-black px-2 py-1 rounded text-[10px] font-bold">
      {m.type}
    </div>

    {/* POSTER */}
    <img
  src={
    m.poster_path?.startsWith("http")
      ? m.poster_path
      : "https://image.tmdb.org/t/p/w500" + m.poster_path
  }
 className="
    w-[110px] h-[165px]
    md:w-[180px] md:h-[270px]
    object-cover rounded-lg
    transition-transform duration-300
    group-hover:scale-105
  "
/>

  </div>

  {/* TITLE */}
  <p className="mt-2 text-base font-medium text-gray-300 line-clamp-1">
    {m.title}
  </p>

</div>
        ))}

      </div>

    </div>
  );


export default function Home() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [hero, setHero] = useState([]);
const [trending, setTrending] = useState([]);
const [popular, setPopular] = useState([]);
const [action, setAction] = useState([]);
const [showProfilePopup, setShowProfilePopup] = useState(false);
const [profileName, setProfileName] = useState("");
const [profiles, setProfiles] = useState([]);
const [currentProfile, setCurrentProfile] = useState(null);
const [anime, setAnime] = useState([]);

  const [selected, setSelected] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  const [wishlist, setWishlist] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [videoUrl, setVideoUrl] = useState(null);

  const navigate = useNavigate();

const handleMore = (title, moviesList) => {
  navigate(`/genre/${title}`, {
    state: { movies: moviesList, title }
  });
};


const deleteProfile = (id) => {
  const updatedProfiles = profiles.filter((p) => p.id !== id);

  setProfiles(updatedProfiles);
  localStorage.setItem("profiles", JSON.stringify(updatedProfiles));

  // if deleted profile was active → reset
  const current = JSON.parse(localStorage.getItem("currentProfile"));

  if (current?.id === id) {
    localStorage.removeItem("currentProfile");
    setCurrentProfile(null);
    setShowProfilePopup(true);
  }
};



useEffect(() => {
  setWishlist(getWishlist());
}, []);

useEffect(() => {
  const savedProfiles =
    JSON.parse(localStorage.getItem("profiles")) || [];

  const selectedProfile =
    JSON.parse(localStorage.getItem("currentProfile"));

  setProfiles(savedProfiles);

  if (selectedProfile) {
    setCurrentProfile(selectedProfile);
    setShowProfilePopup(false); // ✅ already selected → DO NOT show popup
  } else {
    setShowProfilePopup(true); // ✅ first time only
  }
}, []);
  

  useEffect(() => {
  // latest movie first
  const sortedMovies = [...movies].sort(
    (a, b) => Number(b.id) - Number(a.id)
  );

  setHero(
    sortedMovies.filter((m) =>
      m.genre?.includes("hero")
    )
  );

  setTrending(
    sortedMovies.filter((m) =>
      m.genre?.includes("trending")
    )
  );

  setPopular(
    sortedMovies.filter((m) =>
      m.genre?.includes("popular")
    )
  );

  setAction(
    sortedMovies.filter((m) =>
      m.genre?.includes("action")
    )
  );

 setAnime(
  sortedMovies.filter(
    (m) => m.type?.toLowerCase() === "anime"
  )
);
}, []);
  
  // HERO AUTO SLIDE
  useEffect(() => {
    if (!hero.length) return;

    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % hero.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [hero]);

  // OPEN MOVIE
  const openMovie = (movie) => {
    setSelected(movie);
    setTrailerKey(null);
  };

  

  // WISHLIST
  const toggleWishlist = (movie) => {
  const current = getWishlist();

  const exists = current.some((m) => String(m.id) === String(movie.id));

  let updated;

  if (exists) {
    updated = current.filter((m) => String(m.id) !== String(movie.id));
  } else {
    updated = [...current, movie];
  }

  setWishlist(updated);
  saveWishlist(updated);
};

 const createProfile = () => {
  if (!profileName.trim()) return;

  const newProfile = {
    id: Date.now(),
    name: profileName,
  };

  const updatedProfiles = [...profiles, newProfile];

  localStorage.setItem(
    "profiles",
    JSON.stringify(updatedProfiles)
  );

  localStorage.setItem(
    "currentProfile",
    JSON.stringify(newProfile)
  );

  setProfiles(updatedProfiles);
  setCurrentProfile(newProfile);
  setShowProfilePopup(false);
};

const selectProfile = (profile) => {
  localStorage.setItem(
    "currentProfile",
    JSON.stringify(profile)
  );

  setCurrentProfile(profile);
  setShowProfilePopup(false);
};

 

useEffect(() => {
  if (!searchTerm.trim()) {
    setSearchResults([]);
    return;
  }

  const allMovies = movies;

  const results = allMovies.filter((movie) =>
    movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  setSearchResults(results.slice(0, 8)); // limit suggestions
}, [searchTerm, trending, popular, action]);
  return (
    <div className="bg-black text-white min-h-screen w-full overflow-x-hidden">



     {/* NAVBAR WRAPPER */}
     <div style={{ fontFamily: "Inter, sans-serif" }}></div>
<div className="relative z-50">

  {/* ================= DESKTOP NAVBAR ================= */}
  <div className="hidden md:flex items-center w-full px-6 py-4 border-b border-white/10 relative bg-transparent backdrop-blur-md">

    {/* LEFT */}
    <div className="flex items-center gap-4">
      <img
  src={logo}
  alt="Logo"
 className="h-14 w-15 object-contain"
/>

      
    </div>

    {/* CENTER MENU */}
    <div
  className="flex items-center gap-6 text-gray-400 text-base font-medium ml-4"
  style={{ fontFamily: "Inter, sans-serif" }}
>

      {["home", "movies", "series", "anime", "wishlist"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
         className={`${activeTab === tab ? "text-white" : "text-gray-400"} hover:text-gray-200 transition`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}

    </div>

    {/* RIGHT SECTION */}
<div className="ml-auto flex items-center gap-6">

  {/* SEARCH + DROPDOWN WRAPPER */}
<div className="relative">

  {/* SEARCH BOX */}
  <div className="flex items-center bg-white/10 px-3 py-2 rounded w-72">
    <Search size={16} />

    <input
      type="text"
      placeholder="Search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="bg-transparent outline-none ml-2 text-sm w-full"
    />
  </div>

  {/* DROPDOWN (FIXED ALIGNMENT) */}
  {searchTerm && searchResults.length > 0 && (
    <div className="absolute left-0 top-full mt-2 w-72 bg-black/95 border border-white/10 rounded-lg max-h-80 overflow-y-auto z-50">

      {searchResults.map((movie) => (
        <div
          key={movie.id}
          onClick={() => {
            openMovie(movie);
            setSearchTerm("");
            setSearchResults([]);
          }}
          className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer"
        >
          <img
            src={"https://image.tmdb.org/t/p/w200" + movie.poster_path}
            className="w-10 h-14 object-cover rounded"
          />
          <p className="text-sm">{movie.title}</p>
        </div>
      ))}

    </div>
  )}

</div>

  {/* PROFILE SECTION */}
  {currentProfile && (
    <div className="flex flex-col items-center text-center">
      
      {/* PROFILE IMAGE */}
      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black font-bold">
        {currentProfile.name?.charAt(0).toUpperCase()}
      </div>

      {/* NAME BELOW */}
      <span className="text-xs text-gray-300 mt-1">
        {currentProfile.name}
      </span>

    </div>
  )}


</div>
  </div>

  {/* ================= MOBILE NAVBAR ================= */}
  <div className="flex md:hidden items-center justify-between w-full px-4 py-3 border-b border-white/10 bg-transparent backdrop-blur-md relative z-50">

    {/* LEFT */}
    <div className="flex items-center gap-3">
      <img
  src={logo}
  alt="Logo"
  className="h-14 w-auto object-contain"
/>

      {currentProfile && (
        <div className="text-xs text-gray-300">
  Welcome,{" "}
  <span className="text-white font-semibold">
    {currentProfile.name}
  </span>
</div>
      )}
    </div>

    {/* RIGHT */}
    <div className="flex items-center gap-3">
  
  {/* SEARCH ICON */}
  <Search 
    size={18} 
    onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
    className="cursor-pointer"
  />

  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="text-white text-2xl"
  >
    ☰
  </button>

</div>

  </div>

  {/* ================= MOBILE MENU ================= */}
  {menuOpen && (
    <div className="absolute top-[60px] right-3 w-52 bg-black border border-white/10 rounded-lg z-[999]">

      {["home", "movies", "series", "anime", "wishlist"].map((tab) => (
        <button
          key={tab}
          onClick={() => {
            setActiveTab(tab);
            setMenuOpen(false);
          }}
          className={`w-full text-left px-4 py-3 capitalize hover:bg-white/10 ${
            activeTab === tab ? "text-red-500" : "text-white"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}

    </div>
  )}

  {mobileSearchOpen && (
  <div className="absolute top-[60px] left-0 w-full bg-black border-b border-white/10 p-3 z-[999]">

    {/* INPUT */}
    <input
      type="text"
      placeholder="Search movies..."
      value={mobileSearchTerm}
      onChange={(e) => setMobileSearchTerm(e.target.value)}
      className="w-full bg-white/10 px-3 py-2 rounded outline-none"
    />

    {/* SUGGESTIONS */}
    {mobileSearchTerm && (
      <div className="mt-2 max-h-60 overflow-y-auto">

        {movies
          .filter((m) =>
            m.title?.toLowerCase().includes(mobileSearchTerm.toLowerCase())
          )
          .slice(0, 6)
          .map((movie) => (
            <div
              key={movie.id}
              onClick={() => {
                openMovie(movie);
                setMobileSearchTerm("");
                setMobileSearchOpen(false);
              }}
              className="flex items-center gap-3 p-2 hover:bg-white/10 cursor-pointer"
            >

              <img
                src={
                  "https://image.tmdb.org/t/p/w200" + movie.poster_path
                }
                className="w-10 h-14 object-cover rounded"
              />

              <p className="text-sm">{movie.title}</p>

            </div>
          ))}

      </div>
    )}

  </div>
)}



      </div>

      {/* HERO SECTION */}
      <div className="relative h-[55vh] md:h-[70vh] overflow-hidden z-0">

        {hero.map((item, i) => (
          <div
            key={item.id}
            className="absolute w-full h-full transition-all duration-700 ease-in-out"
            style={{
              transform: `translateX(${(i - heroIndex) * 100}%)`,
            }}
          >

            {/* HERO IMAGE */}
            <img
              src={
                "https://image.tmdb.org/t/p/original" +
                item.backdrop_path
              }
              className="w-full h-full object-cover opacity-60"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 flex items-center px-10">

              <div className="max-w-xl mt-14 md:mt-0">

                <div className="flex items-center gap-3">

  <h1 className="text-5xl font-extrabold">
    {item.title}
  </h1>

  <div className="bg-white text-black px-4 py-1 rounded text-sm font-bold mt-4">
    {item.type}
  </div>

</div>

                <p className="hidden md:block text-gray-300 text-sm mt-4">
  {item.overview}
</p>

                <button
  onClick={() => openMovie(hero[heroIndex])}
  className="mt-5 bg-white text-black hover:bg-gray-200 px-5 py-2 rounded flex items-center gap-2 font-semibold transition"
>
  <Play size={16} />
  Play Now
</button>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* ROWS */}
     {activeTab === "home" && (
  <>
    <Row
  title="Trending"
  movies={trending}
  onMovieClick={openMovie}
  onMore={handleMore}
/>

<Row
  title="Popular"
  movies={popular}
  onMovieClick={openMovie}
  onMore={handleMore}
/>

<Row
  title="Action"
  movies={action}
  onMovieClick={openMovie}
  onMore={handleMore}
/>
  </>
)}

{activeTab === "movies" && (
  <Row
    title="🎬 Movies"
    movies={[
      ...movies
        .filter((m) => m.type === "Movie")
        .sort((a, b) => Number(b.id) - Number(a.id))
    ]}
    onMovieClick={openMovie}
  />
)}

{activeTab === "series" && (
  <Row
    title="📺 Series"
    movies={[
      ...movies
        .filter((m) => m.type === "Series")
        .sort((a, b) => Number(b.id) - Number(a.id))
    ]}
    onMovieClick={openMovie}
  />
)}

{activeTab === "anime" && (
  <Row
    title="🎌 Anime"
    movies={anime}
    onMovieClick={openMovie}
  />
)}

{activeTab === "wishlist" && (
  <Row
  title="❤️ My Wishlist"
  movies={wishlist}
  onMovieClick={openMovie}
/>
)}
{videoUrl && (
  <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">

    {/* CLOSE BUTTON */}
    <button
      className="absolute top-5 right-5 text-white text-2xl"
      onClick={() => setVideoUrl(null)}
    >
      ✕
    </button>

    {/* VIDEO PLAYER */}
    <video
      src={videoUrl}
      controls
      autoPlay
      className="w-full h-full"
    />

  </div>
)}

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-auto p-6">

          {/* CLOSE */}
          <button
            onClick={() => {
              setSelected(null);
              setTrailerKey(null);
            }}
            className="absolute top-5 right-5"
          >
            <X />
          </button>

          <div className="max-w-xl mx-auto px-4">

            {/* TRAILER */}
            {trailerKey ? (
  <div className="w-full aspect-video rounded-xl overflow-hidden">
    <iframe
      className="w-full h-full"
      src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
      allowFullScreen
    />
  </div>
) : (
  <img
    src={
      selected.backdrop_path?.startsWith("http")
        ? selected.backdrop_path
        : "https://image.tmdb.org/t/p/original" + selected.backdrop_path
    }
    className="w-full aspect-video object-cover rounded-xl"
  />
)}

            {/* TITLE */}
            <h1 className="text-3xl font-bold mt-5">
              {selected.title}
            </h1>

            {/* OVERVIEW */}
            <p className="text-gray-300 mt-3">
              {selected.overview}
            </p>

            {/* ACTIONS */}
            <div className="flex items-center gap-4 mt-5">

              {/* WATCH TRAILER */}
              <button
  onClick={() => navigate(`/watch/${selected.id}`)}
  className="bg-white text-black hover:bg-gray-200 px-5 py-2 rounded flex items-center gap-2 font-semibold"
>
  <Play size={18} />
  Play
</button>
              <button
  onClick={() => setTrailerKey(selected.trailerId)}
  className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded flex items-center gap-2"
>
  <Play size={18} />

  {/* Desktop text */}
  <span className="hidden md:inline">Watch Trailer</span>

  {/* Mobile text */}
  <span className="md:hidden">Trailer</span>

</button>

              {/* WISHLIST */}
              <button onClick={() => toggleWishlist(selected)}>

                <Heart
                  className={
                    wishlist.find((m) => m.id === selected.id)
                      ? "text-white fill-white"
                      : "text-gray-400"
                  }
                />

              </button>

            </div>

          </div>

        </div>
      )}


{/* PROFILE POPUP */}
{showProfilePopup && (
  <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center">

    <div className="bg-[#111] w-[400px] rounded-2xl p-8 border border-white/10">

      <h1 className="text-3xl font-bold text-center mb-8">
        Who's going to use?
      </h1>

      {/* EXISTING ACCOUNTS */}
      {profiles.length > 0 && (
        <div className="mb-6">

          <div className="flex flex-wrap gap-3">

            {profiles.map((profile) => (
  <div key={profile.id} className="relative">

    {/* PROFILE BUTTON */}
    <button
      onClick={() => selectProfile(profile)}
      className="bg-white/10 hover:bg-red-600 transition px-5 py-3 rounded-lg pr-10"
    >
      {profile.name}
    </button>

    {/* DELETE BUTTON (ALWAYS VISIBLE) */}
    <button
      onClick={() => deleteProfile(profile.id)}
      className="absolute top-1 right-1 text-white text-xs bg-red-600 w-5 h-5 rounded-full flex items-center justify-center"
    >
      ✕
    </button>

  </div>
))}
          </div>

        </div>
      )}

      {/* ADD ACCOUNT */}
      <input
        type="text"
        placeholder="Enter Name"
        value={profileName}
        onChange={(e) =>
          setProfileName(e.target.value)
        }
        className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 outline-none"
      />

      <button
        onClick={createProfile}
        className="w-full mt-5 bg-red-600 hover:bg-red-700 transition py-3 rounded-lg font-semibold"
      >
        Continue
      </button>

    </div>

  </div>
)}
    </div>
  );
}
