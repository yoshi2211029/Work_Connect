import { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PersonIcon from '@mui/icons-material/Person';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// デフォルトのアイコンをインポート
import DefaultIcon from "src/sections/Profile/View/DefaultIcon";


import { useSessionStorage } from "src/hooks/use-sessionStorage";


const ImageCard = ({IconData}) => {

  //console.log("IconData"+IconData);

  // 初期値
  const { getSessionData, updateSessionData } = useSessionStorage();
  const [selectedImage, setSelectedImage] = useState(IconData);
  const theme = useTheme();

  // valueの初期値をセット
  useEffect(() => {
    if (getSessionData("accountData") !== undefined) {
      const SessionData = getSessionData("accountData");

      if(SessionData.IconEditing && SessionData.Icon){
        // セッションストレージから最新のデータを取得
        setSelectedImage(SessionData.Icon);
      } else if(
        ((SessionData.IconEditing && SessionData.Icon && IconData)||
        (!SessionData.IconEditing && IconData)) &&
        IconData !== "http://localhost:8000/storage/images/userIcon"
      ){
         // DBから最新のデータを取得
         setSelectedImage(IconData);
      } else {
        // // デフォルト(アイコン設定なし)
        // setSelectedImage("cover_19.jpg");
      }
    }
  }, [IconData]);

  useEffect(() => {
    // sessionStrageに値を保存
    if(selectedImage){
      const selectedImageName = selectedImage.substring(selectedImage.lastIndexOf('/') + 1);
      updateSessionData("accountData", "Icon", selectedImageName);
    }
  }, [selectedImage]);

  // アイコンの初期化
  const handleImageReset = async () => {
    setSelectedImage(null);
    updateSessionData("accountData", "CompanyIcon", null);
  }

  // アイコンの変更操作
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        // LaravelにPOSTで画像データを送信
        const response = await fetch('http://localhost:8000/post_profile_mypage_upload', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          body: formData,
        });

        if (response.ok) {
          // アップロードできた場合
          const data = await response.json();
          const imageUrl = data.fileName;

          // アイコンの更新
          setSelectedImage(imageUrl);
          // 編集中状態をオン(保存もしくはログアウトされるまで保持)
          updateSessionData("accountData", "IconEditing", true);

        } else {
          // アップロードできなかった場合
          console.error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <>
      <Card sx={{
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        boxShadow: 'none',
        position: 'relative'
      }}>
        {selectedImage ? (
          <CardMedia
          component="img"
          sx={{
            height: 'calc(100vw * 0.58)',
            width: 'calc(100vw * 0.58)',
            objectFit: 'cover',
            borderRadius: '50%',
            maxHeight: 350,
            maxWidth: 350,
            '@media (min-width: 600px)': {
              height: 350,
              width: 350,
            }
          }}
          image={selectedImage ?
            `http://localhost:8000/storage/images/userIcon/${selectedImage}` :
            ""}
          alt="Loading..."
        />
        ):(
          <DefaultIcon sx={{
            height: "calc(100vw * 0.58)",
            width: "calc(100vw * 0.58)",
            padding: '20px',
            objectFit: "cover",
            borderRadius: "50%",
            maxHeight: 350,
            maxWidth: 350,
            "@media (min-width: 600px)": {
              height: 350,
              width: 350,
            },
          }}/>
        )}

        <input
          accept=".jpg,.jpeg,.png"
          style={{ display: 'none' }}
          id="icon-button-file"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="icon-button-file" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Tooltip title="アイコンを変更する">
            <IconButton aria-label="upload picture" component="span"
            sx={{
              color: 'rgba(0, 0, 0, 0.8)',
              width: 'calc(10vw)',
              height: 'calc(10vw)',
              maxWidth: 60,
              maxHeight: 60,
              '@media (min-width: 600px)': {
                width: 60,
                height: 60,
              }
            }}>
              <PhotoCameraIcon
              sx={{
                width: 50,
                height: 50,
              }}/>
            </IconButton>
          </Tooltip>
        </label>
      </Card>
      <Box>
        <Tooltip title="デフォルトのアイコンに戻します。">
          <Button variant="outlined" onClick={handleImageReset}
          sx={{ borderColor: '#5956FF', color: '#5956FF', '&:hover': { borderColor: '#5956FF' }, cursor: 'pointer' }}>
            <PersonIcon/>初期化
          </Button>
        </Tooltip>
      </Box>
    </>
  );
};

ImageCard.propTypes = {
  IconData: PropTypes.string ,
};

export default ImageCard;
