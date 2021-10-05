import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import Entities from "./pages/Entities";

const App: React.FC = () => {
  return (
    <Router>
      <ReactQueryProvider>
        <Box height="100%" width="100%" display="flex" flexDirection="column">
          <Box>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Google Datastore Emulator UI
                </Typography>
                <Button color="inherit">Login</Button>
              </Toolbar>
            </AppBar>
          </Box>
          <Box flex={1} padding="20px">
            <Switch>
              <Route path="/" component={Entities} />
            </Switch>
          </Box>
        </Box>
      </ReactQueryProvider>
    </Router>
  );
};

export default App;
