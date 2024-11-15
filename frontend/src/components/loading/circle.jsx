import PropTypes from 'prop-types';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularIndeterminate({ Circul }) {
  return (
    <div style={{ display: Circul, justifyContent: "center", alignItems: "center" }}>
      <Box>
        <CircularProgress
          sx={{
            margin: "auto",
          }}
        />
      </Box>
    </div>
  );
}

CircularIndeterminate.propTypes = {
  Circul: PropTypes.string.isRequired, // Circulのプロパティをstring型として定義し、isRequiredで必須であることを指定
};