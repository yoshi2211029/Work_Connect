import { useState, useEffect } from "react";
import Select from "react-select";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";

const Environment = () => {
  const [selectedDevEnvironment, setSelectedDevEnvironment] = useState([]);
  // 登録項目確認の際に利用
  const { getSessionData, updateSessionData } = useSessionStorage();

  const [options, setOptions] = useState([]);

  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("student_development_environment");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);

  // 外部URLから本アプリにアクセスした際に、sessionStrageに保存する
  useEffect(() => {
    // if (performance.navigation.type !== performance.navigation.TYPE_RELOAD) {
    // console.log("外部URLからアクセスしたです。");
    if (getSessionData("accountData") !== undefined) {
      let SessionData = getSessionData("accountData");

      if (
        SessionData.development_environment !== undefined &&
        SessionData.development_environment !== ""
      ) {
        let commaArray = SessionData.development_environment.split(",");
        let devtagArray = [];
        commaArray.map((item) => {
          devtagArray.push({ value: item, label: item });
        });
        setSelectedDevEnvironment(devtagArray);
      }
    }
    // }
  }, []);

  useEffect(() => {
    let devTag = "";
    let devTagArray = [];
    selectedDevEnvironment.map((item) => {
      devTagArray.push(item.value);
    });
    devTag = devTagArray.join(",");

    updateSessionData("accountData", "development_environment", devTag);
  }, [selectedDevEnvironment]);

  const handleChange = (selectedOption) => {
    setSelectedDevEnvironment(selectedOption);
  };

  return (
    <div>
      <p>開発環境</p>
      <Select
        id="devEnvironment"
        value={selectedDevEnvironment}
        onChange={handleChange}
        options={options}
        placeholder="▼"
        isMulti
      />
    </div>
  );
};

export default Environment;
