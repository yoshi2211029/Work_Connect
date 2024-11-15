import { useState, useEffect, useCallback} from "react";
import { SketchPicker } from 'react-color';
import styles from './ColorPicker.module.css';

const ColorPicker = () => {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState('#ffffff'); // 初期色を設定
  const [colorInfo, setColorInfo] = useState({
    name: { value: 'White' },
    hex: { value: '#ffffff' },
    rgb: { value: 'rgb(255,255,255)' },
    cmyk: { value: 'cmyk(0, 0, 0, 0)' }
  }); // 初期色情報を設定
  const [setError] = useState(null); // エラーメッセージを保存する状態

  // useCallbackでfetchColorInfoを定義する
  const fetchColorInfo = useCallback(async (color) => {
    try {
      const response = await fetch(`https://www.thecolorapi.com/id?hex=${color.slice(1)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setColorInfo(data);
      setError(null); // エラーをリセット
    } catch (error) {
      console.error('Error fetching color info:', error);
      setError('Error fetching color info');
    }
  }, [setError]); // 依存性配列は空にする

  const handleChange = (color) => {
    setColor(color.hex);
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };



  // 初期色の設定とAPI呼び出し
  useEffect(() => {
    document.body.style.backgroundColor = color;
    fetchColorInfo(color); // 初期色の情報を取得
  }, [color,fetchColorInfo]);

  // colorの値が変更されたときにAPIを呼び出す
  useEffect(() => {
    if (color !== '#000000') {
      fetchColorInfo(color);
    }
  }, [color,fetchColorInfo]);

  return (
    <>
      <div className={styles.container}>
      <p>選択した色: {colorInfo.name.value}</p>
        <div className={styles.containerLeft}>
          <div className={styles.bar} onClick={handleOpen}>
            <div className={styles.barLeft}>カラーを選択する</div>
            <div className={styles.barRight} style={{ background: color }}></div>
          </div>
        </div>
        <div className={styles.containerRight}>
          <div className={styles.colorBox} style={{ background: color }}></div>
        </div>
      </div>
      {open && (
        <div className={styles.pikker}>
          <div className={styles.pikkerBack} onClick={handleClose}></div>
          <SketchPicker
            color={color}
            onChange={handleChange}
          />
        </div>
      )}
    </>
  );
};

export default ColorPicker;
