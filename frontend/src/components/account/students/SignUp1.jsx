// import  { useEffect, useState } from "react";
import  { useState } from "react";
import Modal from "react-modal";

// import axios from "axios";


import "src/App.css";


// ログインのモーダル CSS設定
const modalStyle = {
  content: {
    position: "none",
    backgroundColor: "rgb(0 0 0 / 70%)",
    border: "none",
    borderRadius: "0",
    padding: "1.5rem",
    overflow: "none",
  },
};

const SignUp1 = () => {
  const [showModal, setShowModal] = useState(false);
  // const [formValues, setFormValues] = useState({
  //   user_name: "",
  //   mail: "",
  //   password: "",
  // });
  // const [formErrors, setFormErrors] = useState({});
  // const [isSubmit, setIsSubmit] = useState(false);
  // const [csrfToken, setCsrfToken] = useState("");

  // const url = "http://localhost:8000/s_login";
  // const csrf_url = "http://localhost:8000/csrf-token";

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // setFormErrors({}); // エラーメッセージをリセット
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormValues({ ...formValues, [name]: value });
  // };

  // useEffect(() => {
  //   async function fetchCsrfToken() {
  //     try {
  //       const response = await axios.get(csrf_url); // CSRFトークンを取得するAPIエンドポイント
  //       console.log(response.data.csrf_token); // ログ
  //       console.log("fetching CSRF token:OK"); // ログ
  //       const csrfToken = response.data.csrf_token;
  //       setCsrfToken(csrfToken); // 状態を更新
  //     } catch (error) {
  //       console.error("Error fetching CSRF token:", error);
  //     }
  //   }
  //   fetchCsrfToken(); // ページがロードされた時点でCSRFトークンを取得
  // }, []); // 空の依存配列を渡して、初回のみ実行するようにする

  // aysncつけました
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // フォームの送信処理
  //   setFormErrors(validate(formValues));
  //   setIsSubmit(true);

  //   //////////////////////////////////////////////////////////////////////////////////////////////////////

  //   const user_name = document.getElementsByName("user_name")[0].value;
  //   const password = document.getElementsByName("password")[0].value;

  //   console.log("user_name" + user_name);
  //   console.log("password" + password);

  //   //ajax
  //   $.ajax({
  //     url: url, // アクセスするURL "http://localhost:8000/login"
  //     type: "GET", // POST または GET
  //     cache: false, // cacheを使うか使わないかを設定
  //     dataType: "json", // データタイプ (script, xmlDocument, jsonなど)
  //     data: {
  //       user_name: user_name,
  //       password: password,
  //     },
  //     headers: {
  //       "X-CSRF-TOKEN": csrfToken,
  //     },
  //   })
  //     .done(function (data) {
  //       // ajax成功時の処理

  //       if (data != null) {
  //         console.log(data.id);
  //         console.log("login成功");
  //         alert("ログインに成功しました。");

  //         // データの保存(セッションストレージ)
  //         sessionStorage.setItem("user_id", data.id);
  //         console.log("ユーザーidは" + sessionStorage.getItem("user_id"));
  //       } else {
  //         console.log("login失敗");
  //         alert(
  //           "ログインに失敗しました。\nユーザー名、メールアドレス、パスポートをご確認ください。"
  //         );
  //       }
  //     })
  //     .fail(function (textStatus, errorThrown) {
  //       //ajax失敗時の処理
  //       console.log("Error:", textStatus, errorThrown);
  //     });

  //   //////////////////////////////////////////////////////////////////////////////////////////////////////
  //   // handleCloseModal(); // モーダルを閉じる
  // };

  // const validate = (values) => {
  //   const errors = {};
  //   // 有効なメールアドレスか検証
  //   const regex =
  //     /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

  //   if (!values.user_name) {
  //     errors.user_name = "ユーザー名またはメールアドレスを入力してください";
  //   } else if (/[@]/.test(values.user_name) && !regex.test(values.user_name)) {
  //     // @マークを含み(メールアドレス)かつ、メールアドレスが無効の場合
  //     errors.mail = "正しいメールアドレスを入力してください";
  //   }

  //   if (!values.password) {
  //     errors.password = "パスワードを入力してください";
  //   } else if (values.password.length < 4 || values.password.length > 15) {
  //     errors.password = "4文字以上15文字以下のパスワードを入力してください";
  //   }

  //   return errors;
  // };

  return (
    <div>
      <button onClick={handleOpenModal}>本登録（テスト表示）</button>
      <Modal isOpen={showModal} contentLabel="Example Modal" style={modalStyle}>
        <button onClick={handleCloseModal}>閉じる</button>
      </Modal>
    </div>
  );
};

export default SignUp1;
