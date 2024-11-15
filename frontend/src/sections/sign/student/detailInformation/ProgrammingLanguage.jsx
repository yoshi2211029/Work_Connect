import { useState, useEffect } from "react";
import Select from "react-select";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";


const ProgrammingLanguage = () => {
  const [selectedProgrammingLanguage, setselectedProgrammingLanguage] = useState([]);
  const { getSessionData, updateSessionData } = useSessionStorage();
  const [options, setOptions] = useState([]);
  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("student_programming_language");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);


  // すでにプログラミング言語がsessionStrageに保存されていればその値をstateにセットして表示する。
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      let SessionData = getSessionData("accountData");

      if (
        SessionData.programming_language !== undefined &&
        SessionData.programming_language !== ""
      ) {
        let commaArray = SessionData.programming_language.split(",");
        let devtagArray = [];
        commaArray.map((item) => {
          devtagArray.push({ value: item, label: item });
        });
        setselectedProgrammingLanguage(devtagArray);
      }
    }
  }, []);

  useEffect(() => {
    let devTag = "";
    let devTagArray = [];
    selectedProgrammingLanguage.map((item) => {
      devTagArray.push(item.value);
    });
    devTag = devTagArray.join(",");

    updateSessionData("accountData", "programming_language", devTag);
  }, [selectedProgrammingLanguage]);

  const handleChange = (selectedOption) => {
    setselectedProgrammingLanguage(selectedOption);
  };

  return (
    <div>
      <p>プログラミング言語</p>
      <Select
        id="programmingLanguageDropdown"
        value={selectedProgrammingLanguage}
        onChange={handleChange}
        options={options}
        placeholder="▼"
        isMulti
      />
    </div>
  );
};

export default ProgrammingLanguage;
