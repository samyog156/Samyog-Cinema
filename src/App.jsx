import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import { useEffect, useState } from "react";
import GenrePage from "./pages/GenrePage";
import Genre from "./pages/Genre";

export default function App() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
  setWishlist(saved);
}, []);

useEffect(() => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}, [wishlist]);

const toggleWishlist = (movie) => {
  setWishlist((prev) =>
    prev.find((m) => m.id === movie.id)
      ? prev.filter((m) => m.id !== movie.id)
      : [...prev, movie]
  );
};


  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/genre/:title" element={<GenrePage />} />
      <Route path="/genre/:name" element={<Genre />} />
      <Route
  path="/watch/:id"
  element={
    <Watch
      wishlist={wishlist}
      toggleWishlist={toggleWishlist}
    />
  }
/>
    </Routes>
  );
}