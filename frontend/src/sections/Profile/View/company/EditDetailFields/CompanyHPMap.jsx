import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from 'prop-types'; // prop-types をインポート
import { useSessionStorage } from "src/hooks/use-sessionStorage";

const CompanyHPMap = ({ CompanyHPMapData }) => {


  const [CompanyHPMap, setCompanyHPMap] = useState(CompanyHPMapData);
  const { getSessionData, updateSessionData } = useSessionStorage();

  // valueの初期値をセット
  useEffect(() => {
    if (getSessionData("accountData") !== undefined){
      const SessionData = getSessionData("accountData");
      if(SessionData.CompanyHPMapEditing && SessionData.CompanyHPMap){
        // セッションストレージから最新のデータを取得
        setCompanyHPMap(SessionData.CompanyHPMap);
      } else if(
        (SessionData.CompanyHPMapEditing && SessionData.CompanyIntroVideo && CompanyHPMapData)||
        (!SessionData.CompanyHPMapEditing && CompanyHPMapData)
      ){ // DBから最新のデータを取得
        setCompanyHPMap(CompanyHPMapData);
      }
    }
  }, [CompanyHPMapData]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (e.target.name === "CompanyHPMap") {
      setCompanyHPMap(newValue);
      updateSessionData("accountData", "CompanyHPMapEditing", true);
    }
  };

  // 編集中のデータを保存しておく
  useEffect(() => {
    updateSessionData("accountData", "CompanyHPMap", CompanyHPMap);
  }, [CompanyHPMap]);


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField
        fullWidth
        label="URLをここにコピー"
        margin="normal"
        name="CompanyHPMap"
        onChange={handleChange}
        // required
        type="text"
        value={CompanyHPMap}
        variant="outlined"
        sx={{
          backgroundColor: '#fff', // 背景色を指定
          borderRadius: '8px', // 角の丸みを設定
          marginTop: '6px',
          marginBottom: '0'
        }}
      />
    </div>


  );
};

// プロパティの型を定義
CompanyHPMap.propTypes = {
  CompanyHPMapData: PropTypes.string.isRequired,
};

export default CompanyHPMap;