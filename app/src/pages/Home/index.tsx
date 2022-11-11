import React from "react";
import Content from "../../components/Content";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import MapboxMap from "../../components/Map";
import WinnerSection from "../../components/WinnerSection";

export default function Home() {
  // React.useEffect(() => {
  //   window.addEventListener("beforeunload", alertUser);
  //   return () => {
  //     window.removeEventListener("beforeunload", alertUser);
  //   };
  // }, []);
  // const alertUser = (e: BeforeUnloadEvent) => {
  //   e.preventDefault();
  //   e.returnValue = "";
  // };
  return (
    <div>
      <Header />
      <Content />
      <MapboxMap />
      { //<WinnerSection />
}
      <Footer />
    </div>
  );
}
