import { useState, useEffect } from "react";
import { forwardRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import { follow } from "src/_mock/follow";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import { useSessionStorage } from "src/hooks/use-sessionStorage";
import SvgColor from "src/components/svg-color";

// ----------------------------------------------------------------------

const PostCard = forwardRef(({ post, index }, ref) => {
  const {
    company_id,
    icon,
    userName,
    companyName,
    selectedOccupation,
    prefecture,
    cover,
    author,
    followStatus: initialFollowStatus,
  } = post;

  const [followStatus, setFollowStatus] = useState(initialFollowStatus);
  const latestPostLarge = index === -1;

  const { getSessionData } = useSessionStorage();
  const accountData = getSessionData("accountData");
  const data = {
    account_id: accountData.id,
  };

  useEffect(() => {
    console.log("company_id", company_id);
  }, [company_id]);

  const handleFollowClick = async () => {
    try {
      const updatedFollowStatus = await follow(data.account_id, company_id);
      if (updatedFollowStatus) {
        setFollowStatus(updatedFollowStatus);
      }
    } catch (error) {
      console.error("フォロー処理中にエラーが発生しました！", error);
    }
  };

  const renderFollow = () => {
    if (followStatus === "フォローできません") {
      return <Typography opacity="0.48"></Typography>;
    } else {
      return (
        <Typography opacity="0.48" onClick={handleFollowClick}>
          {followStatus}
        </Typography>
      );
    }
  };

  // const latestPost = index === 1 || index === 2;

  const renderAvatar = (
    <Avatar
      alt={author.name}
      src={icon ? `http://localhost:8000/storage/images/userIcon/${icon}` : author.avatarUrl}
      sx={{
        zIndex: 9,
        width: 32,
        height: 32,
        position: "absolute",
        left: (theme) => theme.spacing(3),
        bottom: (theme) => theme.spacing(-2),
      }}
    />
  );

    <Link
      to={`/Profile/${userName}`}
    >
      {companyName}
    </Link>

  const renderUserName = (
    <Link
      to={`/Profile/${userName}?page=mypage`}
      color="inherit"
      variant="subtitle2"
      underline="hover"
      sx={{
        overflow: "hidden",
        WebkitLineClamp: 2,
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        typography: "h5",
        height: 60,
      }}
    >
      {companyName}
    </Link>
  );

  // 募集職種
  const renderSelectedOccupation =
    selectedOccupation !== null ? (
      <div>
        募集職種:
          {selectedOccupation}
      </div>
    ) : null;

  // 勤務地
  const renderPrefecture =
    prefecture !== null ? (
      <div>
        勤務地:
          {prefecture}
      </div>
    ) : null;

  const renderCover = (
    <Box
      component="img"
      // altをアンコメント（コメントアウトの逆のこと）をするとアイコンの上に名前が表示されてしまうので注意
      // alt={title}
      src={cover}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: "cover",
        position: "absolute",
      }}
    />
  );

  // const renderDate = (
  //   <Typography
  //     variant="caption"
  //     component="div"
  //     sx={{
  //       mb: 2,
  //       color: "text.disabled",
  //     }}
  //   >
  //     {fDate(createdAt, "yyyy MM dd")}
  //   </Typography>
  // );

  const renderShape = (
    <SvgColor
      color="paper"
      src="/assets/icons/shape-avatar.svg"
      sx={{
        width: 80,
        height: 36,
        zIndex: 9,
        bottom: -15,
        position: "absolute",
        color: "background.paper",
      }}
    />
  );

  return (
    <Grid xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}  style={{ width: "100%" }}>
      <div ref={ref}>
        <Card className="postCard" style={{ width: "100%" }}>
          <Box
            sx={{
              position: "relative",
              pt: "calc(100% * 2 / 4)",
            }}
          >
            {renderShape}

            {renderAvatar}

            {renderCover}
          </Box>

          <Box
            sx={{
              p: (theme) => theme.spacing(4, 3, 3, 3),
            }}
          >
            {renderFollow()}

            {renderUserName}

            {renderSelectedOccupation}

            {renderPrefecture}
          </Box>
        </Card>
      </div>
    </Grid>
  );
});

// `displayName` の追加
PostCard.displayName = "PostCard";

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default PostCard;