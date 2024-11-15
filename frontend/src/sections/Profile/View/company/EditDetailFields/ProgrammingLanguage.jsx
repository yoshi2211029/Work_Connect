import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import PropTypes from 'prop-types';
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";
import InsertTag from 'src/components/tag/InsertTag';

const ProgrammingLanguage = ({ProgrammingLanguageData}) => {

  const {InsertTagFunction} = InsertTag();

  const [selectedProgrammingLanguage, setselectedProgrammingLanguage] = useState([]);

  const { getSessionData, updateSessionData } = useSessionStorage();

  const [options, setOptions] = useState([]);

  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("company_programming_language");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);

  // valueの初期値をセット
  useEffect(() => {

    if (getSessionData("accountData") !== undefined) {
      const SessionData = getSessionData("accountData");
      if(SessionData.CompanyProgrammingLanguageEditing && SessionData.CompanyProgrammingLanguage){
        // セッションストレージから最新のデータを取得
        const devtagArray = SessionData.CompanyProgrammingLanguage.split(",").map(item => ({
          value: item,
          label: item,
        }));
        setselectedProgrammingLanguage(devtagArray);
      } else if(
        (SessionData.CompanyProgrammingLanguageEditing && SessionData.CompanyProgrammingLanguage && ProgrammingLanguageData)||
        (!SessionData.CompanyProgrammingLanguageEditing && ProgrammingLanguageData)
      ){ // DBから最新のデータを取得
        const devtagArray = ProgrammingLanguageData.split(",").map(item => ({
          value: item,
          label: item,
        }));
        setselectedProgrammingLanguage(devtagArray);
      }
    }
  }, [ProgrammingLanguageData]);

  useEffect(() => {
    let devTag = "";
    let devTagArray = [];
    selectedProgrammingLanguage.map((item) => {
      devTagArray.push(item.value);
    });
    devTag = devTagArray.join(",");

    updateSessionData("accountData", "CompanyProgrammingLanguage", devTag);
  }, [selectedProgrammingLanguage]);

  const handleChange = (selectedOption, actionMeta) => {
    // newValueをセット
    setselectedProgrammingLanguage(selectedOption);
    // 編集中状態をオン(保存もしくはログアウトされるまで保持)
    updateSessionData("accountData", "CompanyProgrammingLanguageEditing", true);

    if (actionMeta && actionMeta.action === 'create-option') {

      const inputValue = actionMeta;
      console.log(inputValue);
      const newOption = { value: inputValue.option.value, label: inputValue.option.label };
      setOptions([...options, newOption]);
      // 24は企業のプログラミング言語です。
      InsertTagFunction(inputValue.option.value, 24);
    }
    let valueArray = [];
    selectedOption.map((value) => {
      valueArray.push(value.value)
    })
  };

  return (
    <div>
      <CreatableSelect
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

ProgrammingLanguage.propTypes = {
  ProgrammingLanguageData: PropTypes.string ,
};

export default ProgrammingLanguage;
