// components/GoogleMap/GoogleMapLoader.tsx
import { useContext, useMemo } from "react";
import { ConfigContext } from "../../App";
import makeAsyncScriptLoader from "react-async-script";
import GoogleMap from "./GoogleMap";

export default function GoogleMapWithLoader(props: any) {
  const config = useContext(ConfigContext);
  const api = config?.REACT_APP_GOOGLE_MAP_API_KEY;

  const WrappedGoogleMap = useMemo(() => {
    if (!api) return null;

    const url = `https://maps.googleapis.com/maps/api/js?key=${api}&libraries=places&callback=Function.prototype&v=quarterly`;

    const Loader = makeAsyncScriptLoader(url, {
      globalName: "google",
    })(GoogleMap);

    return Loader;
  }, [api]);

  if (!WrappedGoogleMap) return null;

  return <WrappedGoogleMap {...props} />;
}
