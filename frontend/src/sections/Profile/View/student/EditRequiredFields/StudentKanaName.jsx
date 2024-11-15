import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from 'prop-types'; // prop-types をインポート
import { useSessionStorage } from "src/hooks/use-sessionStorage";

const StudentKanaName = ({StudentKanaSurnameData, StudentKananameData}) => {

  const [StudentKanaSurName, setStudentKanaSurName] = useState(StudentKanaSurnameData);
  const [StudentKanaName, setStudentKanaName] = useState(StudentKananameData);
  const { getSessionData, updateSessionData } = useSessionStorage();

  

  // 入力エラーの状態管理
  const [inputError, setInputError] = useState({
    StudentKanaSurNameError: false,
    StudentKanaNameError: false,
  });

  // valueの初期値をセット
  useEffect(() => {
    // セッションデータ取得
    const SessionData = getSessionData("accountData");
    
    /// 編集の途中ならセッションストレージからデータを取得する。
    /// (リロードした時も、データが残った状態にする。)
    if ((SessionData.StudentKanaSurName !== undefined && SessionData.StudentKanaSurName !== "") ||
    SessionData.StudentKanaSurNameEditing) {
      // セッションストレージから最新のデータを取得
      setStudentKanaSurName(SessionData.StudentKanaSurName);
    } else {
      // DBから最新のデータを取得
      setStudentKanaSurName(StudentKanaSurnameData);
    }

    if ((SessionData.StudentKanaName !== undefined && SessionData.StudentKanaName !== "") ||
    SessionData.StudentKanaNameEditing) {
      // セッションストレージから最新のデータを取得
      setStudentKanaName(SessionData.StudentKanaName);
    } else {
      // DBから最新のデータを取得
      setStudentKanaName(StudentKananameData);
    }
  }, [StudentKanaSurnameData, StudentKananameData]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if(e.target.name === "StudentKanaSurName"){
      // newValueをセット
      setStudentKanaSurName(newValue);
      // 編集中状態をオン(保存もしくはログアウトされるまで保持)
      updateSessionData("accountData", "StudentKanaSurNameEditing", true);
    } else if(e.target.name === "StudentKanaName"){
      // newValueをセット
      setStudentKanaName(newValue);
      // 編集中状態をオン(保存もしくはログアウトされるまで保持)
      updateSessionData("accountData", "StudentKanaNameEditing", true);
    }
  };

  // 編集中のデータを保存しておく
  useEffect(() => {
    // カタカナ以外の文字が含まれているかチェック
    const Kana = /^[ァ-ヶー]+$/;

    updateSessionData("accountData", "StudentKanaSurName", StudentKanaSurName);
    updateSessionData("accountData", "StudentKanaName", StudentKanaName);
    // バリデーション
    if(StudentKanaSurName === "" || !Kana.test(StudentKanaSurName)){
      // セイが空、もしくはカタカナ以外だったら、error表示
      setInputError((prev) => ({ ...prev, StudentKanaSurNameError: true }));
    } else if(StudentKanaSurName !== ""){
      // セイが空でないなら、error非表示
      setInputError((prev) => ({ ...prev, StudentKanaSurNameError: false }));
    }
    if(StudentKanaName === "" || !Kana.test(StudentKanaName)){
      // メイが空だったら、error表示
      setInputError((prev) => ({ ...prev, StudentKanaNameError: true }));
    } else if(StudentKanaName !== ""){
      // メイが空でないなら、error非表示
      setInputError((prev) => ({ ...prev, StudentKanaNameError: false }));
    }
  }, [StudentKanaSurName,StudentKanaName]);


  return (
    <div style={{ display: "flex" }}>
        <TextField
            error={inputError.StudentKanaSurNameError}
            fullWidth
            // カタカナ以外ならhelperText表示
            helperText={StudentKanaSurName !== "" && inputError.StudentKanaSurNameError ? "カタカナで入力してください" : ""}            
            label="セイ"
            margin="normal"
            name="StudentKanaSurName"
            onChange={handleChange}
            // required
            type="text"
            value={StudentKanaSurName}
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
        <TextField
            error={inputError.StudentKanaNameError}
            fullWidth
            // カタカナ以外ならhelperText表示
            helperText={StudentKanaName !== "" && inputError.StudentKanaNameError ? "カタカナで入力してください" : ""}
            label="メイ"
            margin="normal"
            name="StudentKanaName"
            onChange={handleChange}
            // required
            type="text"
            value={StudentKanaName}
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
StudentKanaName.propTypes = {
  StudentKanaSurnameData: PropTypes.string,
  StudentKananameData: PropTypes.string,
};

export default StudentKanaName;