import React, { useMemo, useState } from "react";
import Box from "@material-ui/core/Box";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import useKinds from "../../hooks/useKinds";
import useEntitiesByKind from "../../hooks/useEntitiesByKind";
import getColumnHeaders from "../../utils/getColumnHeaders";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { LabelDisplayedRowsArgs } from "@material-ui/core";
import renderToString from "../../utils/renderToString";
import Filter from "../../components/Filter";

function removeKey(key: string) {
  return key !== "__key__";
}

const Entities: React.FC = () => {
  const [kind, setKind] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [entity, setEntity] = useState<Record<string, any> | null>(null);
  const [filters, setFilters] = useState<[any, any, any][]>([]);

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
      isRefetching: isRefetchingEntities,
    },
    changePage,
    page,
    pageSize,
    setPageSize,
    rowCount,
  } = useEntitiesByKind(kind, filters);

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

  const filterOptions = useMemo(() => {
    return columnHeaders.map((columnHeader) => ({
      label: columnHeader,
      value: columnHeader,
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
      <Box marginTop="12px">
        <Filter
          options={filterOptions}
          onChange={(option, operator, value) => {
            setFilters([[option, operator, value]]);
          }}
          defaultOption={filterOptions[0].label}
        />
      </Box>
      
      <Button
        color="primary"
        variant="contained"
        style={{ marginTop: 12 }}
        onClick={() => {
          fetchEntities();
        }}
      >
        Apply Filters
      </Button>
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
          checkboxSelection={false}
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
                disabled: false,
              },
            },
          }}
          filterModel={{ items: [] }}
          onRowClick={(params) => {
            setDrawerOpen(true);
            setEntity(params.row);
          }}
        />
      </Box>
      <Drawer
        anchor="right"
        open={drawerOpen && entity !== null}
        title="View Entity"
        onClose={() => {
          setDrawerOpen(false);
          setEntity(null);
        }}
        sx={{
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 300 },
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
                      <Typography>{renderToString(entity[key])}</Typography>
                    </Box>
                  </Box>
                );
              })}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Entities;
