import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useSessionStorage } from "src/hooks/use-sessionStorage";

const HP_URLSelect = () => {

  const [HP_URL, setHP_URL] = useState('');
  const { getSessionData, updateSessionData } = useSessionStorage();

  // 外部URLから本アプリにアクセスした際に、sessionStorageに保存する
  useEffect(() => {
    const SessionData = getSessionData("accountData");
    if (SessionData.HP_URL !== undefined && SessionData.HP_URL !== "") {
      setHP_URL(SessionData.HP_URL);
    }
  }, []); // 初回マウント時のみ実行

  const handleChange = (e) => {
    const newValue = e.target.value;
    setHP_URL(newValue);
  };

  useEffect(() => {
    updateSessionData("accountData", "HP_URL", HP_URL);
  }, [HP_URL]);

  return (
    <div>
      <>
        <p>ホームページURL</p>
        <TextField
          fullWidth
          name="HP_URL"
          onChange={handleChange}
          type="text"
          value={HP_URL}
          variant="outlined"
        />
      </>
    </div>
  );
};

export default HP_URLSelect;
