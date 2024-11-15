import axios from "axios";
import { useState } from "react";
import { useSessionStorage } from "src/hooks/use-sessionStorage";

const ChangeEmail = () => {
  const { getSessionData } = useSessionStorage();
  let sessionData = getSessionData("accountData");
  let sessionEmail = sessionData.mail;
  let sessionId = sessionData.id;

  console.log("sessionEmail", sessionEmail);

  const [NewEmail, SetNewEmail] = useState("");
  const [CheckEmail, SetCheckEmail] = useState("");
  const [PostCheck, SetPostCheck] = useState("確認メールを送信");
  const [MailCheck, SetMailCheck] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 追加: 送信中かどうかの状態管理

  async function handleClickCheckMail() {
    setIsSubmitting(true); // 送信開始
    SetPostCheck("送信中...");
    try {
      if (NewEmail === CheckEmail) {
        const url = `http://localhost:8000/change_email`;
        const response = await axios.post(url, {
          id: sessionId,
          email: NewEmail,
        });

        console.log("response", response);
        if (response.data) {
          SetPostCheck(response.data);
          SetMailCheck("");
          alert("メールアドレス変更確認メールが送信されました。ログアウトします。"); // ここでアラートを表示
          window.location.href = "/Top";
        }
      } else {
        SetMailCheck("メールアドレスが一致していません。");
      }
    } catch (e) {
      console.log("ChangeEmailerror", e);
    } finally {
      setIsSubmitting(false); // 送信終了
    }
  }

  return (
    <>
    
      <h1>メールアドレス変更</h1>
      <p>現在のメールアドレス: {sessionEmail}</p>
      <p>
        新しいメールアドレス:{" "}
        <input
          type="email"
          onChange={(e) => {
            SetNewEmail(e.target.value);
          }}
          value={NewEmail}
        />
      </p>
      <p>
        新しいメールアドレス（確認）:{" "}
        <input
          type="email"
          onChange={(e) => {
            SetCheckEmail(e.target.value);
          }}
          value={CheckEmail}
        />
      </p>
      {MailCheck && <p key={MailCheck}>{MailCheck}</p>}
      <button onClick={handleClickCheckMail} disabled={isSubmitting || PostCheck === "送信中..."}>
        {PostCheck}
      </button>
    </>
  );
};

export default ChangeEmail;
