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
import StudentName from "./EditRequiredFields/StudentName";
import StudentKanaName from "./EditRequiredFields/StudentKanaName";
import Intro from "./EditRequiredFields/Intro";
import GraduationYear from "./EditRequiredFields/GraduationYear";
import SchoolName from "./EditRequiredFields/SchoolName";
// --- 詳細項目 --- //
import DepartmentName from "./EditDetailFields/DepartmentName";
import FacultyName from "./EditDetailFields/FacultyName";
import MajorName from "./EditDetailFields/MajorName";
import CourseName from "./EditDetailFields/CourseName";
import Environment from "./EditDetailFields/Environment";
import Hobby from "./EditDetailFields/Hobby";
import Prefecture from "./EditDetailFields/Prefecture";
import DesiredOccupation from "./EditDetailFields/DesiredOccupation";
import ProgrammingLanguage from "./EditDetailFields/ProgrammingLanguage";
import Qualification from "./EditDetailFields/Qualification";
import Software from "./EditDetailFields/Software";

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

  // セッションストレージ取得
  const { getSessionData , updateSessionData } = useSessionStorage();
  // useRef初期化
  const Edit = useRef(null);
  const detail = useRef([]);
  const showmore = useRef(null);
  const StudentNameBox = useRef(null);
  const StudentKanaNameBox = useRef(null);
  const IntroBox = useRef(null);

  // useState初期化
  const [close, setClose] = useState(true);
  // Laravelとの通信用URL
  const Get_url = "http://localhost:8000/get_profile_mypage";
  const Post_url = "http://localhost:8000/post_profile_mypage";

  // ユーザーネーム取得
  const { user_name } = useParams();
  const UserName = useState({ user_name });
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
            kind: "s",
            ProfileUserName: ProfileUserName,
          },
        });
        if (response) {
          setResponseData(response.data[0]);
        }
        console.log("ResponseData:", ResponseData);
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
        // Laravel側からデータを取得
        const response = await axios.post(Post_url, {
          // 学生側で送信
          kind: "s",
          // ユーザーネーム
          ProfileUserName: ProfileUserName,
          // アイコン
          Icon: SessionData.Icon,
          // 姓
          StudentSurName: SessionData.StudentSurName,
          // 名
          StudentName: SessionData.StudentName,
          // セイ
          StudentKanaSurName: SessionData.StudentKanaSurName,
          // メイ
          StudentKanaName: SessionData.StudentKanaName,
          // 自己紹介
          Intro: SessionData.Intro,
          // 卒業年度
          Graduation: SessionData.Graduation,
          // 学校名
          SchoolName: SessionData.SchoolName,
          // 学部
          FacultyName: SessionData.FacultyName,
          // 学科
          DepartmentName: SessionData.DepartmentName,
          // 専攻
          MajorName: SessionData.MajorName,
          // コース
          CourseName: SessionData.CourseName,
          // 開発環境
          Environment: SessionData.Environment,
          // 趣味
          Hobby: SessionData.Hobby,
          // 希望勤務地
          Prefecture: SessionData.Prefecture,
          // 希望職種
          DesiredOccupation: SessionData.DesiredOccupation,
          // プログラミング言語
          ProgrammingLanguage: SessionData.ProgrammingLanguage,
          // 取得資格
          Qualification: SessionData.Qualification,
          // ソフトウェア
          Software: SessionData.Software
        });
        if (response.data === true) {

          console.log("保存成功");

          // 編集中状態をオフ(accountDataから削除)
          const keysToDelete = [
            'IconEditing',
            'StudentSurNameEditing',
            'StudentNameEditing',
            'StudentKanaSurNameEditing',
            'StudentKanaNameEditing',
            'IntroEditing',
            'GraduationEditing',
            'SchoolNameEditing',
            'DepartmentNameEditing',
            'FacultyNameEditing',
            'MajorNameEditing',
            'CourseNameEditing',
            'EnvironmentEditing',
            'HobbyEditing',
            'PrefectureEditing',
            'DesiredOccupationEditing',
            'ProgrammingLanguageEditing',
            'QualificationEditing',
            'SoftwareEditing'
          ];

          // 編集中状態のSessionDataを削除
          keysToDelete.forEach(key => {
            delete SessionData[key];
          });

          // 更新された SessionData を sessionStorage に保存
          sessionStorage.setItem('accountData', JSON.stringify(SessionData));

          // popoverのアイコンを更新
          updateSessionData("accountData", "popover_icon", SessionData.Icon);

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
      !SessionData.StudentSurName ||
      !SessionData.StudentName ||
      !SessionData.StudentKanaSurName ||
      !SessionData.StudentKanaName ||
      !SessionData.Intro
    ) {
      // 未入力項目がある場合
      if (!SessionData.Intro) {
        // 自己紹介が未入力のとき<Box ref={IntroBox}>にスクロール
        IntroBox.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (!SessionData.StudentKanaSurName || !SessionData.StudentKanaName) {
        // セイ or メイが未入力のとき<Box ref={StudentKanaNameBox}>にスクロール
        StudentKanaNameBox.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (!SessionData.StudentSurName || !SessionData.StudentName) {
        // 姓 or 名が未入力のとき<Box ref={StudentNameBox}>にスクロール
        StudentNameBox.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      alert("エラー：未入力項目があります。");
    } else if (
      !Kana.test(SessionData.StudentKanaSurName) ||
      !Kana.test(SessionData.StudentKanaName)
    ) {
      // カタカナがある場合
      // <Box ref={StudentKanaNameBox}>にスクロール
      StudentKanaNameBox.current.scrollIntoView({ behavior: "smooth", block: "center" });
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

      <Box ref={StudentNameBox}>
        <Typography variant="h6">名前*</Typography>
        <StudentName StudentSurnameData={ResponseData.student_surname} StudentnameData={ResponseData.student_name} />
      </Box>
      <Box ref={StudentKanaNameBox}>
        <Typography variant="h6">名前(カタカナ)*</Typography>
        <StudentKanaName StudentKanaSurnameData={ResponseData.student_kanasurname} StudentKananameData={ResponseData.student_kananame} />
      </Box>
      <Box ref={IntroBox}>
        <Typography variant="h6">自己紹介*</Typography>
        <Intro IntroData={ResponseData.intro} />
      </Box>
      <Box>
        <Typography variant="h6">卒業年度*</Typography>
        <GraduationYear GraduationData={ResponseData.graduation_year} />
      </Box>
      <Box>
        <Typography variant="h6">学校名(大学名)*</Typography>
        <SchoolName SchoolNameData={ResponseData.school_name} />
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
        <Typography variant="h6">学部</Typography>
        <FacultyName FacultyNameData={ResponseData.faculty_name} />
      </Box>
      <Box ref={el => (detail.current[1] = el)} id="detail">
        <Typography variant="h6">学科</Typography>
        <DepartmentName DepartmentNameData={ResponseData.department_name} />
      </Box>
      <Box ref={el => (detail.current[2] = el)} id="detail">
        <Typography variant="h6">専攻</Typography>
        <MajorName MajorNameData={ResponseData.major_name} />
      </Box>
      <Box ref={el => (detail.current[3] = el)} id="detail">
        <Typography variant="h6">コース</Typography>
        <CourseName CourseNameData={ResponseData.course_name} />
      </Box>
      <Box ref={el => (detail.current[4] = el)} id="detail">
        <Typography variant="h6">開発環境</Typography>
        <Environment EnvironmentData={ResponseData.development_environment} />
      </Box>
      <Box ref={el => (detail.current[5] = el)} id="detail">
        <Typography variant="h6">趣味</Typography>
        <Hobby HobbyData={ResponseData.hobby} />
      </Box>
      <Box ref={el => (detail.current[6] = el)} id="detail">
        <Typography variant="h6">希望勤務地</Typography>
        <Prefecture PrefectureData={ResponseData.desired_work_region} />
      </Box>
      <Box ref={el => (detail.current[7] = el)} id="detail">
        <Typography variant="h6">希望職種</Typography>
        <DesiredOccupation DesiredOccupationData={ResponseData.desired_occupation} />
      </Box>
      <Box ref={el => (detail.current[8] = el)} id="detail">
        <Typography variant="h6">プログラミング言語</Typography>
        <ProgrammingLanguage ProgrammingLanguageData={ResponseData.programming_language} />
      </Box>
      <Box ref={el => (detail.current[9] = el)} id="detail">
        <Typography variant="h6">取得資格</Typography>
        <Qualification QualificationData={ResponseData.acquisition_qualification} />
      </Box>
      <Box ref={el => (detail.current[10] = el)} id="detail">
        <Typography variant="h6">ソフトウェア</Typography>
        <Software SoftwareData={ResponseData.software} />
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