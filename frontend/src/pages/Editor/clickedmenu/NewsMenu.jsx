import { useEffect, useState } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import "../Editor.css";

//ニュースメニューをインポート
import ReleaseNews from "./ReleaseNews"


//MUIアイコン
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import DeleteIcon from '@mui/icons-material/Delete';
import NewsMenuTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//時間
import moment from 'moment';

const modalStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // オーバーレイの背景色
    zIndex: 1200, // オーバーレイの z-index
    width: '100%',
    height: '100%',
  },
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    borderRadius: '4%',
    padding: '1.5rem',
    overflow: 'hidden',
    zIndex: 1300, // コンテンツの z-index
    backgroundColor: 'white',
    height: '60%',
    width: '70%',
  },
};


const NewsMenu = ({
  IsOpen,
  CloseModal,
  CreateFormJump,
  RewriteNewsEnter,
  EditorStatusCheck,
  EditorContentsStatusCheck,
  HandleChange,
  NewsSave,
  genre,
  draftlist,
  newsid,
  imageUrl,
  title,
  RewriteNewsDelete,
  NotificationMessageHandleChange,
  NewsUpLoad,
  message,
  charCount }) => {

  const [expanded, setExpanded] = useState(false);

  const AccordionhandleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  //関数
  const FormattedDate = (time) => {
    return moment(time).format('YYYY/MM/DD HH:mm:ss');
  };

  const header_img_show = (draft) => {
    console.log("サムネイル画像", draft.header_img);
    if (draft.header_img === null) {
      return (
        <ImageNotSupportedIcon fontSize="large" />
      );
    } else {
      return <img src={`${draft.header_img}`} alt="Draft Image" />;
    }
  };

  const AddDraftNews = () => {
    if (window.confirm("編集したニュースを保存しますか?")) {
      NewsSave()
      console.log("保存しました");
    }
    console.log("保存しませんでした");
    window.location.reload(false);
  }

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  const draftListrender = (
    <div className="draftlistScroll">
    <div className="add_draft_news">
      <Button variant="outlined" onClick={AddDraftNews} className="add_draft_news">
        新たな下書き
      </Button>
    </div>
    {draftlist.length > 0 ? (
      draftlist.map(draft => (
        <NewsMenuTable className="draftlisttable" key={draft.id}>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: "#fff", border: "none" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* 画像を左側に配置 */}
                  <div className="news_img">
                    {header_img_show(draft)}
                  </div>
                  {/* テキストと削除ボタンを右側に配置 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ marginBottom: '8px' }}>
                      最終更新日: {FormattedDate(draft.updated_at)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <DeleteIcon />
                      <p style={{ margin: 0, marginLeft: '4px' }} onClick={() => RewriteNewsDelete(draft.id)}>削除</p>
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Tooltip title={draft.article_title}>
                  <p
                    className="draftlist"
                    onClick={() => RewriteNewsEnter(draft.id)}
                    style={{
                      cursor: 'pointer',
                      wordBreak: 'break-all',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '200px',
                    }}
                  >
                    {draft.article_title}
                  </p>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableBody>
        </NewsMenuTable>
      ))
    ) : (
      <p>下書き中の記事はありません</p>
    )}
  </div>
  )

  const saveNewsrender = (
    <div className="news_button">
    <button id="save" className="save" onClick={NewsSave}>下書きを保存する</button>
  </div>
  )

  const editingStatusrender = (
    <div className="editingstatusscroll">
    <p>現在の編集状況</p>
    <p>タイトル</p>
    {EditorStatusCheck(title)}
    <p>サムネイル</p>
    {EditorStatusCheck(imageUrl)}
    <p>通知に添えるメッセージ</p>
    {EditorStatusCheck(message)}
    <p>コンテンツ</p>
    {EditorContentsStatusCheck()}
  </div>
  )

  const notificationMessagerender = (
    <ReleaseNews
    MessageData={message}
    handleChange={HandleChange}
    NotificationMessageHandleChange={NotificationMessageHandleChange}
  />
  )

  const createFormrender = (
    <div className="create_form">
    <p>インターンシップや求人・説明会のニュースでは、<br></br>
      応募フォームを作成することができます。
    </p>
    <button id="createFormJump" className="save" onClick={() => CreateFormJump(newsid)}>応募フォームを作成する</button>

  </div>

  )

  const releaseNewsrender = (
    <p><button onClick={NewsUpLoad}>投稿</button></p>
  )

  const menuItems = [
    { key: "draftList", text: "下書きリスト",render:draftListrender},
    { key: "saveNews", text: "ニュースを保存する",render:saveNewsrender },
    { key: "editingStatus", text: "現在の編集状況",render:editingStatusrender },
    { key: "notificationMessage", text: "通知に添えるメッセージ",render:notificationMessagerender},
    // 条件を満たした場合のみ追加
    ...(genre !== "blogs" ? [{ key: "createForm", text: "応募フォームを作成する",render:createFormrender}] : []),
    ...(title && imageUrl && message && charCount ? [{ key: "releaseNews", text: "ニュースを公開する",render:releaseNewsrender}] : []),
  ];


  return (
    <Modal
      isOpen={IsOpen}
      onRequestClose={CloseModal} // モーダルを閉じるコールバック
      shouldCloseOnOverlayClick={true} // オーバーレイクリックでモーダルを閉じる
      contentLabel="Example Modal"
      style={modalStyle}
    >
      <div className="NewsMenu-Accordion">

        <Button variant="outlined" onClick={CloseModal}>
          閉じる
        </Button>

        {menuItems.map(({ key, text,render }) => (
          <Accordion
            key={key}
            expanded={expanded === key}
            onChange={AccordionhandleChange(key)} 
            className="Accordion"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${key}-content`}
              id={`${key}-header`}
            >
              <Typography sx={{ width: '70%', flexShrink: 0 }}>{text}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {render}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Modal>
  );
};

NewsMenu.propTypes = {
  IsOpen: PropTypes.bool.isRequired,      //モーダルを閉じる
  CloseModal: PropTypes.func.isRequired,  //モーダル閉じる関数
  CreateFormJump: PropTypes.func.isRequired, //ニュース保存後に応募フォーム作成画面に遷移する
  RewriteNewsDelete: PropTypes.func.isRequired, //下書きニュースを削除する
  RewriteNewsEnter: PropTypes.func.isRequired, //下書き中で編集するニュースを選択して、遷移する
  EditorStatusCheck: PropTypes.func.isRequired, //サムネイル・タイトルの編集状況をチェック
  EditorContentsStatusCheck: PropTypes.func.isRequired, //文字数や使用画像をチェック
  message: PropTypes.string.isRequired,
  NewsSave: PropTypes.func.isRequired,
  HandleChange: PropTypes.func.isRequired,
  NewsUpLoad: PropTypes.func.isRequired,
  NotificationMessageHandleChange: PropTypes.func.isRequired,
  genre: PropTypes.string.isRequired,      //ニュースのジャンル
  draftlist: PropTypes.array.isRequired, //下書きリスト
  newsid: PropTypes.number.isRequired, //ニュースID
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired, //サムネイル画像
  charCount: PropTypes.number.isRequired //文字数カウント
};

export default NewsMenu;
