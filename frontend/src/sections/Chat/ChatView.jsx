import React from 'react';
import { useLocation } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import { Link } from "react-router-dom";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/material/styles';
import { ColorRing } from "react-loader-spinner";


/* メモ：WebScokectを使う際、
// work_connect/node-backend/src/index.jsと
// work_connect/frontend/src/layouts/dashboard/index.jsxと
// ChatView.jsx使う*/
import { WebScokectContext } from "src/layouts/dashboard/index";
// デフォルトのアイコンをインポート
import DefaultIcon from "src/sections/Profile/View/DefaultIcon";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import CircleIcon from '@mui/icons-material/Circle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { green } from '@mui/material/colors';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import PersonIcon from '@mui/icons-material/Person';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';



const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 2px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[500]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);


const SelectIcon = ({chatViewIcon}) => {
  return(
    <div style={{ display: 'flex', alignItems: 'center' }}>
    {chatViewIcon ? (
      <img
        src={`http://localhost:8000/storage/images/userIcon/${chatViewIcon}`}
        alt="User Icon"
        style={{
          width: '40px',
          height: '40px',
          margin: '0 5px',
          borderRadius: '50%',
          border: '2px solid #999'
        }}
      />
    ) : (
      <DefaultIcon />
    )}
  </div>
  );

}

