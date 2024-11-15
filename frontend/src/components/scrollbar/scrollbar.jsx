import { memo, forwardRef } from "react";
import PropTypes from "prop-types";

import { StyledScrollbar, StyledRootScrollbar } from "./styles";

import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

// eslint-disable-next-line react/no-multi-comp
const ScrollbarComponent = forwardRef(({ children, sx, ...other }, ref) => {
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

  const mobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

  if (mobile) {
    return (
      <Box ref={ref} sx={{ overflow: "auto", ...sx }} {...other}>
        {children}
      </Box>
    );
  }

  return (
    <StyledRootScrollbar>
      <StyledScrollbar
        scrollableNodeProps={{
          ref,
        }}
        clickOnTrack={false}
        sx={sx}
        {...other}
      >
        {children}
      </StyledScrollbar>
    </StyledRootScrollbar>
  );
});

// displayNameを設定
ScrollbarComponent.displayName = "Scrollbar";

ScrollbarComponent.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};

// コンポーネントに名前を付ける
const Scrollbar = memo(ScrollbarComponent);

export default Scrollbar;
