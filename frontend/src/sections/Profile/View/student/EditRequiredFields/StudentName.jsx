import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from 'prop-types'; // prop-types をインポート
import { useSessionStorage } from "src/hooks/use-sessionStorage";

const StudentName = ({StudentSurnameData, StudentnameData}) => {
  
  const [StudentSurName, setStudentSurName] = useState(StudentSurnameData);
  const [StudentName, setStudentName] = useState(StudentnameData);
  const { getSessionData, updateSessionData } = useSessionStorage();

  // 入力エラーの状態管理
  const [inputError, setInputError] = useState({
    StudentSurNameError: false,
    StudentNameError: false,
  });

  // valueの初期値をセット
  useEffect(() => {
    // セッションデータ取得
    const SessionData = getSessionData("accountData");
    
    /// 編集の途中ならセッションストレージからデータを取得する。
    /// (リロードした時も、データが残った状態にする。)
    if ((SessionData.StudentSurName !== undefined && SessionData.StudentSurName !== "") || 
    SessionData.StudentSurNameEditing) {
      // セッションストレージから最新のデータを取得
      setStudentSurName(SessionData.StudentSurName);
    } else {
      // DBから最新のデータを取得
      setStudentSurName(StudentSurnameData);
    }

    if ((SessionData.StudentName !== undefined && SessionData.StudentName !== "") || 
    SessionData.StudentNameEditing) {
      // セッションストレージから最新のデータを取得
      setStudentName(SessionData.StudentName);
    } else {
      // DBから最新のデータを取得
      setStudentName(StudentnameData);
    }
    
  }, [StudentSurnameData, StudentnameData]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (e.target.name === "StudentSurName") {
      // newValueをセット
      setStudentSurName(newValue);
      // 編集中状態をオン(保存もしくはログアウトされるまで保持)
      updateSessionData("accountData", "StudentSurNameEditing", true);
    } else if (e.target.name === "StudentName") {
      // newValueをセット
      setStudentName(newValue);
      // 編集中状態をオン(保存もしくはログアウトされるまで保持)
      updateSessionData("accountData", "StudentNameEditing", true);
    }
    
  };

  
  useEffect(() => {
    // 編集中のデータを保存しておく
    updateSessionData("accountData", "StudentSurName", StudentSurName);
    updateSessionData("accountData", "StudentName", StudentName);
    
    // バリデーション
    if(StudentSurName === ""){
      // 姓が空だったら、error表示
      setInputError((prev) => ({ ...prev, StudentSurNameError: true }));
    } else if(StudentSurName !== ""){
      // 姓が空でないなら、error非表示
      setInputError((prev) => ({ ...prev, StudentSurNameError: false }));
    }
    if(StudentName === ""){
      // 名が空だったら、error表示
      setInputError((prev) => ({ ...prev, StudentNameError: true }));
    } else if(StudentName !== ""){
      // 名が空でないなら、error非表示
      setInputError((prev) => ({ ...prev, StudentNameError: false }));
    }

  }, [StudentSurName,StudentName]);


  return (
    <div style={{ display: "flex" }}>
        <TextField
            // error={NULL_validation1 == true || inputError.student_surname}
            error={inputError.StudentSurNameError}
            fullWidth
            label="姓"
            margin="normal"
            name="StudentSurName"
            onChange={handleChange}
            // required
            type="text"
            value={StudentSurName}
            variant="outlined"
            sx={{
                backgroundColor: '#fff', // 背景色を指定
                borderRadius: '8px', // 角の丸みを設定
                marginTop:'6px',
                marginBottom:'0'
            }}
        />
        <TextField
            // error={NULL_validation2 == true || inputError.student_name}
            error={inputError.StudentNameError}
            fullWidth
            label="名"
            margin="normal"
            name="StudentName"
            onChange={handleChange}
            // required
            type="text"
            value={StudentName}
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
StudentName.propTypes = {
  StudentSurnameData: PropTypes.string,
  StudentnameData: PropTypes.string,
};

export default StudentName;