// フォローリストのコンポーネント
const FollowGroup = ({
  title,
  followStatusCount,
  followStatus,
  groupingOpen,
  handleClick,
  chatViewId,
  chatOpen,
  saveScrollPosition }) => {

  return (
    <>
      {/* 見出し部分 */}
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <PersonIcon />
          {title === "相互フォロー" && <SyncAltIcon />}
          {title === "フォローしています" && <EastIcon />}
          {title === "フォローされています" && <WestIcon />}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
              {title} {followStatusCount ? `(${followStatusCount})` : null}
            </Typography>
          }
        />
        {groupingOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      {/* フォローリスト部分 */}
      <Collapse in={groupingOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* ユーザーリスト */}
          {followStatus.map((element) => (
            <ListItemButton
              key={element.id}
              sx={{
                pl: 4,
                background: element.id === chatViewId ? '#cce5ff' : 'initial',
                '&:hover': {
                  background: element.id === chatViewId ? '#cce5ff' : '#eee',
                },
              }}
              onClick={() => {
                saveScrollPosition(); // スクロール位置を保存
                chatOpen(element);
              }}>
              {/* アイコン */}
              <ListItemIcon>
              <SelectIcon chatViewIcon={element.icon}/>
              </ListItemIcon>
              {/* ユーザー名 */}
              <ListItemText primary={element.company_name ? element.company_name : element.user_name} />

              {/* 未読の件数を表示 */}
              <Box>
                {element.unread !== 0 ? (
                  <Box
                    sx={{
                      backgroundColor: '#ff6060',
                      color: 'white',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '13px',
                    }}
                  >
                    {element.unread}
                  </Box>
                ) : (
                  ""
                )}
              </Box>
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

// 「ここから未読」のコンポーネント
const UnreadStart = () => {
  return (
    <Typography
      display="flex"
      justifyContent="center"
      alignItems="center"
      variant="caption"
      component="div"
      sx={{
        position: 'relative',
        margin: '0 10px',
        backgroundColor: '#F9FAFB',
        zIndex: 1,
        fontSize: '13px',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: '50%',
          width: '45%',
          borderBottom: '1px dashed #000',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          right: 0,
          top: '50%',
          width: '45%',
          borderBottom: '1px dashed #000',
        },
      }}
    >
      ここから未読
    </Typography>
  );
};

// モーダルのコンポーネント
const ChatEditModal = ({
  modalOpen,
  handleModalClose,
  chatEditData,
  chatEditChange,
  chatEditUpDate }) => {
  return(
    <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #DAE2ED',
        borderRadius: '10px',
        boxShadow: 24,
        p: 4,}}>

        <Typography
          id="modal-modal-title"
          variant="h6"
          sx={{
            mb: 0.5,
          }}>
          チャットの編集
        </Typography>

        <Textarea
          multiline
          minRows={1} // 最小行数を設定
          maxRows={4} // 最大行数を設定
          sx={{
            height: '100%', // 親要素の高さの50%に設定
            width: '100%', // 必要に応じて幅を調整
            fontSize: '1rem',
          }}
          InputProps={{
            sx: {
              height: '100%' // TextFieldの内部要素も親の高さに合わせる
            }
          }}
          value={chatEditData}
          onChange={chatEditChange}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 0.5,
          }}
        >
          <Button
          variant="text"
          sx={{ marginRight: '10px' }}
          onClick={handleModalClose}
          >
            キャンセル
          </Button>
          <Button
          variant="contained"
          size="medium"
          onClick={chatEditUpDate}
          >
            更新
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// ローディングのコンポーネント
const ColorRingStyle = () => {
  return(
    <Box
      sx={{
        marginTop: '20%',
        display: 'flex', // Flexboxを使用
        justifyContent: 'center', // 水平方向中央
        alignItems: 'center', // 垂直方向中央
      }}
    >
      <ColorRing
        style={{
          visible: true,
          margin: "0px",
          height: "10",
          width: "10",
          ariaLabel: "color-ring-loading",
          wrapperClass: "custom-color-ring-wrapper",
          colors:
          ["#e15b64",
            "#f47e60",
            "#f8b26a",
            "#abbd81",
            "#849b87"]
        }}
      />
    </Box>
  );

}

// メインのコンポーネント
const ChatView = () => {

  // websocket通信のデータ保存先
  const chatContext = useContext(WebScokectContext);

  /// セッションストレージ取得
  const { getSessionData , updateSessionData } = useSessionStorage();
  /// セッションストレージからaccountDataを取得し、idを初期値として設定(ログイン中のIDを取得)
  const [accountData, setAccountData] = useState(getSessionData("accountData"));

  // フォローリストのグループ化を管理する変数
  const [GroupingOpen_1, setGroupingOpen_1] = React.useState(true);
  const [GroupingOpen_2, setGroupingOpen_2] = React.useState(true);
  const [GroupingOpen_3, setGroupingOpen_3] = React.useState(true);

  // フォローリストのネストをクリックしたときの処理
  const groupinghandleClick_1 = () => {
    setGroupingOpen_1(!GroupingOpen_1);
  };
  const groupinghandleClick_2 = () => {
    setGroupingOpen_2(!GroupingOpen_2);
  };
  const groupinghandleClick_3 = () => {
    setGroupingOpen_3(!GroupingOpen_3);
  };

  // フォロー状態を管理
  const [FollowStatus_1, setFollowStatus_1] = useState([]);
  const [FollowStatus_2, setFollowStatus_2] = useState([]);
  const [FollowStatus_3, setFollowStatus_3] = useState([]);

  // フォロー状態を管理
  const [FollowStatusCount_1, setFollowStatusCount_1] = useState(null);
  const [FollowStatusCount_2, setFollowStatusCount_2] = useState(null);
  const [FollowStatusCount_3, setFollowStatusCount_3] = useState(null);

  // チャットに表示するユーザー名やアイコンなどを管理する変数
  // chatViewIdはチャットの取得に必須
  const [chatViewId, setChatViewId] = useState(accountData.ChatOpenId ? accountData.ChatOpenId : null);
  const [chatViewUserName, setChatViewUserName] = useState(accountData.ChatOpenUserName ? accountData.ChatOpenUserName : null);
  const [chatViewCompanyName, setChatViewCompanyName] = useState(accountData.ChatOpenCompanyName ? accountData.ChatOpenCompanyName : null);
  const [chatViewIcon, setChatViewIcon] = useState(accountData.ChatOpenIcon ? accountData.ChatOpenIcon : null);
  const [chatViewFollowStatus, setChatViewFollowStatus] = useState(accountData.ChatOpenFollowStatus ? accountData.ChatOpenFollowStatus : null);


  /// ログイン中のidが入る変数
  const MyUserId = accountData.id;

  /// DBからのレスポンスが入る変数(リスト)
  const [ResponseChannelListData, setResponseChannelListData] = useState([]);

  /// DBからのレスポンスが入る変数(チャット)
  const [ResponseData, setResponseData] = useState([]);

  // ポップメニューの変数設定
  const [popMenuId, setPopMenuId] = useState(null);
  const [popMenuMessage, setPopMenuMessage] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const anchorElOpen = Boolean(anchorEl);

  // モーダルの変数設定
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  // チャットのスクロールの高さを保持する
  const chatBoxscroll = useRef(null);
  // チャットのスクロールの高さが変わったときに、元のスクロールの高さを保持しておく
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);

  // フォローリストのスクロールの高さを保持する
  const ListBoxscroll = useRef(null);

  // UIの調整用(初期値設定)
  const [showFollowList, setShowFollowList] = useState(window.innerWidth >= 900);
  const [showChatView, setShowChatView] = useState(true);
  const [showFollowListWidth, setShowFollowWidth] = useState(360);

  // テキストの文章を保持する変数
  const [TextData, setTextData] = useState("");

  // テキストの文章を保持する変数(モーダル)
  const [chatEditData, setChatEditData] = useState(null);

  // 外部からのリンクでチャットを開けるよう、パラメータを取得する。
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ParamsuserName = searchParams.get('userName');

  // useStateだと無限ループが発生するためletで初期値設定
  // 「ここから未読」の位置を保持する変数
  let unreadMessageFlag = false;
  // accountData.GetStartUnreadがなければ0を代入
  let unreadid = accountData.GetStartUnread || 0;

  // useStateだと無限ループが発生するためletで初期値設定
  // メッセージの送信日時を記憶しておく
  let PrevChatDate = null;

  // Laravelとの通信用URL
  const get_channel_list = "http://localhost:8000/get_channel_list";
  const get_chat = "http://localhost:8000/get_chat";

  /// 画面読み込み後、1度だけ実行
  useEffect(() => {

    //GetChannelList();

    // セッションデータと状態更新をまとめる関数
    function updateChatViewData(item) {
      const sessionData = {
        ChatOpenId: item.id || "",
        ChatOpenUserName: item.user_name || "",
        ChatOpenCompanyName: item.company_name || "",
        ChatOpenIcon: item.icon || "",
        ChatOpenFollowStatus: item.follow_status || ""
      };

      Object.keys(sessionData).forEach(key => {
        updateSessionData("accountData", key, sessionData[key]);
      });

      setChatViewId(sessionData.ChatOpenId);
      setChatViewUserName(sessionData.ChatOpenUserName);
      setChatViewCompanyName(sessionData.ChatOpenCompanyName);
      setChatViewIcon(sessionData.ChatOpenIcon);
      setChatViewFollowStatus(sessionData.ChatOpenFollowStatus);
      console.log(chatViewFollowStatus);
    }

    // ResponseChannelListDataが存在している場合のみ処理
    if (ResponseChannelListData && ResponseChannelListData.length > 0) {
      const matchedItem = ResponseChannelListData.find(item => item.user_name === ParamsuserName);

      if (matchedItem) {
        // 関数呼び出し
        updateChatViewData(matchedItem);
      } else {
        // 見つからない場合、404ページにリダイレクト
        location.href = "/404";
      }
    }

    // セッションデータの初期化
    updateSessionData("accountData", "GetStartUnread", 0);
    updateSessionData("accountData", "Commit", false);
    // 関数呼び出し
    restoreScrollPosition();
    scrollToBottom();

    // UI調整
    handleResize();
    window.addEventListener('resize', handleResize);
    // 画面全体のwidthが900px未満かつチャット相手未選択のときはフォローリスト表示
    if(window.innerWidth < 900 && !chatViewId){
      setShowFollowList(true);
    }

    // クリーンアップ関数でリスナーを削除
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, []);


  // chatContext.WebSocketState.Chat,chatViewIdを取得したとき
  useEffect(() => {

    // セッションストレージ取得
    setAccountData(getSessionData("accountData"));
    // フォローリスト、チャット取得
    GetChannelList();
    GetChat(chatViewId);
    //alert("GET CHAT");
    AlreadyReadChat(chatViewId);

  }, [chatContext.WebSocketState.Chat,chatViewId]);

  // chatContext.WebSocketState.Chat2を取得したとき
  // リアルタイムで既読や削除を反映させる

  useEffect(() => {
    // トーク画面の再読み込み
    GetChat(chatViewId);
  }, [chatContext.WebSocketState.Chat2]);


  // chatEditDataが変更されたとき
  useEffect(() => {
    updateSessionData("accountData", "ChatEditData", chatEditData);
  }, [chatEditData]);

  /// ListItemButtonが押された時の処理
  const ChatOpen = (element) => {

    // element.idが存在するときのみ実行
    element.id && updateSessionData("accountData", "ChatOpenId", element.id);
    // element.user_nameが存在するときのみ実行
    element.user_name && updateSessionData("accountData", "ChatOpenUserName", element.user_name);
    // element.company_nameが存在するときのみ実行
    element.company_name && updateSessionData("accountData", "ChatOpenCompanyName", element.company_name);
    // element.iconが存在するときのみ実行
    element.icon ? updateSessionData("accountData", "ChatOpenIcon", element.icon) : updateSessionData("accountData", "ChatOpenIcon", "");
    // element.follow_statusが存在するときのみ実行
    element.follow_status && updateSessionData("accountData", "ChatOpenFollowStatus", element.follow_status);

    // 現在のURLのクエリパラメータを削除する
    window.history.replaceState(null, null, window.location.pathname);

    // UIの調整
    updateSessionData("accountData", "ChatViewOpen", true);

    // ページをリロードする
    window.location.reload();
  };

  // テキストが変更されたとき
  const textChange = (e) => {
    const newValue = e.target.value;
    // newValueをセット
    setTextData(newValue);
    console.log("newvalue:"+newValue);
  };

  // 送信ボタンが押されたとき
  const sendClick = () => {
    const newValue = TextData;
    console.log("送信内容は:"+newValue+"です");
    PostChat();
    // チャットのスクロールを下にする
    scrollToBottom();
  };

  /// フォローリストの取得
  const GetChannelList = () => {
    async function GetData() {
      try {
        // Laravel側からデータを取得
        const response = await axios.get(get_channel_list, {
          params: {
            MyUserId: MyUserId, // ログイン中のID
          },
        });

        if (response) {
          //console.log(JSON.stringify(response, null, 2));
          const data = response.data;
          setResponseChannelListData(data);

          // フォロー状態の処理をまとめる
          handleFollowStatus(data, '相互フォローしています', setFollowStatus_1, setFollowStatusCount_1);
          handleFollowStatus(data, 'フォローしています', setFollowStatus_2, setFollowStatusCount_2);
          handleFollowStatus(data, 'フォローされています', setFollowStatus_3, setFollowStatusCount_3);
        }
      } catch (err) {
        console.log("err:", err);
        alert("フォロワーがいません");
      }
    }
    // DBからデータを取得
    if (MyUserId) {
      GetData();
    }
    // フォロー状態の処理を関数化
    function handleFollowStatus(data, status, setFollowStatus, setFollowStatusCount) {
      const filteredItems = data.filter(item => item.follow_status === status);
      setFollowStatus(filteredItems);
      setFollowStatusCount(filteredItems.length);
    }
  };

  /// 最新のチャットを取得する処理
  const GetChat = (id) => {
    async function GetData() {
      console.log('チャットデータを取得中...'+id);

      try {
        // Laravel側からデータを取得
        const response = await axios.get(get_chat, {
          params: {
            MyUserId: MyUserId, // ログイン中のID
            PairUserId: id // チャット相手のID
          },
        });
        if (response.data !== "null") {
          //console.log("チャットのレスポンスは"+JSON.stringify(response.data, null, 2));
          setResponseData(response.data);

        } else {
          console.log("まだチャットしてない");
          setResponseData("null");
        }
      } catch (err) {
        console.log("err:", err);

      }
    }
    // DBからデータを取得
    if (id) {
      GetData();
    } else {
      console.log("できません");
    }
  };

  /// チャットを送信する処理
  const PostChat = () => {
    async function PostData() {
      try {
        const PairUserId = getSessionData("accountData").ChatOpenId;
        // バックエンドにリクエストを送信
        await fetch("http://localhost:3000/post_chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ MyUserId: MyUserId, PairUserId: PairUserId, Message: TextData }),
        });
        console.log("送信成功しました");
        setTextData("");
        updateSessionData("accountData", "GetStartUnread", 0);
      } catch (err) {
        console.log("err:", err);
      }
    }
    // DBからデータを取得
    if (TextData) {
      PostData();
    } else {
      console.log("送信できません");
    }
  };

  /// チャットを削除する処理
  const DeleteChat = (id) => {
    async function PostData() {
      try {

        // バックエンドにリクエストを送信
        const response = await fetch("http://localhost:3000/delete_chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Id: id }),
        });
        if (response.data) {
          console.log("チャットの削除に成功しました");
          // 削除状態終了
          // 3秒遅延させて実行
          setTimeout(() => {
            updateSessionData("accountData", "Commit", false);
          }, 3000);
        }
      } catch (err) {
        console.log("err:", err);
      }
    }
    // DBからデータを取得
    if (id) {
      PostData();
    }
  };

  /// 既読をつける処理
  const AlreadyReadChat = (id) => {
    async function PostData() {
      try {
         // バックエンドにフォローリクエストを送信
         await fetch("http://localhost:3000/already_read_chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ MyUserId: MyUserId, PairUserId: id }),
        });

      } catch (err) {
        console.log("err:", err);
      }
    }
    // DBからデータを取得
    if (id) {
      PostData();
    }
  };

  /// チャットを更新する処理
  const UpDateChat = () => {
    async function PostData() {
      try {
        // バックエンドにリクエストを送信
        const response = await fetch("http://localhost:3000/update_chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Id: getSessionData("accountData").ChatEditId,
            Data: getSessionData("accountData").ChatEditData
          }),
        });
        if (response.data) {
          console.log("チャットの既読に成功しました");
          // 更新状態終了
          // 3秒遅延させて実行
          setTimeout(() => {
            updateSessionData("accountData", "Commit", false);
          }, 3000);
        }
      } catch (err) {
        console.log("err:", err);
      }
    }
    // DBからデータを取得

    PostData();

  };

  // 送信時間から日にちを取り出す関数
  const GetDay = (time) => {
    // 日付部分を切り取る
    const ChatDate = time.slice(0, 10); // "2024-10-07" などを取得
    if(PrevChatDate && PrevChatDate === ChatDate){
      // 前のデータと日付が同じ場合は、日付を表示しないのでreturnで空文字列を返す
      return "";
    }
    // メッセージの送信日時を更新しておく
    PrevChatDate = ChatDate;

    const [year, month, day] = ChatDate.split('-'); // 年、月、日を分割
    console.log(year);
    // 月と日を整数に変換し、形式を整える
    const formattedDate = `${parseInt(month, 10)}月${parseInt(day, 10)}日`; // "10月7日"

    // 曜日を取得
    const date = new Date(`${ChatDate}T00:00:00+09:00`); // UTCからDateオブジェクトに変換
    const options = { weekday: 'long' }; // 曜日のオプション
    const dayOfWeek = date.toLocaleDateString('ja-JP', options); // 日本語の曜日を取得

    return `${formattedDate} (${dayOfWeek})`; // 返り値(例: 10月7日 (日曜日) )
  };

  // 送信時間から時:分だけを取り出す関数
  const GetTime = (time) => {

    // 文字列を切り取って時間と分を取得
    const timeString = time.slice(11, 16);

    // timeStringの最初の2文字を取得
    let hour = timeString.slice(0, 2);

    // 最初の文字が 0 の場合は切り取る
    if (hour.startsWith('0')) {
      hour = hour.slice(1);
    }

    return `${hour}:${timeString.slice(3)}`; // 返り値
  };

  // 「ここから未読」を表示する関数
  const GetStartUnread = (read,id) => {

    if (read === "未読" && unreadMessageFlag === false) {
      /* 1度きりの表示なので2回目以降は出さないようにする。
         ただし、チャット自体はリアルタイムで更新するので、
         リロードがかかるまでは表示できるようにしておく。 */
      unreadMessageFlag = true;
      unreadid = id;
      updateSessionData("accountData", "GetStartUnread", unreadid);
    }
    // 「ここから未読」を表示
    if(unreadid === id){
      // コンポーネント呼び出し
      return <UnreadStart />;
    }

    return "";
  };

  // チャットのスクロールを下にする関数
  const scrollToBottom = () => {
    const chatBox = chatBoxscroll.current;
    // chatBoxがなければ中断
    if (!chatBox) return;

    // MutationObserverの設定
    const observer = new MutationObserver(() => {

      // 現在のscrollHeight
      const currentScrollHeight = chatBox.scrollHeight;

      // scrollHeightが変わったときのみスクロール
      // リアルタイムで情報を取得するためgetSessionData("accountData")から取得する
      if (currentScrollHeight !== prevScrollHeight && getSessionData("accountData").Commit === false) {
        chatBox.scrollTop = chatBox.scrollHeight;
        setPrevScrollHeight(currentScrollHeight); // 更新
      }
    });
    // observerの監視対象を設定
    observer.observe(chatBox, { childList: true, subtree: true });

    // クリーンアップ
    return () => {
      observer.disconnect(); // コンポーネントがアンマウントされたときにobserverを解除
    };
  };

   // フォローリストのスクロール位置をセッションストレージに保存する関数
   const saveScrollPosition = () => {
    updateSessionData("accountData", "ListBoxscroll", ListBoxscroll.current.scrollTop);
  };

  // セッションストレージを使い、フォローリストのスクロールの高さを調整
  const restoreScrollPosition = () => {
    const ListBoxscrollPosition = getSessionData("accountData").ListBoxscroll;
    if (ListBoxscrollPosition) {
      setTimeout(() => {
        ListBoxscroll.current.scrollTop = parseInt(ListBoxscrollPosition, 10);
      }, 1000); // 0ミリ秒遅延させてスクロール位置を設定
    }
  };

  // onChange={chatEditChange}で実行
  const chatEditChange = (e) => {
    const newValue = e.target.value;
    // newValueをセット
    setChatEditData(newValue);
  };

  // widthが変化したとき
  const handleResize = () => {
    setShowChatView(true);
    if(window.innerWidth < 900){
      // 画面全体のwidthが900px未満のとき
      setShowFollowWidth(window.innerWidth * 0.96);
      if(getSessionData("accountData") && !getSessionData("accountData").ChatViewOpen){
        // トーク画面を開いていないとき
        setShowChatView(false);
      }
    } else {
      // 画面全体のwidthが900px以上のとき
      setShowFollowList(true);
      setShowFollowWidth(360);
    }
  };

  // 戻るボタン(画面全体のwidthが900px未満のとき)
  const handleBackClick = () => {
    if(window.innerWidth < 900){
      // 画面全体のwidthが900px未満のとき
      setShowChatView(false);
      setShowFollowList(true);
    }
  };

  ///////////////////// ポップメニューに関する処理 /////////////////////
  // 開く
  const popMenu = (e) => {
    // 変数の上書き
    setAnchorEl(e.currentTarget);
    setPopMenuId(e.currentTarget.id);
    setPopMenuMessage(e.currentTarget.dataset.message);
    setChatEditData(e.currentTarget.dataset.message);
  };
  // 閉じる
  const popMenuClose = () => {
    setAnchorEl(null);
  };

  // チャットの編集(モーダルを開く)
  const popMenuEdit = (id,message) => {
    console.log(id+":"+message);

    // 開いたチャットのidを保存しておく
    updateSessionData("accountData", "ChatEditId", id);
    // モーダルを開く
    handleModalOpen();
    // ポップメニューを閉じる
    popMenuClose();
  };
  // チャットの編集(更新ボタンを押したとき)
  const chatEditUpDate = () => {
    if (confirm("チャットを更新してよろしいですか？")) {
      // OK（はい）が押された場合の処理
      // 更新状態スタート
      updateSessionData("accountData", "Commit", true);

      // 関数呼び出し
      UpDateChat();
      // アラート
      alert("チャットを更新しました。");
      // モーダルを閉じる
      handleModalClose();

    } else {
      // キャンセル（いいえ）が押された場合の処理
    }
  };
  // チャットの削除
  const popMenuDelete = (id) => {
    if (confirm("チャットを削除してよろしいですか？")) {
      // OK（はい）が押された場合の処理

      // 削除状態スタート
      updateSessionData("accountData", "Commit", true);

      // 関数呼び出し
      DeleteChat(id);
      // アラート
      alert("チャットを削除しました。");

      // ポップメニューを閉じる
      popMenuClose();

    } else {
      // キャンセル（いいえ）が押された場合の処理
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          //height: '100svh',
        }}
      >
        {showFollowList && (
        <List
          ref={ListBoxscroll}
          sx={(theme) => ({
            width: showFollowListWidth,
            minWidth: '360px',
            flexShrink: 0,
            height: showChatView ? '100%' : 'auto',  // false のときに高さを自動に設定
            marginLeft: '0',
            bgcolor: 'background.paper',
            maxHeight: showChatView ? 500 : 'none',  // false のときに最大高さを解除
            overflow: 'auto',
            border: '#DAE2ED 2px solid',
            borderRadius: '10px',
            [theme.breakpoints.down('1200')]: {
              marginLeft: '2%',
            },
          })}

          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            // ヘッダー
            <ListSubheader component="div" id="nested-list-subheader">
              チャット
            </ListSubheader>
          }
        >

          <FollowGroup
            title="相互フォロー"
            followStatusCount={FollowStatusCount_1}
            followStatus={FollowStatus_1}
            groupingOpen={GroupingOpen_1}
            handleClick={groupinghandleClick_1}
            chatViewId={chatViewId}
            chatOpen={ChatOpen}
            saveScrollPosition={saveScrollPosition}
          />

          <FollowGroup
            title="フォローしています"
            followStatusCount={FollowStatusCount_2}
            followStatus={FollowStatus_2}
            groupingOpen={GroupingOpen_2}
            handleClick={groupinghandleClick_2}
            chatViewId={chatViewId}
            chatOpen={ChatOpen}
            saveScrollPosition={saveScrollPosition}
          />

          <FollowGroup
            title="フォローされています"
            followStatusCount={FollowStatusCount_3}
            followStatus={FollowStatus_3}
            groupingOpen={GroupingOpen_3}
            handleClick={groupinghandleClick_3}
            chatViewId={chatViewId}
            chatOpen={ChatOpen}
            saveScrollPosition={saveScrollPosition}
          />

        </List>
      )}
      {showChatView && (
      <Box style={{
        flexGrow: 1, // 残りのスペースを全て使用
        marginLeft: '2%',
        marginRight: '2%',
        border: '#DAE2ED 2px solid',
        borderRadius: '10px'}}>

        {/****** チャット編集のモーダル呼び出し ******/}
        <ChatEditModal
          modalOpen={modalOpen}
          handleModalClose={handleModalClose}
          chatEditData={chatEditData}
          chatEditChange={chatEditChange}
          chatEditUpDate={chatEditUpDate}
        />

        {/****** チャット相手のアイコン、名前を表示させる ******/}
        {(chatViewId) ? (
          // 選択状態
          <Box sx={{
            display: 'flex',
            padding: '5px 0',
            borderBottom: '#DAE2ED 2px solid',
            fontSize: '25px'
            }}>

            {/* 戻るボタン(画面全体のwidthが900px未満のとき) */}
            {!showFollowList && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Tooltip title="戻る">
                <IconButton
                  onClick={handleBackClick}
                  sx={{
                    '&:hover': { backgroundColor: '#f0f0f0' },
                  }}
                >
                  <ArrowBackOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Box>
            )}

            {/* 企業名もしくはユーザーネームを表示(企業は企業名、学生はユーザーネーム) */}
            <Tooltip title={
              (chatViewCompanyName ?
                chatViewCompanyName :
              chatViewUserName) + "さんのマイページ"}>
              <Link
                to={`/Profile/${chatViewUserName}`}
              >
                <Box sx={{ display: 'flex'}}>
                  {/* アイコン */}
                  <SelectIcon chatViewIcon={chatViewIcon}/>
                  {/* 企業名またはユーザーネーム */}
                  <Box sx={{ fontSize: '1.9rem'}}>
                    {chatViewCompanyName ?
                    chatViewCompanyName :
                    chatViewUserName}
                  </Box>
                </Box>
              </Link>
            </Tooltip>
          </Box>
        ) : (
          // 未選択状態
          <Box sx={{
            padding: '5px 0',
            borderBottom: '#DAE2ED 2px solid',
            fontSize: '25px'
            }}>


            &emsp;←選んでください
          </Box>
        )}

        {/****** チャット内容 ******/}
        <Box
        ref={chatBoxscroll} // refを適用
        sx={{
          height:'82%',
          overflow: 'auto',
            }}>

          {(ResponseData && ResponseData.length > 0 && ResponseData !== "null") ? (ResponseData.map((element, index) => (
            // チャット履歴があるとき
            // element.send_user_id(チャットの送信者のid)とMyUserId(自分のid)が一致すれば右側、そうでなければ左側
            <div key={index}>

              {/* 日にち(毎回表示するわけではない。同じ日にちが2回以上続く場合は省略) */}
              <Typography
                display="flex"
                justifyContent="center"
                variant="caption"
                component="div"
                sx={{
                  //margin: '0 10px',
                  position: 'sticky',
                  top: '0',
                  backgroundColor: '#F9FAFB',
                  zIndex: 1,
                  fontSize: '16px'
                }}
              >
                {GetDay(element.send_datetime)}
              </Typography>

              {/* ここから未読 */}
              {/* メッセージが相手、かつcheck_readが未読 */}
              {element.send_user_id !== MyUserId ? (
                GetStartUnread(element.check_read,element.id)

              ):(null)}

              {/* 削除済みでないメッセージ */}
              {element.check_read !== '削除' ? (
                <>
                  {/* 時間 */}
                  <Typography
                  display="flex"
                  justifyContent={element.send_user_id === MyUserId ? 'flex-end' : 'flex-start'}
                  alignItems="center"  // アイコンとテキストを中央揃え
                  variant="caption"
                  component="div"
                  sx={{
                    margin: '5px 15px 0 55px',
                  }}
                  >
                    {GetTime(element.send_datetime)}
                    {(element.send_user_id === MyUserId && element.edit_flag === 1)?(
                      <>
                        <CircleIcon sx={{ fontSize: '0.4rem', marginLeft: '5px' }} />
                        <span style={{ marginLeft: '5px' }}>編集済み</span> {/* 文字列を追加 */}
                      </>
                    ):(
                      null)}
                  </Typography>

                  {/* メッセージ部分 */}
                  <Box
                    display="flex"
                    justifyContent={element.send_user_id === MyUserId ? 'flex-end' : 'flex-start'}
                    sx={{
                      margin:0
                      }}
                    mb={2}
                  >
                    {/* アイコン (相手のメッセージのみ) */}
                    {(element.send_user_id !== MyUserId)?(
                    <Tooltip title={
                      (chatViewCompanyName ?
                        chatViewCompanyName :
                      chatViewUserName) + "さんのマイページ"}>
                      <Link
                        to={`/Profile/${chatViewUserName}`}
                      >
                        <SelectIcon chatViewIcon={chatViewIcon}/>
                      </Link>
                    </Tooltip>
                    ):(null)}
                    {/* 既読マーク (自分のメッセージのみ) */}
                    {(element.send_user_id === MyUserId && element.check_read === '既読')?(
                      <Box
                      display="flex"
                      justifyContent="flex-end"
                      alignItems="flex-end"
                      sx={{
                        margin:'0 5px 10px 0'
                      }}><Tooltip title={"既読"}>
                        <CheckIcon sx={{ color: green[500] ,fontSize: 20 }}/>
                        </Tooltip>
                      </Box>
                    ):(
                    null)}

                    {/* メッセージ部分(吹き出し) */}
                    <Paper
                      id={element.id}
                      data-message={element.message}
                      aria-controls={anchorElOpen ? 'demo-positioned-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={anchorElOpen ? 'true' : undefined}
                      onClick={element.send_user_id === MyUserId ? (e) => popMenu(e) : null}
                      sx={{
                        padding: '10px',
                        margin:element.send_user_id === MyUserId ?'0 10px 10px 0':'0 0 10px 0',
                        color: 'black',
                        borderRadius: '10px',
                        maxWidth: '60%',
                        // 背景色
                        bgcolor: element.send_user_id === MyUserId ?'#dbdbff':'#dbdbdb',
                        // 背景色(ホバー時)
                        '&:hover': {
                          bgcolor: element.send_user_id === MyUserId ? 'rgba(199, 199, 255)':'rgba(199, 199, 199)',
                        },
                      }}
                    >
                      <Typography variant="body1">
                        {/* 改行、aタグに対応 */}
                        {element.message.split('\n').map((msg, idx) => {

                        const linkRegex = /(https?:\/\/[^\s]+)/g;
                        const msgText = msg.split(linkRegex);

                        return (
                          <React.Fragment key={idx}>
                            {msgText.map((part, index) =>
                              linkRegex.test(part) ? (
                                // aタグを含む場合
                                <a key={index} href={part} target="_blank" rel="noopener noreferrer">
                                  {part}
                                </a>
                              ) : (
                                // aタグを含まない場合
                                part
                              )
                            )}
                            {idx < element.message.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        );
                      })}
                      </Typography>
                    </Paper>

                  </Box>

                  {/* チャットのメッセージを押したときのメニュー (自分のメッセージのみ) */}
                  {(element.send_user_id === MyUserId)?(
                    <Menu
                      id="demo-positioned-menu"
                      aria-labelledby="demo-positioned-button"
                      anchorEl={anchorEl}
                      open={anchorElOpen}
                      onClose={popMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <MenuItem onClick={() => popMenuEdit(popMenuId,popMenuMessage)} ><EditIcon />&nbsp;編集</MenuItem>
                      <MenuItem onClick={() => popMenuDelete(popMenuId)} sx={{color:'red'}}><DeleteIcon color="error"/>&nbsp;削除</MenuItem>
                    </Menu>
                  ):(null)}


                </>
                ) : (
                  // 削除済みのメッセージ
                  <Typography
                    variant="caption"
                    justifyContent={element.send_user_id === MyUserId ? 'flex-end' : 'flex-start'}
                    sx={{
                      margin: '10px',
                      color: 'gray',
                      display:'flex',
                      }}>
                    このメッセージは削除されました
                  </Typography>
                )}
            </div>

          ))):(ResponseData === "null") ? (
              // トークがないとき
              <div>
                メッセージがありません
              </div>
          ):(chatViewId !== null) ? (
            // ローディング(読み込み)
            <div>
              <ColorRingStyle />
            </div>
          ):(null)}

        </Box>

        {/****** チャット送信フォーム ******/}
        {(chatViewId) ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', // 横方向の中央揃え
            width: '100%',
          }}
        >
          <Textarea
            multiline
            minRows={1} // 最小行数
            maxRows={4} // 最大行数
            sx={{
              margin: '1% 3%',
              width: '80%', // 必要に応じて幅を調整
              alignSelf: 'center', // 子要素に適用
            }}
            InputProps={{
              sx: {
                height: '100%', // TextFieldの内部要素も親の高さに合わせる
              },
            }}
            value={TextData}
            onChange={textChange}
            placeholder="メッセージを入力してください"
          />
          <IconButton
            onClick={sendClick}
            sx={{
              '&:hover': { backgroundColor: '#c1e0ff' },
            }}
          >
            <SendIcon color="primary" sx={{ fontSize: 30 }} />
          </IconButton>
        </Box>

        ) : (
          // 未選択状態
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '10%'
          }}>

          </Box>
        )}
      </Box>
      )}
      </Box>
    </>
  )
}

// PropTypesの定義
SelectIcon.propTypes = {
  chatViewIcon:PropTypes.string,
};
FollowGroup.propTypes = {
  title: PropTypes.string,
  followStatusCount: PropTypes.number,
  followStatus: PropTypes.arrayOf(PropTypes.object),
  groupingOpen: PropTypes.bool,
  handleClick: PropTypes.func,
  chatViewId: PropTypes.string,
  chatOpen: PropTypes.func,
  saveScrollPosition: PropTypes.func,
};
UnreadStart.propTypes = {
};
ChatEditModal.propTypes = {
  modalOpen: PropTypes.bool,
  handleModalClose: PropTypes.func,
  chatEditData: PropTypes.string,
  chatEditChange: PropTypes.func,
  chatEditUpDate: PropTypes.func,
};
ColorRingStyle.propTypes = {
};

export default ChatView;