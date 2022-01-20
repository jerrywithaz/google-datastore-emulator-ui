import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom";

type AppDrawerProps = { drawerOpen: boolean; drawerWidth: number };

const links = [
  { text: "Entities", Icon: SearchIcon, link: "/" },
  { text: "Backups", Icon: CloudDownloadIcon, link: "backups" },
];

const AppDrawer: React.FC<AppDrawerProps> = ({ drawerOpen, drawerWidth }) => {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={drawerOpen}
    >
      <List>
        {links.map(({ text, Icon, link }, index) => (
          <ListItem button key={text} component={Link} to={link}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default AppDrawer;
