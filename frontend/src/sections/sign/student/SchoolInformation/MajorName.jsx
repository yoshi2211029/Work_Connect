import { useState, useEffect } from "react";
import Select from "react-select";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";

const MajorName = () => {
  const [selectedMajorName, setSelectedMajorName] = useState("");

  const { getSessionData, updateSessionData } = useSessionStorage();
  const [options, setOptions] = useState([]);
  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("student_major_name");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);


  // 外部URLから本アプリにアクセスした際に、sessionStrageに保存する
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      let SessionData = getSessionData("accountData");

      if (SessionData.major_name !== undefined && SessionData.major_name !== "") {
        setSelectedMajorName({
          value: SessionData.major_name,
          label: `${SessionData.major_name}`,
        });
      }
    }
  }, []);

  const handleChange = (selectedOption) => {
    setSelectedMajorName(selectedOption);
    console.log("aa");
    // sessionStrageに値を保存
    updateSessionData("accountData", "major_name", selectedOption.label);
  };

  return (
    <div>
      <p>専攻</p>
      <Select
        id="departmentDropdown"
        value={selectedMajorName}
        onChange={handleChange}
        options={options}
        placeholder="▼"
      />
    </div>
  );
};

export default MajorName;
