import React from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import { isObject } from "../../utils/is";

function removeKey(key: string) {
  return key !== "__key__";
}

type EntityDrawerProps = {
    drawerOpen: boolean;
    entity: Record<string , any> |  null;
    setDrawerOpen: (value: boolean) => void
    setEntity: (value: Record<string , any> | null) => void
}
const EntityDrawer: React.FC<EntityDrawerProps> = ({ drawerOpen, entity, setDrawerOpen, setEntity }) => {
  return (
    <Drawer
      anchor="right"
      open={drawerOpen && entity !== null}
      title="View Entity"
      onClose={() => {
        setDrawerOpen(false);
        setEntity(null);
      }}
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: 400 },
      }}
    >
      <Box padding="20px">
        <Typography variant="h6">View Entity</Typography>
        {entity &&
          Object.keys(entity)
            .sort()
            .filter(removeKey)
            .map((key) => {
              return (
                <Box key={key} padding="5px 0px">
                  <Typography fontWeight="bold">{key}</Typography>
                  <Box maxHeight={300} overflow="auto" maxWidth="100%">
                    {isObject(entity[key]) ? (
                      <SyntaxHighlighter language="json" style={docco}>
                        {JSON.stringify(entity[key], null, 2)}
                      </SyntaxHighlighter>
                    ) : (
                      <Typography>{entity[key]}</Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
      </Box>
    </Drawer>
  );
};


export default EntityDrawer;