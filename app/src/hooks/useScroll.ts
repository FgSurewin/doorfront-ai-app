import React from "react";

export const useScroll = () => {
  const [isTransparent, setIsTransparent] = React.useState<boolean>(true);
  React.useEffect(() => {
    window.onscroll = () => {
      if (document.documentElement.scrollTop > 80) setIsTransparent(false);
      else setIsTransparent(true);
    };
    // fix the react problem:
    // https://stackoverflow.com/questions/54954385/react-useeffect-causing-cant-perform-a-react-state-update-on-an-unmounted-comp
    return () => {
      setIsTransparent(false); // This worked for me
    };
  }, [setIsTransparent]);
  return { isTransparent };
};
