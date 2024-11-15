import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from 'prop-types'; // prop-types をインポート
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import Iframe from 'react-iframe'; //紹介動画やマップを埋め込む


const CompanyAddressMap = ({ CompanyAddressMapData }) => {


  const [CompanyAddressMap, setCompanyAddressMap] = useState(CompanyAddressMapData);
  const { getSessionData, updateSessionData } = useSessionStorage();
  const [CompanyAddressMapURL, setCompanyAddressMapURL] = useState(null);

  // 入力エラーの状態管理
  const [inputError, setInputError] = useState({
    CompanyAddressMapError: false,
  });

  // valueの初期値をセット
  useEffect(() => {
    // セッションデータ取得
    const SessionData = getSessionData("accountData");

    /// 編集の途中ならセッションストレージからデータを取得する。
    /// (リロードした時も、データが残った状態にする。)
    if ((SessionData.CompanyAddressMap !== undefined && SessionData.CompanyAddressMap !== "") ||
    SessionData.CompanyAddressMapEditing) {
      // セッションストレージから最新のデータを取得
      setCompanyAddressMap(SessionData.CompanyAddressMap);
      if(SessionData.CompanyAddressMap){
        iframeURLChange(SessionData.CompanyAddressMap);
      }
    } else {
      // DBから最新のデータを取得
      setCompanyAddressMap(CompanyAddressMapData);
      if(CompanyAddressMapData){
        iframeURLChange(CompanyAddressMapData);
      }
    }

  }, [CompanyAddressMapData]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (e.target.name === "CompanyAddressMap") {
      // newValueをセット
      setCompanyAddressMap(newValue);
      iframeURLChange(newValue);
      // 編集中状態をオン(保存もしくはログアウトされるまで保持)
      updateSessionData("accountData", "CompanyAddressMapEditing", true);
    }
  };

  const iframeURLChange = (URL) => {
    let extractedUrl = null;

    //https://www.google.co.jp/maps/place/%E6%B8%85%E9%A2%A8%E6%83%85%E5%A0%B1%E5%B7%A5%E7%A7%91%E5%AD%A6%E9%99%A2/@34.6364694,135.5073751,17z/data=!3m1!4b1!4m6!3m5!1s0x6000ddea49ae21d7:0x448a2ceddab9b8e!8m2!3d34.636465!4d135.50995!16s%2Fg%2F122wnbjw?hl=ja&entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D
    // Google Maps 共有リンクを入力した場合
    // if (URL.includes("/maps/place/")) {
    //     // クエリパラメータの部分を取り出す
    //     const queryString = URL.split('?')[1];

    //     if (queryString) {
    //         // パラメータを分割する
    //         const params = new URLSearchParams(queryString);

    //         // 'data' パラメータを取得する
    //         const dataParam = params.get('data');

    //         // 'data' パラメータを使用して埋め込みリンクを生成する
    //         if (dataParam) {
    //             extractedUrl = `https://www.google.com/maps/embed?pb=${dataParam}`;
    //         }
    //     }
    //     console.log("通ってます");
    // }
        //"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.721823314568!2d135.5073750761962!3d34.6364693866558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000ddea49ae21d7%3A0x448a2ceddab9b8e!2z5riF6aKo5oOF5aCx5bel56eR5a2m6Zmi!5e0!3m2!1sja!2sjp!4v1725774347774!5m2!1sja!2sjp"
    // 埋め込み用リンクを入力した場合 (iframe srcから始まる)
    if (URL.includes("iframe")) {
        // src属性からURLを抽出する
        const regex = /src="([^"]+)"/;
        const match = URL.match(regex);
        if (match && match[1]) {
            extractedUrl = match[1];
        }
      }
      //   else if (URL.includes("https://maps.app.goo.gl/")) {
      //     // Google Maps の URL から ID を抽出
      //     const mapId = URL.split('/').pop();

      //     if (mapId) {
      //         // 埋め込み URL を生成
      //         extractedUrl = `https://www.google.com/maps/embed?pb=${mapId}`;
      //     }
      // }

        // URL を設定し、コンソールに出力する
        setCompanyAddressMapURL(extractedUrl);
        console.log(extractedUrl);
    };



  useEffect(() => {
    // 編集中のデータを保存しておく
    updateSessionData("accountData", "CompanyAddressMap", CompanyAddressMap);

    // バリデーション
    if(CompanyAddressMap === ""){
      // 姓が空だったら、error表示
      setInputError((prev) => ({ ...prev, CompanyAddressMapError: true }));
    } else if(CompanyAddressMap !== ""){
      // 姓が空でないなら、error非表示
      setInputError((prev) => ({ ...prev, CompanyAddressMapError: false }));
    }

  }, [CompanyAddressMap]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField
        error={inputError.CompanyAddressMapError}
        fullWidth
        margin="normal"
        name="CompanyAddressMap"
        onChange={handleChange}
        // required
        type="text"
        value={CompanyAddressMap}
        variant="outlined"
        sx={{
          backgroundColor: '#fff', // 背景色を指定
          borderRadius: '8px', // 角の丸みを設定
          marginTop: '6px',
          marginBottom: '0'
        }}
      />
      <Iframe
        url={CompanyAddressMapURL}
        width="100%"
        height="400px"
      />
    </div>


  );
};

// プロパティの型を定義
CompanyAddressMap.propTypes = {
  CompanyAddressMapData: PropTypes.string.isRequired,
};

export default CompanyAddressMap;