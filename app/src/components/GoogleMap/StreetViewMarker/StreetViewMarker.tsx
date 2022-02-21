import React from "react";
import ReactDOM from "react-dom";
import { MarkerCreator, PositionType } from "./MarkerCreator";

export interface StreetViewMarkerProps {
  googleMaps: typeof google.maps;
  container: HTMLElement;
  position: PositionType;
  pano: google.maps.StreetViewPanorama;
  anchor: google.maps.Point;
  size: google.maps.Size;
  title: string;
  id: string;
  clickFunc?: () => void;
}

export default class StreetViewMarker extends React.Component<
  StreetViewMarkerProps,
  {}
> {
  /** Overlay instance. */
  //   overlay:ReturnType<ReturnType<typeof MarkerCreator>>|null= null;
  overlay: any = null;

  /** Dom element reference to the content rendered in the overlay. */
  el: HTMLElement | null = null;

  componentWillUnmount() {
    /** remove overlay from the map. */
    // this.overlay.onRemove();
    // delete this.overlay;
  }

  render() {
    try {
      const {
        googleMaps,
        children,
        container,
        position,
        pano,
        anchor,
        size,
        title,
        id,
        clickFunc,
      } = this.props;
      this.el = this.el || createOverlayElement();
      const PanoMarker = MarkerCreator(googleMaps);
      this.overlay =
        this.overlay ||
        new PanoMarker({
          content: this.el,
          container,
          position,
          pano,
          anchor,
          size,
          title,
          id,
          clickFunc,
        });

      if (!googleMaps) return null;
      return ReactDOM.createPortal(children, this.el);
    } catch (e) {
      console.log(e);
    }
  }
}

export function createOverlayElement() {
  const el = document.createElement("div");
  el.style.position = "absolute";
  el.style.cursor = "pointer";
  return el;
}
