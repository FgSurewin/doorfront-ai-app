function get3dFov(zoom: number) {
  return zoom <= 2
    ? 126.5 - zoom * 36.75 // linear descent
    : 195.93 / Math.pow(1.92, zoom); // parameters determined experimentally
}
function sgn(x: number) {
  return x >= 0 ? 1 : -1;
}
export function calculatePointPov(
  canvasX: number,
  canvasY: number,
  pov: { heading: number; pitch: number; zoom: number }
) {
  // var heading = parseInt(pov.heading, 10),
  //   pitch = parseInt(pov.pitch, 10),
  //   zoom = parseInt(pov.zoom, 10);
  let heading = pov.heading;
  let pitch = pov.pitch;
  let zoom = pov.zoom;

  var PI = Math.PI;
  var cos = Math.cos;
  var sin = Math.sin;
  var tan = Math.tan;
  var sqrt = Math.sqrt;
  var atan2 = Math.atan2;
  var asin = Math.asin;

  var fov = (get3dFov(zoom) * PI) / 180.0;
  var width = 640;
  var height = 640;

  var h0 = (heading * PI) / 180.0;
  var p0 = (pitch * PI) / 180.0;

  var f = (0.5 * width) / tan(0.5 * fov);

  var x0 = f * cos(p0) * sin(h0);
  var y0 = f * cos(p0) * cos(h0);
  var z0 = f * sin(p0);

  var du = canvasX - width / 2;
  var dv = height / 2 - canvasY;

  var ux = sgn(cos(p0)) * cos(h0);
  var uy = -sgn(cos(p0)) * sin(h0);
  var uz = 0;

  var vx = -sin(p0) * sin(h0);
  var vy = -sin(p0) * cos(h0);
  var vz = cos(p0);

  var x = x0 + du * ux + dv * vx;
  var y = y0 + du * uy + dv * vy;
  var z = z0 + du * uz + dv * vz;

  var R = sqrt(x * x + y * y + z * z);
  var h = atan2(x, y);
  var p = asin(z / R);

  return {
    heading: (h * 180.0) / PI,
    pitch: (p * 180.0) / PI,
    zoom: zoom,
  };
}
