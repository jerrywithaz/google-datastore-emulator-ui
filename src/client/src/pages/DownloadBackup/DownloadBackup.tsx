import { Box } from "@material-ui/core";
import Button from "@mui/material/Button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import useBackups from "../../hooks/useBackups";

const columns: GridColDef[] = [
  { field: "name", headerName: "Location", flex: 1 },
  {
    field: "date",
    headerName: "Created At",
    flex: 1,
    type: "date",
    valueFormatter: (params) => {
      if (typeof params.value === "string") {
        return new Date(params.value).toLocaleString();
      }
      return "-";
    },
  },
  {
    field: "download",
    headerName: "Download",
    flex: 1,
    renderCell: (params) => {
      return <Button disabled={params.row.exists} variant="contained">Download</Button>;
    },
    sortable: false,
    editable: false
  },
  {
    field: "import",
    headerName: "Import",
    flex: 1,
    renderCell: (params) => {
      return <Button disabled={!params.row.exists} variant="contained">Import</Button>;
    },
    sortable: false,
    editable: false
  },
];

const DownloadBackup: React.FC = () => {
  const { data, loading } = useBackups();

  return (
    <Box height={600} width="100%" marginTop="20px">
      <DataGrid
        columns={columns}
        rows={data?.getBackups ?? []}
        loading={loading}
        paginationMode="client"
        pagination
        pageSize={10}
        sortModel={[{ field: "date", sort: "desc" }]}
        disableSelectionOnClick
      />
    </Box>
  );
};

export default DownloadBackup;
