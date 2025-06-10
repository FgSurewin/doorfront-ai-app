import React from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ListItemIcon from "@mui/material/ListItemIcon";
// import Divider from "@mui/material/Divider";
import Logout from "@mui/icons-material/Logout";
import Login from "@mui/icons-material/Login";
import { Divider, PaperProps } from "@mui/material";
import { useHandleMenu } from "../../hooks/useHandleMenu";
import { Link as RouterLink } from "react-router-dom";
import { useUserStore } from "../../global/userState";
import { deleteAllLocal } from "../../utils/localStorage";
import PersonIcon from '@mui/icons-material/Person';
const paperProps: PaperProps = {
  elevation: 0,
  sx: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 1.5,
    "& .MuiAvatar-root": {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
};
const ProfileItem = React.memo(function () {
  return (
    <MenuItem component={RouterLink} to="/profile">
      <ListItemIcon><PersonIcon /></ListItemIcon>
      Profile
    </MenuItem>
  );
});
const LoginItem = React.memo(function () {
  return (
    <MenuItem component={RouterLink} to="/login">
      <ListItemIcon>
        <Login fontSize="small" />
      </ListItemIcon>
      Login
    </MenuItem>
  );
});
const LogoutItem = React.memo(function () {
  const { clearUserInfo } = useUserStore();
  return (
    <MenuItem
      onClick={() => {
        deleteAllLocal();
        clearUserInfo();
      }}
    >
      <ListItemIcon>
        <Logout fontSize="small" />
      </ListItemIcon>
      Logout
    </MenuItem>
  );
});

export default function UserAvatar() {
  /* -------------------------------------------------------------------------- */
  /*                      Custom Hook - Used to handle menu                     */
  /* -------------------------------------------------------------------------- */
  const { anchorEl, handleOpenMenu, handleCloseMenu } = useHandleMenu();
  /* -------------------------------------------------------------------------- */

  const { userInfo } = useUserStore();

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
          {userInfo.nickname ? (
            <Avatar
              sx={{
                bgcolor: "primary.main",
                color: "white",
                textTransform: "uppercase",
              }}
            >
              {userInfo.nickname[0]}
            </Avatar>
          ) : (
            <Avatar />
          )}
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={paperProps}
      >
        <MenuItem component={RouterLink} to="/leaderBoard">
          <ListItemIcon>
            <EmojiEventsIcon />
          </ListItemIcon>
          Leader Board
        </MenuItem>
        <Divider />
        {!userInfo.nickname ? <LoginItem /> : <div><ProfileItem /><Divider /><LogoutItem /></div>}
      </Menu>
    </Box>
  );
}
