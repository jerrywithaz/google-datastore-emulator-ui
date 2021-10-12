import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
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
