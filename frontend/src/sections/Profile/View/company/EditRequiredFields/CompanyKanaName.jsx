import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from 'prop-types'; // prop-types をインポート
import { useSessionStorage } from "src/hooks/use-sessionStorage";

const CompanyKanaName = ({CompanyKanaNameData}) => {

  const [CompanyKanaName, setCompanyKanaName] = useState(CompanyKanaNameData);
  const { getSessionData, updateSessionData } = useSessionStorage();


  // 入力エラーの状態管理
  const [inputError, setInputError] = useState({
    CompanyKanaNameError: false,
  });

  // valueの初期値をセット
  useEffect(() => {
    // セッションデータ取得
    const SessionData = getSessionData("accountData");

    /// 編集の途中ならセッションストレージからデータを取得する。
    /// (リロードした時も、データが残った状態にする。)
    if ((SessionData.CompanyKanaName !== undefined && SessionData.CompanyKanaName !== "") ||
    SessionData.CompanyKanaNameEditing) {
      // セッションストレージから最新のデータを取得
      setCompanyKanaName(SessionData.CompanyKanaName);
    } else {
      // DBから最新のデータを取得
      setCompanyKanaName(CompanyKanaNameData);
    }
  }, [CompanyKanaNameData]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if(e.target.name === "CompanyKanaName"){
      // newValueをセット
      setCompanyKanaName(newValue);
      // 編集中状態をオン(保存もしくはログアウトされるまで保持)
      updateSessionData("accountData", "CompanyKanaNameEditing", true);
    }
  };

  // 編集中のデータを保存しておく
  useEffect(() => {
    // カタカナ以外の文字が含まれているかチェック
    const Kana = /^[ァ-ヶー]+$/;

    updateSessionData("accountData", "CompanyKanaName", CompanyKanaName);
    // バリデーション
    if(CompanyKanaName === "" || !Kana.test(CompanyKanaName)){
      // セイが空、もしくはカタカナ以外だったら、error表示
      setInputError((prev) => ({ ...prev, CompanyKanaNameError: true }));
    } else if(CompanyKanaName !== ""){
      // セイが空でないなら、error非表示
      setInputError((prev) => ({ ...prev, CompanyKanaNameError: false }));
    }

  }, [CompanyKanaName]);



  return (
    <div style={{ display: "flex" }}>
        <TextField
            error={inputError.CompanyKanaNameError}
            helperText={CompanyKanaName !== "" && inputError.CompanyKanaNameError ? "カタカナで入力してください" : ""}
            fullWidth
            margin="normal"
            name="CompanyKanaName"
            onChange={handleChange}
            // required
            type="text"
            value={CompanyKanaName}
            variant="outlined"
            sx={{
                backgroundColor: '#fff', // 背景色を指定
                borderRadius: '8px', // 角の丸みを設定
                marginTop:'6px',
                marginBottom:'0'
            }}
            // helperTextを赤色にする
            FormHelperTextProps={{
              sx: { color: 'red' },
            }}
        />
        </div>
  );
};

// プロパティの型を定義
CompanyKanaName.propTypes = {
  CompanyKanaNameData: PropTypes.string.isRequired,
};

export default CompanyKanaName;