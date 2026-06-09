// watchProgress.js

const KEY = "watchProgress";

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function saveProgress(id, currentTime, duration, season = null, ep = null) {
  const all = getProgress();
  all[String(id)] = { currentTime, duration, ...(season != null && { season, ep }) };
  localStorage.setItem("watchProgress", JSON.stringify(all));
}
export function clearProgress(movieId) {
  const all = getProgress();
  delete all[String(movieId)];
  localStorage.setItem(KEY, JSON.stringify(all));
}