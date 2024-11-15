import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import PropTypes from 'prop-types';
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import GetTagAllList from "src/components/tag/GetTagAllList";
import InsertTag from 'src/components/tag/InsertTag';


const Hobby = ({ HobbyData }) => {
  const {InsertTagFunction} = InsertTag();

  const [selectedHobby, setSelectedHobby] = useState([]);
  const { getSessionData, updateSessionData } = useSessionStorage();

  const [options, setOptions] = useState([]);

  const { GetTagAllListFunction } = GetTagAllList();

  useEffect(() => {
    let optionArrayPromise = GetTagAllListFunction("student_hobby");
    optionArrayPromise.then((result) => {
      setOptions(result);
    });
  }, []);



  // valueの初期値をセット
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      const SessionData = getSessionData("accountData");
      if (SessionData.HobbyEditing && SessionData.Hobby) {
        // セッションストレージから最新のデータを取得
        const devtagArray = SessionData.Hobby.split(",").map(item => ({
          value: item,
          label: item,
        }));
        setSelectedHobby(devtagArray);
      } else if (
        (SessionData.HobbyEditing && SessionData.Hobby && HobbyData) ||
        (!SessionData.HobbyEditing && HobbyData)
      ) { // DBから最新のデータを取得
        const devtagArray = HobbyData.split(",").map(item => ({
          value: item,
          label: item,
        }));
        setSelectedHobby(devtagArray);
      }
    }
  }, [HobbyData]);

  useEffect(() => {
    let devTag = "";
    let devTagArray = [];
    selectedHobby.map((item) => {
      devTagArray.push(item.value);
    });
    devTag = devTagArray.join(",");

    updateSessionData("accountData", "Hobby", devTag);
  }, [selectedHobby]);

  const handleChange = (selectedOption, actionMeta) => {
    // newValueをセット
    setSelectedHobby(selectedOption);
    // 編集中状態をオン(保存もしくはログアウトされるまで保持)
    updateSessionData("accountData", "HobbyEditing", true);

    if (actionMeta && actionMeta.action === 'create-option') {

      const inputValue = actionMeta;
      console.log(inputValue);
      const newOption = { value: inputValue.option.value, label: inputValue.option.label };
      setOptions([...options, newOption]);
      // 8は学生の趣味です。
      InsertTagFunction(inputValue.option.value, 8);
    }
    let valueArray = [];
    selectedOption.map((value) => {
      valueArray.push(value.value)
    })
  };

  return (
    <div>
      <CreatableSelect
        id="hobbyDropdown"
        value={selectedHobby}
        onChange={handleChange}
        options={options}
        placeholder="▼"
        isMulti
      />
    </div>
  );
};

Hobby.propTypes = {
  HobbyData: PropTypes.string,
};

export default Hobby;
