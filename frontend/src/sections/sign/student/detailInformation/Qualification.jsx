import { useState, useEffect } from "react";
import Select from "react-select";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";

const Qualification = () => {
  const [selectedQualification, setSelectedQualification] = useState([]);
  const { getSessionData, updateSessionData } = useSessionStorage();
  const [options, setOptions] = useState([]);
  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("student_acquisition_qualification");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);

  // すでに取得資格がsessionStrageに保存されていればその値をstateにセットして表示する。
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      let SessionData = getSessionData("accountData");

      if (SessionData.acquisition_qualification !== undefined && SessionData.acquisition_qualification !== "") {
        let commaArray = SessionData.acquisition_qualification.split(",");
        let devtagArray = [];
        commaArray.map((item) => {
          devtagArray.push({ value: item, label: item });
        });
        setSelectedQualification(devtagArray);
      }
    }
  }, []);

  useEffect(() => {
    let devTag = "";
    let devTagArray = [];
    selectedQualification.map((item) => {
      devTagArray.push(item.value);
    });
    devTag = devTagArray.join(",");

    updateSessionData("accountData", "acquisition_qualification", devTag);
  }, [selectedQualification]);

  const handleChange = (selectedOption) => {
    setSelectedQualification(selectedOption);
  };

  return (
    <>
      <p>取得資格</p>
      <Select
        id="acquisitionQualification"
        value={selectedQualification}
        onChange={handleChange}
        options={options}
        placeholder="▼"
        isMulti
      />
    </>
  );
};

export default Qualification;
