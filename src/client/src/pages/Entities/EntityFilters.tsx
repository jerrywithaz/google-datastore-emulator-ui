import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Filter from "../../components/Filter";
import { FilterModel } from "../../types/graphql";
import ButtonGroup from "@material-ui/core/ButtonGroup";

type EntityFiltersProps = {
  onApplyFilters: () => void;
  filterOptions: { label: string; value: string }[];
  setFilters: React.Dispatch<React.SetStateAction<FilterModel[]>>;
  filters: FilterModel[];
};

const EntityFilters: React.FC<EntityFiltersProps> = ({
  onApplyFilters,
  filterOptions,
  setFilters,
  filters,
}) => {
  return (
    <>
      <Box marginTop="12px">
        {filters.map((_, index) => {
          return (
            <Filter
              key={index}
              options={filterOptions}
              onChange={(option, operator, value) => {
                setFilters((filters) => {
                  const newFilters = [...filters];

                  newFilters.splice(index, 1, {
                    property: option,
                    operator,
                    value,
                  } as FilterModel);

                  return newFilters;
                });
              }}
              onRemove={() => {
                setFilters((filters) => {
                  const newFilters = [...filters];

                  newFilters.splice(index, 1);

                  return newFilters;
                });
              }}
              defaultOption={filterOptions[0].label}
            />
          );
        })}
      </Box>

      <ButtonGroup>
        <Button
          color="primary"
          variant="contained"
          style={{ marginTop: 12 }}
          onClick={() => {
            setFilters((filters) => {
              return [
                ...filters,
                {
                  property: filterOptions[0].label,
                  operator: "=",
                  value: "",
                } as FilterModel,
              ];
            });
          }}
        >
          Add Filter
        </Button>
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
      </ButtonGroup>
    </>
  );
};

export default EntityFilters;
