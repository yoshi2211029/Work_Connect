import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === "dark" ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === "dark" ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

const Introduction = (props) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(null);
  const [hasError, setHasError] = useState(false);

  const handleChange = (e) => {
    props.callSetWorkData("Introduction", e.target.value);
    console.log("nagasa",e.target.value);

    setInputValue(e.target.value);
    setHasError(e.target.value === ""); // 空の場合にエラーを表示
  };

  useEffect(() => {
    // バリデーション
    if (inputValue === "") {
      // 自己紹介が空だったら、error表示
      setHasError((prev) => ({ ...prev, hasError: true }));
    } else if (inputValue !== "") {
      // 自己紹介が空でないなら、error非表示
      setHasError((prev) => ({ ...prev, hasError: false }));
    }
  }, [inputValue]);

  return (
    <div>
      <p>
        作品紹介文*
        <Textarea
          error={hasError}
          name="Introduction"
          maxRows={12}
          aria-label="maximum height"
          placeholder="500字以内"
          value={inputValue}
          onChange={handleChange}
          maxLength={500}
          sx={{
            border:
              inputValue === ""
                ? "1px red solid"
                : `1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]}`,
          }}
        />
      </p>

      <Typography
        variant="body2"
        color="textSecondary"
        align="right"
        sx={{ marginTop: 0 }}
      >
        {/* 文字数カウント */}
        {inputValue ? (
          inputValue.length
        ) : (
          <span style={{ color: "red", opacity: 0.7 }}>0</span>
        )}{" "}
        / 500
      </Typography>
    </div>
  );
};

Introduction.propTypes = {
  callSetWorkData: PropTypes.func,
};
export default Introduction;
