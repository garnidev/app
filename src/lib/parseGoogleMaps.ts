/**
 * Extrae coordenadas (latitud, longitud) de una URL de Google Maps.
 *
 * Soporta los siguientes formatos:
 * 1. URLs largas con `@lat,lng,zoom`:
 *    https://www.google.com/maps/place/.../@4.7110,-74.0721,15z/...
 * 2. URLs con `!3dLAT!4dLNG`:
 *    https://www.google.com/maps/...!3d4.7110!4d-74.0721
 * 3. URLs con query param `?q=lat,lng`:
 *    https://www.google.com/maps?q=4.7110,-74.0721
 * 4. URLs con `ll=lat,lng`:
 *    https://maps.google.com/maps?ll=4.7110,-74.0721
 *
 * URLs cortas (maps.app.goo.gl/XXX) NO se pueden parsear sin hacer
 * un fetch redirect (no soportado en el cliente por CORS), así que
 * devolvemos null y el usuario debe expandir la URL primero.
 */

export type Coords = {
  lat: number;
  lng: number;
};

export function extraerCoordsDeGoogleMaps(url: string): Coords | null {
  if (!url || typeof url !== "string") return null;

  const urlLimpia = url.trim();

  // Patrón 1: @lat,lng (en URLs largas /@4.7110,-74.0721,15z/)
  const matchAt = urlLimpia.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (matchAt) {
    return {
      lat: parseFloat(matchAt[1]),
      lng: parseFloat(matchAt[2]),
    };
  }

  // Patrón 2: !3dLAT!4dLNG (formato interno de Google)
  const matchInterno = urlLimpia.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (matchInterno) {
    return {
      lat: parseFloat(matchInterno[1]),
      lng: parseFloat(matchInterno[2]),
    };
  }

  // Patrón 3: ?q=lat,lng
  const matchQ = urlLimpia.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (matchQ) {
    return {
      lat: parseFloat(matchQ[1]),
      lng: parseFloat(matchQ[2]),
    };
  }

  // Patrón 4: ?ll=lat,lng o &ll=lat,lng
  const matchLL = urlLimpia.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (matchLL) {
    return {
      lat: parseFloat(matchLL[1]),
      lng: parseFloat(matchLL[2]),
    };
  }

  return null;
}

/**
 * Verifica si una URL es una URL corta de Google Maps (acortada).
 * Útil para mostrar un mensaje al usuario indicando que debe expandirla.
 */
export function esUrlCorta(url: string): boolean {
  if (!url) return false;
  return (
    url.includes("maps.app.goo.gl") ||
    url.includes("goo.gl/maps") ||
    url.includes("g.co/kgs")
  );
}