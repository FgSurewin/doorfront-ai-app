import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { SxProps } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useHandleMenu } from "../../hooks/useHandleMenu";

export const transparentStyle: SxProps = {
  py: 0.6,
  bgcolor: "transparent",
  boxShadow: 0,
};
export const scrollStyle: SxProps = {
  py: 0.6,
  bgcolor: "rgba(255, 255, 255, 0.9)",
  // bgcolor: "text.primary",
};
const whiteStyle: SxProps = {
  color: "white",
};

const blackStyle: SxProps = {
  color: "text.primary",
};

/* -------------------------------------------------------------------------- */
/*                           React Component - Logo                           */
/* -------------------------------------------------------------------------- */
export interface LogoProps {
  src: string;
  attribute: "web" | "mobile";
}
export const Logo = React.memo(function ({ src, attribute }: LogoProps) {
  const style =
    attribute === "web"
      ? { flexGrow: 0, mr: 2, display: { xs: "none", md: "flex" } }
      : { flexGrow: 5, mr: 2, display: { xs: "flex", md: "none" } };
  return (
    <>
      <Button component={RouterLink} to="/" sx={style}>
        <img src={src} alt="DoorFront" />
      </Button>
    </>
  );
});

/* -------------------------------------------------------------------------- */
/*                        React Component - Mobile Menu                       */
/* -------------------------------------------------------------------------- */
export interface MenuProps {
  menuItems: { name: string; path: string }[];
  isTransparent?: boolean;
}
export const MobileMenu = React.memo(function ({
  menuItems,
  isTransparent,
}: MenuProps) {
  const colorStyle = React.useMemo(
    () => (isTransparent ? whiteStyle : blackStyle),
    [isTransparent]
  );
  const { anchorEl, handleOpenMenu, handleCloseMenu } = useHandleMenu();
  return (
    <>
      <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenMenu}
          sx={colorStyle}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          sx={{
            display: { xs: "block", md: "none" },
          }}
        >
          {menuItems.map((item, index) => (
            <MenuItem
              component={RouterLink}
              to={item.path}
              key={`${item.name} + ${index}`}
              onClick={handleCloseMenu}
            >
              <Typography textAlign="center">{item.name}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  );
});

/* -------------------------------------------------------------------------- */
/*                         React Component - Web Menu                         */
/* -------------------------------------------------------------------------- */
export const WebMenu = React.memo(function ({
  menuItems,
  isTransparent,
}: MenuProps) {
  const colorStyle = React.useMemo(
    () => (isTransparent ? whiteStyle : blackStyle),
    [isTransparent]
  );

  return (
    <>
      <Box sx={{ flexGrow: 0.2, display: { xs: "none", md: "flex" } }}>
        {menuItems.map((item, index) => (
          <Button
            key={`${item.name} + ${index}`}
            component={RouterLink}
            to={item.path}
            sx={{
              mx: 2,
              display: "block",
              fontSize: "1.25rem",
              textTransform: "none",
              ...colorStyle,
            }}
          >
            {item.name}
          </Button>
        ))}
      </Box>
    </>
  );
});
