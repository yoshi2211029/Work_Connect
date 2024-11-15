import { useEffect, forwardRef } from "react";
import PropTypes from "prop-types";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';
import Button from '@mui/material/Button';
import './writeform.css';
import axios from 'axios';

import Stack from "@mui/material/Stack";


// ----------------------------------------------------------------------

const PostCard = forwardRef(({ post }, ref) => {
  const { company_id, create_form, news_id, article_title } = post;

  const { getSessionData } = useSessionStorage();
  const accountData = getSessionData("accountData");
  const data = {
    account_id: accountData.id,
  };

  const writeformsaveurl = `http://localhost:8000/write_form_save`;

  useEffect(() => {
    console.log("company_id", company_id);
    console.log("news_id", news_id);
    console.log("account_id", data.account_id);
    console.log("フォームフィールド", create_form);
  }, [company_id, create_form, data.account_id]);

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


  // フォームフィールドをSurveyの形式に変換する
  const transformFormFields = (fields) => {
    // fieldsが存在するかチェック
    if (!fields || !Array.isArray(fields)) {
      console.error("フォームフィールドがありません。fields:", fields);
      return {
        title: {article_title},
        pages: [],
      };
    }

    return {
      title: article_title,
      pages: [
        {
          name: "page1",
          elements: fields.map(field => ({
            type: field.type,
            name: field.name,
            title: field.title,
            ...(field.inputType && { inputType: field.inputType }), // inputType を確認
            ...(field.validators && { validators: field.validators }), // validators を確認
            ...(field.response && { defaultValue: field.response }),  // response を defaultValue に設定
            ...(field.choices && { choices: field.choices }), // choices を追加
          })),
        }
      ]
    };
  };



  // フォームフィールドデータをSurvey形式に変換
  const surveyData = transformFormFields(create_form);

  // Survey モデルの生成
  const survey = new Model(surveyData);

  const WriteFormSave = () => {
    // Surveyモデルのバリデーション実行
    const isValid = survey.validate();

    if (isValid) {
      console.log("フォームは有効です。保存処理を実行します。");

      // フォームのデータを取得
      const formData = survey.data;
      console.log("保存するデータ:", formData);

      // フォーム定義とユーザーの回答を統合する
      const transformFormFieldsWithResponses = (fields, responses) => {
        return fields.map(field => ({
          ...field,
          response: responses[field.name] || null // ユーザーの回答をフォーム定義に追加
        }));
      };

      // フォーム定義とユーザーの回答を統合
      const formDefinitionWithResponses = transformFormFieldsWithResponses(create_form, formData);

      // 統合データを表示（確認用）
      console.log("フォーム定義と回答を統合したデータ:", formDefinitionWithResponses);
      console.log("ニュースID", news_id);

      // Axiosを使用してデータを保存する
      axios.post(writeformsaveurl, {
        FormData: formDefinitionWithResponses,
        NewsId: news_id,
        RecipientCompanyId: company_id,
        MyId: data.account_id,
      })
        .then(response => {
          console.log('保存成功', response);
        })
        .catch(error => {
          console.error('保存エラー', error);
        });
    } else {
      console.log("フォームにエラーがあります。修正してください。");

      // フォームの全質問を取得し、それぞれのエラーメッセージを表示
      const questions = survey.getAllQuestions();
      questions.forEach((question) => {
        // 各質問にエラーメッセージがある場合に表示
        if (question.errors && question.errors.length > 0) {
          question.errors.forEach((error) => {
            console.log(`質問「${question.title}」のエラー: ${error.text}`);
          });
        }
      });
    }
  };


  return (
    <div ref={ref}>
      <Stack sx={{ display: "inline-block"}}>
        <div className="WriteForm">
        <Survey model={survey} />

        <Button variant="outlined" onClick={WriteFormSave}
          sx={{ width: "40px", borderColor: '#5956FF', color: '#5956FF', '&:hover': { borderColor: '#5956FF' }, cursor: 'pointer' }}>
          保存する
        </Button>
        </div>
      </Stack>
    </div>
  );
});

// displayName を設定
PostCard.displayName = 'PostCard';

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
