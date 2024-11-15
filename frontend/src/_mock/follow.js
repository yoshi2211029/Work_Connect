// senderId と recipientId を使用してフォロー処理を実装する非同期関数
export async function follow(senderId, recipientId) {
  try {
    // フォロー処理のためにPOSTリクエストを送信
    await fetch('http://localhost:3000/follow', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ followerId: senderId, followedId: recipientId }),
    });


    // 成功時の処理（必要に応じて）
    return "成功";

  } catch (error) {
    // エラーハンドリング
    console.error('フォロー処理中にエラーが発生しました！', error);
  }
}
