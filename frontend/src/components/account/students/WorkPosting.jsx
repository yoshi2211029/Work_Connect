import YoutubeURL from "../../../sections/work/WorkPosting/YoutubeURL";
import ImageUpload from "../../../sections/work/WorkPosting/ImageUpload";
import WorkTitle from "../../../sections/work/WorkPosting/WorkTitle";
import WorkGenre from "../../../sections/work/WorkPosting/WorkGenre";
import Introduction from "../../../sections/work/WorkPosting/Introduction";
import Obsession from "../../../sections/work/WorkPosting/Obsession";
import Language from "../../../sections/work/WorkPosting/Language";
import Environment from "../../../sections/work/WorkPosting/Environment";
// import Modal from "react-modal";

import "../../../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "src/hooks/use-sessionStorage";

const WorkPosting = () => {
  let navigation = useNavigate();
  const { getSessionData } = useSessionStorage();
  const accountData = getSessionData("accountData");

  const [workData, setWorkData] = useState({
    creatorId: "",
    YoutubeURL: "",
    WorkTitle: "",
    WorkGenre: "",
    Introduction: "",
    Obsession: "",
    Language: "",
    Environment: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [message, setMessage] = useState("");
  // const [imagesName, setImagesName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [hasError, setHasError] = useState(false);
  const [Image, setImage] = useState();
  const [Description, setDescription] = useState();

  const handleValueChange = (newValue) => {
    setDescription(newValue);
  };

  useEffect(() => {
    console.log("Description: ", Description);
  }, [Description]);

  const callSetImage = (e) => {
    // const image = Array.from(e);
    setImage(e);
    console.log("image: ", Image);
    if (e.length > 0) {
      // Fileオブジェクトのプロパティをログに表示
      for (let i = 0; i < e.length; i++) {
        console.log(
          `File ${i} - Name: ${e[i].name}, Size: ${e[i].size}, Type: ${e[i].type}`
        );
      }
    }
    const imagesArray = Array.from(e);
    setImageFiles(imagesArray);
    console.log("imageArray: ", imagesArray);
    handleImageChange(e);
  };

  useEffect(() => {
    console.log("workData", workData);
  }, [workData]);

  const callSetWorkData = (key, value) => {
    setWorkData({
      ...workData,
      [key]: value,
    });
  };

  const handleImageChange = (e) => {
    console.log("e: ", e);

    callSetWorkData("creatorId", accountData.id);
    // 現在のFileListを維持するために新しいDataTransferを作成
    let dt = new DataTransfer();

    // 既存のimageFilesをDataTransferに追加
    imageFiles.forEach((file) => {
      for (let i = 0; i < e.length; i++) {
        console.log("length", i);
        console.log("name", e[i].name);
        // console.log("file.name",file.name);
        if (file.name == e[i].name) {
          console.log("file.name", file.name);
          console.log("file.name", file);
          dt.items.add(file);
          console.log("Image:", dt.files);
        }
      }
    });
    // 新しいFileListを状態に設定
    setImage(dt.files);
    console.log("Image: ", Image);

    if (e.length == 0) {
      dt.clearData();
      setImage(dt.file);
      console.log("dt", dt.files);
    }
  };

  useEffect(() => {
    console.log("imageFiles updated: ", imageFiles);
    console.log(Array.isArray(imageFiles)); // trueなら配列です
    let dt = new DataTransfer();
    console.log("dt: ",dt);

    // 既存のimageFilesをDataTransferに追加
    imageFiles.forEach((file) => {
      dt.items.add(file);
      console.log("imageFiles: ", dt.files[0].type);
    });
    setImage(dt.files);
  }, [imageFiles]);

  const handleChange = (event) => {
    const url = event.target.value;
    setVideoUrl(url);
    setHasError(url === "");

    // 入力が空の場合、videoIdをリセットしてYoutubeURLをクリア
    if (url === "") {
      setVideoId(""); // videoIdを空にリセット
      callSetWorkData("YoutubeURL", ""); // YoutubeURLもリセット
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
      callSetWorkData("YoutubeURL", extractedVideoId); // 最新のvideoIdを反映
    }
  };

  const WorkSubmit = async (e) => {
    e.preventDefault();
    console.log("e", e.target);
    async function PostData() {
      if (
        !workData.WorkTitle ||
        !workData.WorkGenre ||
        !workData.Introduction ||
        !workData.Obsession ||
        !imageFiles.length // 画像がアップロードされているかを確認
      ) {
        alert("エラー：未入力項目があります。");
        return;
      }
      const formData = new FormData();

      // formDataに画像データを1個追加
      // Imageに入っているデータの形がfileListのため、mapやforEachでループできない
      // imageFilesが配列として扱える場合
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append("images[]", Image[i]);
        formData.append("annotation[]", Description[i].description);
      }

      for (const key in workData) {
        formData.append(key, workData[key]);
      }
      // formData.entries()の中身を確認
      for (let pair of formData.entries()) {
        // ファイル名が 'images[]' で、File オブジェクトの場合のみ詳細を表示
        console.log(`${pair[0]}: `, pair[1]);

        if (pair[1] instanceof File) {
          // Fileオブジェクトの詳細を表示
          console.log(
            "File details - name:",
            pair[1].name,
            "size:",
            pair[1].size,
            "type:",
            pair[1].type
          );
        }
      }

      try {
        const response = await axios.post(
          "http://localhost:8000/work_posting",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(formData);
        navigation("/WorkSelect");
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
      !workData.WorkTitle ||
      !workData.WorkGenre ||
      !workData.Introduction ||
      !workData.Obsession ||
      !FileList
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
      <div className="WorkPostingFormContainer">
        <form onSubmit={WorkSubmit} method="post" id="youtubeForm">
          <h3>作品投稿</h3>
          <div className="WorkPostingUiForm">
            <div className="ImageUpload">
              <div className="Image">
                <div className="WorkPostingFormField">
                  <YoutubeURL
                    onChange={handleChange}
                    value={videoUrl}
                    error={hasError}
                  />
                </div>
                {videoId ? (
                  <p>
                    <br />
                  </p>
                ) : (
                  <p>
                    YouTubeのURL、ID、またはiframeコードを入力してください。
                  </p>
                )}
                <div className="WorkPostingImageFormField">
                  <ImageUpload
                    onImagesUploaded={handleImageChange}
                    callSetImage={callSetImage}
                    handleValueChange={handleValueChange}
                  />
                </div>
              </div>
            </div>
            <div className="WorkInformation">
              <div className="WorkPostingFormField">
                <WorkTitle callSetWorkData={callSetWorkData} />
              </div>
              {/* ジャンル */}
              <div className="WorkPostingFormField">
                <div className="workGenre" id="workGenre">
                  <p className="work_genre">
                    ジャンル*
                    {/* ジャンル&nbsp;<span className="red_txt">必須</span>
                    &nbsp;
                    <span className="alert_red_txt" id="alert_a_3">
                      タグを入れてください
                    </span> */}
                  </p>
                  <WorkGenre callSetWorkData={callSetWorkData} />
                </div>
              </div>
              <br />
              <div className="WorkPostingFormField">
                <Introduction callSetWorkData={callSetWorkData} />
              </div>
              <div className="WorkPostingFormField">
                <Obsession callSetWorkData={callSetWorkData} />
              </div>
              <div className="WorkPostingFormField">
                <p>
                  プログラミング言語
                  <Language callSetWorkData={callSetWorkData} />
                </p>
              </div>
              <div className="WorkPostingFormField">
                <p>
                  開発環境
                  <Environment callSetWorkData={callSetWorkData} />
                </p>
              </div>
            </div>
          </div>
          <input type="submit" value="送信" className="WorkSubmit" />
        </form>
        {message && <p>{message}</p>}
      </div>
      {/* </Modal> */}
    </div>
  );
};

export default WorkPosting;
