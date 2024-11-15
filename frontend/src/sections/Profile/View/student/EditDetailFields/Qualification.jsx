import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import PropTypes from 'prop-types';
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";
import InsertTag from 'src/components/tag/InsertTag';


const Qualification = ({ QualificationData }) => {
  const {InsertTagFunction} = InsertTag();

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

  // valueの初期値をセット
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      const SessionData = getSessionData("accountData");
      if (SessionData.QualificationEditing && SessionData.Qualification) {
        // セッションストレージから最新のデータを取得
        const devtagArray = SessionData.Qualification.split(",").map(item => ({
          value: item,
          label: item,
        }));
        setSelectedQualification(devtagArray);
      } else if (
        (SessionData.QualificationEditing && SessionData.Qualification && QualificationData) ||
        (!SessionData.QualificationEditing && QualificationData)
      ) { // DBから最新のデータを取得
        const devtagArray = QualificationData.split(",").map(item => ({
          value: item,
          label: item,
        }));
        setSelectedQualification(devtagArray);
      }
    }
  }, [QualificationData]);

  useEffect(() => {
    let devTag = "";
    let devTagArray = [];
    selectedQualification.map((item) => {
      devTagArray.push(item.value);
    });
    devTag = devTagArray.join(",");

    updateSessionData("accountData", "Qualification", devTag);
  }, [selectedQualification]);

  const handleChange = (selectedOption, actionMeta) => {
    // newValueをセット
    setSelectedQualification(selectedOption);
    // 編集中状態をオン(保存もしくはログアウトされるまで保持)
    updateSessionData("accountData", "QualificationEditing", true);

    if (actionMeta && actionMeta.action === 'create-option') {

      const inputValue = actionMeta;
      console.log(inputValue);
      const newOption = { value: inputValue.option.value, label: inputValue.option.label };
      setOptions([...options, newOption]);
      // 7は学生の取得資格です。
      InsertTagFunction(inputValue.option.value, 7);
    }
    let valueArray = [];
    selectedOption.map((value) => {
      valueArray.push(value.value)
    })
  };

  return (
    <>
      <CreatableSelect
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

Qualification.propTypes = {
  QualificationData: PropTypes.string,
};

export default Qualification;
