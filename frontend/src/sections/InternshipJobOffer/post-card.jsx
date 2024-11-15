import { forwardRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";


import { postDateTimeDisplay } from "src/components/view/PostDatatime";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import { follow } from "src/_mock/follow";

// ----------------------------------------------------------------------

const PostCard = forwardRef(({ post }, ref) => {
  const { company_id, news_id, company_name, article_title, genre, header_img, news_created_at, follow_status: initialFollowStatus, icon_id, count } = post;

  useEffect(() => {
    console.log("company_id", company_id);
  }, [company_id])




  const [followStatus, setFollowStatus] = useState(initialFollowStatus);
  const { getSessionData } = useSessionStorage();
  const accountData = getSessionData("accountData");

  const handleFollowClick = async () => {
    try {
      const updatedFollowStatus = await follow(accountData.id, company_id);
      if (updatedFollowStatus) {
        setFollowStatus(updatedFollowStatus);
      }
    } catch (error) {
      console.error("フォロー処理中にエラーが発生しました！", error);
    }
  };

  // 企業アイコン
  const renderAvatar = (
    <Avatar
      alt={company_name}
      src={icon_id}
      sx={{
        zIndex: 9,
        width: 30,
        height: 30,
      }}
    />
  );

    // /Profile/株式会社アーキテクト
  // フォームのレンダリング（企業の投稿の場合）
  const renderForm = company_id === accountData.id && count > 0 ? (
    <Link
      to={`/Profile/${company_name}/Checkform?category=application_form_list`}
    >
      <Typography opacity="0.48">
        {count}件のフォーム回答
      </Typography>
    </Link>
  ) : null;

  // ジャンル
  const renderGenre = genre ? (
    <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    spacing={1}
    sx={{
      mt: 3,
      color: "common.black",
      padding: "5px",
    }}
  >

    <Button
      variant="contained"
      sx={{
        padding: "2px",
        margin: "2px",
        background: "linear-gradient(#41A4FF, #9198e5)",
        "&:hover": {
          background: "linear-gradient(#c2c2c2, #e5ad91)",
        },
      }}
    >
    {genre === 'Internship' ? 'インターンシップ' :
    genre === 'Blog' ? 'ブログ' :
    genre === 'JobOffer' ? '求人' :
    genre === 'Session' ? '説明会' :
    genre}    </Button>

    {renderForm}

    </Stack>

) : null;

    // タイトル
    const renderTitle = (
      <Link
        to={`/news_detail/${news_id}`}
        className="link"
        style={{
          color: "common.black",
          height: 30,
          fontWeight: "Bold",
        }}
      >
        {article_title}
      </Link>
    );

  // サムネイル
  const renderThumbnail = (
    <Box
      component="img"
      src={header_img}
      sx={{
        aspectRatio: 16 / 9,
        borderRadius: "10px",
        marginBottom: "10px",
      }}
    />
  );

  //フォローステータス
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


  // 投稿日
  const renderDate = (
    <Typography
      variant="caption"
      component="div"
      sx={{
        mb: 2,
        opacity: 0.48,
        color: "common.black",
      }}
    >
      {postDateTimeDisplay(news_created_at)}
    </Typography>
  );

  // 企業名
  const renderCompanyName = (
    <Typography
      variant="caption"
      component="div"
      sx={{
        mb: 2,
        opacity: 0.48,
        color: "common.black",
      }}
    >
      {company_name}
    </Typography>
  );

  // 投稿情報
  const renderInfo = (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
      sx={{
        mt: 3,
        color: "common.black",
        padding: "5px",
      }}
    >
      {renderDate}
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={1}
        sx={{
          mt: 3,
          color: "common.black",
        }}
      >
        {renderAvatar}
        {renderCompanyName}
      </Stack>
    </Stack>
  );


  return (
    <div ref={ref} >
      <Stack sx={{ display: "inline-block" }}>
        <div className="postCard" style={{ width: '100%' }}>
          {renderThumbnail}
          {renderTitle}
          {renderGenre}
          {renderFollow}
          {renderInfo}
        </div>
      </Stack >
    </div >
  );
});

PostCard.displayName = "PostCard";

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
};

export default PostCard;
