import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import PropTypes from 'prop-types';
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";
import InsertTag from 'src/components/tag/InsertTag';

const Environment = ({EnvironmentData}) => {
  const {InsertTagFunction} = InsertTag();
  const [selectedDevEnvironment, setSelectedDevEnvironment] = useState([]);

  const { getSessionData, updateSessionData } = useSessionStorage();

  const [options, setOptions] = useState([]);

  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("company_development_environment");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);
  // valueの初期値をセット
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      const SessionData = getSessionData("accountData");
      if(SessionData.CompanyEnvironmentEditing && SessionData.CompanyEnvironment){
        // セッションストレージから最新のデータを取得
        const devtagArray = SessionData.CompanyEnvironment.split(",").map(item => ({
          value: item,
          label: item,
        }));
        setSelectedDevEnvironment(devtagArray);
      } else if(
        (SessionData.CompanyEnvironmentEditing && SessionData.CompanyEnvironment && EnvironmentData)||
        (!SessionData.CompanyEnvironmentEditing && EnvironmentData)
      ){ // DBから最新のデータを取得
        const devtagArray = EnvironmentData.split(",").map(item => ({
          value: item,
          label: item,
        }));
        setSelectedDevEnvironment(devtagArray);
      }
    }
  }, [EnvironmentData]);

  useEffect(() => {
    let devTag = "";
    let devTagArray = [];
    selectedDevEnvironment.map((item) => {
      devTagArray.push(item.value);
    });
    devTag = devTagArray.join(",");

    updateSessionData("accountData", "CompanyEnvironment", devTag);
  }, [selectedDevEnvironment]);

  const handleChange = (selectedOption, actionMeta) => {
    // newValueをセット
    setSelectedDevEnvironment(selectedOption);
    // 編集中状態をオン(保存もしくはログアウトされるまで保持)
    updateSessionData("accountData", "CompanyEnvironmentEditing", true);

    if (actionMeta && actionMeta.action === 'create-option') {

      const inputValue = actionMeta;
      console.log(inputValue);
      const newOption = { value: inputValue.option.value, label: inputValue.option.label };
      setOptions([...options, newOption]);
      // 23は企業の開発環境です。
      InsertTagFunction(inputValue.option.value, 23);
    }
    let valueArray = [];
    selectedOption.map((value) => {
      valueArray.push(value.value)
    })
  };
  return (
    <div>
      <CreatableSelect
        id="devEnvironment"
        value={selectedDevEnvironment}
        onChange={handleChange}
        options={options}
        placeholder="▼"
        isMulti
      />
    </div>
  );
};

Environment.propTypes = {
  EnvironmentData: PropTypes.string ,
};

export default Environment;
