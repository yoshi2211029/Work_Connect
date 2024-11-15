import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";

const YoutubeURL = (props) => {
  return (
    <div>
      <p>
        動画
        <TextField
          fullWidth
          margin="normal"
          type="text"
          name="text"
          variant="outlined"
          onChange={props.onChange}
          value={props.value}
          sx={{
            backgroundColor: "#fff", // 背景色を指定
            borderRadius: "8px", // 角の丸みを設定
            marginTop: "6px",
            marginBottom: "0",
          }}
        />
      </p>
    </div>
  );
};

YoutubeURL.propTypes = {
  callSetWorkData: PropTypes.func,
  onChange: PropTypes.func.isRequired, // 追加
  value: PropTypes.string.isRequired, // 追加
};

export default YoutubeURL;
