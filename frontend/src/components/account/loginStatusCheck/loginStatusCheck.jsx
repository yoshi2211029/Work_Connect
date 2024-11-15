import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useSessionStorage } from "src/hooks/use-sessionStorage";
/*--------------------------------------------*/
/* ログイン状態をチェックする処理を追加しました。 */
/*--------------------------------------------*/
/*
import LoginStatusCheck from "～/loginStatusCheck";
const { loginStatusCheckFunction } = LoginStatusCheck();
loginStatusCheckFunction();
*/
/* ↑この3行でこの関数を使用可能です */
/*--------------------------------------------*/
function LoginStatusCheck() {
  const navigate = useNavigate();
  const { getSessionData } = useSessionStorage();

  // セッションストレージのaccountData.idが正しいidでなければトップページに飛ばす
  const loginStatusCheckFunction = async () => {
    const accountData = getSessionData("accountData");

    var loginStatusCheckResponse = { data: "false" };

    const data = {
      id: accountData.id,
    };

    if (accountData != undefined) {
      if (accountData.id != undefined) {
        loginStatusCheckResponse = await axios.post(
          "http://localhost:8000/login_status_check",
          // "http://127.0.0.1:8000/login_status_check",
          data
        );
      }
    }

    // console.log("loginStatusCheckResponse: ", loginStatusCheckResponse);
    if (loginStatusCheckResponse.data == "false") {
      // もしログインチェックに失敗した場合は、404ページに飛ばす
      navigate("/Top");
    }
  };

  return { loginStatusCheckFunction };
}
/*-------------------------------------------*/

export default LoginStatusCheck;
