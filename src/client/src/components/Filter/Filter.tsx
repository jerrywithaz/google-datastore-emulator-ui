import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { useEffect, useState } from "react";
import { DataTypeEnum, Scalars } from "../../types/graphql";

type LabelValue = {
  label: string;
  value: string | number;
};

type FilterProps = {
  options: (LabelValue & { type: string })[];
  defaultValue?: string | number;
  defaultOption?: string;
  onChange: (
    option: string | number | null,
    operator: string,
    value: string | number | boolean | Date | null,
    type: string
  ) => void;
  onRemove: () => void;
  typesMap: Scalars['DataTypeMapScalar'];
};

const typesToInputType: Record<string, React.HTMLInputTypeAttribute> = {
  "string": "text",
  "number": "number",
  "date": "date",
  "boolean": "checkbox"
}

const operators: { label: string, value: string }[] = [
  { label: "equals", value: "="},
  { label: "greater than", value: ">" },
  { label: "greater than or equal to", value: ">=" },
  { label: "less than", value: "<" },
  { label: "less than or equal to", value: ">=" },
];

const style = {
  marginRight: 12,
};

const Filter: React.FC<FilterProps> = ({
  options,
  defaultValue = "",
  defaultOption = null,
  onChange,
  onRemove,
  typesMap
}) => {
  const [option, setOption] = useState<string | null>(defaultOption);
  const [operator, setOperator] = useState<string>("");
  const [value, setValue] = useState<string | number | boolean | Date | null>(defaultValue);

  const type = option !== null ? typesMap[option] : 'string';

  const valueSetterMap: Record<DataTypeEnum, (value: string) => void> = {
    [DataTypeEnum.String]: (value: string) => setValue(value),
    [DataTypeEnum.Number]: (value: string) => setValue(Number(value)),
    [DataTypeEnum.Boolean]: (value: string) => setValue(Boolean(value)),
    [DataTypeEnum.Array]: (value: string) => setValue(value),
    [DataTypeEnum.Object]: (value: string) => setValue(value),
    [DataTypeEnum.Undefined]: () => setValue(null),
    [DataTypeEnum.Nullish]: () => setValue(null),
    [DataTypeEnum.Date]: (value: string) => setValue(value),
    [DataTypeEnum.Buffer]: (value: string) => setValue(value),
  }

  useEffect(() => {
    onChange(option, operator, value, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option, value, operator]);

  return (
    <Box display="flex">
      <Select
        value={option}
        onChange={(e) => {
          setOption(e.target.value);
        }}
        size="small"
        style={style}
      >
        {options.map(({ label, value, type }) => (
          <MenuItem key={value} value={value} data-type={type}>
            {label}
          </MenuItem>
        ))}
      </Select>
      <Select
        value={operator}
        onChange={(e) => setOperator(e.target.value)}
        size="small"
        style={style}
      >
        {operators.map(({ label, value }) => {
          return (
            <MenuItem key={label} value={value}>
              {label}
            </MenuItem>
          )
        })}
      </Select>
      <TextField
        value={value}
        onChange={(e) => {
          const valueSetter = valueSetterMap[type] || setValue;

          valueSetter(e.target.value);
        }}
        size="small"
        style={style}
        variant="outlined"
        type={typesToInputType[type] ?? "text"}
      />
      <ButtonGroup>
        <Button
          variant="outlined"
          onClick={() => {
            setValue("");
          }}
        >
          Clear
        </Button>
        <Button
          variant="outlined"
          onClick={onRemove}
        >
          Remove
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default Filter;
