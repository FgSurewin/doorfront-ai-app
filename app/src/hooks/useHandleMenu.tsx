import React from "react";

export function useHandleMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleOpenMenu = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );
  const handleCloseMenu = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  return { anchorEl, handleOpenMenu, handleCloseMenu };
}
