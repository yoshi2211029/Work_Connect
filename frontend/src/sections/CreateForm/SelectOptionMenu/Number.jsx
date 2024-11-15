import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import Divider from "@mui/material/Divider";



export default function Number({ onSave, onCancel, questionData }) {
    const [title, setTitle] = useState("");
    const [selectedType, setSelectedType] = useState(null);
    const [isrequired, setIsrequired] = useState(false);
    const [defaultValue, setDefaultValue] = useState(0);
    const [step, setStep] = useState(0);
    const [validatorstext, setValidatorstext] = useState("電話番号として認識できません");
    const [placeholder, setPlaceholder] = useState("");
    const [hyphen, sethyphen] = useState(false);



    const [max, setMax] = useState();
    const [min, setMin] = useState();


    // 保存ボタンがクリックされた時にデータを親コンポーネントに渡す
    const handleSave = () => {

        const validators = [];
        if (validatorstext) {
            if (hyphen) {
                validators.push({
                    type: 'regex',
                    regex: '^0\\d{1,4}-\\d{1,4}-\\d{4}$',
                    text: validatorstext || ""
                });

            } else {
                validators.push({
                    type: 'regex',
                    regex: '^0\\d{9,10}$',
                    text: validatorstext || ""
                });
            }

        }

        const settings = {
            title: title || "新しい質問",
            inputType: selectedType ? selectedType.name : "number",
            isRequired: isrequired || false,
            defaultValue: defaultValue || 0,
            min: min ? parseFloat(min) : undefined,
            max: max ? parseFloat(max) : undefined,
            step: step ? parseFloat(step) : undefined,
            autocomplete: "tel",
            placeholder: placeholder || undefined,
            validators: validators,
        };
        onSave(settings);
        console.log("設定", settings);
    };

    //編集をキャンセルして追加したフォームを削除
    const handleCancel = () => {
        onCancel();
    }

    const inputtype = [
        { label: '数値', id: 1, name: "number" },
        { label: '範囲', id: 2, name: "range" },
        { label: '電話番号', id: 3, name: "tel" },
    ];

    // questionData が変更されたら、各フィールドにデータをセットする
    useEffect(() => {
        if (questionData) {
            setTitle(questionData.title || "");
            setSelectedType(inputtype.find(type => type.name === questionData.inputType) || null);
            setIsrequired(questionData.isrequired || false);
            setDefaultValue(questionData.defaultValue || 0);
            setMax(questionData.max || "");
            setMin(questionData.min || "");
            setStep(questionData.step || 0);
            setPlaceholder(questionData.placeholder || "");

            if (questionData.validators && questionData.validators[0]) {
                setValidatorstext(questionData.validators[0].text || "");
            }
        }
    }, [questionData]);

    useEffect(() => {
        if (selectedType?.name === "number") {
            const count = (parseFloat(min) + parseFloat(max)) / 2;
            setDefaultValue(count);
        }
    }, [selectedType, min, max, setDefaultValue]);



    return (
        <div className="TextSetting">
            <Stack spacing={2}>
                <Typography variant="h6">数値フォーム設定</Typography>

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

                {selectedType?.name === "number" && (
                    <div>
                        <TextField
                            label="最小値"
                            value={min}
                            onChange={(e) => setMin(e.target.value)}
                            type="number"
                            fullWidth
                            InputProps={{ inputProps: { min: 0 } }} // 必要に応じて最小値を設定
                        />
                        <TextField
                            label="最大値"
                            value={max}
                            onChange={(e) => setMax(e.target.value)}
                            type="number"
                            fullWidth
                            InputProps={{ inputProps: { max: 100 } }} // 必要に応じて最大値を設定
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

                {selectedType?.name === "range" && (
                    <div>
                        <TextField
                            label="最小値"
                            value={min}
                            onChange={(e) => setMin(e.target.value)}
                            type="number"
                            fullWidth
                            InputProps={{ inputProps: { min: 0 } }} // 必要に応じて最小値を設定
                        />
                        <TextField
                            label="最大値"
                            value={max}
                            onChange={(e) => setMax(e.target.value)}
                            type="number"
                            fullWidth
                            InputProps={{ inputProps: { max: 100 } }} // 必要に応じて最大値を設定
                        />

                        <TextField
                            label="ステップ"
                            value={step}
                            onChange={(e) => setStep(e.target.value)}
                            type="number"
                            fullWidth
                        />

                    </div>
                )}

                {selectedType?.name === "tel" && (
                    <div>

                        <TextField
                            label="プレースホルダー"
                            value={placeholder}
                            onChange={(e) => setPlaceholder(e.target.value)}
                            type="text"
                            fullWidth
                        />

                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Checkbox
                                checked={isrequired}
                                onChange={(e) => setIsrequired(e.target.checked)}
                            />
                            <Typography>フォームを必須にする</Typography>
                        </Stack>

                        <Divider color="black" sx={{ borderStyle: 'dashed', display: 'block' }} />
                        <p>エラーチェック</p>

                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Checkbox
                                checked={hyphen}
                                onChange={(e) => sethyphen(e.target.checked)}
                            />
                            <Typography>ハイフンを必須にする</Typography>
                        </Stack>

                        <TextField
                            label="エラー時の警告メッセージ"
                            value={validatorstext}
                            onChange={(e) => setValidatorstext(e.target.value)}
                            type="text"
                            fullWidth
                        />
                        <Divider color="black" sx={{ borderStyle: 'dashed', marginBottom: '10px', display: 'block' }} />

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

Number.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    questionData: PropTypes.object
};
