import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useSessionStorage } from "src/hooks/use-sessionStorage";

const PrefectureSelect = () => {
  const [Prefectures, setPrefectures] = useState([]);
  const [Prefecture, setPrefecture] = useState([]);

  const { getSessionData, updateSessionData } = useSessionStorage();
  useEffect(() => {
    // RESAS APIのエンドポイントとAPIキー
    const apiEndpoint = "https://opendata.resas-portal.go.jp/api/v1/prefectures";
    const apiKey = "VmOPglAdJHKbMUCUooHSY8qaA0llxEVlwqqCpmof"; // ここに取得したAPIキーを入力してください

    const fetchPrefectures = async () => {
      try {
        const response = await axios.get(apiEndpoint, {
          headers: { "X-API-KEY": apiKey },
        });
        const data = response.data.result.map((pref) => ({
          value: pref.prefCode,
          label: pref.prefName,
        }));
        setPrefectures(data);
      } catch (error) {
        console.error("Failed to fetch prefectures", error);
      }
    };

    fetchPrefectures();
  }, []);

  // 外部URLから本アプリにアクセスした際に、sessionStrageに保存する
  useEffect(() => {
    // if (performance.navigation.type !== performance.navigation.TYPE_RELOAD) {
    // console.log("外部URLからアクセスしたです。");
    if (getSessionData("accountData") !== undefined) {
      let SessionData = getSessionData("accountData");

      if (SessionData.Prefecture !== undefined && SessionData.Prefecture !== "") {
        let commaArray = SessionData.Prefecture.split(",");
        let devtagArray = [];
        commaArray.map((item) => {
          devtagArray.push({ value: item, label: item });
        });
        setPrefecture(devtagArray);
      }
    }
    // }
  }, []);

  useEffect(() => {
    let devTag = "";
    let devTagArray = [];
    console.log("Prefecture", Prefecture);
    Prefecture.map((item) => {
      devTagArray.push(item.label);
    });
    devTag = devTagArray.join(",");

    updateSessionData("accountData", "Prefecture", devTag);
  }, [Prefecture]);

  const handleChange = (selectedOption) => {
    setPrefecture(selectedOption);
  };

  return (
    <div>
      <>
        <p>勤務地</p>
        <Select
          id="prefecturesDropdwon"
          value={Prefecture}
          onChange={handleChange}
          options={Prefectures}
          required
          placeholder="▼"
          isMulti
        />
      </>
    </div>
  );
};

export default PrefectureSelect;
