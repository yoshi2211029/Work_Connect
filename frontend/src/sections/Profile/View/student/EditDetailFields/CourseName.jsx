import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import PropTypes from 'prop-types';
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";
import InsertTag from 'src/components/tag/InsertTag';

const CourseNameDropdown = ({ CourseNameData }) => {
  const {InsertTagFunction} = InsertTag();
  const [selectedCourseName, setSelectedCourseName] = useState(CourseNameData);

  const { getSessionData, updateSessionData } = useSessionStorage();

  const [options, setOptions] = useState([]);

  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("student_course_name");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);

  // valueの初期値をセット
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      const SessionData = getSessionData("accountData");
      if (SessionData.CourseNameEditing && SessionData.CourseName) {
        // セッションストレージから最新のデータを取得
        setSelectedCourseName({
          value: SessionData.CourseName,
          label: SessionData.CourseName,
        });
      } else if (
        (SessionData.CourseNameEditing && SessionData.CourseName && CourseNameData) ||
        (!SessionData.CourseNameEditing && CourseNameData)
      ) {
        // DBから最新のデータを取得
        setSelectedCourseName({
          value: CourseNameData,
          label: CourseNameData,
        });
      }
    }
  }, [CourseNameData]);

  useEffect(() => {
    if (selectedCourseName) {
      updateSessionData("accountData", "CourseName", selectedCourseName.value);
    }
  }, [selectedCourseName]);

  const handleChange = (selectedOption, actionMeta) => {
    // newValueをセット
    setSelectedCourseName(selectedOption);
    // 編集中状態をオン(保存もしくはログアウトされるまで保持)
    updateSessionData("accountData", "CourseNameEditing", true);

    if (actionMeta && actionMeta.action === 'create-option') {
        const inputValue = actionMeta;
        const newOption = { value: inputValue.option.value, label: inputValue.option.label };
        setOptions([...options, newOption]);
        // 20は学生のコースです。
        InsertTagFunction(inputValue.option.value, 20);
    }
  };

  return (
    <div>
      <CreatableSelect
        id="departmentDropdown"
        value={selectedCourseName}
        onChange={handleChange}
        options={options}
        placeholder="▼"
        isClearable
      />
    </div>
  );
};

CourseNameDropdown.propTypes = {
  CourseNameData: PropTypes.string,
};

export default CourseNameDropdown;
