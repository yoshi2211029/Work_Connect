import { useState, useEffect } from "react";
import Select from "react-select";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";

const Software = () => {
  const [selectedSoftware, setSelectedSoftware] = useState([]);
  const { getSessionData, updateSessionData } = useSessionStorage();
  const [options, setOptions] = useState([]);
  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("student_software");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);

  // すでに趣味がsessionStrageに保存されていればその値をstateにセットして表示する。
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      let SessionData = getSessionData("accountData");

      if (SessionData.software !== undefined && SessionData.software !== "") {
        let commaArray = SessionData.software.split(",");
        let devtagArray = [];
        commaArray.map((item) => {
          devtagArray.push({ value: item, label: item });
        });
        setSelectedSoftware(devtagArray);
      }
    }
  }, []);

  useEffect(() => {
    let devTag = "";
    let devTagArray = [];
    selectedSoftware.map((item) => {
      devTagArray.push(item.value);
    });
    devTag = devTagArray.join(",");

    updateSessionData("accountData", "software", devTag);
  }, [selectedSoftware]);

  const handleChange = (selectedOption) => {
    setSelectedSoftware(selectedOption);
  };

  return (
    <>
      <p>ソフトウェア</p>
      <Select
        id="software"
        value={selectedSoftware}
        onChange={handleChange}
        options={options}
        placeholder="▼"
        isMulti
      />
    </>
  );
};

export default Software;
