import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIconTypeMap,
  Typography,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React from "react";

export interface FooterListItemType {
  icon: OverridableComponent<SvgIconTypeMap>;
  content: string;
  link: string;
}

export interface FooterListProps {
  list: FooterListItemType[];
  listTitle: string;
}

export const FooterList = React.memo(function ({
  list,
  listTitle,
}: FooterListProps) {
  function openInNewTab(url:string){
    if(url !== "") {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
      if (newWindow) newWindow.opener = null
    }
  }

  return (
    <>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{
          textTransform: "uppercase",
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {listTitle}
      </Typography>
      <List dense>
        {list.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <ListItem key={index}>
              <Button onClick={()=>openInNewTab(item.link)}>
                <ListItemIcon sx={{ color: "white" }}>
                  <IconComponent />
                </ListItemIcon>
                <ListItemText
                  primary={item.content}
                  sx={{ color: "white", "&:hover": { color: "primary.main" } }}
                />
              </Button>
            </ListItem>
          );
        })}
      </List>
    </>
  );
});
