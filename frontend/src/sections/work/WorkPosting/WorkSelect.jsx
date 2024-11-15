import "../../../App.css";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
// sessionStrage呼び出し
import { useSessionStorage } from "src/hooks/use-sessionStorage";

const WorkSelect = () => {
  let navigation = useNavigate();


  const handleOpenModal = () => {
    // setShowModal(true);
    navigation("/WorkPosting");
  };
  const handleOpenModal2 = () => {
    // setShowModal(true);
    console.log(UserName);

    navigation("/Profile/"+UserName);
  };

  // ユーザーネーム取得
  const { getSessionData } = useSessionStorage();
  const accountData = getSessionData("accountData");
  const UserName = accountData.user_name;



  return (
    <div>
      投稿完了
      <Button onClick={handleOpenModal} variant="contained">
        続けて投稿する
      </Button>
      <Button onClick={handleOpenModal2} variant="contained">
        マイページ
      </Button>
    </div>
  );
};

export default WorkSelect;
