import { forwardRef } from "react";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";

const HeaderAvatar = forwardRef(({ children, ...others }, ref) => {
  const theme = useTheme();

  return (
    <Avatar
      ref={ref}
      variant="rounded"
      sx={{
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        bgcolor: "#1877F2",
        color: "white",
        "&:hover": {
          bgcolor: "#a9a9a9",
          color: "white",
        },

        width: 35,
        height: 35,
      }}
      {...others}
    >
      {children}
    </Avatar>
  );
});

HeaderAvatar.displayName = "HeaderAvatar";

HeaderAvatar.propTypes = {
  children: PropTypes.node,
};

export default HeaderAvatar;
