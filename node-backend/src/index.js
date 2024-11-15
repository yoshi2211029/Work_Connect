// src/index.js
const cors = require("cors"); // corsパッケージのインポート
const express = require("express");
const WebSocket = require("ws");
const http = require("http");
const axios = require("axios");
// Expressアプリを初期化
const app = express();

app.use(
  cors({
    origin: "http://localhost:5174", // Reactのサーバーオリジンを許可
  })
);

// WebSocket用のHTTPサーバーを作成
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket接続を保存するためのオブジェクト
let clients = {};

// WebSocketの接続時の処理
wss.on("connection", (ws, req) => {
  const userId = new URL(
    req.url,
    `http://${req.headers.host}`
  ).searchParams.get("userId");
  clients[userId] = ws;

  ws.on("close", () => {
    delete clients[userId];
  });
});

// フォローAPIの実装
app.use(express.json());

app.post("/follow", async (req, res) => {
  const { followerId, followedId } = req.body;

  // laravelにフォロー情報を送信。
  try {
    const response = await axios.post("http://localhost:8000/follow", {
      sender_id: followerId,
      recipient_id: followedId,
    });



    if (response.data.message == "フォロー処理が完了しました") {
      if (response.data.follow_status == "フォローしています" || response.data.follow_status == "相互フォローしています") {
        res.json(response.data);
        if (clients[followedId]) {
          clients[followedId].send(
            JSON.stringify({
              kind: "notification",
              type: "follow",
              message: `ユーザー${followerId}があなたをフォローしました！`,
              follow_status: response.data.follow_status,
              noticeData: response.data.notice_data[0],
              followData: {
                kind: "follow",
                type: "follow",
                message: `ユーザー${followerId}があなたをフォローしました！`,
                follow_status: response.data.follow_status,
              },
            })
          );
        }
      } else if (response.data.follow_status == "フォローされています" || response.data.follow_status == "フォローする") {
        res.json(response.data);
        if (clients[followedId]) {
          clients[followedId].send(
            JSON.stringify({
              kind: "follow",
              type: "follow",
              message: `ユーザー${followerId}があなたをフォローしました！`,
              follow_status: response.data.follow_status,
            })
          );
        }
      }
    } else {
      res.json("何らかの原因でエラーが起きました");
      if (clients[followedId]) {
        clients[followedId].send(
          JSON.stringify({
            type: "follow",
            message: `何らかの原因でエラーが起きました`,
            follow_status: response.data.follow_status,
          })
        );
      }
    }
    // res.sendStatus(200);
  } catch (error) {
    console.error("Error sending follow notification:", error);
  }
});

