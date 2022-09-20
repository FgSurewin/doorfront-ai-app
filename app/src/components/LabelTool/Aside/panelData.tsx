import ImagePanel from "./ImagePanel";
import LabelPanel from "./LabelPanel";
import BoxPanel from "./BoxPanel";
import ImageIcon from "@mui/icons-material/Image";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";

export interface PanelDataType {
  tabIcon: React.ReactElement;
  tabName: string;
  panelElement: React.ReactElement;
}

export const panelData: PanelDataType[] = [
  {
    tabIcon: <ImageIcon />,
    tabName: "Images",
    panelElement: <ImagePanel />,
  },
  {
    tabIcon: <BookmarksIcon />,
    tabName: "Label",
    panelElement: <LabelPanel />,
  },
  {
    tabIcon: <HighlightAltIcon />,
    tabName: "Box",
    panelElement: <BoxPanel />,
  },
  
];
