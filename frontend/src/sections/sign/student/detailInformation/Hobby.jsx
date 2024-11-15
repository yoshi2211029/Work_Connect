import { useState, useEffect } from "react";
import Select from "react-select";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";

const Hobby = () => {
  const [selectedDepartment, setSelectedHobby] = useState([]);
  const { getSessionData, updateSessionData } = useSessionStorage();
  const [options, setOptions] = useState([]);
  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("student_hobby");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);

  // すでに趣味がsessionStrageに保存されていればその値をstateにセットして表示する。
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      let SessionData = getSessionData("accountData");

      if (SessionData.hobby !== undefined && SessionData.hobby !== "") {
        let commaArray = SessionData.hobby.split(",");
        let devtagArray = [];
        commaArray.map((item) => {
          devtagArray.push({ value: item, label: item });
        });
        setSelectedHobby(devtagArray);
      }
    }
  }, []);

  useEffect(() => {
    let devTag = "";
    let devTagArray = [];
    selectedDepartment.map((item) => {
      devTagArray.push(item.value);
    });
    devTag = devTagArray.join(",");

    updateSessionData("accountData", "hobby", devTag);
  }, [selectedDepartment]);

  const handleChange = (selectedOption) => {
    setSelectedHobby(selectedOption);
  };

  return (
    <div>
      <p>趣味</p>
      <Select
        id="hobbyDropdown"
        value={selectedDepartment}
        onChange={handleChange}
        options={options}
        placeholder="▼"
        isMulti
      />
    </div>
  );
};

export default Hobby;
