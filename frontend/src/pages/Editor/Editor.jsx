import { useEffect, useState, useRef } from "react";
import "./Editor.css";
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';


// プラグインのインポート
import EditorJS from "@editorjs/editorjs";
import Title from "title-editorjs";
import Paragraph from "editorjs-paragraph-with-alignment";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import Raw from "@editorjs/raw";
import Header from "editorjs-header-with-anchor";
import Quote from "@editorjs/quote";
import InlineCode from "@editorjs/inline-code";
import TextVariantTune from "@editorjs/text-variant-tune";
import createGenericInlineTool, { UnderlineInlineTool } from "editorjs-inline-tool";
import Alert from "editorjs-alert";
import ToggleBlock from "editorjs-toggle-block"; //アコーディオンメニューができる
import EditorjsNestedChecklist from "@calumk/editorjs-nested-checklist";
import IndentTune from 'editorjs-indent-tune'; //インデントを1個ずつ決められる
import NoticeTune from 'editorjs-notice';
import Strikethrough from '@sotaproject/strikethrough'; //取り消し線
import ColorPlugin from 'editorjs-text-color-plugin'; //テキストのカラーを変更できる(現在赤と黄色しか選べない)
import Tooltip from 'editorjs-tooltip'; //ホバーすると操作方法や注釈を表示する
import ChangeCase from 'editorjs-change-case'; //大文字と小文字を変更
import Hyperlink from 'editorjs-hyperlink';
import Button from 'editorjs-button';
import Code from '@rxpm/editor-js-code';
import ImageTool from 'editorjs-image-with-link'; //トリミングはできないが、Cropper.jsを使用する
import SKMFlipBox from 'skm-flipbox'; //画像のスライドができるカルーセル
import AudioPlayer from 'editorjs-audio-player'; //音声を挿入できる
import ImageGallery from '@rodrigoodhin/editorjs-image-gallery';
import Carousel from 'editorjs-carousel';


//MUIアイコン
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import CancelIcon from '@mui/icons-material/Cancel';
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ErrorIcon from '@mui/icons-material/Error';
import NewsMenuTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Helmet } from 'react-helmet-async';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

//データ保存
import axios from "axios";

//ルーティング
import { useNavigate } from 'react-router-dom';

//過去に投稿したニュースを取得
import specialCompanyNewsItem from "src/_mock/specialCompanyNewsItem";
import NewsMenu from "./clickedmenu/NewsMenu"


