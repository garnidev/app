"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Map, {
  Marker,
  NavigationControl,
  Source,
  Layer,
  type MapRef,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  buscarPanaderias,
  getPanaderiasPorDepartamento,
  type Panaderia,
} from "@/data/panaderias";
import { type Departamento } from "@/data/departamentos";
import { BuscadorMapa } from "./BuscadorMapa";
import { TarjetaPromo } from "./TarjetaPromo";
import { PanaderiaDetalle } from "./PanaderiaDetalle";
import { CompartirModal } from "./CompartirModal";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const VIEW_INITIAL_DESKTOP = {
  longitude: -73.5,
  latitude: 4.5,
  zoom: 4.5,
};

const VIEW_INITIAL_MOBILE = {
  longitude: -73.5,
  latitude: 4.5,
  zoom: 4.5,
};

/** Detecta si es móvil (ancho < 768px) */
function getViewInitial() {
  if (typeof window === "undefined") return VIEW_INITIAL_DESKTOP;
  return window.innerWidth < 768 ? VIEW_INITIAL_MOBILE : VIEW_INITIAL_DESKTOP;
}

export function MapaPanaderias() {
  const mapRef = useRef<MapRef | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [departamentoActivo, setDepartamentoActivo] =
    useState<Departamento | null>(null);
  const [panaderiaActiva, setPanaderiaActiva] = useState<Panaderia | null>(
    null,
  );
  const [panelColapsado, setPanelColapsado] = useState(false);
  const [modalCompartir, setModalCompartir] = useState<Panaderia | null>(null);

  const panaderiasVisibles = useMemo(() => {
    if (departamentoActivo) {
      return getPanaderiasPorDepartamento(departamentoActivo.nombre);
    }
    return buscarPanaderias(busqueda);
  }, [busqueda, departamentoActivo]);

  /** Selecciona una panadería: muestra detalle + flyTo */
  const handleSelectPanaderia = (p: Panaderia) => {
    setPanaderiaActiva(p);
    const view = getViewInitial();
    mapRef.current?.flyTo({
      center: p.coords,
      zoom: 14,
      duration: 1500,
    });
  };

  const handleSelectDepartamento = (depto: Departamento) => {
    setDepartamentoActivo(depto);
    setPanaderiaActiva(null);
    const view = getViewInitial();
    mapRef.current?.flyTo({
      center: [view.longitude, view.latitude],
      zoom: view.zoom,
      duration: 2000,
    });
  };

  const handleAbrirChange = (abierto: boolean) => {
    setBuscadorAbierto(abierto);
  };

  return (
    <div className="relative h-[calc(100vh-120px)] w-full overflow-hidden">
      <Map
        ref={mapRef}
        mapboxAccessToken={TOKEN}
        initialViewState={getViewInitial()}
        mapStyle="mapbox://styles/mapbox/navigation-night-v1"
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        onLoad={(e) => {
          const map = e.target;
          const layers = map.getStyle().layers ?? [];

          layers.forEach((layer) => {
            try {
              if (layer.type === "background") {
                map.setPaintProperty(layer.id, "background-color", "#0F1B3D");
              }
              if (
                layer.type === "fill" &&
                (layer.id.includes("water") ||
                  layer.id.includes("ocean") ||
                  layer.id.includes("river"))
              ) {
                map.setPaintProperty(layer.id, "fill-color", "#0A1230");
              }
              if (
                layer.type === "symbol" &&
                (layer.layout as any)?.["text-field"]
              ) {
                map.setPaintProperty(layer.id, "text-color", "#D4B88E");
                map.setPaintProperty(layer.id, "text-halo-color", "#0F1B3D");
                map.setPaintProperty(layer.id, "text-halo-width", 1.5);
              }
            } catch {}
          });
        }}
      >
        <Source
          id="colombia-frontera"
          type="geojson"
          data="/data/colombia.geo.json"
        >
          <Layer
            id="colombia-frontera-line"
            type="line"
            paint={{
              "line-color": "#22C55E",
              "line-width": 3.5,
              "line-opacity": 1,
            }}
          />
        </Source>

        <NavigationControl
          position="right"
          showCompass={false}
          showZoom={true}
        />

        {panaderiasVisibles.map((p) => (
          <Marker
            key={p.id}
            longitude={p.coords[0]}
            latitude={p.coords[1]}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              handleSelectPanaderia(p);
            }}
          >
            <MarkerPanaderia
              nombre={p.nombre}
              activa={panaderiaActiva?.id === p.id}
            />
          </Marker>
        ))}
      </Map>

      {/* Overlay flotante */}
      <div className="pointer-events-none absolute inset-0">
        <div className="container-site relative h-full">
          {/* Panel del buscador */}
          <div
            className={`pointer-events-auto absolute w-full transition-all duration-500 md:max-w-md ${
              buscadorAbierto || departamentoActivo
                ? "bottom-0 left-0 top-0"
                : "left-0 right-0 top-4 px-4 md:left-0 md:right-auto md:top-6 md:px-0"
            } ${
              panelColapsado
                ? "-translate-x-[calc(100%+1rem)]"
                : "translate-x-0"
            }`}
          >
            <BuscadorMapa
              value={busqueda}
              onChange={setBusqueda}
              onSelectDepartamento={handleSelectDepartamento}
              onSelectPanaderia={handleSelectPanaderia}
              onAbrirChange={handleAbrirChange}
              panaderiaActivaId={panaderiaActiva?.id}
            />
          </div>

          {/* Botón verde para colapsar */}
          {(buscadorAbierto || departamentoActivo) && (
            <button
              type="button"
              onClick={() => setPanelColapsado((v) => !v)}
              aria-label={panelColapsado ? "Mostrar panel" : "Ocultar panel"}
              className={`pointer-events-auto absolute top-1/2 z-10 flex h-14 w-7 -translate-y-1/2 items-center justify-center rounded-r-2xl bg-brand-green text-white shadow-lg transition-all duration-500 hover:bg-brand-greenDark ${
                panelColapsado ? "left-0" : "left-[28rem]"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-5 w-5 transition-transform ${
                  panelColapsado ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Tarjeta promo (oculta si hay buscador abierto, depto o panadería activa) */}
          {!buscadorAbierto && !departamentoActivo && !panaderiaActiva && (
            <div className="pointer-events-auto absolute bottom-4 left-4 right-4 md:bottom-6 md:left-0 md:right-auto md:w-full md:max-w-sm">
              <TarjetaPromo />
            </div>
          )}

          {/* Tarjeta de detalle de panadería:
    - Desktop: flotante a la derecha del panel
    - Móvil: bottom sheet ocupando toda la pantalla */}
          {panaderiaActiva && (
            <div className="pointer-events-none absolute inset-0 z-30 md:inset-auto md:left-[30rem] md:top-6">
              <PanaderiaDetalle
                panaderia={panaderiaActiva}
                onClose={() => setPanaderiaActiva(null)}
                onShare={() => setModalCompartir(panaderiaActiva)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal de compartir (encima de todo) */}
      {modalCompartir && (
        <CompartirModal
          panaderia={modalCompartir}
          onClose={() => setModalCompartir(null)}
        />
      )}
    </div>
  );
}

/* ─── Marker custom con estado activo ─────────────────────────────── */

function MarkerPanaderia({
  nombre,
  activa,
}: {
  nombre: string;
  activa: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={`Panadería ${nombre}`}
      className={`group transition ${activa ? "scale-125" : "hover:scale-110"}`}
    >
      <Image
        src="/assets/icono-pan-marker.svg"
        alt=""
        width={activa ? 50 : 40}
        height={activa ? 60 : 48}
        className={`drop-shadow-lg transition-all ${
          activa ? "drop-shadow-2xl" : ""
        }`}
        aria-hidden="true"
      />
    </button>
  );
}
