import { useEffect, useState, useRef } from "react";

import PropTypes from "prop-types";
import Modal from "react-modal";
import axios from "axios";
import $ from "jquery";
import { useNavigate } from "react-router-dom";

import { useSessionStorage } from "src/hooks/use-sessionStorage";
import LoginStatusCheck from "src/components/account/loginStatusCheck/loginStatusCheck";

import "src/App.css";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";

import ModalStyle from "../ModalStyle";

const StudentLoginModal = (props) => {
  const { updateSessionData } = useSessionStorage();
  const { loginStatusCheckFunction } = LoginStatusCheck();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(true);
  const [formValues, setFormValues] = useState({
    user_name: "",
    mail: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  const clickOneTimes = useRef(false); // 一度だけ処理させたい処理を管理するuseRefを作成する

  const url = "http://localhost:8000/s_login";
  const csrf_url = "http://localhost:8000/csrf-token";

  // パスワード表示/非表示の切り替え(パスワード)
  const [showPassword, setShowPassword] = useState("");

  const handleClickShowPassword = (e) => {
    setShowModal(true);
    setShowPassword(!showPassword);
    e.stopPropagation();
  };

  const handleMouseDownPassword = (e) => {
    setShowModal(true);
    e.preventDefault();
  };

  // ヘッダーのログインボタンを押したときにログインモーダルを開いたり閉じたりする処理
  $("#loginModalOpenButton").click(function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (clickOneTimes.current) return; // 送信処理中かを判定する（trueなら抜ける）
    clickOneTimes.current = true; // 送信処理中フラグを立てる

    if (showModal == true) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }

    clickOneTimes.current = false; // 送信処理中フラグを下げる
  });

  // 親に渡す。
  const handleOpenCompanyModal = () => {
    props.callSetModalChange("企業");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormErrors({}); // エラーメッセージをリセット
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    async function fetchCsrfToken() {
      try {
        const response = await axios.get(csrf_url); // CSRFトークンを取得するAPIエンドポイント
        console.log(response.data.csrf_token); // ログ
        console.log("fetching CSRF token:OK"); // ログ
        const csrfToken = response.data.csrf_token;
        setCsrfToken(csrfToken); // 状態を更新
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    }
    fetchCsrfToken(); // ページがロードされた時点でCSRFトークンを取得
  }, []); // 空の依存配列を渡して、初回のみ実行するようにする

  // aysncつけました
  const handleSubmit = async (e) => {
    e.preventDefault();
    // フォームの送信処理
    setFormErrors(validate(formValues));
    setIsSubmit(true);

    //////////////////////////////////////////////////////////////////////////////////////////////////////

    const user_name = formValues.user_name;
    const password = formValues.password;
    const kind = "s";

    console.log("user_name" + user_name);
    console.log("password" + password);

    //ajax
    $.ajax({
      url: url, // アクセスするURL "http://localhost:8000/login"
      type: "GET", // POST または GET
      cache: false, // cacheを使うか使わないかを設定
      dataType: "json", // データタイプ (script, xmlDocument, jsonなど)
      data: {
        user_name: user_name,
        password: password,
        kind: kind,
      },
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
    })
      .done(function (data) {
        // ajax成功時の処理

        if (data != null) {
          console.log(data.id);
          console.log("login成功");
          // alert("ログインに成功しました。");

          // データの保存(セッションストレージ)
          updateSessionData("accountData", "id", data.id);
          updateSessionData("accountData", "user_name", data.user_name);
          updateSessionData("accountData", "mail", data.mail);
          updateSessionData("accountData", "popover_icon", data.icon);

          console.log("ユーザーidは" + sessionStorage.getItem("user_id"));

          // 二重送信を防ぐため初期化
          // formValues.user_name = "";
          // formValues.password = "";

          loginStatusCheckFunction();

          /*------------------------------------------------------------------*/
          /* ログイン成功時にモーダルを閉じて、作品一覧に飛ばす処理を追加しました。 */
          /*------------------------------------------------------------------*/
          setShowModal(false);
          setFormValues({
            ...formValues,
            user_name: "",
            password: "",
          });
          navigate("/");
        } else {
          console.log("login失敗");
          alert("ログインに失敗しました。\nユーザー名、メールアドレス、パスポートをご確認ください。");
        }
      })
      .fail(function (textStatus, errorThrown) {
        //ajax失敗時の処理
        console.log("Error:", textStatus, errorThrown);
      });

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // handleCloseModal(); // モーダルを閉じる
  };

  const validate = (values) => {
    const errors = {};
    // 有効なメールアドレスか検証
    const regex = /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

    if (!values.user_name) {
      errors.user_name = "ユーザー名またはメールアドレスを入力してください";
    } else if (/[@]/.test(values.user_name) && !regex.test(values.user_name)) {
      // @マークを含み(メールアドレス)かつ、メールアドレスが無効の場合
      errors.mail = "正しいメールアドレスを入力してください";
    }

    if (!values.password) {
      errors.password = "パスワードを入力してください";
    } else if (values.password.length < 4 || values.password.length > 15) {
      errors.password = "4文字以上15文字以下のパスワードを入力してください";
    }

    return errors;
  };

  // 開発環境のみ使用
  const fillDemoCredentials = () => {
    setFormValues({ user_name: "yoshioka", password: "2023gakusei" });
  };

  return (
    <div>
      {/* 条件付きレンダリングを使用 */}
      <Modal isOpen={showModal} contentLabel="Example Modal" style={ModalStyle}>
        <div className="Modal">
          <form onSubmit={handleSubmit} className="formInModal">
            <h3>Work&Connect ログイン</h3>
            <hr />
            <div className="loginUiForm">
              <TextField
                fullWidth
                label="ユーザー名またはメールアドレス"
                margin="normal"
                name="user_name"
                onChange={handleChange}
                required
                type="text"
                value={formValues.user_name}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="パスワード"
                margin="normal"
                name="password"
                onChange={handleChange}
                required
                type={showPassword ? "text" : "password"}
                value={formValues.password}
                variant="outlined"
                sx={{
                  "&:hover": {
                    borderColor: "#1877F2",
                  },
                }}
                // パスワード表示/非表示の切り替え
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{}}
                        variant="outlined"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type="button" onClick={fillDemoCredentials} className="submitButton">
                ユーザーネーム:yoshioka パスワード:2023gakusei
              </Button>
              <button type="submit" className="submitButton">
                ログイン
              </button>
              {Object.keys(formErrors).length === 0 && isSubmit && handleCloseModal}
              <button onClick={handleCloseModal} className="submitButton">
                閉じる
              </button>
              <div href="" onClick={handleOpenCompanyModal} id="loginCompanyModalLink" className="Login_Sign_select_C_or_S">
                企業の方はこちら
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
StudentLoginModal.propTypes = {
  // --------2024 07 24 13:51 藤田がコメントアウト--------
  // FromCompanyPage: PropTypes.bool.isRequired,
  // --------2024 07 24 13:51 藤田がコメントアウト--------
  FromCompanyPage: PropTypes.bool,
  callSetModalChange: PropTypes.func.isRequired,
};

export default StudentLoginModal;
