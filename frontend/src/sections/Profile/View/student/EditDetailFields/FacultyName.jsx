import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import PropTypes from 'prop-types';
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";
import InsertTag from 'src/components/tag/InsertTag';

const FacultyNameDropdown = ({ FacultyNameData }) => {
  const {InsertTagFunction} = InsertTag();
  const [selectedFaculty, setSelectedFaculty] = useState(FacultyNameData);

  const { getSessionData, updateSessionData } = useSessionStorage();

  const [options, setOptions] = useState([]);

  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("student_faculty_name");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);

  // valueの初期値をセット
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      const SessionData = getSessionData("accountData");
      if (SessionData.FacultyNameEditing && SessionData.FacultyName) {
        // セッションストレージから最新のデータを取得
        setSelectedFaculty({
          value: SessionData.FacultyName,
          label: SessionData.FacultyName,
        });
      } else if (
        (SessionData.FacultyNameEditing && SessionData.FacultyName && FacultyNameData) ||
        (!SessionData.FacultyNameEditing && FacultyNameData)
      ) {
        // DBから最新のデータを取得
        setSelectedFaculty({
          value: FacultyNameData,
          label: FacultyNameData,
        });
      }
    }
  }, [FacultyNameData]);

  useEffect(() => {
    if (selectedFaculty) {
      updateSessionData("accountData", "FacultyName", selectedFaculty.value);
    }
  }, [selectedFaculty]);

  const handleChange = (selectedOption, actionMeta) => {
    // newValueをセット
    setSelectedFaculty(selectedOption);
    // 編集中状態をオン(保存もしくはログアウトされるまで保持)
    updateSessionData("accountData", "FacultyNameEditing", true);

    if (actionMeta && actionMeta.action === 'create-option') {
        const inputValue = actionMeta;
        const newOption = { value: inputValue.option.value, label: inputValue.option.label };
        setOptions([...options, newOption]);
        // 18は学生の学部です。
        InsertTagFunction(inputValue.option.value, 18);
    }
  };

  return (
    <div>
      <CreatableSelect
        id="departmentDropdown"
        value={selectedFaculty}
        onChange={handleChange}
        options={options}
        placeholder="▼"
        isClearable
      />
    </div>
  );
};

FacultyNameDropdown.propTypes = {
  FacultyNameData: PropTypes.string,
};

export default FacultyNameDropdown;
