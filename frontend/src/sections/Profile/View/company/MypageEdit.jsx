//import * as React from 'react';
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useParams } from 'react-router-dom';
import { useSessionStorage } from "src/hooks/use-sessionStorage";

// muiインポート
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
//import TextField from "@mui/material/TextField";


// コンポーネントをインポート
// --- アイコン --- //
import UserIcon from "./EditDetailFields/UserIcon";
// --- 必須項目 --- //
import CompanyName from "./EditRequiredFields/CompanyName";
import CompanyKanaName from "./EditRequiredFields/CompanyKanaName";
//import CompanyUserName from "./EditRequiredFields/CompanyUserName";

import CompanyAddress from "./EditRequiredFields/CompanyAddress";
import CompanyAddressMap from "./EditRequiredFields/CompanyAddressMap";


import Intro from "./EditRequiredFields/Intro";
// import GraduationYear from "./EditRequiredFields/GraduationYear";
// --- 詳細項目 --- //
import Industry from "./EditDetailFields/Industry";
import Prefecture from "./EditDetailFields/Prefecture";
import SelectedOccupation from "./EditDetailFields/SelectedOccupation";
import Environment from "./EditDetailFields/Environment";
import ProgrammingLanguage from "./EditDetailFields/ProgrammingLanguage";
import Qualification from "./EditDetailFields/Qualification";
import Software from "./EditDetailFields/Software";

import CompanyHPMap from "./EditDetailFields/CompanyHPMap";
import IntroVideo from "./EditDetailFields/IntroVideo";



// Showmoreのスタイルを定義
const Showmore = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(1),
  textAlign: 'center',
  fontSize: '20px',
}));

// Saveのスタイルを定義
const Save = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(1),
  textAlign: 'right',
  fontSize: '20px',
}));

