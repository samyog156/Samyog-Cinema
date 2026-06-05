const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

export const IMG_URL = IMG;

export const getTrending = () =>
  fetch(`${BASE}/trending/movie/week?api_key=${API_KEY}`).then(r => r.json());

export const getPopular = () =>
  fetch(`${BASE}/movie/popular?api_key=${API_KEY}`).then(r => r.json());

export const getTopRated = () =>
  fetch(`${BASE}/movie/top_rated?api_key=${API_KEY}`).then(r => r.json());

export const searchMovie = (q) =>
  fetch(`${BASE}/search/movie?api_key=${API_KEY}&query=${q}`).then(r => r.json());

export const getMovie = (id) =>
  fetch(`${BASE}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`).then(r => r.json());