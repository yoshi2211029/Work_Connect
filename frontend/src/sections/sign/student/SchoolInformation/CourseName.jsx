import { useState, useEffect } from "react";
import Select from "react-select";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";

const CourceName = () => {
  const [selectedCourceName, setSelectedCourceName] = useState("");

  const { getSessionData, updateSessionData } = useSessionStorage();
  const [options, setOptions] = useState([]);
  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("student_course_name");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);


  // 外部URLから本アプリにアクセスした際に、sessionStrageに保存する
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      let SessionData = getSessionData("accountData");

      if (SessionData.course_name !== undefined && SessionData.course_name !== "") {
        setSelectedCourceName({
          value: SessionData.course_name,
          label: `${SessionData.course_name}`,
        });
      }
    }
  }, []);

  const handleChange = (selectedOption) => {
    setSelectedCourceName(selectedOption);
    console.log("aa");
    // sessionStrageに値を保存
    updateSessionData("accountData", "course_name", selectedOption.label);
  };

  return (
    <div>
      <p>コース</p>
      <Select
        id="departmentDropdown"
        value={selectedCourceName}
        onChange={handleChange}
        options={options}
        placeholder="▼"
      />
    </div>
  );
};

export default CourceName;
