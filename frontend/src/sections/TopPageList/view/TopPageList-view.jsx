import { useState, useContext } from "react";
import { useSessionStorage } from "../../../hooks/use-sessionStorage";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import $ from "jquery";

import Button from "@mui/material/Button";

// ゲストモード時、作品投稿・動画投稿・通知
import { MyContext } from "src/layouts/dashboard/index";

// ログイン
import StudentLoginModal from "src/components/account/students/StudentLoginModal";
import CompanyLoginModal from "src/components/account/company/CompanyLoginModal";

// 新規登録
import StudentPreSignModal from "src/components/account/students/StudentPreSignModal";
import CompanyPreSignModal from "src/components/account/company/CompanyPreSignModal";

export default function TopPageListView() {
  const [ModalChange, setModalChange] = useState("");
  const [PreModalChange, setPreModalChange] = useState("");
  const Display = useContext(MyContext);
  // 登録項目確認の際に利用
  const { deleteSessionData } = useSessionStorage();
  deleteSessionData("accountData");

  const callSetModalChange = (newValue) => {
    setModalChange(newValue);
  };
  const callSetPreModalChange = (newValue) => {
    setPreModalChange(newValue);
  };

  const handleChange = (e) => {
    if (e.target.id === "LoginButton") {
      setModalChange("学生");
      setPreModalChange("");
    } else {
      setModalChange("");
      setPreModalChange("学生");
    }
  };

  // ログインのform内以外をクリックしたときにモーダルを閉じる処理
  $("*").click(function (e) {
    // クリックした要素の<html>までのすべての親要素の中に"formInModal"クラスがついている要素を取得
    var targetParants = $(e.target).parents(".formInModal");

    // 取得した要素の個数が0個の場合
    // ***if (targetParants.length == 0 || $(e.target).text() == "閉じる")***
    // console.log($(e.target).text());
    if (targetParants.length == 0 || $(e.target).text() == "閉じる") {
      // クリックした要素に"formInModal"クラスがついていない場合
      if (
        $(e.target).attr("class") != "formInModal" &&
        $(e.target).attr("id") != "LoginButton" &&
        $(e.target).attr("id") != "loginCompanyModalLink" &&
        $(e.target).attr("id") != "loginStudentModalLink"
      ) {
        // ログインモーダルを閉じる
        setModalChange("");
      }

      if (
        $(e.target).attr("class") != "formInModal" &&
        $(e.target).attr("id") != "PreSignButton" &&
        $(e.target).attr("id") != "PreSignCompanyModalLink" &&
        $(e.target).attr("id") != "PreSignStudentModalLink"
      ) {
        // 新規登録モーダルを閉じる
        setPreModalChange("");
      }
    }
  });
  return (
    <>
      <div className="top_page_wrapper">
        <div className="top_page_content">
          <div className="top_page_content_first">
            <div>
              <p className="top_page_message">
                あなたの<span className="top_page_messege_span">アピール</span>が
              </p>
              <p className="top_page_message">
                <span className="top_page_messege_span_second">未来を創る</span>
              </p>
            </div>
            <div>
              <div className="top_page_controller">
                <Button
                  id="LoginButton"
                  variant="contained"
                  className="top_page_button login"
                  onClick={handleChange}
                  style={{ display: Display.HomePage === "" ? "none" : "block" }}
                >
                  始めよう
                </Button>
              </div>
              {ModalChange === "学生" ? (
                <StudentLoginModal callSetModalChange={callSetModalChange} />
              ) : ModalChange === "企業" ? (
                <CompanyLoginModal callSetModalChange={callSetModalChange} />
              ) : null}

              {PreModalChange === "学生" ? (
                <StudentPreSignModal callSetPreModalChange={callSetPreModalChange} />
              ) : PreModalChange === "企業" ? (
                <CompanyPreSignModal callSetPreModalChange={callSetPreModalChange} />
              ) : null}
            </div>
          </div>
          <div style={{ height: "100%" }}>
            <DeviceFrameset device="iPhone X" /*landscape*/>
              <img className="top_page_app_image"  src="/assets/images/covers/phoneAppImage.png" alt="" />
            </DeviceFrameset>
          </div>
        </div>
      </div>
    </>
  );
}
