
import { useEffect, useState } from "react";
import { forwardRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import { follow } from "src/_mock/follow";
import SvgColor from "src/components/svg-color";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
// import { useNavigate } from "react-router-dom";
// ----------------------------------------------------------------------

const PostCard = forwardRef(({ post, index }, ref) => {
  const {
    student_id,
    icon,
    cover,
    userName,
    graduationYear,
    schoolName,
    desiredWorkRegion,
    desiredOccupation,
    followStatus: initialFollowStatus,
    author,
  } = post;

  const latestPostLarge = index === -1;

  const [followStatus, setFollowStatus] = useState(initialFollowStatus);

  const { getSessionData } = useSessionStorage();
  const accountData = getSessionData("accountData");

  const data = {
    account_id: accountData.id,
  };

  useEffect(() => {
    console.log("student_id", student_id);
    console.log("followStatus", followStatus);
  }, [student_id, followStatus]);

  const handleFollowClick = async () => {
    try {
      const updatedFollowStatus = await follow(data.account_id, student_id);
      if (updatedFollowStatus) {
        setFollowStatus(updatedFollowStatus);
      }
    } catch (error) {
      console.error("フォロー処理中にエラーが発生しました！", error);
    }
  };

  // const handleProfileJump = () => {
  //   navigate(`/Profile/${user_name}`);
  // }

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
      {userName}
    </Link>
  );

  const renderFollow = followStatus !== "フォローできません" && (
    <Typography opacity="0.48" onClick={handleFollowClick}>
      {followStatus}
    </Typography>
  );

  const renderGraduationYear =
    graduationYear !== null ? (
      <div>
        卒業年度:
          {graduationYear}
      </div>
    ) : null;

  const renderSchoolName =
    schoolName !== null ? (
      <div>
        学校名:
          {schoolName}
      </div>
    ) : null;

  const renderDesiredWorkRegion =
    desiredWorkRegion !== null ? (
      <div>
        希望勤務地:
          {desiredWorkRegion}
      </div>
    ) : null;

  const renderDesiredOccupation =
    desiredOccupation !== null ? (
      <div>
        希望職種:
          {desiredOccupation}
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
    <Grid xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3} style={{ width: "100%" }}>
      <div ref={ref} >
        <Card className="postCard" style={{ width: "100%" }}>
          <Box
            sx={{
              position: "relative",
              pt: "calc(100% * 3 / 4)",
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
            {renderFollow}

            {renderUserName}

            {renderGraduationYear}

            {renderSchoolName}

            {renderDesiredWorkRegion}

            {renderDesiredOccupation}

            {/* {renderInfo} */}
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