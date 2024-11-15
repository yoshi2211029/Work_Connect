import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import axios from "axios";

import ChatIcon from "@mui/icons-material/Chat";
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';

import { WebScokectContext } from "src/layouts/dashboard/index";
import { MyContext } from "src/layouts/dashboard/index";

const ChatPng = () => {

  // websocket通信のデータ保存先
  const chatContext = useContext(WebScokectContext);
  /// セッションストレージ取得
  const { getSessionData } = useSessionStorage();
  // Laravelとの通信用URL
  const all_unread_chat = "http://localhost:8000/all_unread_chat";

  // テキストの文章を保持する変数
  const [count, setCount] = useState(null);

  const Display = useContext(MyContext);
  const navigate = useNavigate();

  // WebSocketStateのChatが変化したとき
  useEffect(() => {
    AllUnreadCount();
  }, [chatContext.WebSocketState.Chat]);

  // アイコンを押したとき
  const handleClick = () => {
    navigate(`/Chat`);
  };

  // チャットのすべての未読件数を取得
  const AllUnreadCount = () => {
    async function GetData() {
      try {
        // Laravel側からデータを取得
        const response = await axios.get(all_unread_chat, {
          params: {
            MyUserId: getSessionData("accountData").id, // ログイン中のID
          },
        });
        if (response) {
          setCount(response.data);
        }
      } catch (err) {
        console.log("err:", err);
      }
    }
    // DBからデータを取得
    if(getSessionData("accountData")){
      GetData();
    }
  };

  return (
    <IconButton
      onClick={handleClick}
      sx={{
        marginLeft: 'auto', // 右揃え
        '&:hover': { backgroundColor: '#f0f0f0' },
      }}
    >
      <Badge badgeContent={count} color="error">
        <ChatIcon color="action" style={{ display: Display.HomePage }} />
      </Badge>

    </IconButton>
  );
};

export default ChatPng;
