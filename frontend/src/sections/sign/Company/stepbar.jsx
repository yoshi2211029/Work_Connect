import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import AccountRegistar from "./AccountRegistration";
import CompanyInformation from "src/sections/sign/Company/CompanyInformation.jsx";
import Confirmation from "src/sections/sign/Company/Confirmation.jsx";

// Laravelとの通信用
import axios from "axios";

// sessionStrage
import { useSessionStorage } from "../../../hooks/use-sessionStorage";

const steps = ["アカウント", "企業情報", "確認"];
let stepConnectorLinesArray = [];

export default function HorizontalLinearStepper({ Stepbar }) {
  // ユーザー名重複エラー用
  const [userAccountCheck, setUserAccountCheck] = useState({
    user_name: false,
    password: false,
    passwordCheck: false,

    // 必須項目がすべて入力されている場合のみfalseになる
    required: false,
  });
  // 作品一覧に飛ばす。
  let navigation = useNavigate();

  const coleSetUserNameCheck = (key, value) => {
    console.log("key, value: ", key, value);
    setUserAccountCheck((test) => ({
      ...test,
      [key]: value,
      // password: false,
      // passwordCheck: false,
    }));
  };

  // 登録項目確認の際に利用
  const { getSessionData, updateSessionData } = useSessionStorage();

  let sessionStep = 0;
  let sessionActiveStep = getSessionData("ActiveStep");
  if(sessionActiveStep != undefined) {
    console.log("sessionActiveStep.step: ", sessionActiveStep.step);
    if(sessionActiveStep.step == 1 || sessionActiveStep.step == 2) {
      console.log("aaaaaaaaaaaaaaa");
      sessionStep = sessionActiveStep.step;
    }
  }

  const [activeStep, setActiveStep] = useState(sessionStep);


  useEffect(() => {
    updateSessionData("ActiveStep", "step", activeStep);
  }, [activeStep]);

  // setActiveStep(getSessionData("ActiveStep"));

  const childRef = useRef(null);

  // 次へボタン押されたとき
  const handleNext = () => {
    console.log("userAccountCheck: ", userAccountCheck);
    if (userAccountCheck.user_name == false && userAccountCheck.password == false && userAccountCheck.passwordCheck == false && userAccountCheck.required == false) {
      console.log("重複あり!!");

      // activeStepが2未満(次へをクリックした場合の処理)
      if (activeStep < 2) {
        console.log("activeStep", activeStep);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

        // ステップバーの色を変える処理
        stepConnectorLinesArray[activeStep].style.borderTop = "5px solid #1976d2";
      } else {
        // activeStepが2(保存をクリックした場合の処理)
        const url = "http://localhost:8000/s_register";

        const sessionData = getSessionData("accountData");
        const kind = "c";
        console.log(sessionData);

        axios
          .get(url, {
            params: {
              sessionData,
              kind,
            },
          })
        // thenで成功した場合の処理
        .then((response) => {
          console.log("レスポンス:", response);
          alert("新規登録が完了しました。");

          

          // セキュリティ対策のため初期化
          sessionStorage.removeItem('accountData');

          // データの保存(セッションストレージ)
          updateSessionData("accountData", "id", response.data.id);
          updateSessionData("accountData", "user_name", response.data.user_name);
          updateSessionData("accountData", "mail", response.data.mail);
          updateSessionData("accountData", "popover_icon", response.data.icon);

          // ここで作品一覧ページに飛ばす処理 //////////////////////////
          navigation("/");
        })
        // catchでエラー時の挙動を定義
        .catch((err) => {
          alert("新規登録できませんでした。");
          console.log("err:", err);
        });
      }
    } else {
      // データ取得
      const accountData = getSessionData("accountData");
      // 各項目が空だった場合、バリデーションを実行(AccountRegistration.jsxへ)
      if(accountData.company_name == undefined || accountData.company_name == ""){
        childRef.current?.NULL_validation(1);
      }
      if(accountData.company_nameCana == undefined || accountData.company_nameCana == ""){
        childRef.current?.NULL_validation(2);
      }
      if(accountData.user_name == undefined || accountData.user_name == ""){
        childRef.current?.NULL_validation(3);
      }
      if(accountData.password == undefined || accountData.password == ""){
        childRef.current?.NULL_validation(4);
      }
      if(accountData.passwordCheck == undefined || accountData.passwordCheck == ""){
        childRef.current?.NULL_validation(5);
      }

      alert("エラー：未入力項目があります");



    }
  };

  // 戻るボタン押されたとき
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    stepConnectorLinesArray[activeStep - 1].style.borderTop = "5px solid #898989";
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    const stepConnectorLines = document.querySelectorAll(".MuiStepConnector-line");
    stepConnectorLinesArray = Array.from(stepConnectorLines);

    // console.log("gaijneranjngaenrnj", stepConnectorLinesArray); // stepConnectorLinesArrayに配列が格納されます
  }, []);

  return (
    <Box
      sx={{
        width: "calc(100% - 20px)",
        padding: "50px 10px",
        display: Stepbar,
      }}
    >
      {/* alternativeLabel ステップナンバーとステップ名の縦並び */}
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          "& .MuiStepConnector-line": {
            borderTop: "5px solid #898989",
            borderRadius: "20px",
          },
        }}
      >
        {steps.map((label) => {
          // console.log("stepsインデックス", activeStep);
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {/*ーーーーーーーーーーーーーーーーーーーーーー 入力フォーム表示位置 ーーーーーーーーーーーーーーーーーーーーーー*/}

      {/* handleValueChange 入力した値を */}
      {activeStep === 0 ? <AccountRegistar coleSetUserNameCheck={coleSetUserNameCheck} ref={childRef} /> : ""}
      {activeStep === 1 ? <CompanyInformation /> : ""}
      {activeStep === 2 ? <Confirmation /> : ""}

      {/*ーーーーーーーーーーーーーーーーーーーーーー 入力フォーム表示位置 ーーーーーーーーーーーーーーーーーーーーーー*/}

      {activeStep === steps.length ? (
        <React.Fragment>
          {/* すべてのステップが完了したメッセージ */}
          <Typography sx={{ mt: 2, mb: 1 }}>登録が完了しました。</Typography>

          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              pt: 2,
            }}
          >
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              戻る
            </Button>
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "保存" : "次へ"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

HorizontalLinearStepper.propTypes = {
  Stepbar: PropTypes.string.isRequired, // StepbarがReact要素（コンポーネント）であると仮定
};
