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
  company_name: "企業名",
  company_nameCana: "企業名(カタカナ)",
  user_name: "ユーザーネーム",
  password: "パスワード",
  // passwordCheck: "パスワードチェック",
  selectedOccupation: "職種",
  Prefecture: "勤務地",
  HP_URL: "ホームページURL",
};

// メールチェック

// 複数選択タグを表示するための関数
// ホームページURLのみnumは0
// ホームページURLのみタグではなくaタグ付きの文字列を出力
const useTagListShow = (tagName, sessionData, num) => {
  // if(num == 1){
    const [tags, setTags] = useState([]);
    useEffect(() => {
      // 職種or勤務地の場合
      // if(num == 1){
        if (sessionData && sessionData[tagName]) {
          const commaArray = sessionData[tagName].split(",");
          // if(num == 1){
          const devtagComponents = commaArray.map((item) => (
          
            num === 0
          ? <a key={item} href={item} target="_blank" rel="noopener noreferrer">{item}</a>
          : <CreateTagElements key={item} itemContents={item} />
          ));
          //}
          setTags(devtagComponents);
        }
      //}
    }, [sessionData, tagName]);
    return tags;
  //} else if (num == 0){
    // const [tags, setTags] = useState([]);
    // useEffect(() => {
    //   if (sessionData && sessionData[tagName]) {
    //     console.log("sessionDataaaaaaaaaaaaaaa="+sessionData[tagName]);
    //     const commaArray = sessionData[tagName].split(",");
    //     const devtagComponents = commaArray.map((item) => (
    //       <CreateTagElements key={item} itemContents={item} />
    //     ));
    //     setTags(devtagComponents);
    //   }
    // }, [sessionData, tagName]);
    // return tags;
  //}
  
};

// 別コンポーネントに分離する。
const SessionDataList = ({ sessionData }) => {
  const Occupation = useTagListShow("selectedOccupation", sessionData, 1);
  const Prefecture = useTagListShow("Prefecture", sessionData, 1);
  const HP_URL = useTagListShow("HP_URL", sessionData, 0);
  

  // パスワード表示/非表示の切り替え(パスワード)
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <ul>
        {Object.entries(displayContentsName).map(([key, label]) => {
          const value = sessionData[key];

          if (value !== null && value !== "" && value !== undefined) {
            let itemContentValues;

            if (label === "メールアドレス" || label === "企業名" || label === "企業名(カタカナ)" || label === "ユーザーネーム") {
              itemContentValues = (
                <TextField
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                  value={value}
                />
              );
            } else if (label === "パスワード") {
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
            } else if (label === "職種") {
              itemContentValues = <span key={key}>{Occupation}</span>;
            } else if (label === "勤務地") {
              itemContentValues = <span key={key}>{Prefecture}</span>;
            } else if (label === "ホームページURL") {
              itemContentValues = <span key={key}>{HP_URL}</span>;
            } else {
              itemContentValues = <span key={key}>{value}</span>;
            }

            return (
              <li key={key}>
                <p>{label}</p>
                {itemContentValues} {/* ここでitemContentValuesを表示 */}
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
