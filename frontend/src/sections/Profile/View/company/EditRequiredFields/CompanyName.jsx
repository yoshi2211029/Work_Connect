import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from 'prop-types';
import { useSessionStorage } from "src/hooks/use-sessionStorage";

const CompanyName = ({ CompanyNameData }) => {

  const [CompanyName, setCompanyName] = useState(CompanyNameData);
  const { getSessionData, updateSessionData } = useSessionStorage();

    // 入力エラーの状態管理
    const [inputError, setInputError] = useState({
      CompanyNameError: false
    });
    // valueの初期値をセット
    useEffect(() => {
      // セッションデータ取得
      const SessionData = getSessionData("accountData");

      /// 編集の途中ならセッションストレージからデータを取得する。
      /// (リロードした時も、データが残った状態にする。)
      if ((SessionData.CompanyName !== undefined && SessionData.CompanyName !== "") ||
      SessionData.CompanyNameEditing) {
        // セッションストレージから最新のデータを取得
        setCompanyName(SessionData.CompanyName);
      } else {
        // DBから最新のデータを取得
        setCompanyName(CompanyNameData);
      }

    }, [CompanyNameData]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    // newValueをセット
    setCompanyName(newValue);
    // 編集中状態をオン(保存もしくはログアウトされるまで保持)
    updateSessionData("accountData", "CompanyNameEditing", true);
  };

  useEffect(() => {
    // 編集中のデータを保存しておく
    updateSessionData("accountData", "CompanyName", CompanyName);

    // バリデーション
    if(CompanyName === ""){
      // 姓が空だったら、error表示
      setInputError((prev) => ({ ...prev, CompanyNameError: true }));
    } else if(CompanyName !== ""){
      // 姓が空でないなら、error非表示
      setInputError((prev) => ({ ...prev, CompanyNameError: false }));
    }


  }, [CompanyName]);

  return (
    <div style={{ display: "flex" }}>
        <TextField
            error={inputError.CompanyNameError}
            fullWidth
            margin="normal"
            name="CompanyName"
            onChange={handleChange}
            // required
            type="text"
            value={CompanyName}
            variant="outlined"
            sx={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                marginTop: '6px',
                marginBottom: '0'
            }}
        />

    </div>
  );
};

CompanyName.propTypes = {
  CompanyNameData: PropTypes.string.isRequired,
};

export default CompanyName;
