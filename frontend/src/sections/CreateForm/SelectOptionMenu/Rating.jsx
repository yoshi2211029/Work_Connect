import { useEffect,useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';


export default function Rating({ onSave, onCancel, questionData }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [rateType, setRateType] = useState("default");
    const [rateNumber, setRateNumber] = useState("tensteps");
    const [rateMax, setRateMax] = useState(10);

    // questionData が変更されたら、各フィールドにデータをセットする
    useEffect(() => {
        if (questionData) {
            console.log("質問の内容", questionData);
            setTitle(questionData.title || "");
            setDescription(questionData.description || "");
            setRateType(questionData.rateType || "");
            setRateNumber(questionData.rateNumber || "tensteps");
            setRateMax(questionData.rateMax || 10);
        }
    }, [questionData]);


    const handleSave = () => {
        const settings = {
            title: title || "新しい質問",
            description: description || "",
            rateType: rateType || "",
            displayMode: "buttons",
        };

        let rateValues = []; // rateValuesを空の配列として初期化

        for (let i = 1; i <= rateMax; i++) { // 1からrateMaxまでの値を設定
            rateValues.push(i);
        }

        if (rateType === "smileys") {
            settings.scaleColorMode = "colored";
        }

        if (rateNumber === "tensteps") {
            settings.rateCount = 10;
            settings.rateValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            settings.rateMax = 10;
        } else if (rateNumber === "others") {
            settings.rateCount = rateMax || 10;
            settings.rateValues = rateValues || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            settings.rateMax = rateMax || 10;
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
                <Typography variant="h6">評価スケールメニューフォーム設定</Typography>

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

                <Typography>評価アイコン</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <RadioGroup
                        value={rateType}
                        onChange={(e) => setRateType(e.target.value)}
                    >
                        <FormControlLabel value="default" control={<Radio />} label="デフォルト" />
                        <FormControlLabel value="stars" control={<Radio />} label="五芒星" />
                        <FormControlLabel value="smileys" control={<Radio />} label="表情" />
                    </RadioGroup>
                </Stack>

                <Typography>評価段階</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <RadioGroup
                        value={rateNumber}
                        onChange={(e) => setRateNumber(e.target.value)}
                    >
                        <FormControlLabel value="tensteps" control={<Radio />} label="10段階評価" />
                        {rateType === "default" && (
                            <div>
                                <FormControlLabel value="others" control={<Radio />} label="カスタマイズをする" />
                            </div>
                        )}
                    </RadioGroup>
                </Stack>

                {rateType == "default" && rateNumber === "others" && (
                    <div>
                        <Typography>評価の最大値</Typography>
                        <TextField
                            placeholder="最大値"
                            value={rateMax}
                            onChange={(e) => setRateMax(e.target.value)}
                            type="number"
                            fullWidth
                            InputProps={{ inputProps: { max: 100 } }} // 必要に応じて最大値を設定
                        />
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

Rating.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    questionData: PropTypes.object
};
