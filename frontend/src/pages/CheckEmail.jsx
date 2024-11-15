import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Container from "@mui/material/Container";

const ChangeEmail = () => {
    const [CheckEmailComplete, SetCheckEmailComplete] = useState("");

    useEffect(() => {
        async function renderCheckEmail() {
            try {
                const currentUrl = window.location.href;  // 'url' の代わりに 'currentUrl' として定義
                const urlObj = new URL(currentUrl);
                const params = new URLSearchParams(urlObj.search);

                // APIエンドポイントURL
                const apiUrl = `http://localhost:8000/check_email`; // 'url' の代わりに 'apiUrl' 
                const response = await axios.post(apiUrl, {
                    kind: params.get("kind"),
                    urltoken: params.get("urltoken"),
                    email: params.get("key"),
                });

                SetCheckEmailComplete(response.data);

            } catch (e) {
                console.log("ChangeEmailerror", e);
            }
        }
        renderCheckEmail();
    }, [])

    const Success = (
        <>
            <p>メールアドレスが確認されました。</p>
            <span>再度</span>
            <Link to="/Top">
                ログイン
            </Link>
            <span>してください</span>
        </>

    );

    return (
        <>
            <Container>{CheckEmailComplete == "success" ? Success : CheckEmailComplete}</Container>
        </>

    )
}

export default ChangeEmail