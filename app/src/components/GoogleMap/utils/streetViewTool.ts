export interface StreetViewEvents {
  onPanoChanged?: (
    result: ReturnType<typeof generateInfo>,
    map: google.maps.Map
  ) => void;
  onPositionChanged?: (
    result: ReturnType<typeof generateInfo>,
    map: google.maps.Map
  ) => void;
  onPovChanged?: (
    result: ReturnType<typeof generateInfo>,
    map: google.maps.Map
  ) => void;
  onVisibleChanged?: (
    result: ReturnType<typeof generateInfo>,
    map: google.maps.Map
  ) => void;
  onZoomChanged?: (
    result: ReturnType<typeof generateInfo>,
    street: google.maps.StreetViewPanorama
  ) => void;
}

export function generateInfo(
  pano: string,
  positionClass: google.maps.LatLng | null,
  pov: google.maps.StreetViewPov,
  zoom: number
) {
  const position = positionClass
    ? {
        lat: positionClass.lat(),
        lng: positionClass.lng(),
      }
    : null;
  return {
    pano,
    pov,
    position,
    zoom,
  };
}

export function bindStreetViewEvents(
  street: google.maps.StreetViewPanorama,
  events: StreetViewEvents,
  map: google.maps.Map
) {
  street.addListener("pano_changed", () => {
    if (events.onPanoChanged) {
      const result = generateInfo(
        street.getPano(),
        street.getPosition(),
        street.getPov(),
        street.getZoom()
      );
      events.onPanoChanged(result, map);
    }
  });

  street.addListener("position_changed", () => {
    // console.log("Origin -> ", street.getPano());
    if (events.onPositionChanged) {
      const result = generateInfo(
        street.getPano(),
        street.getPosition(),
        street.getPov(),
        street.getZoom()
      );

      events.onPositionChanged(result, map);
    }
    const pos = street.getPosition();
    if (pos) {
      const center = { lat: pos.lat(), lng: pos.lng() };
      map.panTo(center);
    }
  });

  street.addListener("pov_changed", () => {
    if (events.onPovChanged) {
      const result = generateInfo(
        street.getPano(),
        street.getPosition(),
        street.getPov(),
        street.getZoom()
      );
      events.onPovChanged(result, map);
    }
  });

  street.addListener("visible_changed", () => {
    if (events.onVisibleChanged) {
      const result = generateInfo(
        street.getPano(),
        street.getPosition(),
        street.getPov(),
        street.getZoom()
      );
      events.onVisibleChanged(result, map);
    }
  });

  street.addListener("zoom_changed", () => {
    if (events.onZoomChanged) {
      const result = generateInfo(
        street.getPano(),
        street.getPosition(),
        street.getPov(),
        street.getZoom()
      );
      events.onZoomChanged(result, street);
    }
  });
}

export const defaultStreetViewOptions = {
  scrollwheel: false,
  fullscreenControl: false,
  panControl: false,
  linksControl: true,
  disableDefaultUI: true,
  zoomControl: true,
  clickToGo: false,
};

export const combineStreetViewOptions = (
  options: google.maps.StreetViewPanoramaOptions
): google.maps.StreetViewPanoramaOptions =>
  Object.assign({}, options, defaultStreetViewOptions);
