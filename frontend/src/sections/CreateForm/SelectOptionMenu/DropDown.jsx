import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Checkbox from "@mui/material/Checkbox";

export default function DropDown({ onSave, onCancel, questionData }) {
    const [title, setTitle] = useState("");
    const [isRequired, setIsRequired] = useState(false);
    const [showNoneItem, setShowNoneItem] = useState(false);
    const [showOtherItem, setShowOtherItem] = useState(false);
    const [Type, setType] = useState(false);
    const [choices, setChoices] = useState([""]);



    const handleChoiceChange = (index, value) => {
        const updatedChoices = [...choices];
        updatedChoices[index] = value;
        setChoices(updatedChoices);
    };

    const addChoiceField = () => {
        setChoices([...choices, ""]);
    };



    // questionData が変更されたら、各フィールドにデータをセットする
    useEffect(() => {
        if (questionData) {
            console.log("質問の内容",questionData);
            setTitle(questionData.title || "");
            setIsRequired(questionData.isRequired || false);
            setShowNoneItem(questionData.showNoneItem || false);
            setShowOtherItem(questionData.showOtherItem || false);
            // choicesが存在する場合、テキストを抽出してセットする
            const processedChoices = (questionData.choices || []).map(choice => {
                // `text` または `jsonObj` からテキストを取り出す
                return choice.text || choice.jsonObj || "";
            });
            setChoices(processedChoices);

            if (questionData?.Type === "tagbox" || questionData?.jsonObj?.type === "tagbox") {
                setType(true);
                console.log("タグボックスです!");
            } else if (questionData?.Type === "dropdown" || questionData?.jsonObj?.type === "dropdown") {
                setType(false);
                console.log(questionData?.jsonObj?.type);
                console.log("タグボックスではありません!");
            }
        }
    }, [questionData]);

    const handleSave = () => {
        const settings = {
            title: title || "新しい質問",
            fitToContainer: false,
            isRequired: isRequired || false,
            showNoneItem: showNoneItem || false,
            showOtherItem: showOtherItem || false,
            choices: choices.filter((choice) => choice.trim() !== ""), // 空白の選択肢を除く
        };

        if (showNoneItem) {
            settings.noneText = "該当なし";
        }

        if (showOtherItem) {
            settings.otherText = "その他";
        }

        if (Type) {
            settings.type = "tagbox";
        } else {
            settings.type = "dropdown";
        }


        onSave(settings);
        console.log("設定", settings);
    };

    //編集をキャンセルして追加したフォームを削除
    const handleCancel = () => {
        onCancel();
    }


    return (
        <div className="TextSetting">
            <Stack spacing={2} className="FormMenuScroll">
                <Typography variant="h6">ドロップダウンメニューフォーム設定</Typography>

                <TextField
                    label="タイトル"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                />

                <Stack direction="row" alignItems="center" spacing={1}>
                    <Checkbox
                        checked={showNoneItem}
                        onChange={(e) => setShowNoneItem(e.target.checked)}
                    />
                    <Typography>「該当なし」の選択肢を追加する</Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                    <Checkbox
                        checked={showOtherItem}
                        onChange={(e) => setShowOtherItem(e.target.checked)}
                    />
                    <Typography>「その他」の選択肢を追加する</Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                    <Checkbox
                        checked={Type}
                        onChange={(e) => setType(e.target.checked)}
                    />
                    <Typography>複数選択できるようにする</Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                    <Checkbox
                        checked={isRequired}
                        onChange={(e) => setIsRequired(e.target.checked)}
                    />
                    <Typography>フォームを必須にする</Typography>
                </Stack>


                <Typography>ドロップダウンメニューの選択肢</Typography>
                {choices.map((choice, index) => (
                    <TextField
                        key={index}
                        label={`選択肢 ${index + 1}`}
                        value={choice}
                        onChange={(e) => handleChoiceChange(index, e.target.value)}
                        fullWidth
                    />
                ))}
               <Button variant="outlined" onClick={addChoiceField} className="FormButton">
                    選択肢を追加
                </Button>

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

DropDown.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    questionData: PropTypes.object
};
