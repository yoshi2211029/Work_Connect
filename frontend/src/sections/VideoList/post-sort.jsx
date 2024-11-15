import PropTypes from "prop-types";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

// PropTypes の設定
PostSort.propTypes = {
  options: PropTypes.array.isRequired,
  sortOption: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
};

export default function PostSort({ options, sortOption, onSort }) {
  // console.log("sortOption", sortOption);
  return (
    <TextField
      select
      size="small"
      value={sortOption} // 動的に選択された値を表示
      onChange={onSort} // 変更時にハンドラを呼び出す
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
