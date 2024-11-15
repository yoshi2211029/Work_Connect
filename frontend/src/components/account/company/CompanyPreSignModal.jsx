import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";

import axios from "axios";

import $ from "jquery";

import "src/App.css";
import ModalStyle from "../ModalStyle";
const CompanyPreSignModal = (props) => {
  const [showModal, setShowModal] = useState(true);
  const [formValues, setFormValues] = useState({
    mail: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  const clickOneTimes = useRef(false); // 一度だけ処理させたい処理を管理するuseRefを作成する

  const url = "http://localhost:8000/s_pre_register";
  const csrf_url = "http://localhost:8000/csrf-token";

  // ヘッダーの新規登録ボタンを押したときに新規登録モーダルを開いたり閉じたりする処理
  $("#CompanypreSignModalOpenButton").click(function (e) {
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

  // 新規登録のform内以外をクリックしたときにモーダルを閉じる処理

  $("*").click(function (e) {
    // クリックした要素の<html>までのすべての親要素の中に"formInModal"クラスがついている要素を取得
    var targetParants = $(e.target).parents(".formInModal");

    // 取得した要素の個数が0個の場合
    // ***if (targetParants.length == 0 || $(e.target).text() == "閉じる")***
    if (targetParants.length == 0 || $(e.target).text() == "閉じる") {
      // クリックした要素に"formInModal"クラスがついていない場合
      if ($(e.target).attr("class") != "formInModal" && $(e.target).attr("id") != "preSignModalOpenButton") {
        // 新規登録モーダルを閉じる
        setShowModal(false);
      }
    }
  });

  // 親に渡す。
  const handleOpenStudentPreModal = () => {
    props.callSetPreModalChange("学生");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // フォームの送信処理
    const errors = validate(formValues, true);
    setFormErrors(errors);
    setIsSubmit(true);

    // バリデーションエラーがある場合、処理を中断する
    if (Object.keys(errors).length > 0) {
      return;
    }
    const mail = formValues.mail;
    const kind = "c";

    console.log("mail=" + mail);

    //ajax
    $.ajax({
      url: url, // アクセスするURL
      type: "GET", // POST または GET
      cache: false, // cacheを使うか使わないかを設定
      dataType: "json", // データタイプ (script, xmlDocument, jsonなど)
      data: {
        mail: mail,
        kind: kind,
      },
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
    })
      .done(function (data) {
        // ajax成功時の処理

        if (data != null) {
          // すでに入力されたメールアドレスが存在している場合に警告文を表示
          if (data == "true") {
            console.log(data);
            console.log("つくれます");
            alert("メールアドレスを送信しました。");

            // 二重送信を防ぐため初期化
            formValues.mail = "";
          } else {
            console.log(data);
            console.log("つくれません");
            alert("このメールアドレスは使用できません。");
            setFormErrors(validate(null, false));

            // メールアドレスの文字を選択状態にする
            document.getElementsByName("mail")[0].select();

            // データの保存(セッションストレージ)
            // sessionStorage.setItem('user_id', data.id);
            // console.log("ユーザーidは"+sessionStorage.getItem('user_id'));
          }
        } else {
          console.log("login失敗");
          alert("ログインに失敗しました。\nユーザー名、メールアドレス、パスワードをご確認ください。");
        }
      })
      .fail(function (textStatus, errorThrown) {
        //ajax失敗時の処理
        console.log("Error:", textStatus, errorThrown);
      });

    // handleCloseModal(); // モーダルを閉じる
  };

  const validate = (values, boolean) => {
    const errors = {};
    const regex = /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
    // メールアドレスがまだ存在しないときはboolean == "true"
    if (boolean == true && !values.mail) {
      errors.mail = "メールアドレスを入力してください";
    } else if (boolean == true && !regex.test(values.mail)) {
      errors.mail = "正しいメールアドレスを入力してください";
    }
    // メールアドレスが既に存在するときはboolean == "false"
    if (boolean == false) {
      errors.mail = "このメールアドレスは既に登録されています。";
    }
    return errors;
  };

  return (
    <div>
      {/* #でリロードを停止させてます。 */}

      {/* 条件付きレンダリングを使用 */}
      {/* <button onClick={handleOpenModal}>新規登録</button> */}
      <Modal isOpen={showModal} contentLabel="Example Modal" style={ModalStyle}>
        <div className="preSignUpFormContainer">
          <form onSubmit={handleSubmit} className="formInModal">
            <h3>Work&Connect 仮登録</h3>
            <hr />
            <div className="preSignUpUiForm">
              <TextField
                fullWidth
                label="メールアドレス"
                margin="normal"
                name="mail"
                onChange={handleChange}
                type="text"
                value={formValues.mail}
                variant="outlined"
              />
              <p className="errorMsg">{formErrors.mail}</p>
              <button type="submit" className="submitButton">
                仮登録
              </button>
              {Object.keys(formErrors).length === 0 && isSubmit && handleCloseModal}
              <button onClick={handleCloseModal}>閉じる</button>
              <div onClick={handleOpenStudentPreModal} id="PreSignStudentModalLink" className="Login_Sign_select_C_or_S">
                学生の方はこちら
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
CompanyPreSignModal.propTypes = {
  FromCompanyPage: PropTypes.bool.isRequired,
  callSetPreModalChange: PropTypes.func.isRequired,
};
export default CompanyPreSignModal;
