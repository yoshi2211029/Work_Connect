//import * as React from 'react';
import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { PulseLoader } from "react-spinners";
import { ColorRing } from "react-loader-spinner";

import ProfileMypageEdit from "./MypageEdit";
// デフォルトのアイコンをインポート
import DefaultIcon from "src/sections/Profile/View/DefaultIcon";
import { follow } from "src/_mock/follow";
import { WebScokectContext } from "src/layouts/dashboard/index";

// Itemのスタイルを定義
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  border: "#DAE2ED 2px solid",
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
  fontSize: "25px",
}));

// Showmoreのスタイルを定義
const Showmore = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(1),
  textAlign: "center",
  fontSize: "20px",
}));

// ローディングのコンポーネント
const ColorRingStyle = () => {
  return(
    <Box
      sx={{
        marginTop: '20%',
        display: 'flex', // Flexboxを使用
        justifyContent: 'center', // 水平方向中央
        alignItems: 'center', // 垂直方向中央
      }}
    >
      <ColorRing
        style={{
          visible: true,
          margin: "0px",
          height: "10",
          width: "10",
          ariaLabel: "color-ring-loading",
          wrapperClass: "custom-color-ring-wrapper",
          colors:
          ["#e15b64",
            "#f47e60",
            "#f8b26a",
            "#abbd81",
            "#849b87"]
        }}
      />
    </Box>
  );

}