const ProfileMypageEdit = forwardRef((props, ref) => {

  // 親コンポーネント(Mypage.jsx)から渡されたデータ
  useImperativeHandle(ref, () => ({
    openEdit() {
      Edit.current.style.display = '';
    }
  }));

  // 「さらに表示」ボタンの初期設定
  const [showMoreText, setShowMoreText] = useState(
    <><KeyboardArrowDownIcon /> さらに表示</>
  );

  // useRef初期化
  const Edit = useRef(null);
  const detail = useRef([]);
  const showmore = useRef(null);
  const [close, setClose] = useState(true);
  const CompanyNameBox = useRef(null);
  const CompanyKanaNameBox = useRef(null);
  const IntroBox = useRef(null);
  const CompanyAddressBox = useRef(null);
  const CompanyAddressMapBox = useRef(null);
  // 編集状態のチェック
  const { getSessionData , updateSessionData } = useSessionStorage();

  // Laravelとの通信用URL
  const Get_url = "http://localhost:8000/get_profile_mypage";
  const Post_url = "http://localhost:8000/post_profile_mypage";

  // ログイン中のuser_nameではない
  // ＊＊＊他ルートからアクセスしたときに表示したいユーザのuser_nameをここで指定＊＊＊
  const { user_name } = useParams();
  const UserName = useState({user_name});
  const ProfileUserName = UserName[0].user_name;

  // DBからのレスポンスが入る変数
  const [ResponseData, setResponseData] = useState([]);

  // ProfileUserNameが変化したとき
  useEffect(() => {
    async function GetData() {

      try {
        // Laravel側からデータを取得
        const response = await axios.get(Get_url, {
          params: {
            kind: "c",
            ProfileUserName: ProfileUserName,
          },
        });
        if (response) {
          setResponseData(response.data[0]);
        }
        // console.log("ResponseData:", ResponseData);
      } catch (err) {
        console.log("err:", err);
      }
    }
    // DBからデータを取得
    GetData();
  }, []);

  // 初回レンダリング時の一度だけ実行させる
  useEffect(() => {
    detail.current.forEach(ref => {
      if (ref) ref.style.display = 'none';
    });
    Edit.current.style.display = 'none';
  }, []);



  // 戻るボタンを押したときの処理
  const handleBackClick = () => {
    // マイページ編集画面のとき
    console.log("click!");
    // リロード
    window.location.reload();
  };

  // 「さらに表示」が押された時の処理
  const ShowmoreClick = () => {
    console.log("「さらに表示」click!");
    if (close) {
      // 「さらに表示」のとき、詳細項目を表示して、ボタンを「閉じる」に変更
      setClose(false);
      detail.current.forEach(ref => {
        if (ref) {
          ref.style.display = '';
        }
      });
      setShowMoreText(<><KeyboardArrowUpIcon /> 閉じる</>);
    } else {
      // 「閉じる」のとき、詳細項目を非表示にして、ボタンを「さらに表示」に変更
      setClose(true);
      detail.current.forEach(ref => {
        if (ref) {
          ref.style.display = 'none';
        }
      });
      setShowMoreText(<><KeyboardArrowDownIcon /> さらに表示</>);
    }
  };

  // 保存ボタンを押したときの処理
  const handleSaveClick = () => {

    async function PostData() {
      try {
        console.log(SessionData.CompanyName);
        // Laravel側からデータを取得
        const response = await axios.post(Post_url, {
          // 企業側で送信
          kind: "c",
          // ユーザーネーム
          ProfileUserName: ProfileUserName,
          // アイコン
          Icon: SessionData.CompanyIcon,
          // 企業名
          CompanyName: SessionData.CompanyName,
          // 企業名(カタカナ)
          CompanyKanaName: SessionData.CompanyKanaName,
          // 採用担当者
          //UserName: SessionData.CompanyUserName,
          // 自己紹介
          Intro: SessionData.CompanyIntro,
          // 紹介動画
          IntroVideo: SessionData.CompanyIntroVideo,
          // 本社所在地
          CompanyAddress: SessionData.CompanyAddress,
          // 本社所在地マップ
          CompanyAddressMap: SessionData.CompanyAddressMap,
          // 勤務地
          Prefecture: SessionData.CompanyPrefecture,
          // 社員の職種・応募職種
          SelectedOccupation: SessionData.CompanySelectedOccupation,
          // 業界キーワード
          Industry: SessionData.CompanyIndustry,
          // 開発環境
          Environment: SessionData.CompanyEnvironment,
          // プログラミング言語
          ProgrammingLanguage: SessionData.CompanyProgrammingLanguage,
          // 資格
          Qualification: SessionData.CompanyQualification,
          // ソフトウェア
          Software: SessionData.CompanySoftware,
          // ホームページURL
          CompanyHPMap: SessionData.CompanyHPMap
        });
        if (response.data === true) {

          console.log("保存成功");

          // 編集中状態をオフ(accountDataから削除)
          const keysToDelete = [
            'CompanyIconEditing',
            'CompanyNameEditing',
            'CompanyKanaNameEditing',
            'CompanyUserNameEditing',
            'CompanyIntroEditing',
            'CompanyIntroVideoEditing',
            'CompanyAddressEditing',
            'CompanyAddressMapEditing',
            'CompanyPrefectureEditing',
            'CompanySelectedOccupationEditing',
            'CompanyIndustryEditing',
            'CompanyEnvironmentEditing',
            'CompanyProgrammingLanguageEditing',
            'CompanyQualificationEditing',
            'CompanySoftwareEditing',
            'CompanyHPMapEditing'
          ];

          // 編集中状態のSessionDataを削除
          keysToDelete.forEach(key => {
            delete SessionData[key];
          });

          // 更新された SessionData を sessionStorage に保存
          sessionStorage.setItem('accountData', JSON.stringify(SessionData));

          // popoverのアイコンを更新
          updateSessionData("accountData", "popover_icon", SessionData.CompanyIcon);

          // アラート
          alert("マイページを更新しました。");
          // リロード
          window.location.reload();
        }
        //console.log("ResponseData:", ResponseData);
      } catch (err) {
        console.log("err:", err);
      }
    }

    // セッションデータ取得
    const SessionData = getSessionData("accountData");

    // カタカナ以外の文字が含まれているかチェック
    const Kana = /^[ァ-ヶー]+$/;

    // 必須項目が満たされている場合、PostDataメソッドを実行
    // 満たされていない場合、アラートを出す。
    if (
      !SessionData.CompanyName ||
      !SessionData.CompanyKanaName ||
      !SessionData.CompanyIntro ||
      !SessionData.CompanyAddress ||
      !SessionData.CompanyAddressMap
    ) {
      // 未入力項目がある場合
      if (!SessionData.CompanyAddressMap) {
        // 本社所在地マップが未入力のとき<Box ref={CompanyAddressMapBox}>にスクロール
        CompanyAddressMapBox.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (!SessionData.CompanyAddress) {
        // 本社所在地が未入力のとき<Box ref={CompanyAddressBox}>にスクロール
        CompanyAddressBox.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (!SessionData.CompanyIntro) {
        // 企業概要が未入力のとき<Box ref={IntroBox}>にスクロール
        IntroBox.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (!SessionData.CompanyName) {
        // 企業名が未入力のとき<Box ref={StudentKanaNameBox}>にスクロール
        CompanyNameBox.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (!SessionData.CompanyKanaName) {
        // 企業名(カタカナ)が未入力のとき<Box ref={StudentNameBox}>にスクロール
        CompanyKanaNameBox.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      alert("エラー：未入力項目があります。");
    } else if (
      !Kana.test(SessionData.CompanyKanaName)
    ) {
      // カタカナがある場合
      // <Box ref={StudentKanaNameBox}>にスクロール
      CompanyKanaNameBox.current.scrollIntoView({ behavior: "smooth", block: "center" });
      alert("エラー：カタカナで入力してください");
    } else {
      // それ以外(実行)
      PostData();
    }

  };

  return (
    <Stack spacing={3} ref={Edit}>
      {/* 戻るボタン */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Tooltip title="戻る">
          <IconButton
            onClick={handleBackClick}
            sx={{
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 55 }} />
          </IconButton>
        </Tooltip>
      </Box>

      <UserIcon IconData={ResponseData.icon} />
      <Box ref={CompanyNameBox}>
        <Typography variant="h6">企業名*</Typography>
        <CompanyName CompanyNameData={ResponseData.company_name} />
      </Box>
      <Box ref={CompanyKanaNameBox}>
        <Typography variant="h6">企業名(カタカナ)*</Typography>
        <CompanyKanaName CompanyKanaNameData={ResponseData.company_namecana} />
      </Box>
      {/* <Box>
        <Typography variant="h6">採用担当者</Typography>
        <CompanyUserName CompanyUserNameData={ResponseData.user_name} />
      </Box> */}
      <Box ref={IntroBox}>
        <Typography variant="h6">企業概要*</Typography>
        <Intro IntroData={ResponseData.intro} />
      </Box>

      <Box ref={CompanyAddressBox}>
        <Typography variant="h6">本社所在地*</Typography>
        <CompanyAddress CompanyAddressData={ResponseData.address} />
      </Box>
      <Box ref={CompanyAddressMapBox}>
        <Typography variant="h6">本社所在地マップ*</Typography>
        <CompanyAddressMap CompanyAddressMapData={ResponseData.map_url} />
      </Box>
      <Box>
        <Showmore>
          <Button variant="outlined" ref={showmore} onClick={ShowmoreClick}
            sx={{ borderColor: '#5956FF', color: '#5956FF', '&:hover': { borderColor: '#5956FF' }, cursor: 'pointer' }}>
            {showMoreText}
          </Button>
        </Showmore>
      </Box>
      <Box ref={el => (detail.current[0] = el)} id="detail">
        <Typography variant="h6">勤務地</Typography>
        <Prefecture PrefectureData={ResponseData.prefecture} />
      </Box>
      <Box ref={el => (detail.current[1] = el)} id="detail">
        <Typography variant="h6">社員の職種・募集職種</Typography>
        <SelectedOccupation SelectedOccupationData={ResponseData.selected_occupation} />
      </Box>
      <Box ref={el => (detail.current[2] = el)} id="detail">
        <Typography variant="h6">業界キーワード</Typography>
        <Industry IndustryData={ResponseData.industry} />
      </Box>
      <Box ref={el => (detail.current[3] = el)} id="detail">
        <Typography variant="h6">開発環境</Typography>
        <Environment EnvironmentData={ResponseData.development_environment} />
      </Box>
      <Box ref={el => (detail.current[4] = el)} id="detail">
        <Typography variant="h6">プログラミング言語</Typography>
        <ProgrammingLanguage ProgrammingLanguageData={ResponseData.programming_language} />
      </Box>
      <Box ref={el => (detail.current[5] = el)} id="detail">
        <Typography variant="h6">社員が取得している資格・取得支援資格・歓迎資格・必須資格</Typography>
        <Qualification QualificationData={ResponseData.acquisition_qualification} />
      </Box>
      <Box ref={el => (detail.current[6] = el)} id="detail">
        <Typography variant="h6">ソフトウェア</Typography>
        <Software SoftwareData={ResponseData.software} />
      </Box>
      <Box ref={el => (detail.current[7] = el)} id="detail">
        <Typography variant="h6">ホームページURL</Typography>
        <CompanyHPMap CompanyHPMapData={ResponseData.hp_url} />
      </Box>
      <Box ref={el => (detail.current[8] = el)} id="detail">
        <Typography variant="h6">紹介動画</Typography>
        <IntroVideo IntroVideoData={ResponseData.video_url} />
      </Box>
      <Box>
        <Save>
          <Button variant="outlined"
            sx={{ borderColor: '#1877F2', color: '#1877F2', '&:hover': { borderColor: '#1877F2' }, cursor: 'pointer' }}
            size="large"
            onClick={handleSaveClick}>
            保存
          </Button>
        </Save>
      </Box>
      {/* </span> */}
    </Stack>

  );

});

ProfileMypageEdit.propTypes = {
  Profile: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};

export default ProfileMypageEdit;
ProfileMypageEdit.displayName = 'Child';