import 'survey-core/defaultV2.min.css';
import { useState, useEffect, forwardRef } from "react";
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import "./CreateForm.css";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import Modal from "react-modal";

//ルーティング
import { useNavigate } from 'react-router-dom';


// フォームメニュー
import Text from "./SelectOptionMenu/Text";
import DateForm from "./SelectOptionMenu/Date";
import Number from "./SelectOptionMenu/Number";
import Radio from "./SelectOptionMenu/Radio";
import FormDesign from "./SelectOptionMenu/FormDesign";
import DropDown from "./SelectOptionMenu/DropDown";
import CheckBox from "./SelectOptionMenu/CheckBox";
import Boolean from "./SelectOptionMenu/Boolean";
import Comment from "./SelectOptionMenu/Comment";
import Rating from "./SelectOptionMenu/Rating";
import Ranking from "./SelectOptionMenu/Ranking";
import ImagePicker from "./SelectOptionMenu/ImagePicker";



// MUI
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TranslateIcon from '@mui/icons-material/Translate';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import MoneyIcon from '@mui/icons-material/Money';
import RadioIcon from '@mui/icons-material/Radio';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
// import BrushIcon from '@mui/icons-material/Brush';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FlakyIcon from '@mui/icons-material/Flaky';
import NotesIcon from '@mui/icons-material/Notes';
import AssessmentIcon from '@mui/icons-material/Assessment';
import StarIcon from '@mui/icons-material/Star';
import BurstModeIcon from '@mui/icons-material/BurstMode';

// データ保存
import axios from "axios";

