// watchProgress.js

const KEY = "watchProgress";

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function saveProgress(movieId, currentTime, duration) {
  if (!duration || duration === 0) return;
  const all = getProgress();
  all[String(movieId)] = { currentTime, duration };
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function clearProgress(movieId) {
  const all = getProgress();
  delete all[String(movieId)];
  localStorage.setItem(KEY, JSON.stringify(all));
}