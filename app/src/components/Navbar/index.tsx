import React from "react";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import WhiterLogo from "../../images/BigLogo.svg";
import BlackLogo from "../../images/blackLogo.svg";
import UserAvatar from "./UserAvatar";
import {
  Logo,
  MobileMenu,
  scrollStyle,
  transparentStyle,
  WebMenu,
} from "./Navbar.style";
import { Box, SxProps } from "@mui/material";
import {useUserStore} from "../../global/userState";

// const menuItems = ["Start Exploring", "Validation"];
let menuItems = [
  { name: "Start Exploring", path: "/exploration" },
  { name: "Validate Labels", path: "/reviewLabels" },
  //{ name: "Contest Page" , path: "/contest" },
  { name: "Tutorial", path:"/tutorial"},
  { name: "Requests", path:"/requests"}
]

export interface NavbarProps {
  position?: "static" | "fixed";
  isTransparent?: boolean;
  extraStyle?: SxProps;
}
const Navbar = React.memo(function ({
  position = "static",
  isTransparent = false,
  extraStyle,
}: NavbarProps) {
  /* -------------------------------------------------------------------------- */
  /*               Computed Values - Background Color & Logo Color              */
  /* -------------------------------------------------------------------------- */
  const backgroundStyle = React.useMemo(() => {
    const style = isTransparent ? transparentStyle : scrollStyle;
    if (extraStyle) return Object.assign({}, style, extraStyle) as SxProps;
    return style;
  }, [isTransparent, extraStyle]);
const LogoSrc = React.useMemo(
    () => (isTransparent ? WhiterLogo : BlackLogo),
    [isTransparent]
  );

  const {userInfo} = useUserStore()
  //console.log(userInfo.role)
  if(userInfo.role === "Blind or Low Vision Data Requester"){
    menuItems = [
      {name: "Request Data", path: "/createRequest"}
    ]
  }
  /* this is to only show contest in navbar when a contest is active in the DB but it's buggy so disabled for now
    React.useEffect(()=>{
      if(readLocal("contest" as LocalStorageKeyType) != null && readLocal("contest" as LocalStorageKeyType) != "" ) {
        menuItems = [
          { name: "Start Exploring", path: "/exploration" },
          { name: "Validate Labels", path: "/reviewLabels" },
          { name: "Contest Page" , path: "/contest" }
        ];
        }
    },[readLocal("contest" as LocalStorageKeyType)])
    */
return (
    <>
      <AppBar position={position} sx={backgroundStyle}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Logo src={LogoSrc} attribute="web" />
            <Box
              id="BlankPosition"
              sx={{ flexGrow: 1, display: { md: "block", xs: "none" } }}
            />
            <MobileMenu menuItems={menuItems} isTransparent={isTransparent} />
            <Logo src={LogoSrc} attribute="mobile" />
            <WebMenu menuItems={menuItems} isTransparent={isTransparent} />
            <UserAvatar />
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
});

export default Navbar;