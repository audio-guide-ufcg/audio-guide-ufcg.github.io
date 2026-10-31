"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import AudioPlayer from "./AudioPlayer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  API_URL,
  Point,
  Language,
  recoveredPoints,
  distance,
  fold,
  loadPoints,
  openingStatus,
  price,
} from "@/lib/guide";
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <div className="map-loading">Carregando mapa…</div>,
});
export function Brand() {
  return (
    <Link href="/" className="brand">
      <span className="brand-icon" aria-hidden="true">
        ◉
      </span>{" "}
      audio<span>guide</span>
      <small>CAMPINA GRANDE</small>
    </Link>
  );
}
export function PointImage({ point }: { point: Point }) {
  const [failed, setFailed] = useState(false);
  return point.images[0] && !failed ? (
    <img
      src={point.images[0].url}
      alt={point.name}
      onError={() => setFailed(true)}
    />
  ) : (
    <div className="image-placeholder" aria-label="Imagem indisponível">
      <span aria-hidden="true">⌖</span>
      <small>{point.type}</small>
    </div>
  );
}
export default function Explorer() {
  const [points, setPoints] = useState<Point[]>([]);
  const [recovered, setRecovered] = useState(!API_URL);
  const [language, setLanguage] = useState<Language>("pt");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [accessible, setAccessible] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [sheet, setSheet] = useState<"peek" | "half" | "full">("half");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [audioOnly, setAudioOnly] = useState(false);
  const dragStart = useRef<number | null>(null);
  const dragged = useRef(false);
  const selectPoint = useCallback((id: number) => {
    setSelectedId(id);
    setSheet("half");
  }, []);
  const [clock, setClock] = useState<Date | undefined>();
  useEffect(() => {
    setClock(new Date());
    const timer = setInterval(() => setClock(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setPoints([]);
    if (recovered) {
      setPoints(recoveredPoints);
      setLoading(false);
      return;
    }
    loadPoints(language, controller.signal)
      .then(setPoints)
      .catch((e) => {
        if (!controller.signal.aborted)
          setError(
            e instanceof Error
              ? e.message
              : "Não foi possível carregar os pontos.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [recovered, language, reload]);
  const types = useMemo(
    () => Array.from(new Set(points.map((p) => p.type))).sort(),
    [points],
  );
  const filtered = useMemo(
    () =>
      points
        .filter(
          (p) =>
            (!type || p.type === type) &&
            (!audioOnly || !!p.audio) &&
            (!accessible || p.accessible === true) &&
            (!open || (clock && openingStatus(p, clock) === "open")) &&
            fold([p.name, p.type, p.address, ...p.tags].join(" ")).includes(
              fold(query),
            ),
        )
        .sort((a, b) =>
          location
            ? distance(location, a) - distance(location, b)
            : a.name.localeCompare(b.name),
        ),
    [points, type, accessible, open, audioOnly, clock, query, location],
  );
  function locate() {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Seu navegador não oferece localização. A busca continua disponível.",
      );
      return;
    }
    setLocationMessage("Buscando sua localização…");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLocation({
          latitude: p.coords.latitude,
          longitude: p.coords.longitude,
        });
        setLocationMessage("Pontos ordenados pela distância até você.");
      },
      () =>
        setLocationMessage(
          "Não foi possível acessar sua localização. Você pode continuar pelo mapa e pela busca.",
        ),
      { timeout: 10000, maximumAge: 60000 },
    );
  }
  const clear = () => {
    setQuery("");
    setType("");
    setAccessible(false);
    setOpen(false);
    setAudioOnly(false);
  };
  const selected = filtered.find((p) => p.id === selectedId);
  const pointUrl = (p: Point) =>
    `/points/${p.id}?language=${language}${recovered ? "&source=recovered" : ""}`;
  return (
    <main className={`map-app sheet-${sheet}`}>
      <div className="map-canvas">
        <Map
          points={filtered}
          location={location}
          selectedId={selected?.id ?? null}
          onSelect={selectPoint}
        />
      </div>
      <header className="map-search-area">
        <div className="map-search-box">
          <Link href="/" className="app-logo" aria-label="AudioGuide início">
            <span aria-hidden="true">◉</span>
          </Link>
          <div className="map-search-field">
            <label htmlFor="place-search">
              AudioGuide <span>Campina Grande</span>
            </label>
            <input
              id="place-search"
              placeholder="Buscar lugares e histórias"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedId(null);
              }}
            />
          </div>
          {query ? (
            <button aria-label="Limpar busca" onClick={() => setQuery("")}>
              ×
            </button>
          ) : (
            <span className="search-glyph" aria-hidden="true">
              ⌕
            </span>
          )}
        </div>
        <div className="map-chips" aria-label="Filtros de lugares">
          <button
            className={!type ? "active" : ""}
            aria-pressed={!type}
            onClick={() => {
              setType("");
              setSelectedId(null);
            }}
          >
            ⌖ Todos
          </button>
          {types.map((t) => (
            <button
              key={t}
              className={type === t ? "active" : ""}
              aria-pressed={type === t}
              onClick={() => {
                setType(type === t ? "" : t);
                setSelectedId(null);
              }}
            >
              {t}
            </button>
          ))}
          <button
            className={audioOnly ? "active" : ""}
            aria-pressed={audioOnly}
            onClick={() => setAudioOnly(!audioOnly)}
          >
            ♫ Com áudio
          </button>
          <button
            className={accessible ? "active" : ""}
            aria-pressed={accessible}
            onClick={() => setAccessible(!accessible)}
          >
            ♿ Acessível
          </button>
          <button
            className={open ? "active" : ""}
            aria-pressed={open}
            onClick={() => setOpen(!open)}
          >
            ◷ {recovered ? "Horário cadastrado" : "Aberto agora"}
          </button>
        </div>
      </header>
      <div className="map-tools">
        <button
          onClick={locate}
          aria-label="Usar minha localização"
          title="Usar minha localização"
        >
          ⌖
        </button>
        <button
          onClick={() => {
            setSheet(sheet === "peek" ? "half" : "peek");
            setSelectedId(null);
          }}
          aria-label={sheet === "peek" ? "Mostrar lugares" : "Recolher painel"}
          title="Alternar painel"
        >
          {sheet === "peek" ? "☰" : "⌄"}
        </button>
      </div>
      {locationMessage && (
        <div className="map-toast" role="status">
          <span>{locationMessage}</span>
          <button
            aria-label="Fechar aviso"
            onClick={() => setLocationMessage("")}
          >
            ×
          </button>
        </div>
      )}
      <section
        className="places-sheet"
        aria-label={selected ? selected.name : "Lugares para explorar"}
      >
        <button
          className="sheet-handle"
          aria-label={sheet === "full" ? "Recolher lista" : "Expandir lista"}
          aria-expanded={sheet === "full"}
          onPointerDown={(e) => {
            dragStart.current = e.clientY;
            dragged.current = false;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerUp={(e) => {
            const delta = e.clientY - (dragStart.current ?? e.clientY);
            dragStart.current = null;
            if (Math.abs(delta) > 25) {
              dragged.current = true;
              setSheet(delta < 0 ? "full" : "peek");
            }
          }}
          onClick={() => {
            if (!dragged.current) setSheet(sheet === "full" ? "half" : "full");
            dragged.current = false;
          }}
          onPointerCancel={() => {
            dragStart.current = null;
            dragged.current = false;
          }}
        >
          <span />
        </button>
        <div className="sheet-heading">
          <div>
            <span className="sheet-kicker">
              {selected ? selected.type : "DESCUBRA AO SEU REDOR"}
            </span>
            <h1>
              {selected
                ? selected.name
                : location
                  ? "Perto de você"
                  : "Explore a cidade"}
            </h1>
            <p>
              {selected
                ? price(selected.entryPrice)
                : `${filtered.length} ${filtered.length === 1 ? "lugar" : "lugares"}${recovered ? " recuperados" : " para conhecer"} · Campina Grande`}
            </p>
          </div>
          <button
            className="sheet-toggle"
            aria-label={
              selected
                ? "Voltar aos lugares"
                : sheet === "full"
                  ? "Mostrar mapa"
                  : "Expandir lista"
            }
            onClick={() =>
              selected
                ? setSelectedId(null)
                : setSheet(sheet === "full" ? "half" : "full")
            }
          >
            {selected ? "×" : sheet === "full" ? "⌄" : "⌃"}
          </button>
        </div>
        <div className="sheet-content">
          {recovered && (
            <div className="demo-strip">
              <span className="demo-dot" />
              <span>
                Catálogo de 2024 · Confirme as informações antes de visitar
              </span>
              {API_URL && (
                <button
                  onClick={() => {
                    setRecovered(false);
                    clear();
                  }}
                >
                  Catálogo da API
                </button>
              )}
            </div>
          )}
          {!recovered &&
            language === "en" &&
            points.some((p) => p.language !== "en") && (
              <p className="notice">
                Conteúdo sem tradução é exibido no idioma original.
              </p>
            )}
          {loading ? (
            <div className="empty" role="status">
              Carregando lugares…
            </div>
          ) : error ? (
            <div className="empty" role="alert">
              <h2>Catálogo indisponível</h2>
              <p>{error}</p>
              <button onClick={() => setReload((n) => n + 1)}>
                Tentar novamente
              </button>
              <button
                onClick={() => {
                  setRecovered(true);
                  clear();
                }}
              >
                Abrir catálogo de 2024
              </button>
            </div>
          ) : selected ? (
            <article className="selected-preview">
              <div className="selected-photo">
                <PointImage key={selected.id} point={selected} />
              </div>
              {selected.images[0]?.credits && (
                <p className="credits">Foto: {selected.images[0].credits}</p>
              )}
              <p className="selected-address">
                {selected.address || "Endereço não informado"}
              </p>
              <div className="selected-facts">
                {selected.accessible && <span>♿ Acessível</span>}
                {selected.rating > 0 && (
                  <span>★ {selected.rating.toFixed(1)}</span>
                )}
                <span>
                  {location
                    ? `${distance(location, selected).toFixed(1)} km de você`
                    : "Explore no seu ritmo"}
                </span>
              </div>
              <Link className="primary details-link" href={pointUrl(selected)}>
                Sobre este lugar <span>→</span>
              </Link>
              {selected.audio && (
                <AudioPlayer
                  key={selected.id}
                  src={selected.audio}
                  name={selected.name}
                />
              )}
            </article>
          ) : (
            <>
              {filtered.length === 0 ? (
                <div className="empty">
                  <h2>Nenhum lugar encontrado</h2>
                  <p>Tente outra busca ou remova os filtros.</p>
                  <button onClick={clear}>Limpar filtros</button>
                </div>
              ) : (
                <div className="place-list">
                  {filtered.map((p, i) => (
                    <article className="place-row" key={p.id}>
                      <button
                        className="place-select"
                        onClick={() => selectPoint(p.id)}
                        aria-label={`Ver ${p.name} no mapa`}
                      >
                        <div className="row-image">
                          <PointImage point={p} />
                          <span>{i + 1}</span>
                        </div>
                        <div className="row-copy">
                          <span className="row-type">{p.type}</span>
                          <h2>{p.name}</h2>
                          <p>
                            {price(p.entryPrice)}
                            {location
                              ? ` · ${distance(location, p).toFixed(1)} km`
                              : p.accessible
                                ? " · Acessível"
                                : ""}
                          </p>
                          {clock && (
                            <small
                              className={`status ${openingStatus(p, clock)}`}
                            >
                              {
                                {
                                  open: recovered
                                    ? "Aberto pelo horário de 2024"
                                    : "Aberto agora",
                                  closed: recovered
                                    ? "Fechado pelo horário de 2024"
                                    : "Fechado agora",
                                  unknown: "Consulte os horários",
                                }[openingStatus(p, clock)]
                              }
                            </small>
                          )}
                        </div>
                        <span className="row-arrow" aria-hidden="true">
                          ›
                        </span>
                      </button>
                      <div className="row-links">
                        {p.audio && (
                          <button
                            onClick={() => {
                              selectPoint(p.id);
                              setSheet("full");
                            }}
                          >
                            ♫ Ouvir história
                          </button>
                        )}
                        <Link href={pointUrl(p)}>Detalhes ↗</Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
          <div className="sheet-footer">
            <span>
              audio<strong>guide</strong>
            </span>
            <label>
              Conteúdo{" "}
              <select
                aria-label="Idioma do conteúdo"
                value={language}
                disabled={recovered}
                onChange={(e) => {
                  setLanguage(e.target.value as Language);
                  setType("");
                  setSelectedId(null);
                }}
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
              </select>
            </label>
          </div>
        </div>
      </section>
      <nav className="map-bottom-nav" aria-label="Navegação principal">
        <button
          className={sheet !== "full" ? "active" : ""}
          aria-pressed={sheet !== "full"}
          onClick={() => setSheet("peek")}
        >
          <span aria-hidden="true">⌖</span>Mapa
        </button>
        <button
          className={sheet === "full" ? "active" : ""}
          aria-pressed={sheet === "full"}
          onClick={() => {
            setSheet("full");
            setSelectedId(null);
          }}
        >
          <span aria-hidden="true">☷</span>Lugares
        </button>
        <button
          className={audioOnly ? "active" : ""}
          aria-pressed={audioOnly}
          onClick={() => {
            setAudioOnly(!audioOnly);
            setSheet("half");
            setSelectedId(null);
          }}
        >
          <span aria-hidden="true">♫</span>Audioguias
        </button>
      </nav>
    </main>
  );
}
