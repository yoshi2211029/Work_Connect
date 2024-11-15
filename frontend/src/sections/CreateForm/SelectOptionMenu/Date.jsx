import { useEffect,useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import "../CreateForm.css";


export default function Data({ onSave,onCancel,questionData }) {
    const [title, setTitle] = useState("");
    const [selectedType, setSelectedType] = useState(null);
    const [isrequired, setIsrequired] = useState(false);
    const [pastdate, setPastDate] = useState(false);
    const [defaultValueExpression, setdefaultValueExpression] = useState("");


    const [max, setMax] = useState("");
    const [min, setMin] = useState("");

        // questionData が変更されたら、各フィールドにデータをセットする
        useEffect(() => {
            if (questionData) {
                setTitle(questionData.title || "");
                setSelectedType(inputtype.find(type => type.name === questionData.inputType) || null);
                setIsrequired(questionData.isRequired || false);
                // setPastDate(questionData.isRequired || false);
                setMin(questionData.min || "");
                setMax(questionData.max || "");
                setdefaultValueExpression(questionData.defaultValueExpression || "");

                if(questionData.minValueExpression){
                    setPastDate(true)
                }

            }
        }, [questionData]);



    // 保存ボタンがクリックされた時にデータを親コンポーネントに渡す
    const handleSave = () => {

        const settings = {
            title: title || "新しい質問",
            inputType: selectedType ? selectedType.name : "date",
            isRequired: isrequired || false,
            defaultValueExpression: defaultValueExpression || "",
            minValueExpression: pastdate ? "today()" : undefined,
            min: min || undefined,
            max: max || undefined,

        };
        onSave(settings);
        console.log("設定", settings);
    };

    //編集をキャンセルして追加したフォームを削除
    const handleCancel = () =>{
        onCancel();
    }

    const inputtype = [
        { label: '日付', id: 1, name: "date" },
        { label: '時間', id: 2, name: "time" },
        { label: '日付と時間', id: 3, name: "datetime-local" },
        { label: '月', id: 4, name: "month" },
        { label: '週', id: 4, name: "week" },

    ];

    useEffect(() => {
        if (selectedType?.name === "datetime-local") {
          setdefaultValueExpression("currentDate()");
        }else if(selectedType?.name === "date"){
            setdefaultValueExpression("today()");
        }
      }, [selectedType, setdefaultValueExpression]);



    return (
        <div className="TextSetting">
            <Stack spacing={2}>
                <Typography variant="h6">日時フォーム設定</Typography>

                <Autocomplete
                    disablePortal
                    options={inputtype}
                    value={selectedType}
                    onChange={(event, newValue) => setSelectedType(newValue)}
                    isOptionEqualToValue={(option, value) => option.name === value?.name}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="種類" />}
                />

                <TextField
                    label="タイトル"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                />

                {selectedType?.name === "date" && (
                    <div>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Checkbox
                                checked={pastdate}
                                onChange={(e) => setPastDate(e.target.checked)}
                            />
                            <Typography>過去の日時を選択できないようにする</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Checkbox
                                checked={isrequired}
                                onChange={(e) => setIsrequired(e.target.checked)}
                            />
                            <Typography>フォームを必須にする</Typography>
                        </Stack>
                    </div>
                )}

                {selectedType?.name === "time" && (
                    <div>
                        <TextField
                            label="開始の時刻"
                            value={min}
                            onChange={(e) => setMin(e.target.value)}
                            type="time"
                            fullWidth
                        />

                        <TextField
                            label="終了の時刻"
                            value={max}
                            onChange={(e) => setMax(e.target.value)}
                            type="time"
                            fullWidth
                        />


                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Checkbox
                                checked={isrequired}
                                onChange={(e) => setIsrequired(e.target.checked)}
                            />
                            <Typography>フォームを必須にする</Typography>
                        </Stack>
                    </div>
                )}

                {selectedType?.name === "datetime-local" && (
                    <div>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Checkbox
                                checked={isrequired}
                                onChange={(e) => setIsrequired(e.target.checked)}
                            />
                            <Typography>フォームを必須にする</Typography>
                        </Stack>
                    </div>
                )}


                <Button variant="contained" color="primary" onClick={handleSave}  className="FormButton">
                    保存
                </Button>

                <Button variant="contained" color="primary" onClick={handleCancel} className="FormButton">
                    キャンセル
                </Button>
            </Stack>
        </div>
    );
}

Data.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    questionData: PropTypes.object
};
