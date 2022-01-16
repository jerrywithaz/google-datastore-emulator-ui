import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Filter from "../../components/Filter";
import { FilterModel } from "../../types/graphql";

type EntityFiltersProps = {
  onApplyFilters: () => void;
  filterOptions: { label: string; value: string }[];
  setFilters: (filters: FilterModel[]) => void;
};

const EntityFilters: React.FC<EntityFiltersProps> = ({
  onApplyFilters,
  filterOptions,
  setFilters,
}) => {
  return (
    <>
      <Box marginTop="12px">
        <Filter
          options={filterOptions}
          onChange={(option, operator, value) => {
            if (value) {
              setFilters([
                { property: option, operator, value } as FilterModel,
              ]);
            }
          }}
          defaultOption={filterOptions[0].label}
        />
      </Box>

      <Button
        color="primary"
        variant="contained"
        style={{ marginTop: 12 }}
        onClick={() => {
          onApplyFilters();
        }}
      >
        Apply Filters
      </Button>
    </>
  );
};

export default EntityFilters;
