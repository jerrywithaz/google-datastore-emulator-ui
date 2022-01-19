import React, { useEffect, useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Entities from "./pages/Entities";
import axios from "axios";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  ApolloProvider,
} from "@apollo/client";
import AppContent from "./components/AppContent";
import AppHeader from "./components/AppHeader";
import AppDrawer from "./components/AppDrawer";
import DownloadBackup from "./pages/DownloadBackup";

SyntaxHighlighter.registerLanguage("json", json);

const url = process.env.PUBLIC_URL + "/server_config.json";
const drawerWidth = 240;

const App: React.FC = () => {
  const [apolloClient, setApolloClient] = useState<
    ApolloClient<NormalizedCacheObject> | undefined
  >(undefined);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

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
              <AppHeader
                drawerOpen={drawerOpen}
                drawerWidth={drawerWidth}
                onIconClick={toggleDrawerOpen}
              />
              <AppDrawer drawerOpen={drawerOpen} drawerWidth={drawerWidth} />
              <AppContent drawerOpen={drawerOpen} drawerWidth={drawerWidth}>
                <Switch>
                  <Route path="/" exact component={Entities} />
                  <Route path="/download-backup" exact component={DownloadBackup} />
                </Switch>
              </AppContent>
            </ApolloProvider>
          )}
        </Box>
      </Router>
  );
};

export default App;
