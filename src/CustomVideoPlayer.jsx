import { useEffect, useRef } from "react";
import { saveProgress, clearProgress, getProgress } from "./watchProgress";

export default function CustomVideoPlayer({ src, movieId }) {
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!window.Playerjs) return;

    // Give the div a unique id per src so Playerjs reinits cleanly
    const playerId = "player_" + String(movieId || "default");
    containerRef.current.id = playerId;

    const player = new window.Playerjs({
      id: playerId,
      file: src,
    });

    playerRef.current = player;

    // Restore saved position once player is ready
    const savedProgress = getProgress()[String(movieId)];

    if (savedProgress?.currentTime && savedProgress.currentTime > 5) {
      // Playerjs fires "ready" — seek after a short delay as fallback
      setTimeout(() => {
        try {
          player.api("seek", Math.floor(savedProgress.currentTime));
        } catch (e) {}
      }, 1500);
    }

    // Poll currentTime every 5 seconds via Playerjs API
    intervalRef.current = setInterval(() => {
      try {
        const currentTime = player.api("time");
        const duration = player.api("duration");

        if (duration && duration > 0 && currentTime > 0) {
          const pct = currentTime / duration;

          if (pct >= 0.95) {
            // Fully watched — clear progress
            clearProgress(movieId);
          } else {
            saveProgress(movieId, currentTime, duration);
          }
        }
      } catch (e) {}
    }, 5000);

    return () => {
      clearInterval(intervalRef.current);
      try {
        player.api("destroy");
      } catch (e) {}
    };
  }, [src, movieId]);

  return (
    <div
      id="player_default"
      ref={containerRef}
      className="
        w-[340px] h-[220px]
        md:w-full md:h-[75vh]
        rounded-lg mx-auto
      "
    />
  );
}
