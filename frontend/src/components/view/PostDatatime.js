// 投稿日を表示
export function postDateTimeDisplay(postDateTime) {
  // console.log(postDateTime);
  // 変数postDayに日付を格納しておく
  let postDay = postDateTime;

  // インスタンス化
  let posted = new Date(postDay);

  // 差分 = 現在の日時 - 投稿日時
  let diff = new Date().getTime() - posted.getTime();

  // 経過時間をDateに変換
  let progress = new Date(diff);

  //結果を表示するために必要
  let datetime;

  if (progress.getUTCFullYear() - 1970) {
    datetime = progress.getUTCFullYear() - 1970 + "年前";
  } else if (progress.getUTCMonth()) {
    datetime = progress.getUTCMonth() + "ヶ月前";
  } else if (progress.getUTCDate() - 1) {
    datetime = progress.getUTCDate() - 1 + "日前";
  } else if (progress.getUTCHours()) {
    datetime = progress.getUTCHours() + "時間前";
  } else if (progress.getUTCMinutes()) {
    datetime = progress.getUTCMinutes() + "分前";
  } else {
    datetime = "たった今";
  }

  // console.log(datetime);
  return datetime;
}
