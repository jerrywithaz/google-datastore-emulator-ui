import React from "react";
import styled from "styled-components";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

type AppHeaderProps = { drawerOpen: boolean; drawerWidth: number };

const AppHeaderStyled = styled(AppBar)<AppHeaderProps>`
  ${({ drawerOpen, drawerWidth }) => `
        ${
          drawerOpen
            ? `
                width: calc(100% - ${drawerWidth}px);
                margin-left: ${drawerWidth}px;
            `
            : ``
        }
    `}
`;

const AppHeader: React.FC<AppHeaderProps & { onIconClick: () => void }> = ({ drawerOpen, drawerWidth, onIconClick }) => {
  return (
    <AppHeaderStyled
      position="static"
      drawerOpen={drawerOpen}
      drawerWidth={drawerWidth}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={onIconClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Google Datastore Emulator UI
        </Typography>
      </Toolbar>
    </AppHeaderStyled>
  );
};

export default AppHeader;
