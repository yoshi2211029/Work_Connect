import { useState, useEffect } from "react";
import Select from "react-select";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";

const DepartmentNameDropdown = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const { getSessionData, updateSessionData } = useSessionStorage();
  const [options, setOptions] = useState([]);
  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("student_faculty_name");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);


  // 外部URLから本アプリにアクセスした際に、sessionStrageに保存する
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      let SessionData = getSessionData("accountData");

      if (SessionData.department_name !== undefined && SessionData.department_name !== "") {
        setSelectedDepartment({
          value: SessionData.department_name,
          label: `${SessionData.department_name}`,
        });
      }
    }
  }, []);

  const handleChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);

    // sessionStrageに値を保存
    updateSessionData("accountData", "department_name", selectedOption.label);
  };

  return (
    <div>
      <p>学部</p>
      <Select
        id="departmentDropdown"
        value={selectedDepartment}
        onChange={handleChange}
        options={options}
        placeholder="▼"
      />
    </div>
  );
};

export default DepartmentNameDropdown;
