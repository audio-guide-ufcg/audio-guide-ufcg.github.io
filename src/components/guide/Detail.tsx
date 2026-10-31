"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  API_URL,
  Point,
  demoPoints,
  recoveredPoints,
  canRatePoint,
  loadPoint,
  price,
  request,
} from "@/lib/guide";
import { Brand, PointImage } from "./Explorer";
import AudioPlayer from "./AudioPlayer";
function Rating({ point, demo }: { point: Point; demo: boolean }) {
  const ratingDisabled = demo || !canRatePoint(point);
  const [selected, setSelected] = useState(0);
  const [saved, setSaved] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const key = `audioguide:rating:${API_URL}:${point.id}`;
  useEffect(() => {
    try {
      setSaved(Number(localStorage.getItem(key)) || 0);
    } catch {}
  }, [key]);
  async function submit() {
    if (!selected || busy || ratingDisabled) return;
    setBusy(true);
    setMessage("");
    try {
      await request("points/rate", undefined, {
        point_id: point.id,
        rating: selected,
      });
      setSaved(selected);
      try {
        localStorage.setItem(key, String(selected));
      } catch {}
      setMessage("Obrigado! Sua avaliação foi enviada.");
    } catch {
      setMessage(
        "Não foi possível enviar. Sua avaliação não foi salva; tente novamente.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="rating-panel">
      <h2>Como foi sua visita?</h2>
      <p>
        {point.rating
          ? `Média do público: ${point.rating.toFixed(1)} de 5`
          : point.source === "recovered"
            ? "Avaliações antigas não foram recuperadas."
            : "Ainda sem avaliações."}
      </p>
      <div className="stars" role="group" aria-label="Escolha sua avaliação">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            disabled={!!saved || busy || ratingDisabled}
            aria-label={`${v} ${v === 1 ? "estrela" : "estrelas"}`}
            aria-pressed={(saved || selected) === v}
            onClick={() => setSelected(v)}
          >
            {v <= (saved || selected) ? "★" : "☆"}
          </button>
        ))}
      </div>
      {ratingDisabled ? (
        <p>Avaliações indisponíveis enquanto o serviço não for reconectado.</p>
      ) : saved ? (
        <p>Sua avaliação: {saved} de 5. Obrigado!</p>
      ) : (
        <button
          className="primary"
          disabled={!selected || busy}
          onClick={submit}
        >
          {busy ? "Enviando…" : "Enviar avaliação"}
        </button>
      )}
      {message && <p role="status">{message}</p>}
    </section>
  );
}
export default function Detail({ id }: { id: number }) {
  const params = useSearchParams();
  const demo = params.get("demo") === "1";
  const recovered = params.get("source") === "recovered" || id < 0;
  const language = params.get("language") === "en" ? "en" : "pt";
  const [point, setPoint] = useState<Point | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [tab, setTab] = useState("info");
  const [image, setImage] = useState(0);
  const [share, setShare] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    setPoint(null);
    setError("");
    setImage(0);
    if (recovered) {
      const p = recoveredPoints.find((p) => p.id === id);
      if (p) setPoint(p);
      else setError("Ponto recuperado não encontrado.");
      return;
    }
    if (demo) {
      const p = demoPoints.find((p) => p.id === id);
      if (p) setPoint(p);
      else setError("Ponto não encontrado.");
      return;
    }
    if (!Number.isInteger(id) || id < 1) {
      setError("Ponto inválido.");
      return;
    }
    loadPoint(id, language, controller.signal)
      .then(setPoint)
      .catch(() => {
        if (!controller.signal.aborted)
          setError(
            "Não foi possível carregar este lugar. Verifique o endereço ou tente novamente.",
          );
      });
    return () => controller.abort();
  }, [id, demo, recovered, language, reload]);
  async function sharePoint() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShare("Link copiado!");
    } catch {
      setShare("Copie o endereço desta página para compartilhar.");
    }
  }
  return (
    <>
      <header className="topbar">
        <Brand />
        <Link className="back-link" href="/">
          ← Explorar lugares
        </Link>
      </header>
      <main className="detail">
        {error ? (
          <div className="empty" role="alert">
            <h1>Lugar indisponível</h1>
            <p>{error}</p>
            <button onClick={() => setReload((n) => n + 1)}>
              Tentar novamente
            </button>
          </div>
        ) : !point ? (
          <p className="empty" role="status">
            Carregando lugar…
          </p>
        ) : (
          <>
            {recovered && (
              <p className="demo-notice">
                Catálogo recuperado de 2024. Confirme preços, horários, contatos
                e condições de acessibilidade antes da visita.
              </p>
            )}
            {demo && (
              <p className="demo-notice">
                Demonstração · Este ponto é fictício. O áudio recuperado é
                apenas uma amostra para teste.
              </p>
            )}
            {point.locationNeedsReview && <p className="notice">A coordenada deste local está em revisão. Confira o endereço antes de sair.</p>}
            <div className="detail-title">
              <div>
                <span className="eyebrow">{point.type}</span>
                <h1>{point.name}</h1>
                <p>{point.address || "Endereço não informado"}</p>
              </div>
              <button onClick={sharePoint}>↗ Compartilhar</button>
            </div>
            {share && <p role="status">{share}</p>}
            <div className="detail-columns">
              <div className="detail-main">
                <div className="detail-hero">
                  {point.images.length ? (
                    <button
                      className="hero-button"
                      aria-label="Ampliar imagem"
                      onClick={() => dialog.current?.showModal()}
                    >
                      <img
                        src={point.images[image].url}
                        alt={point.name}
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </button>
                  ) : (
                    <PointImage point={point} />
                  )}
                </div>
                {!!point.images.length && (
                  <>
                    <p className="credits">
                      {point.images[image].credits &&
                        `Foto: ${point.images[image].credits}`}
                    </p>
                    <div className="thumbnails">
                      {point.images.map((img, i) => (
                        <button
                          key={img.url}
                          aria-label={`Ver foto ${i + 1}`}
                          aria-pressed={image === i}
                          onClick={() => setImage(i)}
                        >
                          <img
                            src={img.url}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                    <dialog
                      ref={dialog}
                      className="lightbox"
                      onClick={(e) => {
                        if (e.target === e.currentTarget)
                          dialog.current?.close();
                      }}
                    >
                      <button
                        autoFocus
                        onClick={() => dialog.current?.close()}
                        aria-label="Fechar imagem"
                      >
                        ×
                      </button>
                      <img src={point.images[image].url} alt={point.name} />
                      <p>{point.images[image].credits}</p>
                    </dialog>
                  </>
                )}
                <div className="tags">
                  {point.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                {point.audio ? (
                  <AudioPlayer
                    key={point.audio}
                    src={point.audio}
                    name={point.name}
                  />
                ) : (
                  <p className="notice">
                    Este lugar ainda não tem audioguia disponível.
                  </p>
                )}
                <div className="detail-tabs">
                  <button
                    aria-pressed={tab === "info"}
                    className={tab === "info" ? "active" : ""}
                    onClick={() => setTab("info")}
                  >
                    Informações
                  </button>
                  <button
                    aria-pressed={tab === "transcript"}
                    className={tab === "transcript" ? "active" : ""}
                    onClick={() => setTab("transcript")}
                  >
                    Transcrição
                  </button>
                </div>
                {tab === "transcript" ? (
                  <section className="text-panel">
                    <h2>História do lugar</h2>
                    <p>
                      {point.transcript ||
                        "Transcrição ainda não disponível neste idioma."}
                    </p>
                  </section>
                ) : (
                  <section className="text-panel">
                    <h2>Planeje sua visita</h2>
                    <div className="info-grid">
                      <div>
                        <h3>
                          Horários{recovered ? " cadastrados em 2024" : ""}
                        </h3>
                        {point.shouldContact || point.hours.every((h) => !h) ? (
                          <p>Entre em contato para confirmar os horários.</p>
                        ) : (
                          <dl className="hours">
                            {[
                              "Domingo",
                              "Segunda",
                              "Terça",
                              "Quarta",
                              "Quinta",
                              "Sexta",
                              "Sábado",
                            ].map((d, i) => (
                              <div key={d}>
                                <dt>{d}</dt>
                                <dd>{point.hours[i] || "Fechado"}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                      </div>
                      <div>
                        <h3>Acessibilidade</h3>
                        <p>
                          {point.accessible === true
                            ? "Local indicado como acessível."
                            : point.accessible === false
                              ? "Local não indicado como acessível. Confirme as condições antes da visita."
                              : "Informação não disponível."}
                        </p>
                        <h3>Contato</h3>
                        {point.telephone && (
                          <p>
                            <a
                              href={`tel:${point.telephone.replace(/[^+\d]/g, "")}`}
                            >
                              {point.telephone}
                            </a>
                          </p>
                        )}
                        {point.email && (
                          <p>
                            <a href={`mailto:${point.email}`}>{point.email}</a>
                          </p>
                        )}
                        {!point.telephone && !point.email && (
                          <p>Contato não informado.</p>
                        )}
                      </div>
                    </div>
                  </section>
                )}
              </div>
              <aside className="visit-panel">
                <span className="eyebrow">SUA PRÓXIMA DESCOBERTA</span>
                <h2>Vamos explorar?</h2>
                <div className="visit-row">
                  <span>Entrada</span>
                  <strong>{price(point.entryPrice)}</strong>
                </div>
                <div className="visit-row">
                  <span>Audioguia</span>
                  <strong>{point.audio ? "Disponível" : "Em breve"}</strong>
                </div>
                <p>{point.address}</p>
                {!demo && !point.locationNeedsReview && (
                  <a
                    className="primary route-link"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ⌖ Como chegar ↗
                  </a>
                )}
                <Rating key={point.id} point={point} demo={demo} />
              </aside>
            </div>
          </>
        )}
      </main>
    </>
  );
}
