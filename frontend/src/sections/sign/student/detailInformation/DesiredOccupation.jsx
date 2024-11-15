import { useEffect, useState } from "react";
import Select from "react-select";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";


const DesiredOccupation = () => {
  // const [prefectures, setPrefectures] = useState([]);
  // const [Prefectures, setPrefecture] = useState([]);

  const { getSessionData, updateSessionData } = useSessionStorage();
  const [selectedOccupation, setSelectedOccupation] = useState([]);
  const [options, setOptions] = useState([]);
  const { GetTagAllListFunction } = GetTagAllList();
  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("student_desired_occupation");
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
        SessionData.desired_occupation !== undefined &&
        SessionData.desired_occupation !== ""
      ) {
        let commaArray = SessionData.desired_occupation.split(",");
        let devtagArray = [];
        commaArray.map((item) => {
          devtagArray.push({ value: item, label: item });
        });
        setSelectedOccupation(devtagArray);
      }
    }
    // }
  }, []);

  useEffect(() => {
    let devTag = "";
    let devTagArray = [];
    console.log("selectedOccupation", selectedOccupation);
    selectedOccupation.map((item) => {
      devTagArray.push(item.label);
    });
    devTag = devTagArray.join(",");

    updateSessionData("accountData", "desired_occupation", devTag);
  }, [selectedOccupation]);

  const handleChange = (selectedOption) => {
    setSelectedOccupation(selectedOption);
  };

  return (
    <div>
      <>
        <p>希望職種</p>
        <Select
          id="prefecturesDropdwon"
          value={selectedOccupation}
          onChange={handleChange}
          options={options}
          placeholder="▼"
          isMulti
        />
      </>
    </div>
  );
};

export default DesiredOccupation;
