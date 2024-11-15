import { useEffect,useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Checkbox from '@mui/material/Checkbox';


export default function Comment({ onSave, onCancel,questionData }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [rows, setRows] = useState(1);
    const [autoGrow, setAutoGrow] = useState(true);
    const [allowResize, setAllowResize] = useState(false);
    const [maxLength, setMaxLength] = useState(20);

        // questionData が変更されたら、各フィールドにデータをセットする
        useEffect(() => {
            if (questionData) {
                setTitle(questionData.title || "");
                setDescription(questionData.description || "");
                setRows(questionData.rows || 1);
                setAutoGrow(questionData.autoGrow || false);
                setAllowResize(questionData.allowResize || false);
                setMaxLength(questionData.maxLength || "");
            }
        }, [questionData]);


    const handleSave = () => {
        const settings = {
            title: title || "新しい質問",
            description: description || undefined,
            rows: rows || 1,
            autoGrow: autoGrow !== undefined ? autoGrow : true,
            allowResize: allowResize !== undefined ? allowResize : false,
            maxLength: maxLength || undefined,
        };

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
                <Typography variant="h6">テキストボックスメニューフォーム設定</Typography>

                <TextField
                    label="タイトル"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                />

                <TextField
                    label="説明"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                />

                <TextField
                    label="テキストエリアに表示される行数"
                    type="number"
                    value={rows}
                    onChange={(e) => {
                        const value = e.target.value;
                        // 空の文字列の場合は状態を空にする
                        setRows(value === "" ? "" : Number(value));
                    }}
                    fullWidth
                />

                <TextField
                    label="最大入力文字数"
                    type="number"
                    value={maxLength}
                    onChange={(e) => {
                        const value = e.target.value;
                        // 空の文字列の場合は状態を空にする
                        setMaxLength(value === "" ? "" : Number(value));
                    }}
                    fullWidth
                />

                <Checkbox
                    checked={autoGrow}
                    onChange={(e) => {
                        setAutoGrow(e.target.checked);
                        console.log("autoGrow:", e.target.checked); // デバッグ用ログ
                    }}
                />
                <Typography>テキストエリアの自動拡張を有効にする</Typography>

                <Checkbox
                    checked={allowResize}
                    onChange={(e) => {
                        setAllowResize(e.target.checked);
                        console.log("allowResize:", e.target.checked); // デバッグ用ログ
                    }}
                />
                <Typography>テキストエリアのサイズ変更を禁止する</Typography>


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

Comment.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    questionData: PropTypes.object
};