const PostCard = forwardRef(({ post },) => {
  const { create_form, news_id, article_title } = post;

  console.log("クリエイトフォーム", create_form);

  // Form の内容を useState にセットする例
  const [questions, setQuestions] = useState(create_form); // 配列を初期値として設定

  // const [survey, setSurvey] = useState(null); // Survey モデルを state に保存
  const [modalopen, setModalOpen] = useState(false);
  const [buttonOpen, setButtonOpen] = useState(true);


  const [selectmenu, setSelectMenu] = useState("");
  const { getSessionData } = useSessionStorage();
  const [questionData, setQuestionData] = useState(null);

  const accountData = getSessionData("accountData");
  const data = {
    id: accountData.id,
  };
  const [create_news_id] = useState(news_id);
  const navigate = useNavigate();

  const modalStyle = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // オーバーレイの背景色
      zIndex: 1200, // オーバーレイの z-index
      width:'110%',
      height:'100%',
    },
    content: {
      position: 'absolute',
      top: '45%',
      left: '45%',
      height:'100%',
      transform: 'translate(-50%, -50%)',
      border: 'none',
      padding: '1.5rem',
      overflow: 'hidden',
      zIndex: 1200, // コンテンツの z-index
    },
  };


  // 質問を追加する関数 //dropdown
  const addQuestion = (Questions_Genre) => {
    console.log("クリックしたジャンル", Questions_Genre);
    const { type, inputType } = getQuestionType(Questions_Genre);

    // 新しい質問データを作成
    const newQuestion = {
      id: `${questions.length + 1}`,
      name: `Question${questions.length + 1}`,
      title: `設定中`,
      type: type,  // 質問のタイプを決定
      inputType: inputType,  // 質問のタイプを決定
    };

    console.log(type);
    console.log(inputType);

    // 新規追加なので `questionData` を初期化
    setQuestionData(newQuestion);

    // 新しい質問を追加
    setQuestions([...questions, newQuestion]);

    // モーダルを開く
    setButtonOpen(false);
    openModal(Questions_Genre);
  };


  const openModal = (Questions_Genre) => {
    setSelectMenu(Questions_Genre);
    setModalOpen(true);
  };

  const EditopenModal = (Questions_Genre, questionData) => {
    setSelectMenu(Questions_Genre);
    setQuestionData(questionData);
    setButtonOpen(false);
    setModalOpen(true);
  };

  // 質問のタイプを決定する関数
  const getQuestionType = (Questions_Genre) => {
    const type = (() => {
      switch (Questions_Genre) {
        case "radio":
          return "radiogroup";
        case "dropdown":
          return "dropdown";
        // case "Number":
        //   return "text";
        // case "Date":
        //     return "text";
        case "checkbox":
          return "checkbox";
        case "boolean":
          return "boolean";
        case "comment":
          return "comment";
        case "rating":
          return "rating";
        case "ranking":
          return "ranking";
        case "imagepicker":
          return "imagepicker";
        default:
          return "text";
      }
    })();

    //ラジオ・チェックボックス

    const inputType = (() => {
      switch (Questions_Genre) {
        case "number":
          return "number";
      }
    })();

    console.log('Question Type:', type);
    return { type, inputType };
  };

  const handleSaveSettings = (settings) => {
    console.log("受け取った設定", settings);
    console.log("inputType 確認: ", settings.inputType); // 追加
    const updatedQuestions = questions.map((q, index) =>
      index === questions.length - 1
        ? {
          ...q,
          title: settings.title || q.title,
          type: settings.type || q.type,
          inputType: settings.inputType || q.inputType,
          maxLength: settings.maxLength || q.maxLength,
          minLength: settings.minLength || q.minLength,
          placeholder: settings.placeholder || q.placeholder,
          autocomplete: settings.autocomplete || q.autocomplete,
          isrequired: settings.isrequired || q.isrequired,
          description: settings.description || q.description,
          validators: settings.validators || q.validators,
          defaultValueExpression: settings.defaultValueExpression || q.defaultValueExpression,
          minValueExpression: settings.minValueExpression || q.minValueExpression,
          min: settings.min || q.min,
          max: settings.max || q.max,
          defaultValue: settings.defaultValue || q.defaultValue,
          step: settings.step || q.step,
          showNoneItem: settings.showNoneItem || q.showNoneItem,
          showOtherItem: settings.showOtherItem || q.showOtherItem,
          choices: settings.choices || q.choices,
          colCount: settings.colCount || q.colCount,
          noneText: settings.noneText || q.noneText,
          otherText: settings.otherText || q.otherText,
          clearText: settings.clearText || q.clearText,
          separateSpecialChoices: settings.separateSpecialChoices || q.separateSpecialChoices,
          showClearButton: settings.showClearButton || q.showClearButton,
          fitToContainer: settings.fitToContainer || q.fitToContainer,

          showSelectAllItem: settings.showSelectAllItem || q.showSelectAllItem,
          selectallText: settings.selectallText || q.selectallText,

          rows: settings.rows || q.rows,
          autoGrow: settings.autoGrow || q.autoGrow,
          allowResize: settings.allowResize || q.allowResize,
          renderAs: settings.renderAs || q.renderAs,
          titleLocation: settings.titleLocation || q.titleLocation,

          rateType: settings.rateType || q.rateType,
          displayMode: settings.displayMode || q.displayMode,
          scaleColorMode: settings.scaleColorMode || q.scaleColorMode,
          rateCount: settings.rateCount || q.rateCount,
          rateValues: settings.rateValues || q.rateValues,
          rateMax: settings.rateMax || q.rateMax,

          multiSelect: settings.multiSelect || q.multiSelect,
          showLabel: settings.showLabel || q.showLabel,

        }
        : q
    );

    console.log("更新した質問", updatedQuestions);
    setQuestions(updatedQuestions);
    setQuestionData(null);

    survey.applyTheme({
      themeName: settings.themeName,
      colorPalette: settings.colorPalette,
    });

    console.log("handleSaveSettings通ってます");
    console.log("modalopen",modalopen);

    setModalOpen(false);
    setButtonOpen(true);
  };



  const surveyJson = {
    elements: questions && questions.length > 0 ? questions.map((q) => {
      // 各質問のデータをログに出力
      console.log("質問データ:", {
        name: q.name,
        title: q.title,
        type: q.type,
        inputType: q.inputType,
        maxLength: q.maxLength || undefined,
        minLength: q.minLength || undefined,
        placeholder: q.placeholder || undefined,
        autocomplete: q.autocomplete || undefined,
        isRequired: q.isrequired || false,
        description: q.description || undefined,
        validators: q.validators || undefined,
        defaultValueExpression: q.defaultValueExpression || undefined,
        minValueExpression: q.minValueExpression || undefined,
        min: q.min || undefined,
        max: q.max || undefined,
        defaultValue: q.defaultValue || undefined,
        step: q.step || undefined,
        showNoneItem: q.showNoneItem || undefined,
        showOtherItem: q.showOtherItem || undefined,
        choices: q.choices || undefined,
        colCount: q.colCount || undefined,
        noneText: q.noneText || undefined,
        otherText: q.otherText || undefined,
        clearText: q.clearText || undefined,
        separateSpecialChoices: q.separateSpecialChoices || undefined,
        showClearButton: q.showClearButton || undefined,
        fitToContainer: q.fitToContainer || undefined,
      });

      return {
        name: q.name,
        title: q.title,
        type: q.type || undefined,
        inputType: q.inputType || undefined,
        maxLength: q.maxLength || undefined,
        minLength: q.minLength || undefined,
        placeholder: q.placeholder || undefined,
        autocomplete: q.autocomplete || undefined,
        isRequired: q.isrequired || false,
        description: q.description || undefined,
        validators: q.validators || undefined,
        defaultValueExpression: q.defaultValueExpression || undefined,
        minValueExpression: q.minValueExpression || undefined,
        min: q.min || undefined,
        max: q.max || undefined,
        defaultValue: q.defaultValue || undefined,
        step: q.step || undefined,
        showNoneItem: q.showNoneItem || undefined,
        showOtherItem: q.showOtherItem || undefined,
        choices: q.choices || undefined,
        colCount: q.colCount || undefined,
        noneText: q.noneText || undefined,
        otherText: q.otherText || undefined,
        clearText: q.clearText || undefined,
        separateSpecialChoices: q.separateSpecialChoices || undefined,
        showClearButton: q.showClearButton || undefined,
        fitToContainer: q.fitToContainer || undefined,
        showSelectAllItem: q.showSelectAllItem || undefined,
        selectallText: q.selectallText || undefined,
        rows: q.rows || undefined,
        autoGrow: q.autoGrow || undefined,
        allowResize: q.allowResize || undefined,
        renderAs: q.renderAs || undefined,
        titleLocation: q.titleLocation || undefined,
        rateType: q.rateType || undefined,
        displayMode: q.displayMode || undefined,
        scaleColorMode: q.scaleColorMode || undefined,
        rateCount: q.rateCount || undefined,
        rateValues: q.rateValues || undefined,
        rateMax: q.rateMax || undefined,
        multiSelect: q.multiSelect || undefined,
        showLabel: q.showLabel || undefined,
        themeSettings: {
          themeName: q.themeName || "default", // デフォルト値を設定
          colorPalette: q.colorPalette || "light",
        },
      };
    }) : [], // questionsがnullまたは空の場合は空の配列を返す
  };


  // surveyJsonの内容をログに出力
  console.log("Survey JSON:", surveyJson);


  console.table(surveyJson.elements);
  const survey = new Model(surveyJson);
  survey.locale = "jp";  // 日本語に設定




  survey.onAfterRenderQuestion.add(function (survey, options) {
    // ボタンの作成
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");

    // ボタンのテキスト設定
    deleteButton.textContent = "削除";
    editButton.textContent = "編集";

    // 削除ボタンのクリックイベント
    deleteButton.onclick = function () {
      // 削除する質問の ID を取得
      const questionId = options.question.name;
      console.log(questionId);

      // `questions` ステートから削除対象の質問を除外
      const updatedQuestions = questions.filter(q => q.name !== questionId);

      // ステートを更新して再描画
      setQuestions(updatedQuestions);

      // SurveyJS 内でも削除
      const page = options.question.page;
      page.removeQuestion(options.question);
    };

    // 編集ボタンのクリックイベント
    editButton.onclick = function () {
      const questionData = options.question;

      // 質問の入力タイプを取得
      const questionInputType = questionData.inputType;
      console.log("questionData.type", questionData.jsonObj.type);
      let questionType;

      // 入力タイプが存在する場合の処理
      // imagepicker の場合、questionInputTypeがradioかcheckboxになってしまい、別のフォームが開く
      if (questionData.jsonObj.type === "imagepicker") {
        questionType = "imagepicker";
        console.log("ImagePickerのフォームを表示します");
      } else if (questionInputType) {
        // NumberかDateの場合、そのままinputTypeを使用
        questionType = questionInputType;
        console.log("inputTypeを使用:", questionType);
      } else {
        // 入力タイプが存在しない場合、通常のtypeを使用
        questionType = questionData.getType ? questionData.getType() : questionData.type;
      }

      console.log("編集対象の質問データ:", questionData);
      console.log("質問タイプ:", questionType);

      // 編集モーダルを開く
      EditopenModal(questionType, questionData);
    };

    // HTML要素にボタンを追加
    options.htmlElement.appendChild(deleteButton);
    options.htmlElement.appendChild(editButton);
  });



  useEffect(() => {
    // 完了ボタンを非表示にする
    const css = `
      .sv-action__content .sd-btn--action.sd-navigation__complete-btn {
        display: none;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
  }, []);

  // フォームの編集データを保存
  const CreateFormSave = async () => {
    console.log("フォーム内容", questions);

    const create_form_save_url = `http://localhost:8000/create_form_save`;

    try {
      const response = await axios.post(create_form_save_url, {
        create_form: questions,
        company_id: data.id,
        create_news_id: create_news_id,
      });
      console.log("サーバーからのレスポンス", response.data);
      window.location.reload()
      alert("保存が完了しました");
    } catch (error) {
      console.error("フォーム保存エラー", error);
    }
  };



  // キャンセル時の処理
  const CreateFormCancel = () => {
    setQuestions(questions.filter(q => q !== questionData));  // キャンセル時に追加した質問を削除
    setQuestionData(null);  // `questionData` をクリア
    setModalOpen(false);
    setButtonOpen(true);
  };

  //ニュースの下書きに戻る
  const handleBack = () => {
    const editorSessionData = JSON.parse(sessionStorage.getItem("editorSessionData"));
    const genre = editorSessionData.genre; // null チェックを追加
    console.log("ジャンル", genre);
    navigate(`/Editor/${genre}`);
  };


  const FormSelectArray = [
    { lavel: 'テキスト', icon: <TranslateIcon />, click: 'text' },
    { lavel: '日時', icon: <WatchLaterIcon />, click: 'date' },
    { lavel: '数値', icon: <MoneyIcon />, click: 'number' },
    { lavel: 'ラジオボタン', icon: <RadioIcon />, click: 'radio' },
    { lavel: 'ドロップダウン', icon: <ArrowDropDownCircleIcon />, click: 'dropdown' },
    { lavel: 'チェックボックス', icon: <CheckBoxIcon />, click: 'checkbox' },
    { lavel: 'クローズドクエスチョン', icon: <FlakyIcon />, click: 'boolean' },
    { lavel: 'テキストボックス', icon: <NotesIcon />, click: 'comment' },
    { lavel: '評価', icon: <AssessmentIcon />, click: 'rating' },
    { lavel: 'ランキング', icon: <StarIcon />, click: 'ranking' },
    { lavel: '画像ピッカー', icon: <BurstModeIcon />, click: 'imagepicker' },
    // { lavel: 'デザイン変更', icon: <BrushIcon />, click: 'FormDesign' },
  ];

  const SelectMenuArray = [
    //テキスト
    { menu: "text", component: Text },
    { menu: "username", component: Text },
    { menu: "email", component: Text },
    { menu: "password", component: Text },
    { menu: "url", component: Text },
    //日時
    { menu: "date", component: DateForm },
    { menu: "time", component: DateForm },
    { menu: "datetime-local", component: DateForm },
    { menu: "month", component: DateForm },
    { menu: "week", component: DateForm },
    //数値
    { menu: "number", component: Number },
    { menu: "range", component: Number },
    { menu: "tel", component: Number },
    //ラジオボタン
    { menu: "radio", component: Radio },
    { menu: "radiogroup", component: Radio },
    //ドロップダウン
    { menu: "dropdown", component: DropDown },
    { menu: "tagbox", component: DropDown },
    //チェックボックス
    { menu: "checkbox", component: CheckBox },
    //クローズドクエスチョン
    { menu: "boolean", component: Boolean },
    //ロングテキストボックス
    { menu: "comment", component: Comment },
    //(10段階)評価
    { menu: "rating", component: Rating },
    //ランキング
    { menu: "ranking", component: Ranking },
    //画像ピッカー
    { menu: "imagepicker", component: ImagePicker },
    //デザインを変更する
    { menu: "FormDesign", component: FormDesign },

  ];

  console.log("surveyの中身", survey);

  return (
    <>
      <Stack direction="row" spacing={2} style={{ width: "1000px" }}>


        <div className="FormDemo"> {/* フォーム部分 */}

        <Typography>{article_title}</Typography>


          {!questions || questions.length === 0 ? (
            <p>フォームがありません</p>
          ) : (
            <>
              <div className="back_news_draft" onClick={handleBack}>
                <Typography>← ニュースの下書きに戻る</Typography>
              </div>


              <div className="SurveyModal">
                <Survey model={survey} />
              </div>

            </>
          )}
          <Button
            variant="outlined"
            onClick={CreateFormSave}
            sx={{
              borderColor: "#5956FF",
              color: "#5956FF",
              "&:hover": { borderColor: "#5956FF" },
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            保存する
          </Button>
        </div>

        <Modal
              isOpen={modalopen}
              onRequestClose={CreateFormCancel} // モーダルを閉じるコールバック
              shouldCloseOnOverlayClick={true} // オーバーレイクリックでモーダルを閉じる
              contentLabel="Example Modal"
              style={modalStyle}
            >
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            {SelectMenuArray.map((menu, index) => {
              const Component = menu.component; // 各メニューに対応するコンポーネントを取得
              return (
                selectmenu === menu.menu && (
                  <Component
                    key={index}
                    onSave={handleSaveSettings}
                    onCancel={CreateFormCancel}
                    questionData={questionData ? questionData : null} // 編集時のみquestionDataを渡す
                  />
                )
              );
            })}
          </Stack>
        </Modal>

       {buttonOpen && (
          <Stack spacing={2} className="SelectMenu">
            {FormSelectArray.map((form, index) => (
              <Button
                key={index}
                startIcon={form.icon}
                onClick={() => addQuestion(form.click)}
                variant="outlined"
                style={{ textAlign: 'center', width: "250px", marginLeft: "40%", }}  // アイコンとテキストを左寄せ
              >
                {form.lavel}
              </Button>
            ))}
          </Stack>
        )}
      </Stack>
    </>
  );

});


// displayName を設定
PostCard.displayName = 'PostCard';

// PropTypesバリデーション
Text.propTypes = {
  onSave: PropTypes.func.isRequired,
};

PostCard.propTypes = {
  post: PropTypes.shape({
    company_id: PropTypes.string,
    news_id: PropTypes.string,
    article_title: PropTypes.string,
    create_form: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      inputtype: PropTypes.string,
      validators: PropTypes.array,
    })).isRequired, // JSON 配列として修正
  }).isRequired,
};


export default PostCard;

