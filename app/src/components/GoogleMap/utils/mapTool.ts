export const defaultMapOptions: google.maps.MapOptions = {
  mapTypeControlOptions: {
    mapTypeIds: [],
  },
  zoomControl: false,
  gestureHandling: "none",
  fullscreenControl: true,
  panControl: true,
  rotateControl: true,
  scaleControl: true,
  // streetViewControl: false,
  // disableDefaultUI: true,
};

export const combineMapOptions = (
  options: google.maps.MapOptions
): google.maps.MapOptions => Object.assign({}, options, defaultMapOptions);
