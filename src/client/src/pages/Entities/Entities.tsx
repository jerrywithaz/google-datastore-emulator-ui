import React, { useCallback, useEffect, useMemo, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import useKinds from "../../hooks/useKinds";
import useEntitiesByKind from "../../hooks/useEntitiesByKind";
import { DataGrid, GridCellEditCommitParams, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { LabelDisplayedRowsArgs } from "@material-ui/core";
import { FilterModel, SortModel } from "../../types/graphql";
import useUpdateEntity from "../../hooks/useUpdateEntity";
import EntityDrawer from "./EntityDrawer";
import EntityKinds from "./EntityKinds";
import EntityFilters from "./EntityFilters";

function isObjectOrArray(
  value: any
): value is Array<any> | Record<string, any> {
  if (value === null || value === undefined) return false;

  if (Array.isArray(value) || typeof value === "object") {
    return true;
  }

  return false;
}

const Entities: React.FC = () => {
  const [kind, setKind] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [entity, setEntity] = useState<Record<string, any> | null>(null);
  const [filters, setFilters] = useState<FilterModel[]>([]);
  const [sortModel, setSortModel] = useState<SortModel[] | null>(null);
  const [currentCell, setCurrentCell] = useState<GridCellParams | null>(null);

  const { data: kindsData, loading: isLoadingKinds } = useKinds({
    onCompleted: (data) => {
      if (!kind) setKind(data.getKinds[0]);
    },
  });

  const { getKinds: kinds } = kindsData || { getKinds: [] };

  const {
    result: [
      fetchEntities,
      { data: getEntitiesData, loading: isLoadingEntities },
    ],
    changePage,
    page,
    pageSize,
    setPageSize,
    rowCount,
  } = useEntitiesByKind({ kind, filters, sortModel });

  const [updateEntity] = useUpdateEntity({
    onCompleted: () => fetchEntities(),
  });

  const { getEntities: entitiesData } = getEntitiesData ?? {};

  const entities = useMemo(() => {
    if (entitiesData?.entities) {
      return entitiesData?.entities.map(({ entity, key, path }) => {
        return { id: key, key, ...entity, __path: path };
      });
    }
    return [];
  }, [entitiesData?.entities]);


  const dataGridColumns = useMemo<GridColDef[]>(() => {
    const columns: GridColDef[] = (entitiesData?.columns || []).map((key) => {
      const type = entitiesData?.typesMap[key];
      const isArrayOrObject = type === "array" || type === "object";

      return {
        field: key,
        headerName: key,
        flex: 1,
        valueFormatter: (params) => {
          if (params.value instanceof Date) {
            return params.value.toLocaleString();
          }

          if (params.value === undefined) return "-";

          return params.value;
        },
        valueGetter: (params) => {
          const value = params.row[params.field];
          const type = entitiesData?.typesMap[params.field];

          if (type === "date") {
            return value ? new Date(value) : undefined;
          }

          if (isObjectOrArray(value)) {
            return JSON.stringify(value);
          }

          return value;
        },
        editable: true,
        minWidth: 200,
        type: isArrayOrObject ? "string" : entitiesData?.typesMap[key],
      };
    }, []);

    const viewColumn: GridColDef = {
      field: "view",
      editable: false,
      headerName: "",
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              setDrawerOpen(true);
              setEntity(params.row);
            }}
            variant="contained"
            size="small"
          >
            View
          </Button>
        );
      },
      width: 100,
    };
    return [viewColumn].concat(columns);
  }, [entitiesData]);

  const filterOptions = useMemo(() => {
    if (entitiesData) {
      return entitiesData.columns.map((key) => ({
        label: key,
        value: key,
        type: entitiesData.typesMap[key]
      }));
    }
    return [];
  }, [entitiesData]);

  const onCellEditCommit = useCallback(async (data: GridCellEditCommitParams) => {
    if (currentCell) {
      const { value, field } = data;
      const type = entitiesData?.typesMap[field];
      const isArrayOrObject = type === "array" || type === "object";

      try {
        const updates = {
          [field]: isArrayOrObject
            ? JSON.parse(value as any)
            : value instanceof Date
              ? value
              : value,
        };

        const path = currentCell.row.__path;
  
        await updateEntity({
          variables: {
            input: {
              path,
              updates,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [currentCell, entitiesData?.typesMap, updateEntity]);

  useEffect(() => {
    if (kind) fetchEntities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortModel, kind]);

  return (
    <Box>
      <EntityKinds kind={kind} kinds={kinds} setKind={setKind} />
      <EntityFilters
        onApplyFilters={setFilters}
        filterOptions={filterOptions}
        typesMap={entitiesData?.typesMap ?? {}}
      />
      <Box height={600} width="100%" marginTop="20px">
        <DataGrid
          pagination
          paginationMode="server"
          sortingMode="server"
          rows={entities}
          rowCount={rowCount}
          columns={dataGridColumns}
          pageSize={pageSize}
          page={page}
          editMode="cell"
          onCellEditStart={(params) => {
            setCurrentCell(params);
          }}
          onCellEditCommit={onCellEditCommit}
          rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
          checkboxSelection={false}
          loading={isLoadingEntities || isLoadingKinds}
          onPageChange={(page) => {
            changePage(page);
            fetchEntities();
          }}
          getRowId={(rowData) => {
            return rowData.id;
          }}
          disableSelectionOnClick
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
          onSortModelChange={(sortModel) =>
            setSortModel(sortModel as SortModel[])
          }
        />
      </Box>
      <EntityDrawer
        setDrawerOpen={setDrawerOpen}
        setEntity={setEntity}
        entity={entity}
        drawerOpen={drawerOpen}
      />
    </Box>
  );
};

export default Entities;
