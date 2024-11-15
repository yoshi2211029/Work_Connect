import { useEffect, useState } from "react";

// フォローボタンと通知コンポーネント
const Follow = (/*{ userId, followId }*/) => {
  const [notifications, setNotifications] = useState([]);
  const [ws, setWs] = useState(null);

  const userId = "C_0000000002";
  const followId = "S_000000000001";

  // WebSocket接続
  useEffect(() => {
    const newWs = new WebSocket(`ws://localhost:3000?userId=${userId}`); // 修正: ws://を使用
    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "follow") {
        setNotifications((prev) => [...prev, data.message]);
        console.log("WebSocket: newWs.onmessage: ", data.message);
      }
    };
    newWs.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, [userId]);

  // フォローボタンクリック時の処理
  const handleFollow = async () => {
    // バックエンドにフォローリクエストを送信
    await fetch("http://localhost:3000/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ followerId: userId, followedId: followId }),
    });
  };

  useEffect(() => {
    console.log(ws); // WebSocketインスタンスを確認
  }, [ws]);
  return (
    <div>
      <h2>フォローボタン</h2>
      <button onClick={handleFollow}>フォローする</button>

      <h2>通知</h2>
      <ul>
        {notifications &&
          notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
      </ul>
    </div>
  );
};
export default Follow;
