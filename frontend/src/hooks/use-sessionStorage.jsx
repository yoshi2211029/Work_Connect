export const useSessionStorage = () => {
  // 情報取得
  const getSessionData = (keyName) => {
    if (sessionStorage.getItem(keyName) !== null) {
      const temp = sessionStorage.getItem(keyName);
      if (temp != null) {
        return JSON.parse(temp);
      }
    }
    return undefined;
  };

  // 追加
  const setSessionData = (keyName, setData) => {
    const temp = JSON.stringify(setData);
    sessionStorage.setItem(keyName, temp);
  };

  // 削除
  const deleteSessionData = (keyName) => {
    sessionStorage.removeItem(keyName);
  };

  // 編集
  const updateSessionData = (sessionKeyName, jsonKeyName, setData) => {
    // console.log("sessionKeyName, jsonKeyName, setData", sessionKeyName, jsonKeyName, setData);
    let sessionData = getSessionData(sessionKeyName);
    // console.log("sessionData", sessionData);
    if (sessionData !== undefined) {
      sessionData[jsonKeyName] = setData;
    } else {
      sessionData = {
        [jsonKeyName]: setData,
      };
    }
    setSessionData(sessionKeyName, sessionData);
  };

  //タグ要素などのオブジェクトデータを保存
  const updateObjectSessionData = (sessionKeyName, setData) => {
    Object.keys(setData).forEach((key) => {
      updateSessionData(sessionKeyName, key, setData[key]);
    });
  };

  //
  // const tagSessionData = (tagName, setStatename) => {
  //   if (getSessionData("accountData") !== undefined) {
  //     let SessionData = getSessionData("accountData");
  //     console.log("SessionData[tagName]", SessionData[tagName]);

  //     if (SessionData[tagName] !== undefined && SessionData[tagName] !== "") {
        
  //       setStatename({
  //         value: SessionData[tagName],
  //         label: `${SessionData[tagName]}`,
  //       });
  //     }
  //   }
  // };

  return {
    getSessionData,
    setSessionData,
    deleteSessionData,
    updateSessionData,
    updateObjectSessionData,
    // tagSessionData,
  };
};
