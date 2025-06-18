import React, { useEffect, useState } from "react";
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
import { useUserStore } from "../../global/userState";

// Default menuItems
let defaultMenuItems = [
  { name: "Start Exploring", path: "/exploration" },
  { name: "Validate Labels", path: "/reviewLabels" },
  { name: "Tutorial", path: "/tutorial" },
  { name: "Requests", path: "/requests" },
];

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

  const { userInfo } = useUserStore();
  const [menuItems, setMenuItems] = useState(defaultMenuItems);

  useEffect(() => {
    // Update menu items based on user info
    let updatedMenuItems = [...defaultMenuItems]; // start with the default menu items

    if (userInfo.role === "Blind or Low Vision Data Requester") {
      updatedMenuItems = [
        { name: "Request Data", path: "/createRequest" }
      ];
    }

    if (userInfo.accessLevel === "admin") {
      const adminPanelExists = updatedMenuItems.some(item => item.name === "Admin Panel");

      if (!adminPanelExists) {
        updatedMenuItems.push({ name: "Admin Panel", path: "/adminpage" });
      }
    }

    // Update the state with the modified menuItems
    setMenuItems(updatedMenuItems);
  }, [userInfo]); // Re-run the effect whenever userInfo changes

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
