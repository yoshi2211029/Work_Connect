import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

import { useResponsive } from "src/hooks/use-responsive";
import { bgBlur } from "src/theme/css";
import { NAV, HEADER } from "./config-layout";
import Iconify from "src/components/iconify";
import AccountPopover from "./common/account-popover";
import Searchbar from "./common/searchbar";
import ChatPng from "./common/chatPng";
import NotificationsPopover from "./common/notifications-popover";
import { useNavigate } from "react-router-dom";
// ゲストモード時、作品投稿・動画投稿・通知
import { MyContext } from "src/layouts/dashboard/index";
//学生か企業かで、ヘッダー内容を切り替え、Linkを用いてジャンプする
import { useSessionStorage } from "src/hooks/use-sessionStorage";

import $ from "jquery";
// ログイン
import StudentLoginModal from "src/components/account/students/StudentLoginModal";
import CompanyLoginModal from "src/components/account/company/CompanyLoginModal";

// 新規登録
import StudentPreSignModal from "src/components/account/students/StudentPreSignModal";
import CompanyPreSignModal from "src/components/account/company/CompanyPreSignModal";

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const Display = useContext(MyContext);
  const { getSessionData } = useSessionStorage();
  const accountData = getSessionData("accountData") || {};
  const theme = useTheme();
  const lgUp = useResponsive("up", "lg");

  const data = {
    id: accountData.id || "",
  };
  const [open, setOpen] = useState(null);
  const [login_state, setLoginState] = useState(false);

  const [ModalChange, setModalChange] = useState("");
  const [PreModalChange, setPreModalChange] = useState("");

  let navigate = useNavigate();

  // style CSS ここから
  const buttonStyle = {
    display: Display.HomePage,
    margin: 4,
    "&:hover": {
      backgroundColor: "#a9a9a9",
    },
  };
  // style CSS ここまで

  useEffect(() => {
    if (accountData) {
      if (accountData.user_name) {
        setLoginState(true);
      }
    }
  }, [accountData]);

  const handleOpenModal = () => {
    // setShowModal(true);
    navigate("WorkPosting");
  };
  const handleOpenModal2 = () => {
    // setShowModal(true);
    navigate("VideoPosting");
  };

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

  const handleOpen = (event) => {
    setOpen(event.currentTarget); // ボタンがクリックされた要素を保存
  };

  const handleClose = () => {
    setOpen(null); // ポップオーバーを閉じる
  };

  const NEWS_MENU_OPTIONS = [
    {
      label: "インターンシップの記事を投稿する",
      path: `/Editor/Internship`,
      icon: "eva:person-fill",
    },
    {
      label: "説明会の記事を投稿する",
      path: `/Editor/Session`,
      icon: "eva:person-fill",
    },
    {
      label: "求人の記事を投稿する",
      path: "/Editor/JobOffer",
      icon: "eva:settings-2-fill",
    },
    {
      label: "ブログの記事を投稿する",
      path: "/Editor/Blog",
      icon: "eva:settings-2-fill",
    },
  ];

  const handleMenuItemClick = (path) => {
    handleClose();
    navigate(path);
  };

  //クリックすると一番上まで戻るボタン
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ログインのform内以外をクリックしたときにモーダルを閉じる処理
  $("*").click(function (e) {
    // クリックした要素の<html>までのすべての親要素の中に"formInModal"クラスがついている要素を取得
    var targetParants = $(e.target).parents(".formInModal");

    // 取得した要素の個数が0個の場合
    if (targetParants.length == 0 || $(e.target).text() == "閉じる") console.log($(e.target).text());
    if (targetParants.length == 0 || $(e.target).text() == "閉じる") {
      if (
        $(e.target).attr("class") != "formInModal" &&
        $(e.target).attr("id") != "LoginButton" &&
        $(e.target).attr("id") != "loginCompanyModalLink" &&
        $(e.target).attr("id") != "loginStudentModalLink"
      ) {
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

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1, display: Display.HomePage }}>
          {/* ハンバーガーメニュー */}
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}
      <div
        style={{
          display: Display.HomePage === "none" ? "flex" : "none",
          alignItems: "center",
        }}
      >
        <img
          src={`/assets/Work&ConnectIcon.png`}
          style={{
            width: "100%",
            height: "100%",
            minWidth: "20px",
            minHeight: "20px",
            maxWidth: "50px",
            maxHeight: "50px",
          }}
        ></img>
        <span style={{ color: "black", fontWeight: "bold" }}>Work&Connect</span>
      </div>
      {/* 検索バー */}
      <Searchbar style={{ display: Display.MyPage }} />

      <Box sx={{ flexGrow: 1 }} />
      {/* ログイン、新規登録、本登録、チャット、通知、アカウントプロフィール */}
      <Stack direction="row" alignItems="center" spacing={1}>
        {data.id[0] === "S" ? (
          <>
            <Button onClick={handleOpenModal} variant="contained" sx={buttonStyle}>
              作品投稿
            </Button>
            <Button onClick={handleOpenModal2} variant="contained" sx={buttonStyle}>
              動画投稿
            </Button>
          </>
        ) : data.id[0] === "C" ? (
          <>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Button onClick={handleOpen} variant="contained">
                ニュース投稿
              </Button>

              <Popover
                open={!!open}
                anchorEl={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    p: 0,
                    mt: 1,
                    ml: 0.75,
                    width: 250,
                  },
                }}
              >
                {NEWS_MENU_OPTIONS.map((option) => (
                  <MenuItem key={option.label} onClick={() => handleMenuItemClick(option.path)} sx={{ display: login_state ? "block" : "none" }}>
                    {option.label}
                    <Divider sx={{ borderStyle: "dashed", display: "block" }} />
                  </MenuItem>
                ))}
              </Popover>
            </Stack>
          </>
        ) : null}

        <Button id="LoginButton" onClick={handleChange} variant="contained" style={{ display: Display.HomePage === "" ? "none" : "block" }}>
          ログイン
        </Button>

        <Button id="PreSignButton" onClick={handleChange} variant="outlined" style={{ display: Display.HomePage === "" ? "none" : "block" }}>
          新規登録
        </Button>

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

        <Tooltip title="チャット">
          <IconButton
            sx={{
              marginLeft: "auto", // 右揃え
              width: "30px",
              height: "30px",
              display: Display.HomePage ? "none" : "flex",
            }}
          >
            <ChatPng />
          </IconButton>
        </Tooltip>

        <NotificationsPopover />

        <Tooltip title="アカウント" sx={{ display: Display.HomePage ? "none" : "flex" }}>
          <IconButton
            sx={{
              marginLeft: "auto", // 右揃え
              "&:hover": { backgroundColor: "#f0f0f0", title: "a" },
              width: "30px",
              height: "30px",
              display: Display.HomePage ? "none" : "felx",
            }}
          >
            <AccountPopover />
          </IconButton>
        </Tooltip>
      </Stack>
    </>
  );

  useEffect(() => {
    console.log("theme.zIndex", theme.zIndex);
  }, [theme]);

  return (
    <>
      <AppBar
        sx={{
          boxShadow: "none",
          height: HEADER.H_MOBILE,
          zIndex: theme.zIndex.appBar + 1,
          ...bgBlur({
            color: theme.palette.background.default,
          }),
          transition: theme.transitions.create(["height"], {
            duration: theme.transitions.duration.shorter,
          }),
          ...(lgUp &&
            !Display.HomePage && {
              width: `calc(100% - ${NAV.WIDTH + 1}px)`,
              height: HEADER.H_DESKTOP,
            }),
        }}
      >
        <Toolbar
          sx={{
            px: Display.HomePage === "none" ? { lg: 30 } : { lg: 5 },
            height: 1,
          }}
        >
          {renderContent}
        </Toolbar>
        <ArrowUpwardIcon
          onClick={handleScrollToTop}
          style={{
            cursor: "pointer",
            width: "50px",
            height: "50px",
            position: "fixed",
            top: "873px",
            right: "20px",
            color: "black",
            borderRadius: "50%",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
            display: Display.HomePage? "none" : "block",
          }}
        />
      </AppBar>
    </>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
