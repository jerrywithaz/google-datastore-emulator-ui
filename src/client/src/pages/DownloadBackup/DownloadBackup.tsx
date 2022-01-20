import { Box } from "@material-ui/core";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";
import useBackups from "../../hooks/useBackups";
import useImportBackup from "../../hooks/useImportBackup";

const createColumns = (
  importBackup: (name: string) => void,
  importingBackup: boolean,
  currentBackup: string | null
): GridColDef[] => {
  return [
    { field: "name", headerName: "Name", flex: 1 },
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
        return (
          <Button disabled={params.row.exists} variant="contained">
            Download
          </Button>
        );
      },
      sortable: false,
      editable: false,
    },
    {
      field: "import",
      headerName: "Import",
      flex: 1,
      renderCell: (params) => {
          const importing = importingBackup && params.row.name === currentBackup;
        return (
          <Button
            disabled={!params.row.exists || importingBackup}
            variant="contained"
            onClick={() =>
              importBackup(params.row.name)
            }
            startIcon={importing ? <CircularProgress size={12} /> : null}
          >
            {importing ? "Importing" : "Import"}
          </Button>
        );
      },
      sortable: false,
      editable: false,
    },
  ];
};

const DownloadBackup: React.FC = () => {
  const { data, loading, error } = useBackups();
  const [importBackup, { loading: importingBackup }] =
    useImportBackup();

  const [importing, setImporting] = useState<string | null>(null);

  const backup = (name: string) => {
    setImporting(name);
    importBackup({ variables: { name }}).then(() => {
        setImporting(null);
    }).catch(() => {
        setImporting(null);
    });
  };

  const columns = createColumns(
    backup,
    importingBackup,
    importing
  );

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
        components={{
          NoRowsOverlay: () => {
            return (
              <Stack height="100%" alignItems="center" justifyContent="center">
                {error?.message ?? "No rows backups found."}
              </Stack>
            );
          },
          NoResultsOverlay: () => {
            return (
              <Stack height="100%" alignItems="center" justifyContent="center">
                {error?.message ?? "No rows backups found."}
              </Stack>
            );
          },
        }}
      />
    </Box>
  );
};

export default DownloadBackup;
