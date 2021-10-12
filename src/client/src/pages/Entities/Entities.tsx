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
import { LabelDisplayedRowsArgs } from "@mui/material";

const Entities: React.FC = () => {
  const [kind, setKind] = useState<string>("");

  const { data: kinds = [], isLoading: isLoadingKinds } = useKinds({
    onSuccess: (data) => {
      if (!kind) setKind(data[0]);
    },
  });

  const {
    result: {
      data: entitiesData,
      isLoading: isLoadingEntities,
      refetch: fetchEntities,
      isRefetching: isRefetchingEntities
    },
    changePage,
    page,
    pageSize,
    setPageSize,
    rowCount
  } = useEntitiesByKind(kind);

  const columnHeaders = useMemo(() => {
    return getColumnHeaders(entitiesData?.entities || []);
  }, [entitiesData]);

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
      minWidth: 200,
    }));
  }, [columnHeaders]);

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
          pagination
          paginationMode="server"
          rows={entitiesData?.entities || []}
          rowCount={rowCount}
          columns={dataGridColumns}
          pageSize={pageSize}
          page={page}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          checkboxSelection
          disableSelectionOnClick
          loading={isLoadingEntities || isLoadingKinds || isRefetchingEntities}
          onPageChange={(page) => {
            changePage(page);
            fetchEntities();
          }}
          getRowId={(rowData) => {
            return rowData.__key__ ?? rowData.id;
          }}
          rowHeight={40}
          onPageSizeChange={setPageSize}
          componentsProps={{
            pagination: {
              labelDisplayedRows: ({ from, to }: LabelDisplayedRowsArgs) => {
                return `${from}-${to} of many`;
              },
              nextIconButtonProps: {
                disabled: false
              }
            }
          }}
          filterModel={{ items: []}}
        />
      </Box>
    </Box>
  );
};

export default Entities;
