"use client";
import { useRef, useState } from "react";
export default function AudioPlayer({
  src,
  name,
}: {
  src: string;
  name: string;
}) {
  const player = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState(false);
  const [rate, setRate] = useState(1);
  return (
    <section className="audio-panel" aria-label="Audioguia">
      <div className="section-heading">
        <div>
          <span className="eyebrow">OUÇA A HISTÓRIA</span>
          <h2>Uma nova forma de descobrir</h2>
        </div>
        <span aria-hidden="true">♫</span>
      </div>
      <audio
        ref={player}
        controls
        preload="metadata"
        src={src}
        aria-label={`Audioguia: ${name}`}
        onError={() => setError(true)}
        onLoadedMetadata={() => {
          if (player.current) player.current.playbackRate = rate;
        }}
      />
      <div className="audio-actions">
        <button
          onClick={() => {
            if (player.current)
              player.current.currentTime = Math.max(
                0,
                player.current.currentTime - 15,
              );
          }}
        >
          ↶ 15 segundos
        </button>
        <label>
          Velocidade{" "}
          <select
            value={rate}
            onChange={(e) => {
              const v = +e.target.value;
              setRate(v);
              if (player.current) player.current.playbackRate = v;
            }}
          >
            {[1, 1.5, 2].map((v) => (
              <option key={v} value={v}>
                {v}×
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={() => {
            if (player.current && Number.isFinite(player.current.duration))
              player.current.currentTime = Math.min(
                player.current.duration,
                player.current.currentTime + 15,
              );
          }}
        >
          15 segundos ↷
        </button>
      </div>
      {error && (
        <p role="alert">
          Não foi possível carregar o áudio.{" "}
          <button
            onClick={() => {
              setError(false);
              player.current?.load();
            }}
          >
            Tentar novamente
          </button>
        </p>
      )}
    </section>
  );
}
