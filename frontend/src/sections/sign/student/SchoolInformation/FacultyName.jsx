import { useState, useEffect } from "react";
import Select from "react-select";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";

const FacultyNameDropdown = () => {
  const [selectedFaculty, setSelectedFaculty] = useState("");

  const { getSessionData, updateSessionData } = useSessionStorage();
  const [options, setOptions] = useState([]);
  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("student_department_name");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);


  // 外部URLから本アプリにアクセスした際に、sessionStrageに保存する
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      let SessionData = getSessionData("accountData");

      if (SessionData.faculty_name !== undefined && SessionData.faculty_name !== "") {
        setSelectedFaculty({
          value: SessionData.faculty_name,
          label: `${SessionData.faculty_name}`,
        });
      }
    }
  }, []);

  const handleChange = (selectedOption) => {
    setSelectedFaculty(selectedOption);
    console.log("aa");
    // sessionStrageに値を保存
    updateSessionData("accountData", "faculty_name", selectedOption.label);
  };

  return (
    <div>
      <p>学科</p>
      <Select
        id="departmentDropdown"
        value={selectedFaculty}
        onChange={handleChange}
        options={options}
        placeholder="▼"
      />
    </div>
  );
};

export default FacultyNameDropdown;
