import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from 'prop-types'; // prop-types をインポート
import { useSessionStorage } from "src/hooks/use-sessionStorage";

const CompanyUserName = ({CompanyUserNameData}) => {


  const [CompanyUserName, setCompanyUserName] = useState(CompanyUserNameData);
  const { getSessionData, updateSessionData } = useSessionStorage();


  // valueの初期値をセット
  useEffect(() => {
    // セッションデータ取得
    const SessionData = getSessionData("accountData");

    /// 編集の途中ならセッションストレージからデータを取得する。
    /// (リロードした時も、データが残った状態にする。)
    if ((SessionData.CompanyUserName !== undefined) ||
    SessionData.CompanyUserNameEditing ) {
      // セッションストレージから最新のデータを取得
      setCompanyUserName(SessionData.CompanyUserName);
    }

  }, [CompanyUserNameData]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (e.target.name === "CompanyUserName") {
      setCompanyUserName(newValue);
      updateSessionData("accountData", "CompanyUserNameEditing", true);
    }
  };

  // 編集中のデータを保存しておく
  useEffect(() => {
    updateSessionData("accountData", "CompanyUserName", CompanyUserName);
  }, [CompanyUserName]);


  return (
    <div style={{ display: "flex" }}>
        <TextField
            // error={NULL_validation1 == true || inputError.student_surname}
            fullWidth
            label=""
            margin="normal"
            name="CompanyUserName"
            onChange={handleChange}
            required
            type="text"
            value={CompanyUserName}
            variant="outlined"
            sx={{
                backgroundColor: '#fff', // 背景色を指定
                borderRadius: '8px', // 角の丸みを設定
                marginTop:'6px',
                marginBottom:'0'
            }}
        />
        </div>
  );
};

// プロパティの型を定義
CompanyUserName.propTypes = {
  CompanyUserNameData: PropTypes.string.isRequired,
};

export default CompanyUserName;