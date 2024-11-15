import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
// import axios from "axios";
import PropTypes from 'prop-types';
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";
import InsertTag from 'src/components/tag/InsertTag';

const SelectedOccupation = ({SelectedOccupationData}) => {
  const {InsertTagFunction} = InsertTag();
  const { getSessionData, updateSessionData } = useSessionStorage();

  const [selectedOccupation, setSelectedOccupation] = useState([]);
  const [options, setOptions] = useState([]);

  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("company_selected_occupation");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);

  // valueの初期値をセット
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      const SessionData = getSessionData("accountData");
      if(SessionData.CompanySelectedOccupationEditing && SessionData.CompanySelectedOccupation){
        // セッションストレージから最新のデータを取得
        const devtagArray = SessionData.CompanySelectedOccupation.split(",").map(item => ({
          value: item,
          label: item,
        }));
        setSelectedOccupation(devtagArray);
      } else if(
        (SessionData.CompanySelectedOccupationEditing && SessionData.CompanySelectedOccupation && SelectedOccupationData)||
        (!SessionData.CompanySelectedOccupationEditing && SelectedOccupationData)
      ){ // DBから最新のデータを取得
        const devtagArray = SelectedOccupationData.split(",").map(item => ({
          value: item,
          label: item,
        }));
        setSelectedOccupation(devtagArray);
      }
    }
  }, [SelectedOccupationData]);

  useEffect(() => {
    let devTag = "";
    let devTagArray = [];
    console.log("selectedOccupation", selectedOccupation);
    selectedOccupation.map((item) => {
      devTagArray.push(item.label);
    });
    devTag = devTagArray.join(",");

    updateSessionData("accountData", "CompanySelectedOccupation", devTag);
  }, [selectedOccupation]);

  const handleChange = (selectedOption, actionMeta) => {
    // newValueをセット
    setSelectedOccupation(selectedOption);
    // 編集中状態をオン(保存もしくはログアウトされるまで保持)
    updateSessionData("accountData", "CompanySelectedOccupationEditing", true);

    if (actionMeta && actionMeta.action === 'create-option') {

      const inputValue = actionMeta;
      console.log(inputValue);
      const newOption = { value: inputValue.option.value, label: inputValue.option.label };
      setOptions([...options, newOption]);
      // 21は企業の社員の職種・募集職種です。
      InsertTagFunction(inputValue.option.value, 21);
    }
    let valueArray = [];
    selectedOption.map((value) => {
      valueArray.push(value.value)
    })
  };

  return (
    <CreatableSelect
        name="selectedOccupation"
        id="prefecturesDropdwon"
        value={selectedOccupation}
        onChange={handleChange}
        options={options}
        placeholder="▼"
        isMulti
    />
  );
};

SelectedOccupation.propTypes = {
  SelectedOccupationData: PropTypes.string ,
};

export default SelectedOccupation;



