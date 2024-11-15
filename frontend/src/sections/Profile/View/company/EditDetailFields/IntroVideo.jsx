import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from 'prop-types';
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import Iframe from 'react-iframe'; //紹介動画やマップを埋め込む

const IntroVideo = ({ IntroVideoData }) => {
  const [IntroVideo, setIntroVideo] = useState(IntroVideoData);
  const [IntroVideoURL, setIntroVideoURL] = useState(null);
  const { getSessionData, updateSessionData } = useSessionStorage();

  // valueの初期値をセット
  useEffect(() => {
    if (getSessionData("accountData") !== undefined){
      const SessionData = getSessionData("accountData");
      if(SessionData.CompanyIntroVideoEditing && SessionData.CompanyIntroVideo){
        // セッションストレージから最新のデータを取得
        setIntroVideo(SessionData.CompanyIntroVideo);
        if(SessionData.CompanyIntroVideo){
          iframeURLChange(SessionData.CompanyIntroVideo);
        }
      } else if(
        (SessionData.CompanyIntroVideoEditing && SessionData.CompanyIntroVideo && IntroVideoData)||
        (!SessionData.CompanyIntroVideoEditing && IntroVideoData)
      ){ // DBから最新のデータを取得
        setIntroVideo(IntroVideoData);
        if(IntroVideoData){
          iframeURLChange(IntroVideoData);
        }
      }
    }
  }, [IntroVideoData]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (e.target.name === "IntroVideo") {
      setIntroVideo(newValue);
      iframeURLChange(newValue);
      updateSessionData("accountData", "CompanyIntroVideoEditing", true);
    }
  };

  const iframeURLChange = (URL) => {
    let extractedUrl = null;

    // 共有リンクを入力した場合
    if (URL.includes("youtu.be")) {
      const videoId = URL.split('/').pop().split('?')[0];
      extractedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    // 埋め込み用リンクを入力した場合(Iframeから始まる)
    else if (URL.includes("iframe")) {
      const regex = /src="([^"]+)"/;
      const match = URL.match(regex);
      if (match && match[1]) {
        extractedUrl = match[1];
      }
    } else if (URL.includes("watch?v=")) {
      const videoId = URL.split('v=')[1].split('&')[0]; // Extract the video ID
      extractedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    setIntroVideoURL(extractedUrl);
    console.log(extractedUrl);
  };

  // 編集中のデータを保存しておく
  useEffect(() => {
    updateSessionData("accountData", "CompanyIntroVideo", IntroVideo);

  }, [IntroVideo]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField
        fullWidth
        label="YouTubeのURLをここにコピー"
        margin="normal"
        name="IntroVideo"
        onChange={handleChange}
        // required
        type="text"
        value={IntroVideo}
        variant="outlined"
        sx={{
          backgroundColor: '#fff', // 背景色を指定
          borderRadius: '8px', // 角の丸みを設定
          marginTop: '6px',
          marginBottom: '0'
        }}
      />
      <Iframe
        url={IntroVideoURL}
        width="100%"
        height="400px"
      />
    </div>




  );
};


// プロパティの型を定義
IntroVideo.propTypes = {
  IntroVideoData: PropTypes.string.isRequired,
};


export default IntroVideo;