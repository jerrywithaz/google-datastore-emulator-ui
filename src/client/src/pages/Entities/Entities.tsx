import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import useKinds from "../../hooks/useKinds";
import useEntitiesByKind from "../../hooks/useEntitiesByKind";
import getColumnHeaders from "../../utils/getColumnHeaders";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const Entities: React.FC = () => {
  const [kind, setKind] = useState<string>("");

  const { data: kinds = [], isLoading: isLoadingKinds } = useKinds({
    onSuccess: (data) => {
      if (!kind) setKind(data[0]);
    },
  });

  const { data: entities = [], isLoading: isLoadingEntities } = useEntitiesByKind(kind);

  const columnHeaders = useMemo(() => {
    return getColumnHeaders(entities);
  }, [entities]);

  const dataGridColumns = useMemo<GridColDef[]>(() => {
    return columnHeaders.map((columnHeader) => ({
      field: columnHeader,
      headerName: columnHeader,
      flex: 1,
      valueFormatter: (params) => {
        if (Array.isArray(params.value) || typeof params.value === "object") {
          return JSON.stringify(params.value);
        }
        return params.value;
      },
    }));
  }, [columnHeaders]);

  console.log(columnHeaders);

  return (
    <Box>
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
      <Box height={600} width="100%" marginTop="20px">
        <DataGrid
          rows={entities}
          columns={dataGridColumns}
          pageSize={25}
          rowsPerPageOptions={[5, 25, 50, 100]}
          checkboxSelection
          disableSelectionOnClick
          loading={isLoadingEntities || isLoadingKinds}
        />
      </Box>
    </Box>
  );
};

export default Entities;
