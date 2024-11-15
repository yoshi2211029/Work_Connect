import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Iframe from "react-iframe";
import axios from "axios";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import {  AVATAR } from "src/layouts/dashboard/config-layout";
import { UseCreateTagbutton } from "src/hooks/use-createTagbutton";
import { useSessionStorage } from "src/hooks/use-sessionStorage";

const VideoDetailItem = () => {
  // ログイン情報の取得
  const { getSessionData } = useSessionStorage();
  // 動画IDの取得
  const { id } = useParams();
  // -----動画データ-----
  const [VideoDetail, setVideoDetail] = useState([]);
  const [CommentPost, setCommentPost] = useState({
    // display: "none",
    text: "",
  });
  const [videoComment, setVideoComment] = useState([]);
  const [AccountData, setAccountData] = useState({});
  const [Comment, setComment] = useState({});
  const [CommentCancel, setCommentCancel] = useState("");

  // -----タグ-----
  const { tagCreate } = UseCreateTagbutton();
  // ジャンル
  const [VideoGenre, setVideoGenre] = useState("");

  // 動画データ
  const videoDetailUrl = "http://localhost:8000/get_movie_detail";
  // 動画コメント投稿
  const videoCommentPostUrl = "http://localhost:8000/post_movie_comment_post";
  // 動画コメントデータ
  const videoCommentUrl = "http://localhost:8000/post_movie_comment";
  // 動画コメント削除
  const videoCommentDelete = "http://localhost:8000/post_movie_comment_delete";

  // Laravel側から動画詳細データを取得
  useEffect(() => {
    setAccountData(getSessionData("accountData"));

    async function VideoListFunction() {
      try {
        // Laravel側から動画詳細データを取得
        const response = await axios.get(videoDetailUrl, {
          params: { id: id },
          headers: {
            "Content-Type": "json",
          },
        });

        setVideoDetail(response.data["動画"][0]);
        setVideoComment(response.data["動画コメント"]);

        console.log("response.data[動画][0]", response.data);
        // console.log("response.data[動画][0]", response.data);
      } catch (err) {
        console.log("err:", err);
      }
    }
    VideoListFunction();
  }, [id]); // 空の依存配列を渡すことで初回のみ実行されるようにする

  useEffect(() => {
    const initialCommentState = {};
    videoComment.forEach((value) => {
      initialCommentState[value.id] = {
        display: "none",
        text: value.content,
        readOnly: true,
      };
    });
    setComment(initialCommentState);
  }, [videoComment]);

  useEffect(() => {
    console.log("commentが変更されました。", Comment);
  }, [Comment]);

  // タグ作成
  useEffect(() => {
    //ジャンル
    setVideoGenre(tagCreate(VideoDetail.genre));
    console.log("VideoDetail", VideoDetail);
  }, [VideoDetail]);





  // 動画タイトル
  const renderTitle = VideoDetail.title && <h1 className="WorkDetail-title">{VideoDetail.title}</h1>;

  // 動画投稿者アイコン
  const renderIcon = VideoDetail.icon && (
    <img
      src={
        VideoDetail.icon
          ? `http://localhost:8000/storage/images/userIcon/${VideoDetail.icon}`
          : `http://localhost:8000/storage/images/userIcon/subNinja.jpg`
      }
      alt=""
      style={{ width: AVATAR.A_WIDTH, height: AVATAR.A_HEIGHT, borderRadius: AVATAR.A_RADIUS }}
    />
  );

  // 動画作成者ユーザーネーム
  const renderUserName = VideoDetail.user_name && <Typography variant="h6">{VideoDetail.user_name}</Typography>;

  // // コメント欄表示
  // const handleTextOpen = () => {
  //   setCommentPost({ ...CommentPost, display: "block" });
  // };

  // コメント投稿キャンセル
  const handlePostCancel = () => {
    setCommentPost({ ...CommentPost, text: "" });
  };

  // コメント投稿内容
  const handlePostChange = (value) => {
    console.log("valuevaluevaluevalue", value);
    setCommentPost({ ...CommentPost, text: value });
  };

  const videoCommentSave = async (text, movieId, userId) => {
    try {
      // Laravel側から作品詳細データを取得
      await axios.post(videoCommentPostUrl, {
        movieCommentContent: text,
        movie_id: movieId,
        user_id: userId,
      });
      // コメント投稿後にページを再読み込み
      window.location.reload();
    } catch (err) {
      console.log("err:", err);
    }
  };

  // コメント投稿
  const handlePost = () => {
    setCommentPost({ ...CommentPost, display: "none" });
    if (CommentPost.text.trim() !== "") {
      videoCommentSave(CommentPost.text, id, AccountData.id);
    } else {
      alert("空白のまま投稿はできません。");
    }
  };

  // コメント編集ボタンクリック
  const handleClick = (commentId) => {
    setComment({
      ...Comment,
      [commentId]: {
        ...Comment[commentId],
        display: "block",
        readOnly: false,
      },
    });

    setCommentCancel(Comment[commentId].text);
  };

  const handleCancel = (commentId) => {
    setComment({
      ...Comment,
      [commentId]: {
        ...Comment[commentId],
        display: "none",
        text: CommentCancel,
        readOnly: true,
      },
    });
  };

  // コメント入力内容変更
  const handleChenge = (text, commentId) => {
    setComment({
      ...Comment,
      [commentId]: {
        ...Comment[commentId],
        text: text,
      },
    });
  };

  // コメント保存
  const handleSave = (commentId) => {
    setComment({
      ...Comment,
      [commentId]: {
        ...Comment[commentId],
        display: "none",
        readOnly: true,
      },
    });

    async function videoCommentSave() {
      try {
        await axios.post(videoCommentUrl, {
          movieCommentContent: Comment[commentId].text,
          commentId: commentId,
        });
      } catch (err) {
        console.log("err:", err);
      }
    }
    videoCommentSave();
  };

  // コメント削除
  const handleDelete = (commentId) => {
    async function videoCommentDeletefunc() {
      try {
        // Laravel側から作品詳細データを取得
        await axios.post(videoCommentDelete, {
          commentId: commentId,
        });
        alert("コメントを削除しました。");
        // コメント削除にページを再読み込み
        window.location.reload();
      } catch (err) {
        console.log("err:", err);
      }
    }
    videoCommentDeletefunc();
  };
  // 動画URL
  const renderYoutubeFrame = (
    <>
      <Iframe

        // https://www.youtube.com/watch?v=6bm54L6tZMs
        url={`https://www.youtube.com/embed/${VideoDetail.youtube_url}?iv_load_policy=3&modestbranding=1&fs=0`}
        width="100%"
        height="500px"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
    </>
  );

  // 動画紹介文
  const renderIntro = VideoDetail.intro && VideoDetail.intro.length > 0 && (
    <>
      <Typography variant="h5" className="WorkDetail_typo">
        ●動画の紹介
      </Typography>
      <div className="WorkDetail_info-intro" style={{ fontSize: "16px" }}>
        {VideoDetail.intro}
      </div>
    </>
  );

  // 動画ジャンル
  const renderGenre = VideoGenre && VideoGenre.length > 0 && (
    <>
      <p>ジャンル</p>
      {VideoGenre}
    </>
  );

  const renderCommentButton = (
    <div
      className="top_comment_area"
      style={{
        display: CommentPost.display,
      }}
    >
      <div className="comment_area_parts">
        <textarea
          className="comment_text_area"
          value={CommentPost.text}
          onChange={(e) => handlePostChange(e.target.value)}
          style={{
            height: "100px",
          }}
        ></textarea>
        <div className="comment_operation">
          <div className="comment_button">
            <Button variant="outlined" onClick={() => handlePostCancel()}>
              キャンセル
            </Button>
            <Button variant="contained" onClick={() => handlePost()}>
              コメント
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // コメント
  const renderComment = videoComment && Object.keys(Comment).length > 0 && (
    <>
      {videoComment && Object.keys(Comment).length > 0 && <h3>コメント一覧</h3>}
      {videoComment.map((item, index) =>
        (item.commenter_id === AccountData.id && item.commenter_user_name === AccountData.user_name) ||
          (item.commenter_id === AccountData.id && item.commenter_company_name === AccountData.company_name) ? (
          <div key={index}>
            {/* {console.log("comment", Comment)} */}
            <Divider sx={{ borderStyle: "dashed", margin: "5px 0px 20px 0px", width: "90%" }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3} sx={{ width: "80%", paddingBottom: "5px" }}>
              <Stack direction="row" justifyContent="left" alignItems="center" spacing={1}>
                <div>{item.commenter_user_name || item.commenter_company_name}</div>
              </Stack>
              <Stack direction="row" justifyContent="right" alignItems="center" spacing={1}>
                <Stack direction="row" justifyContent="left" alignItems="center" spacing={1}>
                  <Button variant="outlined" onClick={() => handleClick(item.id)}>
                    編集
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleCancel(item.id)}
                    className={`comment_${item.id}`}
                    style={{ display: Comment[item.id]?.display }}
                  >
                    キャンセル
                  </Button>
                </Stack>
                <Stack direction="row" justifyContent="left" alignItems="center" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={() => handleSave(item.id)}
                    className={`comment_${item.id}`}
                    style={{ display: Comment[item.id]?.display }}
                  >
                    保存
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ color: "error.main" }}
                    onClick={() => handleDelete(item.id)}
                    className={`comment_${item.id}`}
                    style={{ display: Comment[item.id]?.display }}
                  >
                    削除
                  </Button>
                </Stack>
              </Stack>
            </Stack>

            <textarea
              style={{
                width: "80%",
                height: "100px",
              }}
              className="comment_text_area items"
              value={Comment[item.id].text}
              readOnly={Comment[item.id].readOnly} // 読み取り専用にする場合
              onChange={(e) => handleChenge(e.target.value, item.id)}
            />
          </div>
        ) : (
          <div key={index}>
            <hr />
            <p>{item.commenter_user_name || item.commenter_company_name}</p>
            <textarea
              style={{
                width: "80%",
                height: "100px",
              }}
              className="comment_text_area items"
              value={item.content}
              readOnly // 読み取り専用にする場合
            />
          </div>
        )
      )}
    </>
  );

  return (
    <>
      <Container>

        <Link to="/VideoList">動画一覧に戻る</Link>
        <div>
          <Link to={`/Profile/${VideoDetail.user_name}?page=mypage`}>
            <Stack direction="row" justifyContent="left" alignItems="center" spacing={3}>
              {renderIcon}
              {renderUserName}
            </Stack>
          </Link>
          {renderTitle}
        </div>

        {/* 各項目の表示、ここから */}
        <Box>
          {renderYoutubeFrame}
          {renderGenre}
          {renderIntro}
          {renderCommentButton}
          {renderComment}
        </Box>
        {/* 各項目の表示、ここまで */}
      </Container>
    </>
  );
};

export default VideoDetailItem;
