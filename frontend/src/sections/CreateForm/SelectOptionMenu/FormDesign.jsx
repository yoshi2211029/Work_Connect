import { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PropTypes from 'prop-types';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function FormDesign({ onSave,onCancel }) {
    const [themeName, setThemeName] = useState("default");
    const [colorPalette, setColorPalette] = useState("light");

    // 保存ボタンがクリックされた時にデータを親コンポーネントに渡す
    const handleSave = () => {
        const settings = {
            themeName: themeName || "default",
            colorPalette: colorPalette || "light",
        };
        onSave(settings);
    };

        //編集をキャンセルして追加したフォームを削除
        const handleCancel = () =>{
            onCancel();
        }

    return (
        <div className="TextSetting">
            <Stack spacing={2}>
                <Typography variant="h6">デザインフォーム設定</Typography>
                <Typography variant="subtitle1">テーマ設定</Typography>
                <RadioGroup
                    value={themeName} // 修正: themename -> themeName
                    onChange={(e) => setThemeName(e.target.value)} // 修正: setThemeName(e.target.value)
                >
                    <FormControlLabel value="default" control={<Radio />} label="デフォルト" />
                    <FormControlLabel value="sharp" control={<Radio />} label="シャープ" />
                    <FormControlLabel value="borderless" control={<Radio />} label="ボーダーレス" />
                    <FormControlLabel value="flat" control={<Radio />} label="フラット" />
                    <FormControlLabel value="plain" control={<Radio />} label="無地" />
                    <FormControlLabel value="doubleborder" control={<Radio />} label="二重枠" />
                    <FormControlLabel value="layered" control={<Radio />} label="レイヤード" />
                    <FormControlLabel value="solid" control={<Radio />} label="個体" />
                    <FormControlLabel value="3d" control={<Radio />} label="3D" />
                    <FormControlLabel value="contrast" control={<Radio />} label="対比" />
                </RadioGroup>

                <Typography variant="subtitle1">カラーパレット設定</Typography>
                <RadioGroup
                    value={colorPalette}
                    onChange={(e) => setColorPalette(e.target.value)}
                >
                    <FormControlLabel value="light" control={<Radio />} label="ライト" />
                    <FormControlLabel value="dark" control={<Radio />} label="ダーク" />
                </RadioGroup>

                <Button variant="contained" onClick={handleSave}>
                    保存
                </Button>

                <Button variant="contained" color="primary" onClick={handleCancel}>
                    キャンセル
                </Button>
            </Stack>
        </div>
    );
}

FormDesign.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};
