import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import PropTypes from 'prop-types';
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";
import InsertTag from 'src/components/tag/InsertTag';


const Software = ({SoftwareData}) => {
  const {InsertTagFunction} = InsertTag();

  const [selectedSoftware, setSelectedSoftware] = useState([]);
  const { getSessionData, updateSessionData } = useSessionStorage();

  const [options, setOptions] = useState([]);

  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("company_software");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);

   // valueの初期値をセット
   useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      const SessionData = getSessionData("accountData");
      if(SessionData.CompanySoftwareEditing && SessionData.CompanySoftware){
        // セッションストレージから最新のデータを取得
        const devtagArray = SessionData.CompanySoftware.split(",").map(item => ({
          value: item,
          label: item,
        }));
        setSelectedSoftware(devtagArray);
      } else if(
        (SessionData.CompanySoftwareEditing && SessionData.CompanySoftware && SoftwareData)||
        (!SessionData.CompanySoftwareEditing && SoftwareData)
      ){ // DBから最新のデータを取得
        const devtagArray = SoftwareData.split(",").map(item => ({
          value: item,
          label: item,
        }));
        setSelectedSoftware(devtagArray);
      }
    }
  }, [SoftwareData]);

  useEffect(() => {
    let devTag = "";
    let devTagArray = [];
    selectedSoftware.map((item) => {
      devTagArray.push(item.value);
    });
    devTag = devTagArray.join(",");

    updateSessionData("accountData", "CompanySoftware", devTag);
  }, [selectedSoftware]);

  const handleChange = (selectedOption, actionMeta) => {
    // newValueをセット
    setSelectedSoftware(selectedOption);
    // 編集中状態をオン(保存もしくはログアウトされるまで保持)
    updateSessionData("accountData", "CompanySoftwareEditing", true);

    if (actionMeta && actionMeta.action === 'create-option') {

      const inputValue = actionMeta;
      console.log(inputValue);
      const newOption = { value: inputValue.option.value, label: inputValue.option.label };
      setOptions([...options, newOption]);
      // 26は企業のソフトウェアです。
      InsertTagFunction(inputValue.option.value, 26);
    }
    let valueArray = [];
    selectedOption.map((value) => {
      valueArray.push(value.value)
    })
  };

  return (
    <>
      <CreatableSelect
        id="Software"
        value={selectedSoftware}
        onChange={handleChange}
        options={options}
        placeholder="▼"
        isMulti
      />
    </>
  );
};

Software.propTypes = {
  SoftwareData: PropTypes.string ,
};

export default Software;
