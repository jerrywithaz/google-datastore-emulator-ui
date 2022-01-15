import React, { useEffect, useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuIcon from "@mui/icons-material/Menu";
import Entities from "./pages/Entities";
import axios from "axios";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  ApolloProvider,
} from "@apollo/client";

SyntaxHighlighter.registerLanguage("json", json);

const url = process.env.PUBLIC_URL + "/server_config.json";

const App: React.FC = () => {
  const [apolloClient, setApolloClient] = useState<
    ApolloClient<NormalizedCacheObject> | undefined
  >(undefined);

  useEffect(() => {
    axios
      .get<{ port: number }>(url)
      .then((result) => {

        setApolloClient(
          new ApolloClient({
            uri: `http://localhost:${result.data.port}/graphql`,
            cache: new InMemoryCache(),
          })
        );
      })
      .catch(() => {
        throw new Error("Unable to fetch server config.");
      });
  }, []);

  return (
    <Router>
      <Box height="100%" width="100%" display="flex" flexDirection="column">
        {apolloClient === undefined ? (
          <Box
            display="flex"
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        ) : (
          <ApolloProvider client={apolloClient}>
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
          </ApolloProvider>
        )}
      </Box>
    </Router>
  );
};

export default App;