const ProfileMypage = () => {
  // 「さらに表示」ボタンの初期設定
  const [showMoreText, setShowMoreText] = useState(
    <>
      <KeyboardArrowDownIcon /> さらに表示
    </>
  );

  // useTheme,useRef初期化
  const theme = useTheme();
  const Profile = useRef(null);
  const detail = useRef([]);
  const showmore = useRef(null);
  const childRef = useRef(null);
  const [close, setClose] = useState(true);
  // Laravelとの通信用URL
  const url = "http://localhost:8000/get_profile_mypage";

  // ログイン中のuser_nameではない
  // ＊＊＊他ルートからアクセスしたときに表示したいユーザのuser_nameをここで指定＊＊＊
  const { user_name } = useParams();

  // DBからのレスポンスが入る変数
  const [ResponseData, setResponseData] = useState([]);
  const [responseIcon, setResponseIcon] = useState(true);

  // セッションストレージ取得
  const { getSessionData } = useSessionStorage();

  //フォローの状況がセットされる関数
  const [followStatus, setFollowStatus] = useState([]);

  //フォローステータスが変更されるまでの間ボタンを押せなくする
  const [ButtonDisable, setButtonDisable] = useState(false);

  // const coloRing = {
  //   visible: true,  // コロンで区切る
  //   margin: "0px",
  //   height: "10",
  //   width: "10",
  //   ariaLabel: "color-ring-loading",
  //   wrapperClass: "custom-color-ring-wrapper", // コメントを外に
  //   colors: ["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]
  // };

  // websocket通信のデータ保存先
  const notificationContext = useContext(WebScokectContext);

  // セッションストレージからaccountDataを取得し、idを初期値として設定(ログイン中のIDを取得)
  const getUserId = () => {
    const accountData = getSessionData("accountData");
    return accountData.id ? accountData.id : 0;
  };

  //ログイン中のid
  const MyUserId = useState(getUserId);

  // ProfileUserNameが変化したとき
  useEffect(() => {
    async function GetData() {
      try {
        // Laravel側からデータを取得
        const response = await axios.get(url, {
          params: {
            kind: "s",
            ProfileUserName: user_name, //プロフィールとして表示されている人のユーザーネーム
            MyUserId: MyUserId, //ログイン中のID
          },
        });
        if (response) {
          setResponseData(response.data[0]);
          setFollowStatus(response.data[0].follow_status);
        }
      } catch (err) {
        console.log("err:", err);
      }
    }
    // DBからデータを取得
    if (user_name) {
      GetData();
    }
  }, []);

  // 初回レンダリング時の一度だけ実行させる
  useEffect(() => {
    // 詳細項目の非表示
    detail.current.forEach((ref) => {
      if (ref) ref.style.display = "none";
    });
  }, []);

  // フォロー
  useEffect(() => {
    let followStatusDetail;
    if (notificationContext.WebSocketState.notification.noticeData) {
      followStatusDetail = notificationContext.WebSocketState.notification.noticeData;
      console.log("followStatusDetail.detail", followStatusDetail.detail);
      if (followStatusDetail.detail == "相互フォロー") {
        setFollowStatus("相互フォローしています");
      } else if (followStatus == "フォローする") {
        setFollowStatus("フォローされています");
      }
    }
  }, [notificationContext.WebSocketState.notification.noticeData]);

  useEffect(() => {
    // let followStatusDetail;
    console.log(
      "notificationContext.WebSocketState.websocketFollowStatus.follow_status",
      notificationContext.WebSocketState.websocketFollowStatus.follow_status
    );
    if (notificationContext.WebSocketState.websocketFollowStatus.follow_status) {
      // followStatusDetail = notificationContext.WebSocketState.websocketFollowStatus.follow_status;
      console.log(
        "notificationContext.WebSocketState.websocketFollowStatus.follow_status",
        notificationContext.WebSocketState.websocketFollowStatus.follow_status
      );
      if (followStatus == "フォローされています") {
        console.log(
          "notificationContext.WebSocketState.websocketFollowStatus.follow_status",
          notificationContext.WebSocketState.websocketFollowStatus.follow_status
        );
        setFollowStatus("フォローする");
      } else if (followStatus == "相互フォローしています") {
        console.log(
          "notificationContext.WebSocketState.websocketFollowStatus.follow_status",
          notificationContext.WebSocketState.websocketFollowStatus.follow_status
        );
        setFollowStatus("フォローしています");
      }
      console.log(
        "notificationContext.WebSocketState.websocketFollowStatus.follow_status",
        notificationContext.WebSocketState.websocketFollowStatus.follow_status
      );
    }
  }, [notificationContext.WebSocketState.websocketFollowStatus.follow_status]);

  useEffect(() => {
    console.log("notificationContext", notificationContext);
  }, [notificationContext]);

  // アイコンの設定
  useEffect(() => {
    if (ResponseData.icon !== undefined) {
      setResponseIcon(false);
    }
  }, [ResponseData.icon]);

  // 編集ボタンを押したときの処理
  const handleEditClick = () => {
    // 編集画面をオープン
    childRef.current?.openEdit();
    // プロフィール画面を閉じる
    Profile.current.style.display = "none";
    //setMypageEditState(1);
  };

  // 「さらに表示」が押された時の処理
  const ShowmoreClick = () => {
    if (close) {
      // 「さらに表示」のとき、詳細項目を表示して、ボタンを「閉じる」に変更
      setClose(false);
      detail.current.forEach((ref) => {
        if (ref) {
          ref.style.display = "";
        }
      });
      setShowMoreText(
        <>
          <KeyboardArrowUpIcon /> 閉じる
        </>
      );
    } else {
      // 「閉じる」のとき、詳細項目を非表示にして、ボタンを「さらに表示」に変更
      setClose(true);
      detail.current.forEach((ref) => {
        if (ref) {
          ref.style.display = "none";
        }
      });
      setShowMoreText(
        <>
          <KeyboardArrowDownIcon /> さらに表示
        </>
      );
    }
  };

  // データからタグを抽出する処理
  const ExtractTags = (data, key) => {
    return data?.[key] ? data[key].split(",").map((region) => region.trim()) : [];
  };

  // タグを表示する処理
  const ShowTags = (tags) => {
    return tags.map((region, index) => (
      <Button
        key={index}
        variant="outlined"
        sx={{ borderColor: "#637381", color: "#637381", "&:hover": { borderColor: "#637381" }, cursor: "pointer" }}
      >
        {region}
      </Button>
    ));
  };

  // ExtractTagsメソッドで抽出したタグを<Item>内で表示する
  const department_name_tag = ExtractTags(ResponseData, "department_name");
  const faculty_name_tag = ExtractTags(ResponseData, "faculty_name");
  const major_name_tag = ExtractTags(ResponseData, "major_name");
  const course_name_tag = ExtractTags(ResponseData, "course_name");
  const development_environment_tag = ExtractTags(ResponseData, "development_environment");
  const hobby_tag = ExtractTags(ResponseData, "hobby");
  const desired_work_region_tag = ExtractTags(ResponseData, "desired_work_region");
  const desired_occupation_tag = ExtractTags(ResponseData, "desired_occupation");
  const programming_language_tag = ExtractTags(ResponseData, "programming_language");
  const acquisition_qualification_tag = ExtractTags(ResponseData, "acquisition_qualification");
  const software_tag = ExtractTags(ResponseData, "software");
  const profile_id = ResponseData.id;

  console.log("profile_id", profile_id);
  const handleFollowClick = async () => {
    try {
      //data.account_id = 自分のid
      console.log(profile_id);
      //id = 今見ているプロフィールの人のid
      console.log(MyUserId[0]);
      setButtonDisable(true);
      const updatedFollowStatus = await follow(MyUserId[0], profile_id);

      setButtonDisable(false);

      if (updatedFollowStatus == "成功") {
        if (followStatus == "フォローする") {
          setFollowStatus("フォローしています");
        } else if (followStatus == "フォローされています") {
          setFollowStatus("相互フォローしています");
        } else if (followStatus == "フォローしています") {
          setFollowStatus("フォローする");
        } else if (followStatus == "相互フォローしています") {
          setFollowStatus("フォローされています");
        }
      }
      const response = await axios.post("http://localhost:8000/followCheck", {
        sender_id: MyUserId[0],
        recipient_id: profile_id,
      });

      if (response.data !== followStatus) {
        console.log("setFollowStatusresponse.data", response.data);
        setFollowStatus(response.data);
      }
      console.log("updatedFollowStatus", updatedFollowStatus);
    } catch (error) {
      console.error("フォロー処理中にエラーが発生しました！", error);
    }
  };

  const renderFollow = () => {
    if (followStatus && followStatus === "フォローできません") {
      return <Typography opacity="0.48"></Typography>;
    } else {
      return (
        <Button disabled={ButtonDisable} onClick={handleFollowClick} variant="outlined">
          {followStatus}
        </Button>
      );
    }
  };

  return (
    <Box sx={{ marginLeft: "18%", width: "64%", marginTop: "30px" }}>
      {/* 編集のコンポーネントをここで呼び出し */}
      <ProfileMypageEdit ref={childRef} />
      <Stack spacing={3} ref={Profile}>
        {/* 編集ボタン */}
        {/* ResponseData.id(プロフィールのID) と MyUserId(ログイン中のID)が一致したら編集ボタンを表示 */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {ResponseData.id === MyUserId[0] ? (
            <Tooltip title="編集する">
              <IconButton
                onClick={handleEditClick}
                sx={{
                  marginLeft: "auto", // 右揃え
                  "&:hover": { backgroundColor: "#f0f0f0", title: "a" },
                  // width: "30px",
                  // height: "30px",
                }}
              >
                <ModeEditIcon sx={{ fontSize: 55 }} />
              </IconButton>
            </Tooltip>
          ) : ResponseData.id && MyUserId[0] && ResponseData.id.charAt(0) !== MyUserId[0].charAt(0) ? (
            // ResponseData.id(プロフィールのID)の1文字目 と MyUserId(ログイン中のID)の1文字目が一致しない場合はフォローの状況を表示
            // 学生側はS、企業側はCで始まる。
            <Tooltip title="フォロー状況">{renderFollow()}</Tooltip>
          ) : (
            <div>
              <div
                style={{
                  marginLeft: "auto", // 右揃え
                  "&:hover": { backgroundColor: "#f0f0f0", title: "a" },
                  width: "30px",
                  height: "30px",
                }}
              >
                <div style={{ fontSize: 55 }}></div>
              </div>
            </div>
          )}
        </Box>

        <Card
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            backgroundColor: theme.palette.background.default,
            boxShadow: "none",
            position: "relative",
          }}
        >
          {responseIcon ? (
            <Box sx={{ height: "calc(100vw * 0.58)", width: "calc(100vw * 0.58)", maxHeight: 350, maxWidth: 350 }}>
              <ColorRingStyle />
            </Box>
          ) : ResponseData.icon ? (
            <CardMedia
              component="img"
              sx={{
                height: "calc(100vw * 0.58)",
                width: "calc(100vw * 0.58)",
                objectFit: "cover",
                borderRadius: "50%",
                maxHeight: 350,
                maxWidth: 350,
                "@media (min-width: 600px)": {
                  height: 350,
                  width: 350,
                },
              }}
              image={`http://localhost:8000/storage/images/userIcon/${ResponseData.icon}`}
            />
          ) : (
            <DefaultIcon
              sx={{
                height: "calc(100vw * 0.58)",
                width: "calc(100vw * 0.58)",
                padding: '20px',
                objectFit: "cover",
                borderRadius: "50%",
                maxHeight: 350,
                maxWidth: 350,
                "@media (min-width: 600px)": {
                  height: 350,
                  width: 350,
                },
              }}
            />
          )}

        </Card>

        <Box>
          <Typography variant="h6">名前</Typography>
          <Item>
            {ResponseData.student_surname ? ResponseData.student_surname : <PulseLoader color="#DAE2ED" />} {ResponseData.student_name}
          </Item>
        </Box>
        <Box>
          <Typography variant="h6">名前(カタカナ)</Typography>
          <Item>
            {ResponseData.student_kanasurname ? ResponseData.student_kanasurname : <PulseLoader color="#DAE2ED" />} {ResponseData.student_kananame}
          </Item>
        </Box>
        <Box>
          <Typography variant="h6">自己紹介</Typography>
          <Item sx={{ fontSize: "20px" }}>{ResponseData.intro ? ResponseData.intro : <PulseLoader color="#DAE2ED" />}</Item>
        </Box>
        <Box>
          <Typography variant="h6">卒業年度</Typography>
          <Item>{ResponseData.graduation_year ? ResponseData.graduation_year + "年" : <PulseLoader color="#DAE2ED" />}</Item>
        </Box>

        <Box>
          <Typography variant="h6">学校名(大学名)</Typography>
          <Item>{ResponseData.school_name ? ResponseData.school_name : <PulseLoader color="#DAE2ED" />}</Item>
        </Box>
        {/* 詳細項目がない場合「さらに表示」を表示しない */}
        {(ResponseData.department_name ||
          ResponseData.faculty_name ||
          ResponseData.major_name ||
          ResponseData.course_name ||
          ResponseData.development_environment ||
          ResponseData.hobby ||
          ResponseData.desired_work_region ||
          ResponseData.desired_occupation ||
          ResponseData.programming_language ||
          ResponseData.acquisition_qualification ||
          ResponseData.software) && (
          <Box>
            <Showmore>
              <Button
                variant="outlined"
                ref={showmore}
                onClick={ShowmoreClick}
                sx={{ borderColor: "#5956FF", color: "#5956FF", "&:hover": { borderColor: "#5956FF" }, cursor: "pointer" }}
              >
                {showMoreText}
              </Button>
            </Showmore>
          </Box>
        )}
        {/* ResponseData.faculty_nameがあるときのみ表示 */}
        {ResponseData.faculty_name && !close && (
          <Box ref={(el) => (detail.current[0] = el)} id="detail">
            <Typography variant="h6">学部</Typography>
            <Item>{ShowTags(faculty_name_tag)}</Item>
          </Box>
        )}
        {/* ResponseData.department_nameがあるときのみ表示 */}
        {ResponseData.department_name && !close && (
          <Box ref={(el) => (detail.current[1] = el)} id="detail">
            <Typography variant="h6">学科</Typography>
            <Item>{ShowTags(department_name_tag)}</Item>
          </Box>
        )}
        {/* ResponseData.faculty_nameがあるときのみ表示 */}
        {ResponseData.major_name && !close && (
          <Box ref={(el) => (detail.current[2] = el)} id="detail">
            <Typography variant="h6">専攻</Typography>
            <Item>{ShowTags(major_name_tag)}</Item>
          </Box>
        )}
        {/* ResponseData.department_nameがあるときのみ表示 */}
        {ResponseData.course_name && !close && (
          <Box ref={(el) => (detail.current[3] = el)} id="detail">
            <Typography variant="h6">コース</Typography>
            <Item>{ShowTags(course_name_tag)}</Item>
          </Box>
        )}
        {/* ResponseData.development_environmentがあるときのみ表示 */}
        {ResponseData.development_environment && !close && (
          <Box ref={(el) => (detail.current[4] = el)} id="detail">
            <Typography variant="h6">開発環境</Typography>
            <Item>{ShowTags(development_environment_tag)}</Item>
          </Box>
        )}
        {/* ResponseData.hobbyがあるときのみ表示 */}
        {ResponseData.hobby && !close && (
          <Box ref={(el) => (detail.current[5] = el)} id="detail">
            <Typography variant="h6">趣味</Typography>
            <Item>{ShowTags(hobby_tag)}</Item>
          </Box>
        )}
        {/* ResponseData.desired_work_regionがあるときのみ表示 */}
        {ResponseData.desired_work_region && !close && (
          <Box ref={(el) => (detail.current[6] = el)} id="detail">
            <Typography variant="h6">希望勤務地</Typography>
            <Item>{ShowTags(desired_work_region_tag)}</Item>
          </Box>
        )}
        {/* ResponseData.desired_occupationがあるときのみ表示 */}
        {ResponseData.desired_occupation && !close && (
          <Box ref={(el) => (detail.current[7] = el)} id="detail">
            <Typography variant="h6">希望職種</Typography>
            <Item>{ShowTags(desired_occupation_tag)}</Item>
          </Box>
        )}
        {/* ResponseData.programming_languageがあるときのみ表示 */}
        {ResponseData.programming_language && !close && (
          <Box ref={(el) => (detail.current[8] = el)} id="detail">
            <Typography variant="h6">プログラミング言語</Typography>
            <Item>{ShowTags(programming_language_tag)}</Item>
          </Box>
        )}
        {/* ResponseData.acquisition_qualificationがあるときのみ表示 */}
        {ResponseData.acquisition_qualification && !close && (
          <Box ref={(el) => (detail.current[9] = el)} id="detail">
            <Typography variant="h6">取得資格</Typography>
            <Item>{ShowTags(acquisition_qualification_tag)}</Item>
          </Box>
        )}
        {/* ResponseData.softwareがあるときのみ表示 */}
        {ResponseData.software && !close && (
          <Box ref={(el) => (detail.current[10] = el)} id="detail">
            <Typography variant="h6">ソフトウェア</Typography>
            <Item>{ShowTags(software_tag)}</Item>
          </Box>
        )}

        {/* </span> */}
      </Stack>
    </Box>
  );
};

export default ProfileMypage;
ProfileMypage.displayName = "Parent";
ColorRingStyle.propTypes = {
};
