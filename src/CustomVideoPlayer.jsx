import { useEffect, useRef } from "react";

export default function CustomVideoPlayer({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!window.Playerjs) return;

    new window.Playerjs({
      id: videoRef.current.id,
      file: src,
    });
  }, [src]);

  return (
    <div
      id="player"
      ref={videoRef}
      className="w-full h-full"
    />
  );
}