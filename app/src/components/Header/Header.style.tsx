import React from "react";
import { HeaderData } from "./data";
import { Stack, SxProps, Typography } from "@mui/material";

export const HeaderWrapperStyle: React.CSSProperties = {
  height: "100vh",
  position: "relative",
};

export const HeaderButtonStyle: SxProps = {
  mt: 3,
  color: "white",
  py: 1,
  px: 4,
  "&:hover": {
    bgcolor: "primary.dark",
  },
};

const videoStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
  zIndex: "0",
};

const shadeStyle: React.CSSProperties = {
  position: "absolute",
  top: "0",
  left: "0",
  right: "0",
  height: "100vh",
  background: "rgba(196, 196, 196, 0.29)",
};

/* -------------------------------------------------------------------------- */
/*                     React Component - Background Video                     */
/* -------------------------------------------------------------------------- */
const videoLink = process.env.REACT_APP_VIDEO_LINK;
export const BackgroundVideo = React.memo(function () {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && /Mobi|Android/i.test(navigator.userAgent)) {
      // Disable fullscreen for mobile browsers
      videoElement.removeAttribute("controls");
      videoElement.setAttribute("playsinline", ""); // This attribute is important for iOS
    }
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        muted
        loop
        autoPlay
        playsInline // This prop is important for iOS
        src={videoLink}
        style={videoStyle}
      />
      <div style={shadeStyle} />
    </>
  );
});

/* -------------------------------------------------------------------------- */
/*                        React Component - Main Title                        */
/* -------------------------------------------------------------------------- */
const HeaderTitleStyle: SxProps = {
  zIndex: "12",
  color: "white",
  fontWeight: "bold",
  textTransform: "uppercase",
  mb: 4,
};
export const HeaderTitle = React.memo(function () {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="column"
      sx={{ mb: 2 }}
    >
      <Typography variant="h3" sx={HeaderTitleStyle}>
        {HeaderData.title.one}
      </Typography>
      <Typography variant="h3" sx={HeaderTitleStyle}>
        {HeaderData.title.two}
      </Typography>
    </Stack>
  );
});

/* -------------------------------------------------------------------------- */
/*                         React Component - Subtitle                         */
/* -------------------------------------------------------------------------- */
const HeaderSubtitleStyle: SxProps = {
  zIndex: "12",
  color: "white",
  mb: 2,
  //   fontWeight: "bold",
};

export const HeaderSubtitle = React.memo(function () {
  return (
    <Stack justifyContent="center" alignItems="center" direction="column">
      <Typography variant="h6" sx={HeaderSubtitleStyle}>
        {HeaderData.subtitle.one}
      </Typography>
      <Typography variant="h6" sx={HeaderSubtitleStyle}>
        {HeaderData.subtitle.two}
      </Typography>
    </Stack>
  );
});
