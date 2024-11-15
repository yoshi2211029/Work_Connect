import { useState, useEffect, useContext, forwardRef,useImperativeHandle } from "react";
import PropTypes from "prop-types";
// import { useNavigation } from "react-router-dom";

import TextField from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { Container, RegistarCard } from "../css/RegistarStyled";

// 仮登録からemailに届いたURLをクリックしたアカウントのemailを表示するための準備
import { emailContext } from "src/components/account/students/EmailContext";

// sessionStrage呼び出し
import { useSessionStorage } from "../../../hooks/use-sessionStorage";

// Laravelとの通信用
import axios from "axios";
let NULL_validation1 = false;
let NULL_validation2 = false;
let NULL_validation3 = false;
let NULL_validation4 = false;
let NULL_validation5 = false;
let NULL_validation6 = false;
let NULL_validation7 = false;
// import { prepareCssVars } from "@mui/system";

const AccountRegistar = forwardRef((props, ref) => {

  // 「次へ」を押したときに企業名・企業名(カナ)が空だったらバリデーションを実行
  // ./stepbar.jsx から呼び出し
  useImperativeHandle(ref, () => ({
    NULL_validation(num) {
      if(num == 1){
        NULL_validation1 = true;
      } else if(num == 2){
        NULL_validation2 = true;
      } else if(num == 3){
        NULL_validation3 = true;
      } else if(num == 4){
        NULL_validation4 = true;
      } else if(num == 5){
        NULL_validation5 = true;
      } else if(num == 6){
        NULL_validation6 = true;
      } else if(num == 7){
        NULL_validation7 = true;
      }
    }
  }));
  // ユーザー名重複時のhelperTextの内容を宣言
  const [userNameHelperText, setUserNameHelperText] = useState("");

  // アカウントデータの状態管理
  const [accountData, setAccountData] = useState({
    student_surname: "",
    student_name: "",
    student_kanasurname: "",
    student_kananame: "",
    user_name: "",
    password: "",
    passwordCheck: "",
  });

  // 入力エラーの状態管理
  const [inputError, setInputError] = useState({
    student_surname: false,
    student_name: false,
    student_kanasurname: false,
    student_kananame: false,
    user_name: false,
    password: false,
    // trueだった時にエラーを表示
    passwordCheck: false,
  });
  // パスワード表示/非表示の切り替え(パスワード)
  const [showPassword, setShowPassword] = useState("");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  // パスワード表示/非表示の切り替え(パスワード確認)
  const [showPassword2, setShowPassword2] = useState("");

  const handleClickShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  const handleMouseDownPassword2 = (e) => {
    e.preventDefault();
  };

  // 登録項目確認の際に利用
  const { getSessionData, updateSessionData, updateObjectSessionData } =
    useSessionStorage();

    // セイのバリデーションチェック
  const student_kanasurnameCheck = (student_kanasurnameElement) => {
    // 条件が一致していない場合はエラーを表示
    console.log("props: ", props);
    if (!student_kanasurnameElement.checkValidity()) {
      setInputError((prev) => ({ ...prev, student_kanasurname: true }));
    } else {
      setInputError((prev) => ({ ...prev, student_kanasurname: false }));
    }
  };

  // メイのバリデーションチェック
  const student_kananameCheck = (student_kananameElement) => {
    // 条件が一致していない場合はエラーを表示
    console.log("props: ", props);
    if (!student_kananameElement.checkValidity()) {
      setInputError((prev) => ({ ...prev, student_kananame: true }));
    } else {
      setInputError((prev) => ({ ...prev, student_kananame: false }));
    }
  };

  // ユーザー名の重複チェック
  const inviteUserNameCheck = (user_name) => {
    // ユーザー名重複チェックのリクエスト用URL
    const url = "http://localhost:8000/user_name_check";

    axios
      .get(url, {
        params: {
          user_name: user_name,
          kind: "s",
        },
      })
      // thenで成功した場合の処理
      .then((response) => {
        console.log("レスポンス:", response);

        console.log("response.data:", response.data);
        if (response.data == "重複あり") {
          // console.log("ユーザー名が重複しています");
          setUserNameHelperText("ユーザー名が重複しています");
          // console.log("inputError.user_name: ", inputError.user_name);
          setInputError((prevState) => ({
            ...prevState,
            user_name: true,
          }));

          props.coleSetUserNameCheck("user_name", true);
        } else {
          setUserNameHelperText("");
          setInputError((prevState) => ({
            ...prevState,
            user_name: false,
          }));
          props.coleSetUserNameCheck("user_name", false);
        }
      })
      // catchでエラー時の挙動を定義
      .catch((err) => {
        console.log("err:", err);
      });
  };

  // パスワードのバリデーションチェック
  const passwordCheck = (passwordElement) => {
    // 条件が一致していない場合はエラーを表示
    console.log("props: ", props);
    if (!passwordElement.checkValidity()) {
      setInputError((prev) => ({ ...prev, password: true }));
    } else {
      setInputError((prev) => ({ ...prev, password: false }));
    }
  };

  useEffect(() => {
    // 外部URLから本アプリにアクセスした際に、sessionStrageに保存する
    if (performance.navigation.type !== performance.navigation.TYPE_RELOAD) {
      console.log("外部URLからのアクセスです。");
      if (getSessionData("accountData") === undefined) {
        updateObjectSessionData("accountData", accountData);
      }
    } else {
      console.log("リロードでのアクセスです。");
    }
    props.coleSetUserNameCheck("required", true);

    // console.log('props.coleSetUserNameCheck("required", true)');
  }, []);

  // sessionStrageに保存されているデータを取得する
  useEffect(() => {
    console.log("処理準確認用: 1");
    let sessionDataAccount = getSessionData("accountData");
    console.log("sessionDataAccount", sessionDataAccount);

    setAccountData((prev) => ({
      ...prev,
      student_surname: sessionDataAccount.student_surname,
      student_name: sessionDataAccount.student_name,
      student_kanasurname: sessionDataAccount.student_kanasurname,
      student_kananame: sessionDataAccount.student_kananame,
      user_name: sessionDataAccount.user_name,
      password: sessionDataAccount.password,
      passwordCheck: sessionDataAccount.passwordCheck,
    }));
  }, []);

  // リロードしたときに、accountDataのオブジェクト内のvalueに値があれば、sessionStrageに保存する
  useEffect(() => {
    console.log("処理準確認用: 2");
    if (Object.values({ ...accountData }).some((value) => value !== "")) {
      console.log("空じゃないです。");
      let sessionDataAccount = getSessionData("accountData");
      console.log("sessionDataAccount", sessionDataAccount);
      updateObjectSessionData("accountData", accountData);
    } else {
      console.log("空。");
    }

    /* --------------------------------------------------------------------- */
    /* 必須項目全て入力された場合のみ次に行けるようにする処理を追加しました */
    /* --------------------------------------------------------------------- */
    // フラグをセット
    let requiredFlg = false;

    // accountDataのvalueに1個でも空欄のものが存在するとフラグをtrueにする
    Object.values(accountData).map((value) => {
      if (value == "" || value == undefined) {
        requiredFlg = true;
      }
    });

    // フラグがtrueならstepbar.jsxのuserAccountCheck.requiredをtrueにする
    if (requiredFlg) {
      props.coleSetUserNameCheck("required", true);
    } else {
      props.coleSetUserNameCheck("required", false);
    }


    // セイのhtmlオブジェクトを取得
    const student_kanasurnameElement = document.querySelector('[name="student_kanasurname"]');
    // セイのバリデーションチェック
    student_kanasurnameCheck(student_kanasurnameElement);

    // メイのhtmlオブジェクトを取得
    const student_kananameElement = document.querySelector('[name="student_kananame"]');
    // メイのバリデーションチェック
    student_kananameCheck(student_kananameElement);

    // ユーザー名の重複チェック
    inviteUserNameCheck(accountData.user_name);

    // パスワードのhtmlオブジェクトを取得
    const passwordElement = document.querySelector('[name="password"]');
    // パスワードのバリデーションチェック
    passwordCheck(passwordElement);

    // ESlintError削除、推奨されて無いので他の方法を追々考えます。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

      // 未入力バリデーションに伴う処理を追加
      console.log("name--->>>"+name);
      console.log("value--->>>"+value);

      if(name == "student_surname" && value.trim() === ''){
        // バリデーションを実行
        NULL_validation1 = true;
      } else if(name == "student_name" && value.trim() === ''){
        // バリデーションを実行
        NULL_validation2 = true;
      } else if(name == "student_kanasurname" && value.trim() === ''){
        // バリデーションを実行
        NULL_validation3 = true;
      } else if(name == "student_kananame" && value.trim() === ''){
        // バリデーションを実行
        NULL_validation4 = true;
      } else if(name == "user_name" && value.trim() === ''){
        // バリデーションを実行
        NULL_validation5 = true;
      } else if(name == "password" && value.trim() === ''){
        // バリデーションを実行
        NULL_validation6 = true;
      } else if(name == "passwordCheck" && value.trim() === ''){
        // バリデーションを実行
        NULL_validation7 = true;
      } else if(name == "student_surname" && value.trim() !== ''){
        // バリデーションを解除
        NULL_validation1 = false;
      } else if(name == "student_name" && value.trim() !== ''){
        // バリデーションを解除
        NULL_validation2 = false;
      } else if(name == "student_kanasurname" && value.trim() !== ''){
        // バリデーションを解除
        NULL_validation3 = false;
      } else if(name == "student_kananame" && value.trim() !== ''){
        // バリデーションを解除
        NULL_validation4 = false;
      } else if(name == "user_name" && value.trim() !== ''){
        // バリデーションを解除
        NULL_validation5 = false;
      } else if(name == "password" && value.trim() !== ''){
        // バリデーションを解除
        NULL_validation6 = false;
      } else if(name == "passwordCheck" && value.trim() !== ''){
        // バリデーションを解除
        NULL_validation7 = false;
      }

    setAccountData((prev) => ({ ...prev, [name]: value }));

    console.log("処理準確認用: 3");

    console.log("処理準確認用: 4");
  };

  /*-------------------------------------------------------------------------------*/
/* セイがカタカナじゃないときに次へ行かない処理を追加しました */
/*-------------------------------------------------------------------------------*/
// inputError.company_nameCanaの値が変化したときの処理
useEffect(() => {
  console.log("e.error", inputError.student_kanasurname);

  // パスワードがバリデーションに違反しているときstepbar.jsxのuserAccountCheck.passwordをtrueにする
  if (inputError.student_kanasurname) {
    // パスワードがバリデーションに違反している場合
    console.log("パスワードの条件に当てはまっていません");
    props.coleSetUserNameCheck("student_kanasurname", true);
  } else {
    // パスワードがバリデーションに違反していない場合
    props.coleSetUserNameCheck("student_kanasurname", false);
  }
}, [inputError.student_kanasurname]);

/*-------------------------------------------------------------------------------*/
/* メイがカタカナじゃないときに次へ行かない処理を追加しました */
/*-------------------------------------------------------------------------------*/
// inputError.company_nameCanaの値が変化したときの処理
useEffect(() => {
  console.log("e.error", inputError.student_kananame);

  // パスワードがバリデーションに違反しているときstepbar.jsxのuserAccountCheck.passwordをtrueにする
  if (inputError.student_kananame) {
    // パスワードがバリデーションに違反している場合
    console.log("パスワードの条件に当てはまっていません");
    props.coleSetUserNameCheck("student_kananame", true);
  } else {
    // パスワードがバリデーションに違反していない場合
    props.coleSetUserNameCheck("student_kananame", false);
  }
}, [inputError.student_kananame]);

  /*-------------------------------------------------------------------------------*/
  /* パスワードがバリデーションに違反している場合に次へ行かない処理を追加しました */
  /*-------------------------------------------------------------------------------*/
  // inputError.passwordの値が変化したときの処理
  useEffect(() => {
    console.log("e.error", inputError.password);

    // パスワードがバリデーションに違反しているときstepbar.jsxのuserAccountCheck.passwordをtrueにする
    if (inputError.password) {
      // パスワードがバリデーションに違反している場合
      console.log("パスワードの条件に当てはまっていません");
      props.coleSetUserNameCheck("password", true);
    } else {
      // パスワードがバリデーションに違反していない場合
      props.coleSetUserNameCheck("password", false);
    }
  }, [inputError.password]);

  /*-----------------------------------------------------------------*/
  /* パスワードが一致していない場合に次へ行かない処理を追加しました */
  /*-----------------------------------------------------------------*/
  // inputError.passwordCheckの値が変化したときの処理
  useEffect(() => {
    console.log("e.error", inputError.passwordCheck);

    // パスワードが一致していないときstepbar.jsxのuserAccountCheck.passwordをtrueにする
    if (inputError.passwordCheck) {
      // パスワードが一致していない場合
      console.log("パスワードが一致していません");
      props.coleSetUserNameCheck("passwordCheck", true);
    } else {
      // パスワードが一致している場合
      props.coleSetUserNameCheck("passwordCheck", false);
    }
  }, [inputError.passwordCheck]);

  // パスワード確認
  useEffect(() => {
    const passwordMatch = accountData.password === accountData.passwordCheck;
    setInputError((prev) => ({ ...prev, passwordCheck: !passwordMatch }));
  }, [accountData, inputError]); // パスワードまたはパスワード確認が変更されたときに実行

  // sessionStrageにaccountDataを保存

  const AccountData = useContext(emailContext);
  const objAccountData = {};
  for (const [key, value] of AccountData) {
    objAccountData[key] = value;
  }

  updateSessionData("accountData", "mail", AccountData[0][1]);

  return (
    <>
      <Container>
        <RegistarCard>
          <div>
            <TextField
              fullWidth
              label="メールアドレス"
              margin="normal"
              required
              type="email"
              value={objAccountData.email}
              variant="outlined"
              disabled
            />
            <div style={{ display: "flex" }}>
              <TextField
                error={NULL_validation1 == true || inputError.student_surname}
                fullWidth
                label="姓"
                margin="normal"
                name="student_surname"
                onChange={handleChange}
                required
                type="text"
                value={accountData.student_surname}
                variant="outlined"
              />
              <TextField
                error={NULL_validation2 == true || inputError.student_name}
                fullWidth
                label="名"
                margin="normal"
                name="student_name"
                onChange={handleChange}
                required
                type="text"
                value={accountData.student_name}
                variant="outlined"
              />
            </div>
            <div style={{ display: "flex" }}>
              <TextField
                error={NULL_validation3 == true || (accountData.student_kanasurname != undefined && accountData.student_kanasurname != "") && inputError.student_kanasurname}
                fullWidth
                helperText={
                  (accountData.student_kanasurname == undefined || accountData.student_kanasurname == "" ? "" : inputError.student_kanasurname ? "カタカナで入力してください" : "")
                }
                label="セイ"
                margin="normal"
                name="student_kanasurname"
                onChange={handleChange}
                required
                type="text"
                value={accountData.student_kanasurname}
                inputProps={{
                  pattern: "^[ァ-ヶ＆‘,\\-.・ー]+$",
                  // ^        : 文字列の開始
                  // [ァ-ヶ＆‘,\\-.・]: 一文字のカタカナ、アンパサンド、アポストロフィ、コンマ、ハイフン、ピリオド、中点
                  // +        : 1回以上の繰り返し
                  // $        : 文字列の終了
                }}
                variant="outlined"
              />
              <TextField
                error={NULL_validation4 == true || (accountData.student_kananame != undefined && accountData.student_kananame != "") && inputError.student_kananame}
                fullWidth
                helperText={
                  (accountData.student_kananame == undefined || accountData.student_kananame == "" ? "" : inputError.student_kananame ? "カタカナで入力してください" : "")
                }
                label="メイ"
                margin="normal"
                name="student_kananame"
                onChange={handleChange}
                required
                type="text"
                value={accountData.student_kananame}
                inputProps={{
                  pattern: "^[ァ-ヶ＆‘,\\-.・ー]+$",
                  // ^        : 文字列の開始
                  // [ァ-ヶ＆‘,\\-.・]: 一文字のカタカナ、アンパサンド、アポストロフィ、コンマ、ハイフン、ピリオド、中点
                  // +        : 1回以上の繰り返し
                  // $        : 文字列の終了
                }}
                variant="outlined"
              />
            </div>

            <TextField
              error={NULL_validation5 == true || inputError.user_name}
              fullWidth
              helperText={userNameHelperText}
              // helperText={
              //   (inputError.user_name ? "ユーザー名が条件に合致していません" : "") +
              //   "※大文字・小文字・英数字・8文字以上16文字以内"
              // }
              label="ユーザー名"
              margin="normal"
              name="user_name"
              onChange={handleChange}
              required
              type="text"
              value={accountData.user_name}
              variant="outlined"
            />

            <TextField
              // パスワードが空の時にもエラー表示出てたので修正しました。
              error={NULL_validation6 == true || (accountData.password != undefined && accountData.password != "") && inputError.password}
              fullWidth
              helperText={
                // パスワードが空の時にもエラー表示出てたので修正しました。
                (accountData.password == undefined || accountData.password == "" ? "" : inputError.password ? "パスワードが条件を満たしていません" : "") +
                " ※大文字・小文字・英数字・記号・8文字以上30文字以内"
              }
              label="パスワード"
              margin="normal"
              name="password"
              onChange={handleChange}
              required
              type={showPassword ? "text" : "password"}
              value={accountData.password}
              inputProps={{
                pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[_!@#$%^&*]).{8,30}$",
                // ^                : 文字列の開始
                // (?=.*[a-z])      : 少なくとも一つの小文字の英字が含まれていること
                // (?=.*[A-Z])      : 少なくとも一つの大文字の英字が含まれていること
                // (?=.*\\d)        : 少なくとも一つの数字が含まれていること
                // (?=.*[!@#$%^&*]) : 少なくとも一つの記号 (!@#$%^&*) が含まれていること
                // .{8,30}          : 全体の長さが8文字以上30文字以下であること
                // $                : 文字列の終了
              }}
              variant="outlined"
              // パスワード表示/非表示の切り替え
              InputProps={{
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
            <TextField
              disabled={
                !accountData.password ||
                !new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,30}$").test(
                  accountData.password
                )
              }
              // パスワード確認が空の時にもエラー表示出てたので修正しました。
              error={NULL_validation7 == true || (accountData.passwordCheck != undefined && accountData.passwordCheck != "") && inputError.passwordCheck}
              fullWidth
              helperText={
                // パスワード確認が空の時にもエラー表示出てたので修正しました。
                accountData.passwordCheck == undefined || accountData.passwordCheck == "" ? "" : inputError.passwordCheck ? "パスワードが一致しません" : "パスワードが一致しました"
              }
              label="パスワード確認"
              margin="normal"
              name="passwordCheck"
              onChange={handleChange}
              required
              type={showPassword2 ? "text" : "password"}
              value={accountData.passwordCheck}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword2}
                      onMouseDown={handleMouseDownPassword2}
                      edge="end"
                      disabled={
                        !accountData.password ||
                        !new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,30}$").test(
                          accountData.password
                        )
                      }
                    >
                      {showPassword2 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </RegistarCard>
      </Container>
    </>
  );
});


AccountRegistar.propTypes = {
  accountData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    user_name: PropTypes.string.isRequired,
  }).isRequired,
  inputError: PropTypes.shape({
    user_name: PropTypes.bool.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired, // 必須の関数として定義
  SessionSaveTrigger: PropTypes.string, // ここでSessionSaveTriggerの型を定義
  coleSetUserNameCheck: PropTypes.func.isRequired,
};

export default AccountRegistar;

AccountRegistar.displayName = 'Child';

// 以下のコードは絶対消さないでへへ
// const AccountData = useContext(emailContext);
// const objAccountData = {};

// //
// for (const [key, value] of AccountData) {
//   objAccountData[key] = value;
// }

// input要素に全て値が入力されたかどうかをチェック
// const allInputsFilled = (accountData, inputError, passwordMatch) => {
//   const allInputsTrue =
//     !inputError.user_name &&
//     accountData.user_name !== "" &&
//     !inputError.password &&
//     accountData.password !== "" &&
//     passwordMatch &&
//     accountData.passwordCheck !== "";

//   return allInputsTrue;
// };