app.post("/video_posting", async (req, res) => {
  console.log("req.body.body.workData", req.body.body);

  // laravelにフォロー情報を送信。
  try {
    const response = await axios.post(
      "http://localhost:8000/video_posting",
      req.body.body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // console.log(formData);
    // console.log(response.data.message);



    if (response.data.message == "Work data saved successfully") {
      res.json(response.data);
      console.log("response.data.notice_data[0]", response.data.noticeData[0]);
      response.data.follower.map((value) => {
        if (clients[value]) {
          clients[value].send(
            JSON.stringify({
              kind: "notification",
              type: "videoPosting",
              message: `ユーザー${req.body.body.creatorId}が動画を投稿しました！`,
              noticeData: response.data.noticeData[0],
            })
          );
        }
      })
    } else {
      res.json("何らかの原因でエラーが起きました");
      if (clients[followedId]) {
        clients[followedId].send(
          JSON.stringify({
            type: "follow",
            message: `何らかの原因でエラーが起きました`,
            follow_status: response.data.follow_status,
          })
        );
      }
    }
    // res.sendStatus(200);
  } catch (error) {
    console.error("Error sending follow notification:", error);
  }
});

// チャットの取得
app.post("/post_chat", async (req, res) => {
  const { MyUserId, PairUserId, Message } = req.body;

  // laravelにフォロー情報を送信。
  try {
    const response = await axios.post(
      "http://localhost:8000/post_chat"
      , {
      MyUserId: MyUserId, // ログイン中のID
      PairUserId: PairUserId, // チャット相手のID
      Message: Message // メッセージ
    });

    res.json(response.data);

    if (clients[response.data.get_user_id]) {
      clients[response.data.get_user_id].send(
        JSON.stringify({
          kind: "chat",
          type: "post",
          chatData: response.data,
        })
      );
    }
    if (clients[response.data.send_user_id]) {
      clients[response.data.send_user_id].send(
        JSON.stringify({
          kind: "chat",
          type: "post",
          chatData: response.data,
        })
      );
    }
  }

   catch (error) {
    console.error("Error sending follow notification:", error);
  }
});

// チャットの既読
app.post("/already_read_chat", async (req, res) => {
  console.log("Request received at /already_read_chat"); // リクエストが届いているか確認
  const { MyUserId, PairUserId } = req.body;

  // laravelに既読を送信。
  try {
    const response = await axios.post(
      "http://localhost:8000/already_read_chat"
      , {
      MyUserId: MyUserId, // ログイン中のID
      PairUserId: PairUserId, // チャット相手のID
    });

    res.json(response.data);

    if (clients[response.data.send_user_id]) {
      clients[response.data.send_user_id].send(
        JSON.stringify({
          kind: "chat",
          type: "already_read",
          chatData: response.data,
        })
      );
    }
  }

   catch (error) {
    console.error("Error sending follow notification:", error);
  }
});

// チャットの削除
app.post("/delete_chat", async (req, res) => {
  console.log("Request received at /already_read_chat"); // リクエストが届いているか確認
  const { Id } = req.body;

  // laravelにリクエストを送信。
  try {
    const response = await axios.post(
      "http://localhost:8000/delete_chat"
      , {
        Id: Id, // チャットのID
    });

    res.json(response.data);

    if (clients[response.data.send_user_id]) {
      clients[response.data.send_user_id].send(
        JSON.stringify({
          kind: "chat",
          type: "delete",
          chatData: response.data,
        })
      );
    }
    if (clients[response.data.get_user_id]) {
      clients[response.data.get_user_id].send(
        JSON.stringify({
          kind: "chat",
          type: "delete",
          chatData: response.data,
        })
      );
    }
  }

   catch (error) {
    console.error("Error sending follow notification:", error);
  }
});

// チャットの更新
app.post("/update_chat", async (req, res) => {
  console.log("Request received at /already_read_chat"); // リクエストが届いているか確認
  const { Id, Data } = req.body;

  // laravelにリクエストを送信。
  try {
    const response = await axios.post(
      "http://localhost:8000/update_chat"
      , {
        Id: Id, // チャットのID
        Data: Data // 更新するチャットの内容
    });

    res.json(response.data);

    if (clients[response.data.send_user_id]) {
      clients[response.data.send_user_id].send(
        JSON.stringify({
          kind: "chat",
          type: "update",
          chatData: response.data,
        })
      );
    }
    if (clients[response.data.get_user_id]) {
      clients[response.data.get_user_id].send(
        JSON.stringify({
          kind: "chat",
          type: "update",
          chatData: response.data,
        })
      );
    }
  }

   catch (error) {
    console.error("Error sending follow notification:", error);
  }
});

// ニュース投稿
app.post("/news_upload", async (req, res) => {
  console.log("req.body.body.workData", req.body.body);

  // laravelにフォロー情報を送信。
  try {
    const response = await axios.post(
      "http://localhost:8000/news_upload",
      req.body.body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // console.log(formData);
    // console.log(response.data.message);



    if (response.data.message == "successfully") {
      res.json(response.data);
      console.log("response.data.notice_data[0]", response.data.noticeData[0]);
      response.data.follower.map((value) => {
        if (clients[value]) {
          clients[value].send(
            JSON.stringify({
              kind: "notification",
              type: "newsPosting",
              message: "",
              noticeData: response.data.noticeData[0],
            })
          );
        }
      })
    } else {
      res.json("何らかの原因でエラーが起きました");
      if (clients[followedId]) {
        clients[followedId].send(
          JSON.stringify({
            type: "follow",
            message: "",
            follow_status: response.data.follow_status,
          })
        );
      }
    }
    // res.sendStatus(200);
  } catch (error) {
    console.error("Error sending follow notification:", error);
  }
});

// サーバーを起動
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