const Editor = () => {

  const editorInstance = useRef(null);
  const fileInputRef = useRef(null); // ファイル入力の参照を定義
  const editorHolder = useRef(null);
  const [imageUrl, setImageUrl] = useState(null); // 画像のURLを保持するステート
  const [displayInput, setDisplayInput] = useState(true); // input要素の表示状態を管理するステート
  const [title, setTitle] = useState('');
  const [csrfToken, setCsrfToken] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [news_id, setNewsId] = useState(0); // ニュースの情報が格納されているDBのidを格納する
  const [draft_list, setDraftList] = useState([]); // ニュースの下書きリストを保持するステート
  const [selected_draft, setSelectedDraft] = useState(null); // 選択された下書きを保持するステート
  const [newsmenushow, setNewsMenuShow] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [usedImages, setUsedImages] = useState(null);
  const [newsContent, setNewsContent] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [NewsValue,setNewsValue] = useState(null);
  const news_save_url = "http://127.0.0.1:8000/news_save";
  const thumbnail_image_save_url = "http://127.0.0.1:8000/thumbnail_image_save";

  const csrf_url = "http://localhost:8000/csrf-token";
  const navigate = useNavigate();
  const { genre } = useParams();
  console.log(genre);

  // style CSS ここから
  const buttonStyle = {
    display: "block",
    margin: 4,
    "&:hover": {
      backgroundColor: "#a9a9a9",
    },
  };


  // style CSS ここまで


  //ニュースを投稿した際の処理
  const news_upload = async () => {
    alert("ニュースを投稿しました");

    try {
      if (!editorInstance.current || typeof editorInstance.current.save !== "function") {
        console.error("Editor instance or save function not available");
        return;
      }

      //採用担当者からの一言メッセージを変数に入れる


      const outputData = await editorInstance.current.save();

      console.log("sessionId", sessionId);
      console.log("news_id", news_id);
      console.log("title", title);
      console.log("header_img", imageUrl);
      console.log("outputData", outputData);
      console.log("newsContent", newsContent);

      // websocketサーバーに送信
      const response = await axios.post(
        "http://localhost:3000/news_upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: {
            company_id: sessionId, // 企業ID
            news_id: news_id,     //ニュースid
            title: title,     //ニュースタイトル
            header_img: imageUrl, //ニュースサムネイル画像
            value: outputData,  //ニュースの内容
            message: newsContent, //採用担当者からの一言メッセージ
            genre: genre
          },
        }
      );

      console.log(response.data.id);
      console.log(response.data);
      console.log("成功");
      navigate(`/Internship_JobOffer?page=${genre}`);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const titlechange = (event) => {
    setTitle(event.target.value); // テキストエリアの値をstateに反映
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setNewsContent(newValue);
    console.log("newValue", newValue);
  }

  const notification_messagehandleChange = (e) =>{
    const newValue = e.target.value;
    setNewsContent(newValue);
    console.log("newValue",newValue);
}




  // 下書きを新規保存・更新する処理
  const news_save = async () => {
    try {
      console.log(title);

      if (!editorInstance.current || typeof editorInstance.current.save !== "function") {
        console.error("Editor instance or save function not available");
        return;
      }

      const outputData = await editorInstance.current.save();
      console.log("Article data: ", outputData);
      console.log(sessionId);
      console.log(news_id);
      console.log(newsContent);
      console.log(genre);

      const response = await axios.post(news_save_url, {
        value: outputData,    // ニュース記事
        title: title,     // タイトル
        news_id: news_id,     // ID
        message: newsContent, //通知に添えるメッセージ
        company_id: sessionId, // 企業ID
        genre: genre //ジャンル
      }, {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
      });

      setDraftList(response.data.news_draft_list); // 下書きリスト最新に更新
      setNewsId(response.data.id); // news_idを更新する
      setNewsValue(outputData); //エディタの内容を更新する
      setIsSaved(true); // 保存済みとして状態を設定
      console.log("成功");
      alert("下書きを保存しました!");
      return response.data; // 保存されたnews_idを返す
    } catch (error) {
      console.error("Error:", error);
    }
  };











  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const contents_image_save_url = "http://localhost:8000/contents_image_save";
    try {
      const response = await axios.post(contents_image_save_url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return { success: 1, file: { url: response.data.url } };
      } else {
        return { success: 0, message: 'Failed to upload image' };
      }
    } catch (error) {
      console.error(error);
      return { success: 0, message: 'Failed to upload image', error };
    }
  };

  const handleImageDelete = async () => {
    console.log("削除しました!");
  }


  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file && csrfToken) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('news_id', news_id);
      formData.append('session_id', sessionId);

      console.log('file', file);
      console.log('news_id', news_id);
      console.log('session_id', sessionId);

      try {
        const response = await axios.post(thumbnail_image_save_url, formData, {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
        const path = response.data.image;
        const id = response.data.id;
        const news_draft_list = response.data.news_draft_list;
        console.log(path);
        console.log(id)
        setDraftList(news_draft_list); //下書きリスト最新に更新
        setNewsId(id);
        setImageUrl(path);
        setDisplayInput(false);
        console.log("成功");
      } catch (error) {
        console.error("データの取得中にエラーが発生しました", error);
      }
    }
  };

  const rewrite_news = async(id) => {
    //ニュースメニューを閉じる
    closeModal("NewsMenu");
    // ドラフトリストから選択したIDのアイテムを取得
    const select_draft_list = draft_list.find(d => d.id === id);
    console.log('Selected draft:', select_draft_list);
    if (!select_draft_list) {
      console.error("Draft not found for ID:", id);
      console.log('Selected draft:', selected_draft); // デバッグ用
      return;
    }

    // 取得したアイテムを状態にセット
    setSelectedDraft(select_draft_list);
    // タイトルや画像URLを状態にセット
    setTitle(select_draft_list.article_title); // タイトル上書き
    if (!select_draft_list.header_img || select_draft_list.header_img.trim() === '') {
      // header_img が null、undefined、または空文字列の場合
      setImageUrl("");
      setDisplayInput(true);
      console.log("画像NULL");
      console.log("画像パス",select_draft_list.header_img);
    } else {
      // header_img が空でない場合
      setImageUrl(select_draft_list.header_img); // ヘッダー画像上書き
      setDisplayInput(false);
      console.log("画像NULLじゃない");
      console.log("画像パス",select_draft_list.header_img);
    }

    // エディタの内容を更新
    if (editorInstance.current && typeof editorInstance.current.render === "function") {
      try {
        console.log("カレント", editorInstance.current);
        // select_draft_list.summaryがエディタが理解できる形式であることを確認
        const content = select_draft_list.summary ? JSON.parse(select_draft_list.summary) : {};
        editorInstance.current.render(content); // エディタにデータをセット
        console.log("コンテンツ", content);
        await editorInstance.current.save();
        await countChars(); //countChars関数を用いて、最初から記事の内容を書いている場合、その文字数を反映させる
      } catch (error) {
        console.error("Error parsing or rendering content:", error);
      }
    } else {
      console.log("Editor instance or render function not available");
    }
    // news_idをセット
    setNewsId(select_draft_list.id);

  };

  const rewrite_news_delete = async (id) => {
    confirm("本当に削除しますか");
    if (confirm && id) {
      console.log("delete_id", id);
      console.log("company_id", sessionId);
      try {
        const response = await axios.post(
          `http://localhost:8000/rewrite_news_delete`,
          {
            delete_id: id,
            company_id: sessionId,
          }
        );
        console.log(response.data);
        setDraftList(response.data.news_draft_list); // 下書きリスト最新に更新
        alert("削除しました");
      } catch (error) {
        console.error("Error sending data!", error);
      }
    }

  };

  //エディタの編集状況を見て、チェックボックスで表示する
  const EditorStatusCheck = (check_element) => {
    return (
      <NewsMenuTable>
        <TableBody>
          <TableRow>
            <TableCell>
              {check_element ? (
                <CheckBoxIcon color="primary" aria-label="設定完了しています" />
              ) : (
                <ErrorIcon color="error" aria-label="設定完了していません" />
              )}
            </TableCell>
            <TableCell>
              {check_element ? (
                <p>設定完了しています</p>
              ) : (
                <p>設定完了していません</p>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </NewsMenuTable>
    );
  };

  //エディタのコンテンツを見て、チェックボックスで表示する
  const EditorContentsStatusCheck = () => {
    return (
      <NewsMenuTable>
        <TableBody>
          <TableRow>
            <TableCell>
              {charCount ? (
                <CheckBoxIcon color="primary" aria-label="設定完了しています" />
              ) : (
                <ErrorIcon color="error" aria-label="設定完了していません" />
              )}
            </TableCell>
            <TableCell>
              {charCount ? (
                <p>現在の文字数: {charCount}文字</p>
              ) : (
                <p>テキストが打ち込まれていません</p>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {usedImages && usedImages.length > 0 ? (
                <CheckBoxIcon color="primary" aria-label="設定完了しています" />
              ) : (
                <QuestionMarkIcon color="error" aria-label="設定完了していません" />
              )}
            </TableCell>
            <TableCell>
              {usedImages && usedImages.length > 0 ? (
                <>
                  <p>使用画像</p>
                  <ShowUsedImages usedImages={usedImages} />
                </>
              ) : (
                <p>画像を使用していません</p>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </NewsMenuTable>
    );
  };


  const ShowUsedImages = ({ usedImages }) => {
    if (!Array.isArray(usedImages)) {
      console.error('usedImagesは配列ではありません:', usedImages);
      return <p>画像のデータにエラーがあります</p>;
    }

    // 画像を2枚ずつのグループに分ける
    const rows = [];
    for (let i = 0; i < usedImages.length; i += 2) {
      rows.push(usedImages.slice(i, i + 2));
    }

    return (
      <>
        {usedImages.length > 0 ? (
          <NewsMenuTable>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((imageObj, index) => (
                    <TableCell key={index} align="center">
                      <img
                        src={imageObj}
                        alt={`使用された画像 ${index + 1}`}
                        style={{ maxWidth: '100px', height: 'auto' }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </NewsMenuTable>
        ) : (
          <p>画像が使用されていません</p>
        )}
      </>
    );
  };

  ShowUsedImages.propTypes = {
    usedImages: PropTypes.arrayOf(PropTypes.string).isRequired
  };

  //テキストの文字数(テーブルやリスト・コードなど)使用したプラグインの名前を格納
  const countChars = async () => {
    console.log("countChars関数のニュース内容",editorInstance.current);
    if (editorInstance.current) {
      const outputData = await editorInstance.current.save();
      let text = '';
      let image = '';
      console.log("外部データ", outputData);
      console.log("ブロック", outputData.blocks);
      let usedImages = new Set(); // 使用した画像を格納

      outputData.blocks.forEach(block => {
        if (['paragraph', 'header', 'list', 'quote', 'title', 'toggle'].includes(block.type)) {
          text += block.data.text || '';
        }

        switch (block.type) {
          case 'alert':
            text += block.data.message || '';
            break;
          case 'raw':
            text += block.data.html || '';
            break;
          case 'code':
            text += block.data.code || '';
            break;
          case 'table':
            // テーブルブロックの各セルの文字をカウント
            block.data.content.forEach(row => {
              row.forEach(cell => {
                text += cell || '';
              });
            });
            break;
          case 'nestedchecklist':
            block.data.items.forEach(item => {
              text += item.content || '';
            });
            break;
          case 'checklist':
            block.data.items.forEach(item => {
              text += item.text || '';
            });
            break;
          //画像
          case 'image':
            image = block.data.file.url;
            console.log("画像URL", image);
            usedImages.add(image);
            break;
        }
      });

      const plainText = text
        .replace(/&nbsp;/g, ' ') //空白を取り除く
        .replace(/<\/?s[^>]*>/g, "") // <s>タグを取り除く
        .replace(/<\/?mark[^>]*>/g, "")  // <mark>タグを取り除く
        .replace(/<\/?font[^>]*>/g, "")  // <font>タグを取り除く
        .replace(/<\/?u[^>]*>/g, "")  // <u>タグを取り除く
        .replace(/<\/?code[^>]*>/g, "")  // <u>タグを取り除く
        .replace(/<\/?a[^>]*>/g, "")  // <a>タグを取り除く
        .replace(/\s+/g, '') // すべてのスペースや空白を取り除く
        .replace(/&lt;.*?&gt;/g, "");  // エスケープされたHTMLタグを取り除く

      console.log("文字数", plainText.length);
      console.log("文字", text);
      console.log("リプレイス後の文字", plainText);
      setCharCount(plainText.length); // 文字数を設定
      setNewsValue(outputData);
      // 使用された画像を配列に変換
      const usedImagesArray = Array.from(usedImages);
      console.log("使用された画像", usedImagesArray);
      setUsedImages(usedImagesArray);
    }
  };

  const postsFrominternshipJobOffer = specialCompanyNewsItem();
  console.log("postsFromCompany", postsFrominternshipJobOffer);

  const create_form_jump = async () => {
    if (!isSaved) {
      const savedNewsData = await news_save(); // 保存されていなければ保存してから取得
      if (savedNewsData) {
        SessionStoragePush()
        navigate(`/CreateForm/${savedNewsData.id}`);
      }
    } else {
      // すでに保存されている場合、保存したnews_idを使用してそのまま遷移
      // 応募フォーム作成ページからニュース記事編集ページに戻る際にデータをセッションストレージに入れて、行き来ができるようにする
      SessionStoragePush()
      navigate(`/CreateForm/${news_id}`);
    }
  };

  //ニュースデータをセッションストレージに入れる関数
  const SessionStoragePush = () => {
    const sessionData = {
      imageUrl,
      displayInput,
      title,
      sessionId,
      news_id,
      draft_list,
      selected_draft,
      NewsValue,
      charCount,
      usedImages,
      newsContent,
      genre,
    };

    sessionStorage.setItem("editorSessionData", JSON.stringify(sessionData)); // 一つのオブジェクトにまとめて保存

    console.log("SessionStoragePush通りました");
  };

  useEffect(() => {


    async function getSessionId() {
      try {
        // Get data from sessionStorage
        const dataString = sessionStorage.getItem("accountData");
        if (dataString) {
          const dataObject = JSON.parse(dataString);
          if (dataObject) {
            setSessionId(dataObject.id);
          }
        }
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    }
    getSessionId(); // ページがロードされた時点でsessionstorageからidを取得

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


    if (editorHolder.current) {
      console.log("editorHolder.current入りました");
      editorInstance.current = new EditorJS({
        holder: editorHolder.current,
        onChange: countChars,
        placeholder: "コンテンツを入力してください",
        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            tunes: ["textVariant", "indentTune", "noticeTune"],
          },
          embed: {
            class: Embed,
            config: {
              services: {
                facebook: true,  //このfacebook投稿は利用できません。削除されたか、プライバシー設定が変更された可能性があります。と表示され埋め込みできない
                instagram: true, //埋め込み可能
                youtube: true,  //埋め込み可能
                twitter: true,  //埋め込み可能
                twitch: true,
                miro: true,
                vimeo: true,
                gfycat: true,
                imgur: true,
                vine: true,
                aparat: true,
                codepen: true,
                pinterest: true,
                github: true,
                coub: true,
                note: {
                  regex: /https?:\/\/note\.com\/[^/]+\/n\/([^/?]+)/,
                  embedUrl: '/api/embed/?url=<%= remote_id %>',
                  html: "<iframe height='150' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
                  height: 150,
                  width: 600,
                  id: (groups) => groups.join(''),
                },
                ogp: {
                  regex: /(https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+)/,
                  embedUrl: '/api/embed/?url=<%= remote_id %>',
                  html: "<iframe height='150' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
                  height: 150,
                  width: 600,
                  id: (groups) => groups.join(''),
                },
              },
            },
          },
          Color: {
            class: ColorPlugin,
            config: {
              colorCollections: [
                "#FF1300",
                "#EC7878",
                "#9C27B0",
                "#673AB7",
                "#3F51B5",
                "#0070FF",
                "#03A9F4",
                "#00BCD4",
                "#4CAF50",
                "#8BC34A",
                "#CDDC39",
                "#FFF"
              ],
              defaultColor: "#FF1300",
              type: "text",
              customPicker: true,
            }
          },
          Marker: {
            class: ColorPlugin,
            config: {
              defaultColor: '#FFBF00',
              type: 'marker',
              icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`
            }
          },
          table: {
            class: Table,
            inlineToolbar: true,
          },
          code: {
            class: Code,
            inlineToolbar: true,
            config: {
              modes: {
                'js': 'JavaScript',     // JavaScript
                'py': 'Python',         // Python
                'java': 'Java',         // Java
                'cpp': 'C++',           // C++
                'cs': 'C#',             // C#
                'php': 'PHP',           // PHP
                'rb': 'Ruby',           // Ruby
                'go': 'Go',             // Go
                'ts': 'TypeScript',     // TypeScript
                'swift': 'Swift',       // Swift
                'kt': 'Kotlin',         // Kotlin
                'rs': 'Rust',           // Rust
                'md': 'Markdown',       // Markdown
                'html': 'HTML',         // HTML
                'css': 'CSS',           // CSS
                'sql': 'SQL',           // SQL
                'sh': 'Shell',          // Shell
                'r': 'R',               // R
                'scala': 'Scala',       // Scala
                'perl': 'Perl',         // Perl
                'dart': 'Dart',         // Dart
              },
              defaultMode: 'js'
            }
          },
          carousel: {
            class: Carousel,
            inlineToolbar: true,
            config: {
              uploader: {
                uploadByFile: handleImageUpload,
              },
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: handleImageUpload,
                uploadByURL: handleImageUpload,
                deleteByFile: handleImageDelete,
              },
            },
          },
          slide: {
            class: SKMFlipBox,
            inlineToolbar: true,
          },
          audioPlayer: {
            class: AudioPlayer,
            inlineToolbar: true,
          },
          imageGallery: {
            class: ImageGallery,
            inlineToolbar: true,
            config: {
              placeholder: "画像アドレスをコピーして貼付してください(最後はjpg)",
              actions: {
                "Edit Images": '画像URLを表示・非表示',
                "Activate/Deactivate dark mode": 'ダークモードを有効化/無効化',
                "Default layout": 'デフォルトのレイアウト',
                "Set horizontal layout": '水平レイアウト',
                "Set square layout": '正方形レイアウト',
                "Set layout with gap": '隙間のあるレイアウト',
                "Set layout with fixed size": '固定サイズのレイアウト',
              }
            },
          },
          raw: {
            class: Raw,
            inlineToolbar: true,
            config: {
              placeholder: "HTMLのコードを書いてください",
            },
          },
          header: {
            class: Header,
            config: {
              placeholder: "Enter a header",
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 3,
              allowAnchor: true,
              anchorLength: 100,
            },
          },
          title: {
            class: Title,
            inlineToolbar: true,
          },
          alert: {
            class: Alert,
            inlineToolbar: true,
            config: {
              alertTypes: [
                "primary",
                "secondary",
                "info",
                "success",
                "warning",
                "danger",
                "light",
                "dark",
              ],
              defaultType: "primary",
              messagePlaceholder: "Enter something",
            },
          },
          quote: Quote,
          checklist: CheckList,
          delimiter: Delimiter,
          inlineCode: InlineCode,
          textVariant: TextVariantTune,
          noticeTune: NoticeTune,
          indentTune: {
            class: IndentTune,
            config: {
              customBlockIndentLimits: {
                someOtherBlock: { max: 5 },
              },
              maxIndent: 10,
              indentSize: 30,
              multiblock: true,
              tuneName: 'indentTune',
            }
          },
          bold: {
            class: createGenericInlineTool({
              sanitize: {
                strong: {},
              },
              shortcut: "CMD+B",
              tagName: "STRONG",
              toolboxIcon: '<span style="font-weight: bold;">B</span>',
            }),
          },
          italic: {
            class: createGenericInlineTool({
              sanitize: {
                italic: {},
              },
              shortcut: "CMD+L",
              tagName: "I",
              toolboxIcon: '<span style="font-weight: bold;">L</span>',
            }),
          },
          underline: UnderlineInlineTool,
          toggle: {
            class: ToggleBlock,
            inlineToolbar: true,
            config: {
              placeholder:
                "この機能で、\n折りたたみメニュー(アコーディオンメニュー)を作成できます",
            },
          },
          tooltip: {
            class: Tooltip,
            inlineToolbar: true,
            config: {
              location: 'left',
              underline: true,
              placeholder: '注釈を書いてください',
              highlightColor: '#FFEFD5',
              backgroundColor: '#154360',
              textColor: '#FDFEFE',
              holder: 'editor',
            }
          },
          strikethrough: {
            class: Strikethrough,
            inlineToolbar: true,
          },
          changeCase: {
            class: ChangeCase,
            inlineToolbar: true,
            config: {
              showLocaleOption: true,
              locale: 'ja'
            }
          },
          hyperlink: {
            class: Hyperlink,
            config: {
              shortcut: 'CMD+L',
              target: '_blank',
              rel: 'nofollow',
              availableTargets: ['_blank', '_self'],
              availableRels: ['author', 'noreferrer'],
              validate: false,
            }
          },
          button: {
            class: Button,
            inlineToolbar: true,
            config: {
              css: {
                btnColor: "btn--gray",
                btnBorder: "solid",
              },
              textValidation: (text) => {
                // ボタンテキストが空でないことを確認する
                if (text.trim() !== "") {
                  return true;
                } else {
                  console.log("error! Button text is empty.");
                  return false;
                }
              },
              linkValidation: (text) => {
                // リンクURLがhttp://またはhttps://で始まることを確認する
                if (text.startsWith("https://") || text.startsWith("http://")) {
                  return true;
                } else {
                  console.log("error! Invalid URL:", text);
                  return false;
                }
              }
            }
          },
          nestedchecklist: EditorjsNestedChecklist,
        },
        tunes: ["indentTune", "noticeTune"],
        autofocus: true,
        i18n: {
          messages: {
            ui: {
              blockTunes: {
                toggler: {
                  "Click to tune": "クリックして調整",
                  "or drag to move": "またはドラッグして移動",
                  "Move up": "上に移動する",
                  "Move down": "下に移動する",
                  "Delete": "削除",
                },
              },
              inlineToolbar: {
                converter: {
                  "Convert to": "変換",
                },
              },
              toolbar: {
                toolbox: {
                  Add: "追加",
                },
              },
            },
            tools: {
              noticeTune: {
                'Notice caption': '強調表示をする'
              },
              hyperlink: {
                Save: 'Salvar',
                'Select target': 'Seleziona destinazione',
                'Select rel': 'Wählen rel'
              },
              button: {
                'Button Text': 'ボタンに表示するテキスト',
                'Link Url': 'ボタンのジャンプ先のURL',
                'Set': "設定する",
                'Default Button': "デフォルト",
              },
              textVariant: {
                'Call-out': 'コールアウト',
              },
            },
            toolNames: {
              //メニュー
              Text: "テキスト",
              Table: "テーブル",
              Code: "コード",
              Carousel: "カルーセル",
              Image: "画像",
              FlipBox: "スライド(テキストのみ)",
              AudioPlayer: "オーディオ",
              "Image Gallery": "画像ギャラリー",
              "Raw HTML": "HTML",
              Heading: "見出し",
              Title: "タイトル",
              Alert: "警告",
              Quote: "引用",
              Checklist: "チェックリスト",
              Delimiter: "区切り",
              Toggle: "折りたたみメニュー",
              Button: "ボタン",
              "Nested Checklist": "リスト",
              Embed: "埋め込み",

              //サブメニュー
              Bold: "太字",
              Italic: "斜体",
              Link: "リンク",
              Color: "カラー",
              Marker: "マーカー",
              InlineCode: "インラインコード",
              Underline: "下線",
              Tooltip: "ツールチップ",
              Strikethrough: "取り消し線",
              ChangeCase: "大文字:小文字 変換",
              Hyperlink: 'ハイパーリンク',
            },
          },
        },
      });
    }

  }, []); // 空の依存配列を渡して初回のみ実行

  useEffect(() => {
    async function newsDraftList() {
      if (sessionId) {
        const news_draft_list_url = `http://localhost:8000/news_draft_list/${sessionId}`;
        console.log(news_draft_list_url);
        try {
          const response = await axios.get(news_draft_list_url);
          console.log("ドラフトリスト:", response.data); // 配列そのものが返ってくる
          setDraftList(response.data); // 直接配列をセット
        } catch (error) {
          console.error("Error fetching news draft list:", error);
        }
      }
    }

    newsDraftList();
  }, [sessionId]); // sessionIdが変更されたときに実行される

// ページ遷移後にエディタのデータを復元
useEffect(() => {
  const SessionStoragePull = async () => {
    const editorSessionData = JSON.parse(sessionStorage.getItem("editorSessionData"));
    if (editorSessionData) {
      // 各状態を設定
      setImageUrl(editorSessionData.imageUrl);
      setDisplayInput(editorSessionData.displayInput);
      setTitle(editorSessionData.title);
      setSessionId(editorSessionData.sessionId);
      setNewsId(editorSessionData.news_id);
      setDraftList(editorSessionData.draft_list);
      setSelectedDraft(editorSessionData.selected_draft);
      setNewsValue(editorSessionData.NewsValue);
      setUsedImages(editorSessionData.usedImages);
      setCharCount(editorSessionData.charCount);
      setNewsContent(editorSessionData.newsContent);
      console.log("ニュースの内容", editorSessionData.NewsValue);
      console.log("エディタインスタンスカレント", editorInstance.current);

      if (editorInstance.current) {
        console.log("Editor instance available:", editorInstance.current);
        try {
          // isReadyが解決するのを待つ
          await editorInstance.current.isReady;

          // renderを呼び出す
          await editorInstance.current.render(editorSessionData.NewsValue);
          await editorInstance.current.save();
          console.log("ここ通ってます");
        } catch (error) {
          console.error("Error rendering or saving editor content:", error);
        }
      } else {
        console.error("Editor instance is not initialized");
      }
    } else {
      console.error("No saved editor data found in session storage");
    }

    sessionStorage.removeItem("editorSessionData");
  };
  SessionStoragePull();
}, [])

  // 画像を削除する処理
  const thumbnail_img_delete = async () => {
    if (fileInputRef.current) {
      console.log("fileInputRef.current", fileInputRef.current);
      console.log("value", fileInputRef.current.value);
      fileInputRef.current.value = null; // ファイル入力の値をリセット
      const header_img_delete_url = `http://localhost:8000/thumbnail_img_delete/${news_id}`;
      console.log(news_id);
      console.log(header_img_delete_url);
      console.log(sessionId);
      try {
        const response = await axios.get(header_img_delete_url, {
          params: {
            Company_Id: sessionId,
          },
        });
        if (response.data.success) {
          setImageUrl(null); // 画像URLをリセット
          setDisplayInput(true);// ファイルアップロードアイコン表示

          // ドラフトリストを更新する
          setDraftList(prevDraftList =>
            prevDraftList.map(draft =>
              draft.id === news_id ? { ...draft, header_img: null } : draft
            )
          );
        }
      } catch (error) {
        console.error("画像削除中にエラーが発生しました:", error);
      }
    }
  };


  const NewsMenuShow = () => {
    setNewsMenuShow(true);
    console.log("開く");
    document.body.style.overflow = 'hidden';
  }

  const closeModal = () => {
    setNewsMenuShow(false);
    console.log("閉じる");
    document.body.style.overflow = 'auto';
  };


  const getNewsTitle = () => {
    let NewsTitle;
    console.log(genre);

    if (genre === "Blog") {
      NewsTitle = "ブログニュースの編集";
    } else if (genre === "Internship") {
      NewsTitle = "インターンニュースの編集";
    } else if (genre === "JobOffer") {
      NewsTitle = "求人ニュースの編集";
    } else if (genre === "Session") {
      NewsTitle = "説明会ニュースの編集";
    }

    return (
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{NewsTitle}</Typography>
      </Stack>
    );
  };



  return (
    <div>
      <Helmet>
        <title>ニュースの投稿 | Work&Connect</title>
      </Helmet>

      {getNewsTitle()}

      {/* アップロードされた画像の表示 */}
      {imageUrl &&
      (
        <div className="uploaded-image" id="uploaded-image">
          <img src={`${imageUrl}`} alt="Uploaded" style={{ width: '100%', height: '300px' }} />
          <CancelIcon onClick={thumbnail_img_delete} />
        </div>
      )}


      {/* 画像を選ぶ */}
      <form>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
      </form>


      <Stack direction="row" alignItems="center" spacing={1}>
        <MUIButton onClick={NewsMenuShow} variant="contained" sx={buttonStyle}>
          ニュースメニュー
        </MUIButton>
      </Stack>

      {/* /* 関数の場合は大文字、変数の場合は最初小文字 */}
      <NewsMenu
        IsOpen={newsmenushow}   //モーダルを開く関数
        CloseModal={closeModal} // モーダルを閉じる関数
        genre={genre}  //説明会・ブログなどのジャンル
        draftlist={draft_list} //下書きリストの配列
        CreateFormJump = {create_form_jump} //ニュースを保存後に応募フォーム作成画面に遷移する
        newsid = {news_id} //ニュースのID
        RewriteNewsDelete = {rewrite_news_delete} //下書きニュースを削除する関数
        RewriteNewsEnter = {rewrite_news}
        EditorStatusCheck = {EditorStatusCheck}
        EditorContentsStatusCheck = {EditorContentsStatusCheck}
        NewsSave = {news_save}
        handleChange = {handleChange}
        imageUrl = {imageUrl}
        title = {title}
        NewsUpLoad = {news_upload}
        NotificationMessageHandleChange = {notification_messagehandleChange}
        message = {newsContent}
        charCount = {charCount}
      />


      <ImageSearchIcon
        className="cover_img_upload"
        style={{ display: displayInput ? 'block' : 'none' }}
        onClick={() => document.getElementById('fileInput').click()}
      />

      <textarea
        className="editor_title"
        id="editor_title"
        wrap="soft"
        placeholder="記事タイトル"
        value={title} // 状態の値をテキストエリアにセット
        onChange={titlechange} // テキストエリアの変更を監視し、stateを更新
      />

      <div className="editor-wrapper">
        <div ref={editorHolder} id="editor"/>
      </div>
    </div>
  );
};

export default Editor;