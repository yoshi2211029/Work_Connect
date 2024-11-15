import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import PropTypes from 'prop-types';

export default function Text({ onSave, onCancel,questionData }) {
    const [title, setTitle] = useState("");
    const [maxLength, setMaxLength] = useState("");
    const [minLength, setMinLength] = useState("");
    const [selectedType, setSelectedType] = useState(null);
    const [placeholder, setPlaceholder] = useState("");
    const [autocomplete, setAutoComplete] = useState(false);
    const [isRequired, setIsRequired] = useState(false);
    const [description, setDescription] = useState("");
    const [validatorsMinLength, setValidatorsMinLength] = useState("");
    const [validatorsMaxLength, setValidatorsMaxLength] = useState("");
    const [validatorstext, setValidatorstext] = useState("");

    const inputtype = [
        { label: 'テキスト', id: 1, name: "username" },
        { label: 'メールアドレス', id: 2, name: "email" },
        { label: 'パスワード', id: 3, name: "password" },
        { label: 'URL', id: 4, name: "url" },
    ];

    // questionData が変更されたら、各フィールドにデータをセットする
    useEffect(() => {
        if (questionData) {
            setTitle(questionData.title || "");
            setMaxLength(questionData.maxLength || "");
            setMinLength(questionData.minLength || "");
            setSelectedType(inputtype.find(type => type.name === questionData.inputType) || null);
            setPlaceholder(questionData.placeholder || "");
            setAutoComplete(questionData.autocomplete || false);
            setIsRequired(questionData.isRequired || false);
            setDescription(questionData.description || "");

            if (questionData.validators && questionData.validators[0]) {
                setValidatorsMinLength(questionData.validators[0].minLength || "");
                setValidatorsMaxLength(questionData.validators[0].maxLength || "");
                setValidatorstext(questionData.validators[0].text || "");
            }
        }
    }, [questionData]);

    // 保存ボタンがクリックされた時にデータを親コンポーネントに渡す
    const handleSave = () => {
        const validators = [];
        if (validatorsMinLength || validatorsMaxLength || validatorstext) {
            validators.push({
                type: 'text',
                maxLength: validatorsMaxLength ? parseInt(validatorsMaxLength, 10) : undefined,
                minLength: validatorsMinLength ? parseInt(validatorsMinLength, 10) : undefined,
                text: validatorstext || ""
            });
        }

        const settings = {
            title: title || "新しい質問",
            inputType: selectedType ? selectedType.name : "username",
            maxLength: maxLength ? parseInt(maxLength, 10) : undefined,
            minLength: minLength ? parseInt(minLength, 10) : undefined,
            placeholder: placeholder || "",
            autocomplete: autocomplete || false,
            isRequired: isRequired || false,
            description: description || "",
            validators: validators
        };

        onSave(settings);
        console.log("設定", settings);
    };

        //編集をキャンセルして追加したフォームを削除
        const handleCancel = () =>{
            onCancel();
        }

    return (
        <div className="TextSetting">
            <Stack spacing={2}>
                <Typography variant="h6">テキストフォーム設定</Typography>

                <Autocomplete
                    disablePortal
                    options={inputtype}
                    value={selectedType}
                    onChange={(event, newValue) => setSelectedType(newValue)}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="種類" />}
                />

                <TextField
                    label="タイトル"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                />
                
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

Text.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    questionData: PropTypes.object
};
