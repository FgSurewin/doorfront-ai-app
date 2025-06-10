import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#d6974d",
      light: "#fceed4",
      dark: "#b07337",
    },
    secondary: {
      main: "#526576",
    },
    text: {
      primary: "#3F3D56",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

/* ------------------------ Set responsive font size ------------------------ */
theme = responsiveFontSizes(theme);
export { theme };
