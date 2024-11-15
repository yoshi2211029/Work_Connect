const sessionAccountData = () => {
  //   セッションデータを取得
  const sessionData = sessionStorage.getItem("accountData");
  if (sessionData) {
    const accountData = JSON.parse(sessionData);
    return accountData;
  }
};

export default sessionAccountData;
