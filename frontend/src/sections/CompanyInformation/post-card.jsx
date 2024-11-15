import { forwardRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './CompanyInformation.css';
import axios from "axios";
import EditCompanyInformation from './EditCompanyInformation';
import { arrayMove } from '@dnd-kit/sortable';
import { useLocation } from 'react-router-dom';


const PostCard = forwardRef(({ post },) => {
  const { title_contents } = post;
  const CompanyInformationsSaveURL = "http://localhost:8000/company_informations_save";
  const AllCompanyInformationsPullURL = "http://localhost:8000/all_company_informations_pull";
  const [MyUserId, setMyUserId] = useState(0);
  const [MyUserName, setMyUserName] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editedContents, setEditedContents] = useState([]);
  const [TrueTitleContents, setTitleContents] = useState(title_contents);
  const [CompanyId,setCompanyId] = useState(null);
  const location = useLocation();
  const path = location.pathname;
  const URLUserName = path.split('/')[2];
  const canEdit = (CompanyId === MyUserId) || (URLUserName === MyUserName);

  useEffect(() => {
    const accountData = JSON.parse(sessionStorage.getItem("accountData"));
    setMyUserId(accountData?.id || 0);
    setMyUserName(accountData.user_name);
    console.log("MyUserName:", accountData.user_name);
  }, []);

  useEffect(() => {
    if (TrueTitleContents && TrueTitleContents.length > 0) {
      const companyId = TrueTitleContents[0].company_id;
      setCompanyId(companyId);
      console.log("companyIdが設定されました:", companyId);
    }
    console.log("title_contents", title_contents);
  }, [TrueTitleContents]);


  useEffect(() => {
    async function CompanyInformationSave() {
      console.log("保存するデータ", editedContents);
      try {
        const response = await axios.post(CompanyInformationsSaveURL, {
          CompanyInformation: editedContents,
          CompanyName: MyUserName
        });
        //成功したらtitle_contentsを更新する
        if (response) {
          console.log("saveが成功です");
          setTitleContents(response.data.title_contents);
        }
      } catch (err) {
        console.error("Error saving company information:", err.response ? err.response.data : err.message);
      }
    }

    // editedContentsのタイトルまたはコンテンツがnullでないことを確認
    const hasValidData = editedContents.every(item => item.title !== "" && item.contents !== "");

    if (editedContents.length && hasValidData) {
      CompanyInformationSave();
    }
  }, [editedContents]);

  useEffect(() => {
    // 編集時に公開・非公開含めたすべての企業情報を取得する
    async function AllCompanyInformationsPull() {
      try {
        // Laravel側から企業一覧データを取得
        const response = await axios.post(AllCompanyInformationsPullURL, {
          InformationUserName: URLUserName
        });
        setEditedContents(response.data.title_contents);
        setCompanyId(response.data.id);
        console.log(response.data.title_contents);

        console.log("pullが成功です");
      } catch (err) {
        console.log("err:", err);
      }
    }
    AllCompanyInformationsPull();
  }, []);


  useEffect(() => {
    if (showEdit) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showEdit]);






  const handleEditClick = (postId) => {
    console.log("編集ボタンがクリックされました", postId);
    if (editedContents) {
      setShowEdit(true);
      console.log(editedContents);
      console.log("通ってます");
    }
  };

  const handlePublicStatusChange = (index) => {
    setEditedContents(prevContents => {
      const newContents = [...prevContents];
      newContents[index].public_status = newContents[index].public_status === 1 ? 0 : 1;
      return newContents;
    });
  };


  const handleTextChange = (index, field, value) => {
    setEditedContents(prevContents => {
      const newContents = [...prevContents];
      newContents[index] = {
        ...newContents[index],
        [field]: value,
      };
      return newContents;
    });
  };

  const handleDelete = (index) => {
    const result = window.confirm("本当に削除しますか?");
    if (result) {
      setEditedContents(prevContents => prevContents.filter((_, i) => i !== index));
    }
  };


  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = editedContents.findIndex(item => item.id === active.id);
      const newIndex = editedContents.findIndex(item => item.id === over.id);

      // 並び替え処理
      const reorderedItems = arrayMove(editedContents, oldIndex, newIndex);

      // row_numberを更新
      const updatedItems = reorderedItems.map((item, index) => {
        return {
          ...item,
          row_number: index + 1, // 1から順にrow_numberを設定
        };
      });

      console.log(updatedItems);

      setEditedContents(updatedItems);
    }
  };

  const handleAddRow = (index) => {
    const newRow = {
      id: editedContents.length + 1, // ユニークなIDを生成
      title: '新しいタイトル',      // 新しい行の初期タイトル
      contents: '新しい内容',   // 新しい行の初期内容
      public_status: 0, // 新しい行の公開状態（初期は非公開）
      company_id: CompanyId, // 既存の企業IDを設定
      row_number: editedContents.length + 1 // 新しい行のrow_numberを設定
    };

    setEditedContents(prevContents => {
      // 新しい行を指定されたインデックスの1つ下に追加
      const newContents = [...prevContents];
      newContents.splice(index + 1, 0, newRow);
      return newContents;
    });
  };

  //閉じるボタンを押したら更新後のtitle_contentsを取得しに行って渡す
  const modalclose = () => {
    setShowEdit(false)
  }




  return (
    <div>

      {/* 関数の場合は大文字、変数の場合は最初小文字 企業情報を編集する */}
      <EditCompanyInformation
        IsOpen={showEdit}   //モーダルを開く関数
        CloseModal={modalclose} //モーダルを閉じる関数
        editedContents={editedContents} //全ての企業情報
        HandlePublicStatusChange={handlePublicStatusChange}
        HandleAddRow={handleAddRow}
        HandleDragEnd={handleDragEnd}
        HandleDelete={handleDelete}
        HandleTextChange={handleTextChange}
      />

      {TrueTitleContents && TrueTitleContents.length > 0 && (
        <TableContainer component={Paper} className="tableContainer">
          <Table className="Table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', width: '40%' }}>タイトル</TableCell>
                <TableCell style={{ fontWeight: 'bold', width: '150%' }}>内容</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {TrueTitleContents.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.contents}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!canEdit ? (
        <div>
          企業情報はありません
        </div>
      ) : (
        <div>
        <Tooltip title="編集する">
          <IconButton onClick={() => handleEditClick(CompanyId)}>
            <ModeEditIcon />
          </IconButton>
        </Tooltip>
          まだ公開されている情報がありません
        </div>
      )}


    </div>

  );
});

PostCard.displayName = "PostCard";

PostCard.propTypes = {
  post: PropTypes.shape({
    title_contents: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        contents: PropTypes.string.isRequired,
        public_status: PropTypes.number.isRequired,
        company_id: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default PostCard;