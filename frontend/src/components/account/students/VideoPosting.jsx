import VideoYoutubeURL from "../../../sections/video/VideoYoutubeURL";
import VideoTitle from "../../../sections/video/VideoTitle";
import VideoGenre from "../../../sections/video/VideoGenre";
import VideoIntroduction from "../../../sections/video/VideoIntroduction";
import YouTube from "react-youtube";
// import Modal from "react-modal";
// import { useNavigate } from "react-router-dom";

import "../../../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "src/hooks/use-sessionStorage";

const VideoPosting = () => {
  let navigation = useNavigate();
  const { getSessionData } = useSessionStorage();
  const accountData = getSessionData("accountData");

  const [workData, setVideoData] = useState({
    creatorId: "",
    YoutubeURL: "",
    VideoTitle: "",
    VideoGenre: "",
    Introduction: "",
  });
  const [message, setMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    console.log("workData: ", workData);
  }, [workData]);

  const callSetVideoData = (key, value) => {
    setVideoData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleChange = (event) => {
    const url = event.target.value;
    setVideoUrl(url);
    setHasError(url === "");

    callSetVideoData("creatorId", accountData.id);

    // 入力が空の場合、videoIdをリセットしてYoutubeURLをクリア
    if (url === "") {
      setVideoId(""); // videoIdを空にリセット
      callSetVideoData("YoutubeURL", ""); // YoutubeURLもリセット
      return; // ここで処理を終了
    }

    let extractedVideoId = "";

    // YouTubeの動画IDを抽出
    // iframe入力時
    if (url.includes("iframe")) {
      const srcMatch = url.match(
        /src="https:\/\/www\.youtube\.com\/embed\/([^"]+)?/
      );
      const srcMatch2 = srcMatch[1].match(/([^?]+)?/);

      if (srcMatch && srcMatch2[1]) {
        extractedVideoId = srcMatch2[1];
      }
    }
    // URL入力時
    else if (url.includes("youtube.com/watch?v=")) {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      extractedVideoId = params.get("v");
    }
    // 短縮URL入力時
    else if (url.includes("youtu.be/")) {
      const urlObj = new URL(url);
      extractedVideoId = urlObj.pathname.substring(1);
    }
    // 動画ID入力時
    else {
      extractedVideoId = url;
    }

    if (extractedVideoId) {
      setVideoId(extractedVideoId); // videoIdを設定
      callSetVideoData("YoutubeURL", extractedVideoId); // 最新のvideoIdを反映
    }
  };

  const opts = {
    height: "283",
    width: "450",
    playerVars: {
      modestbranding: 0,
      controls: 0,
      iv_load_policy: 3,
    },
  };

  const VideoSubmit = async (e) => {
    e.preventDefault();
    console.log("e", e.target);
    console.log("workData[key]", workData);
    async function PostData() {
      const formData = new FormData();

      for (const key in workData) {
        formData.append(key, workData[key]);
      }
      try {
        const response = await axios.post(
          "http://localhost:8000/video_posting",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("formData: ", formData);
        navigation("/VideoSelect");
        setMessage(response.data.message);
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        setMessage(
          error.response ? error.response.data.message : error.message
        );
      }
    }

    if (
      !workData.YoutubeURL ||
      !workData.VideoTitle ||
      !workData.VideoGenre ||
      !workData.Introduction
    ) {
      alert("エラー：未入力項目があります。");
    } else {
      // それ以外(実行)
      PostData();
    }
    // e.target.map
  };

  return (
    <div>
      <div className="VideoPostingFormContainer">
        <form onSubmit={VideoSubmit} method="post" id="youtubeForm">
          <h3>動画投稿</h3>
          <div className="VideoPostingUiForm">
            <div className="ImageUpload">
              <div className="VideoPostingFormField">
                <VideoYoutubeURL
                  onChange={handleChange}
                  value={videoUrl}
                  error={hasError}
                />
              </div>
              <br />
              {videoId ? (
                <YouTube videoId={videoId} opts={opts} />
              ) : (
                <p>YouTubeのURL、ID、またはiframeコードを入力してください。</p>
              )}
            </div>
            <div className="VideoInformation">
              <div className="VideoPostingFormField">
                <VideoTitle callSetVideoData={callSetVideoData} />
              </div>
              {/* ジャンル */}
              <div className="VideoPostingFormField">
                <div className="workGenre" id="workGenre">
                  <p className="work_genre">
                    ジャンル
                    {/* ジャンル&nbsp;<span className="red_txt">必須</span>
                    &nbsp;
                    <span className="alert_red_txt" id="alert_a_3">
                      タグを入れてください
                    </span> */}
                  </p>
                  <VideoGenre callSetVideoData={callSetVideoData} />
                </div>
              </div>
              <br />
              <div className="VideoPostingFormField">
                <VideoIntroduction callSetVideoData={callSetVideoData} />
              </div>
            </div>
          </div>
          <input type="submit" value="送信" className="VideoSubmit" />
        </form>
        {message && <p>{message}</p>}
      </div>
      {/* </Modal> */}
    </div>
  );
};

export default VideoPosting;
