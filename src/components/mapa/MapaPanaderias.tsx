"use client";

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
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
  obtenerMarkers,
  obtenerPanaderiasPorDepartamento,
  obtenerPanaderiaPorId,
  buscarPanaderias,
  filtrarMarkersPorDepartamento,
  type Panaderia,
  type PanaderiaMarker,
} from "@/data/panaderias";
import {
  obtenerDepartamentos,
  type Departamento,
} from "@/data/departamentos";
import { obtenerCiudades, type Ciudad } from "@/data/ciudades";
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

export function MapaPanaderias() {
  const mapRef = useRef<MapRef | null>(null);

  /* ─── Datos del backend ─────────────────────────────────────────── */
  const [markers, setMarkers] = useState<PanaderiaMarker[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [cargandoInicial, setCargandoInicial] = useState(true);

  /* ─── Búsqueda dinámica ─────────────────────────────────────────── */
  const [busqueda, setBusqueda] = useState("");
  const [panaderiasBusqueda, setPanaderiasBusqueda] = useState<Panaderia[]>([]);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);

  /* ─── Estados de UI ─────────────────────────────────────────────── */
  const [isMobile, setIsMobile] = useState(false);
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [departamentoActivo, setDepartamentoActivo] =
    useState<Departamento | null>(null);
  const [panaderiasDepto, setPanaderiasDepto] = useState<Panaderia[]>([]);
  const [cargandoDepto, setCargandoDepto] = useState(false);
  const [panaderiaActiva, setPanaderiaActiva] = useState<Panaderia | null>(
    null,
  );
  const [panelColapsado, setPanelColapsado] = useState(false);
  const [modalCompartir, setModalCompartir] = useState<Panaderia | null>(null);

  /* ─── Detectar móvil (resuelve bug de hidratación) ──────────────── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ─── Aplicar zoom móvil después del mount ──────────────────────── */
  useEffect(() => {
    if (isMobile && mapRef.current) {
      mapRef.current.flyTo({
        center: [VIEW_INITIAL_MOBILE.longitude, VIEW_INITIAL_MOBILE.latitude],
        zoom: VIEW_INITIAL_MOBILE.zoom,
        duration: 0,
      });
    }
  }, [isMobile]);

  /* ─── Cargar datos iniciales (markers + deptos + ciudades) ──────── */
  useEffect(() => {
    let activo = true;

    (async () => {
      try {
        setCargandoInicial(true);
        const [markersData, deptosData, ciudadesData] = await Promise.all([
          obtenerMarkers(),
          obtenerDepartamentos(),
          obtenerCiudades(),
        ]);

        if (activo) {
          setMarkers(markersData);
          setDepartamentos(deptosData);
          setCiudades(ciudadesData);
        }
      } catch (error) {
        console.error("Error cargando datos del mapa:", error);
      } finally {
        if (activo) setCargandoInicial(false);
      }
    })();

    return () => {
      activo = false;
    };
  }, []);

  /* ─── Búsqueda server-side con debounce de 300ms ────────────────── */
  useEffect(() => {
    if (!busqueda.trim()) {
      setPanaderiasBusqueda([]);
      return;
    }

    let activo = true;
    setCargandoBusqueda(true);

    const timer = setTimeout(async () => {
      const resultados = await buscarPanaderias(busqueda);
      if (activo) {
        setPanaderiasBusqueda(resultados);
        setCargandoBusqueda(false);
      }
    }, 300);

    return () => {
      activo = false;
      clearTimeout(timer);
    };
  }, [busqueda]);

  /* ─── Markers visibles en el mapa ───────────────────────────────── */
  const markersVisibles = useMemo(() => {
    // Si hay un depto activo, filtramos markers a ese depto
    if (departamentoActivo) {
      return filtrarMarkersPorDepartamento(markers, departamentoActivo.slug);
    }

    // Si hay búsqueda, mostramos los markers que matchean por id con las panaderías buscadas
    if (busqueda.trim() && panaderiasBusqueda.length > 0) {
      const idsEncontradas = new Set(panaderiasBusqueda.map((p) => p.id));
      return markers.filter((m) => idsEncontradas.has(m.id));
    }

    // Default: todos los markers
    return markers;
  }, [markers, departamentoActivo, busqueda, panaderiasBusqueda]);

  /* ─── Handlers ──────────────────────────────────────────────────── */

  /** Selecciona una panadería: carga su detalle + flyTo */
  const handleSelectPanaderia = useCallback(
    async (idOrPanaderia: string | Panaderia) => {
      // Si recibe el objeto completo (desde la lista), úsalo directo
      // Si recibe solo un id (desde el marker), fetch al detalle
      let panaderia: Panaderia | null = null;

      if (typeof idOrPanaderia === "string") {
        panaderia = await obtenerPanaderiaPorId(idOrPanaderia);
      } else {
        panaderia = idOrPanaderia;
      }

      if (!panaderia) return;

      setPanaderiaActiva(panaderia);

      mapRef.current?.flyTo({
        center: panaderia.coords,
        zoom: 14,
        duration: 1500,
        ...(isMobile
          ? {}
          : { padding: { top: 0, bottom: 0, left: 800, right: 0 } }),
      });
    },
    [isMobile],
  );

  /** Selecciona un departamento: carga sus panaderías + flyTo */
  const handleSelectDepartamento = useCallback(
    async (depto: Departamento) => {
      setDepartamentoActivo(depto);
      setPanaderiaActiva(null);
      setCargandoDepto(true);

      // FlyTo al departamento
      mapRef.current?.flyTo({
        center: depto.coordsCentro,
        zoom: depto.zoomNivel,
        duration: 2000,
      });

      // Cargar panaderías del departamento
      try {
        const panaderias = await obtenerPanaderiasPorDepartamento(depto.slug);
        setPanaderiasDepto(panaderias);
      } catch (error) {
        console.error("Error cargando panaderías del depto:", error);
      } finally {
        setCargandoDepto(false);
      }
    },
    [],
  );

  /** Cierra el detalle del departamento */
  const handleCerrarDepartamento = useCallback(() => {
    setDepartamentoActivo(null);
    setPanaderiasDepto([]);
    const view = isMobile ? VIEW_INITIAL_MOBILE : VIEW_INITIAL_DESKTOP;
    mapRef.current?.flyTo({
      center: [view.longitude, view.latitude],
      zoom: view.zoom,
      duration: 2000,
    });
  }, [isMobile]);

  const handleAbrirChange = useCallback((abierto: boolean) => {
    setBuscadorAbierto(abierto);
  }, []);

  return (
    <div className="relative h-[calc(100vh-120px)] w-full overflow-hidden">
      <Map
        ref={mapRef}
        mapboxAccessToken={TOKEN}
        initialViewState={VIEW_INITIAL_DESKTOP}
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

        {markersVisibles.map((m) => (
          <Marker
            key={m.id}
            longitude={m.coords[0]}
            latitude={m.coords[1]}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              handleSelectPanaderia(m.id);
            }}
          >
            <MarkerPanaderia
              nombre={m.nombre}
              activa={panaderiaActiva?.id === m.id}
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
              markers={markers}
              departamentos={departamentos}
              ciudades={ciudades}
              departamentoActivo={departamentoActivo}
              panaderiasDepto={panaderiasDepto}
              cargandoDepto={cargandoDepto}
              cargandoInicial={cargandoInicial}
              panaderiasBusqueda={panaderiasBusqueda}
              cargandoBusqueda={cargandoBusqueda}
              onSelectDepartamento={handleSelectDepartamento}
              onCerrarDepartamento={handleCerrarDepartamento}
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

          {/* Detalle de panadería */}
          {panaderiaActiva && (
            <div
              data-mapa-overlay
              className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-20 md:bottom-auto md:left-[30rem] md:right-auto md:top-6"
            >
              <PanaderiaDetalle
                panaderia={panaderiaActiva}
                onClose={() => setPanaderiaActiva(null)}
                onShare={() => setModalCompartir(panaderiaActiva)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal de compartir */}
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