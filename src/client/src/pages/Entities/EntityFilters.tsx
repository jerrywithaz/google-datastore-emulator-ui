import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Filter from "../../components/Filter";
import { DataTypeEnum, FilterModel, Scalars } from "../../types/graphql";
import ButtonGroup from "@material-ui/core/ButtonGroup";

type EntityFiltersProps = {
  onApplyFilters: React.Dispatch<React.SetStateAction<FilterModel[]>>;
  filterOptions: { label: string; value: string; type: string }[];
  typesMap: Scalars['DataTypeMapScalar'];
};

type EntityFilter = FilterModel & { type: DataTypeEnum };

const typesConvertor: Record<DataTypeEnum, (value: string | number) => any> = {
  [DataTypeEnum.Date]: (value) => new Date(value),
  [DataTypeEnum.Boolean]: (value) => Boolean(value),
  [DataTypeEnum.String]: (value) => value,
  [DataTypeEnum.Number]: (value) => value,
  [DataTypeEnum.Array]: (value) => value,
  [DataTypeEnum.Object]: (value) => value,
  [DataTypeEnum.Undefined]: () => null,
  [DataTypeEnum.Nullish]: () => null,
  [DataTypeEnum.Buffer]: (value) => value,
}

const EntityFilters: React.FC<EntityFiltersProps> = ({
  onApplyFilters,
  filterOptions,
  typesMap
}) => {
  const [filters, setFilters] = useState<EntityFilter[]>([]);

  if (filterOptions.length === 0) {
    return null;
  }

  return (
    <>
      <Box marginTop="12px">
        {filters.map((_, index) => {
          return (
            <Filter
              key={`filter-${index}`}
              options={filterOptions}
              typesMap={typesMap}
              onChange={(option, operator, value, type) => {
                setFilters((filters) => {
                  const newFilters = [...filters];

                  newFilters.splice(index, 1, {
                    property: option,
                    operator,
                    value,
                    type
                  } as EntityFilter);

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
                  type: "string"
                } as EntityFilter,
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
            onApplyFilters(filters.map(({ property, value, operator, type }) => {
              const convertor = typesConvertor[type];

              return {
                property,
                value: convertor(value),
                operator
              }
            }));
          }}
        >
          Apply Filters
        </Button>
        <Button
          color="primary"
          variant="contained"
          style={{ marginTop: 12 }}
          onClick={() => {
            onApplyFilters([]);
            setFilters([]);
          }}
        >
          Reset Filters
        </Button>
      </ButtonGroup>
    </>
  );
};

export default EntityFilters;
