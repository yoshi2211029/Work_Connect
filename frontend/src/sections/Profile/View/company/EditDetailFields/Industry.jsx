import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
// import axios from "axios";
import PropTypes from 'prop-types';
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";
import InsertTag from 'src/components/tag/InsertTag';

const Industry = ({IndustryData}) => {
  const {InsertTagFunction} = InsertTag();
  const { getSessionData, updateSessionData } = useSessionStorage();

  const [selectedIndustry, setSelectedIndustry] = useState([]);
  const [options, setOptions] = useState([]);

  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("company_industry");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);


// valueの初期値をセット
useEffect(() => {
  if (getSessionData("accountData") !== undefined){
    const SessionData = getSessionData("accountData");
    if(SessionData.CompanyIndustryEditing && SessionData.CompanyIndustry){
      // セッションストレージから最新のデータを取得
      const devtagArray = SessionData.CompanyIndustry.split(",").map(item => ({
        value: item,
        label: item,
      }));
      setSelectedIndustry(devtagArray);
    } else if(
      (SessionData.CompanyIndustryEditing && SessionData.CompanyIndustry && IndustryData)||
      (!SessionData.CompanyIndustryEditing && IndustryData)
    ){ // DBから最新のデータを取得
      const devtagArray = IndustryData.split(",").map(item => ({
        value: item,
        label: item,
      }));
      setSelectedIndustry(devtagArray);
    }
  }
}, [IndustryData]);

  useEffect(() => {
    let devTag = "";
    let devTagArray = [];
    selectedIndustry.map((item) => {
      devTagArray.push(item.value);
    });
    devTag = devTagArray.join(",");

    updateSessionData("accountData", "CompanyIndustry", devTag);
  }, [selectedIndustry]);

  const handleChange = (selectedOption, actionMeta) => {
    // newValueをセット
    setSelectedIndustry(selectedOption);
    // 編集中状態をオン(保存もしくはログアウトされるまで保持)
    updateSessionData("accountData", "CompanyIndustryEditing", true);

    if (actionMeta && actionMeta.action === 'create-option') {

      const inputValue = actionMeta;
      console.log(inputValue);
      const newOption = { value: inputValue.option.value, label: inputValue.option.label };
      setOptions([...options, newOption]);
      // 22は企業の業界キーワードです。
      InsertTagFunction(inputValue.option.value, 22);
    }
    let valueArray = [];
    selectedOption.map((value) => {
      valueArray.push(value.value)
    })
  };

  return (
    <>
      <CreatableSelect
        id="acquisitionIndustry"
        value={selectedIndustry}
        onChange={handleChange}
        options={options}
        placeholder="▼"
        isMulti
      />
    </>
  );
};

Industry.propTypes = {
  IndustryData: PropTypes.string ,
};

export default Industry;
