import React from "react";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

type EntityKindsProps = {
  kind: string;
  kinds: string[];
  setKind: (kind: string) => void;
};

const EntityKinds: React.FC<EntityKindsProps> = ({ kind, kinds, setKind }) => {
  return (
    <FormControl>
      <InputLabel id="kinds-select-label">Kinds</InputLabel>
      <Select
        autoWidth
        placeholder="Kinds"
        value={kind}
        onChange={(e) => setKind(e.target.value)}
        label="Kinds"
        labelId="kinds-select-label"
        id="kinds-select"
        size="small"
      >
        {kinds.map((kind) => {
          return (
            <MenuItem key={kind} value={kind}>
              {kind}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default EntityKinds;
