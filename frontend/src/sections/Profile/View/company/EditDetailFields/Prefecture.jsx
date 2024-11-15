import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import PropTypes from 'prop-types';
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";
import InsertTag from 'src/components/tag/InsertTag';

const PrefectureDropdown = ({PrefectureData}) => {
  const {InsertTagFunction} = InsertTag();

  const [selectedPrefecture, setSelectedPrefecture] = useState([]);
  const { getSessionData, updateSessionData } = useSessionStorage();

  const [options, setOptions] = useState([]);

  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("company_prefecture");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);

  // valueの初期値をセット
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      const SessionData = getSessionData("accountData");
      if(SessionData.CompanyPrefectureEditing && SessionData.CompanyPrefecture){
        // セッションストレージから最新のデータを取得
        const devtagArray = SessionData.CompanyPrefecture.split(",").map(item => ({
          value: item,
          label: item,
        }));
        setSelectedPrefecture(devtagArray);
      } else if(
        (SessionData.CompanyPrefectureEditing && SessionData.CompanyPrefecture && PrefectureData)||
        (!SessionData.CompanyPrefectureEditing && PrefectureData)
      ){ // DBから最新のデータを取得
        const devtagArray = PrefectureData.split(",").map(item => ({
          value: item,
          label: item,
        }));
        setSelectedPrefecture(devtagArray);
      }
    }
  }, [PrefectureData]);

  useEffect(() => {
    let devTag = "";
    let devTagArray = [];
    selectedPrefecture.map((item) => {
      devTagArray.push(item.value);
    });
    devTag = devTagArray.join(",");

    updateSessionData("accountData", "CompanyPrefecture", devTag);
  }, [selectedPrefecture]);

  const handleChange = (selectedOption, actionMeta) => {
    // newValueをセット
    setSelectedPrefecture(selectedOption);
    // 編集中状態をオン(保存もしくはログアウトされるまで保持)
    updateSessionData("accountData", "CompanyPrefectureEditing", true);

    if (actionMeta && actionMeta.action === 'create-option') {

      const inputValue = actionMeta;
      console.log(inputValue);
      const newOption = { value: inputValue.option.value, label: inputValue.option.label };
      setOptions([...options, newOption]);
      // 16は企業の勤務地です。
      InsertTagFunction(inputValue.option.value, 16);
    }
    let valueArray = [];
    selectedOption.map((value) => {
      valueArray.push(value.value)
    })
  };

  return (
    <div>
      <>
        <CreatableSelect
          id="prefecturesDropdwon"
          value={selectedPrefecture}
          onChange={handleChange}
          options={options}
          placeholder="▼"
          isMulti
        />
      </>
    </div>
  );
};

PrefectureDropdown.propTypes = {
  PrefectureData: PropTypes.string ,
};

export default PrefectureDropdown;