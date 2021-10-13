import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { useEffect, useState } from "react";

type LabelValue = {
  label: string;
  value: string | number;
};

type FilterProps = {
  options: LabelValue[];
  defaultValue?: string | number;
  defaultOption?: string | number;
  onChange: (
    option: string | number | null,
    operator: string,
    value: string | number | null
  ) => void;
};

const operators: LabelValue[] = [
  { label: "equals", value: "=" },
  { label: "greater than", value: ">" },
  { label: "greater than or equal to", value: ">=" },
  { label: "less than", value: "<" },
  { label: "less than or equal to", value: "<" },
];

const style = {
  marginRight: 12,
};

const Filter: React.FC<FilterProps> = ({
  options,
  defaultValue = "",
  defaultOption = null,
  onChange,
}) => {
  const [option, setOption] = useState<string | number | null>(defaultOption);
  const [operator, setOperator] = useState<string>("=");
  const [value, setValue] = useState<string | number>(defaultValue);

  useEffect(() => {
    onChange(option, operator, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option, value, operator]);

  return (
    <Box display="flex">
      <Select
        value={option}
        onChange={(e) => setOption(e.target.value)}
        size="small"
        style={style}
      >
        {options.map(({ label, value }) => (
          <MenuItem key={value} value={value}>
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
        {operators.map(({ label, value }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        size="small"
        style={style}
        variant="outlined"
      />
      <Button
        variant="outlined"
        onClick={() => {
          setValue("");
        }}
      >
        Clear
      </Button>
    </Box>
  );
};

export default Filter;
