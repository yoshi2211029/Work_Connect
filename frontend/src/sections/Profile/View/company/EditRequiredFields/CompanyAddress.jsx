import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from 'prop-types';
import { useSessionStorage } from "src/hooks/use-sessionStorage";

const CompanyAddress = ({ CompanyAddressData }) => {

  const [CompanyAddress, setCompanyAddress] = useState(CompanyAddressData);
  const { getSessionData, updateSessionData } = useSessionStorage();

  // 入力エラーの状態管理
  const [inputError, setInputError] = useState({
    CompanyAddressError: false,
  });

  // valueの初期値をセット
  useEffect(() => {
    // セッションデータ取得
    const SessionData = getSessionData("accountData");

    /// 編集の途中ならセッションストレージからデータを取得する。
    /// (リロードした時も、データが残った状態にする。)
    if ((SessionData.CompanyAddress !== undefined && SessionData.CompanyAddress !== "") ||
    SessionData.CompanyAddressEditing) {
      // セッションストレージから最新のデータを取得
      setCompanyAddress(SessionData.CompanyAddress);
    } else {
      // DBから最新のデータを取得
      setCompanyAddress(CompanyAddressData);
    }

  }, [CompanyAddressData]);


  const handleChange = (e) => {
    const newValue = e.target.value;
    if (e.target.name === "CompanyAddress") {
      // newValueをセット
      setCompanyAddress(newValue);
      // 編集中状態をオン(保存もしくはログアウトされるまで保持)
      updateSessionData("accountData", "CompanyAddressEditing", true);
    }
  };

  useEffect(() => {
    // 編集中のデータを保存しておく
    updateSessionData("accountData", "CompanyAddress", CompanyAddress);

    // バリデーション
    if(CompanyAddress === ""){
      // 姓が空だったら、error表示
      setInputError((prev) => ({ ...prev, CompanyAddressError: true }));
    } else if(CompanyAddress !== ""){
      // 姓が空でないなら、error非表示
      setInputError((prev) => ({ ...prev, CompanyAddressError: false }));
    }

  }, [CompanyAddress]);

  return (
    <div style={{ display: "flex" }}>
        <TextField
            error={inputError.CompanyAddressError}
            fullWidth
            margin="normal"
            name="CompanyAddress"
            onChange={handleChange}
            // required
            type="text"
            value={CompanyAddress}
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

CompanyAddress.propTypes = {
  CompanyAddressData: PropTypes.string.isRequired,
};

export default CompanyAddress;
