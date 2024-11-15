import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Container, RegistarCard } from "../css/RegistarStyled";
import { useSessionStorage } from "src/hooks/use-sessionStorage";

import TextField from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function CreateTagElements({ itemContents }) {
  return <button className="greeting">{itemContents}</button>;
}

// li要素のP要素に項目名を表示させるのに必要なオブジェクトをセット
const displayContentsName = {
  mail: "メールアドレス",
  student_surname: "姓",
  student_name: "名",
  student_kanasurname: "セイ",
  student_kananame: "メイ",
  user_name: "ユーザーネーム",
  password: "パスワード",
  // passwordCheck: "パスワードチェック",
  graduation_year: "卒業年度",
  school_name: "学校名",
  department_name: "学部",
  faculty_name: "学科",
  major_name: "専攻",
  course_name: "コース",
  desired_work_region: "希望勤務地",
  desired_occupation: "希望職種",
  development_environment: "開発環境",
  acquisition_qualification: "取得資格",
  programming_language: "プログラミング言語",
  software: "ソフトウェア",
  hobby: "趣味",
};

// メールチェック

// 複数選択タグを表示するための関数
const useTagListShow = (tagName, sessionData) => {
  const [tags, setTags] = useState([]);
  useEffect(() => {
    if (sessionData && sessionData[tagName]) {
      const commaArray = sessionData[tagName].split(",");
      const devtagComponents = commaArray.map((item) => (
        <CreateTagElements key={item} itemContents={item} />
      ));
      setTags(devtagComponents);
    }
  }, [sessionData, tagName]);
  return tags;
};

// 別コンポーネントに分離する。
const SessionDataList = ({ sessionData }) => {
  const developmentEnvironment = useTagListShow("development_environment", sessionData);
  const hobby = useTagListShow("hobby", sessionData);
  const desiredWorkRegion = useTagListShow("desired_work_region", sessionData);
  const desiredOccupation = useTagListShow("desired_occupation", sessionData);
  const programmingLanguage = useTagListShow("programming_language", sessionData);
  const acquisitionQualification = useTagListShow("acquisition_qualification", sessionData);
  const software = useTagListShow("software", sessionData);

  // パスワード表示/非表示の切り替え(パスワード)
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  // 名前を結合
  const full_name = `${sessionData["student_surname"] || ''} ${sessionData["student_name"] || ''}`.trim();
  const full_kananame = `${sessionData["student_kanasurname"] || ''} ${sessionData["student_kananame"] || ''}`.trim();

  return (
    <>
      <ul>
        {/* entriesはオブジェクト内のkeyとvalueをセットで"配列"にして渡してくれる。 */}
        {Object.entries(displayContentsName).map(([key, label]) => {
          const value = sessionData[key];
          // developmentEnvironmentこの作成したタグを入れ替えたい。
          // sessionDataから取り出した値が空でないものを表示する。
          if (value !== null && value !== "" && value !== undefined) {
            let itemContentValues;
            if (label === "メールアドレス" || 
              label === "ユーザーネーム" ||
              label === "学校名"||
              label === "学部"||
              label === "学科" ||
              label === "専攻"||
              label === "コース") {
                // テキストに普通に表示
              itemContentValues = (
                <TextField
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                  value={value}
                />
              );
            } else if (label === "姓"){
              // 姓と名を結合して表示。
              itemContentValues = (
                <TextField
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                value={full_name}
                />
              );
            } else if (label === "セイ"){
              // セイとメイを結合して表示。
              itemContentValues = (
                <TextField
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                value={full_kananame}
                />
              );
            } else if (label === "卒業年度"){
              // 「年」をつけて表示。
              itemContentValues = (
                <TextField
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                value={`${value}年`}
                />
              );
            } else if (label === "パスワード") {
              // パスワード表示切替ボタンを右に表示。
              itemContentValues = (
                <TextField
                fullWidth
                  key={key}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={value}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              );
            } else if (label === "開発環境") {
              // タグを表示。以下同じ。
              itemContentValues = <span>{developmentEnvironment}</span>;
            } else if (label === "趣味") {
              itemContentValues = <span>{hobby}</span>;
            } else if (label === "希望勤務地") {
              itemContentValues = <span>{desiredWorkRegion}</span>;
            } else if (label === "希望職種") {
              itemContentValues = <span>{desiredOccupation}</span>;
             } else if (label === "プログラミング言語") {
              itemContentValues = <span>{programmingLanguage}</span>;
            } else if (label === "取得資格") {
              itemContentValues = <span>{acquisitionQualification}</span>;
            } else if (label === "ソフトウェア") {
              itemContentValues = <span>{software}</span>;
            } else if (label === "名" || label === "メイ"){
              // 結合済みなので表示させない。
              return null;
            }
            return (
              <li key={key}>
                <p>{label === "姓" ? "名前": label === "セイ" ? "名前(カタカナ)": label}</p>
                {itemContentValues}
              </li>
            );
          }
          return null;
        })}
      </ul>
    </>
  );
};

SessionDataList.propTypes = {
  sessionData: PropTypes.object.isRequired,
};
const Confirmation = () => {
  // セッションデータを取得する関数
  const { getSessionData } = useSessionStorage();
  const [sessionData, setSessionData] = useState({});

  useEffect(() => {
    const data = getSessionData("accountData");
    if (data) {
      setSessionData(data);
    }
  }, []);

  return (
    <Container>
      <RegistarCard>
        <SessionDataList sessionData={sessionData} />
      </RegistarCard>
    </Container>
  );
};

export default Confirmation;

CreateTagElements.propTypes = {
  itemContents: PropTypes.string.isRequired,
};
// SessionDataList.propTypes = {
//   itemContents: PropTypes.string.isRequired,
// };
