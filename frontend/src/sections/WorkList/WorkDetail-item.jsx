import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import Modal from "react-modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Divider from "@mui/material/Divider";

import { SLIDER, AVATAR } from "src/layouts/dashboard/config-layout";
import { UseCreateTagbutton } from "src/hooks/use-createTagbutton";
import { useSessionStorage } from "src/hooks/use-sessionStorage";

import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "src/App.css";

//------------------------------------------------------------------------------------

// ここでアプリケーションのルートエレメントを設定
Modal.setAppElement("#root");

const options = {
  type: "loop",
  gap: "1rem",
  autoplay: false, //自動再生off
  pauseOnHover: false, //スクロール停止するかどうか、自動再生と依存関係なので必要なし
  resetProgress: false, //自動再生が中断されたのち再開する際、それまでの経過時間を維持するか破棄するかを決定
  aspectRatio: "16 / 9", //アスペクト比
};

const ModalOptions = {
  type: "loop",
  gap: "1rem",
  autoplay: false, //自動再生off
  pauseOnHover: false, //スクロール停止するかどうか、自動再生と依存関係なので必要なし
  resetProgress: false, //自動再生が中断されたのち再開する際、それまでの経過時間を維持するか破棄するかを決定
  aspectRatio: "16 / 9", //アスペクト比
};

const thumbsOptions = {
  type: "slide",
  rewind: true,
  gap: "1rem",
  pagination: false,
  fixedWidth: 110,
  fixedHeight: 70,
  cover: true,
  focus: "center",
  isNavigation: true,
  aspectRatio: "16 / 9",
};

const WorkDetailItem = () => {
  // ログイン情報の取得
  const { getSessionData } = useSessionStorage();
  // 作品IDの取得
  const { id } = useParams();

  // -----スライド-----
  // メインスライドのパス
  const [WorkSlide, setWorkSlide] = useState([]);
  // スライドの画像がWorkSlideにセットされたかの確認・セットされればスライドを表示
  const [WorkSlideCheck, setWorkSlideCheck] = useState(false);
  // スライドの位置
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // -----作品データ-----
  const [workDetail, setWorkDetail] = useState([]);
  const [CommentPost, setCommentPost] = useState({
    // display: "none",
    text: "",
  });
  const [workComment, setWorkComment] = useState([]);
  const [AccountData, setAccountData] = useState({});
  const [Comment, setComment] = useState({});
  const [CommentCancel, setCommentCancel] = useState("");

  // -----タグ-----
  const { tagCreate } = UseCreateTagbutton();
  // ジャンル
  const [WorkGenre, setWorkGenre] = useState("");
  // 開発言語
  const [WorkProgrammingLanguage, setWorkProgrammingLanguage] = useState("");
  // 開発環境
  const [WorkDevelopmentEnvironment, setWorkDevelopmentEnvironment] = useState("");

  // -----モーダル・ギャラリ-----
  const theme = useTheme();
  // モーダルスライドの開閉
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // ギャラリーモーダルの開閉
  const [galleryIsOpen, setGalleryIsOpen] = useState(false);

  // メインスライドとモーダルスライドの連携
  const mainSplideRef = useRef(null);
  const modalSplideRef = useRef(null);
  const thumbnailSplideRef = useRef(null);

  // メインスライドのCSS

  // モーダルスライドのCSS

  // 作品データ
  const workDetailUrl = "http://localhost:8000/get_work_detail";
  // 作品コメント投稿
  const workCommentPostUrl = "http://localhost:8000/post_work_comment_post";
  // 作品コメントデータ
  const workCommentUrl = "http://localhost:8000/post_work_comment";
  // 作品コメント削除
  const workCommentDelete = "http://localhost:8000/post_work_comment_delete";

  // console.log("currentSlideIndex", currentSlideIndex);

  // Laravel側から作品詳細データを取得
  useEffect(() => {
    setAccountData(getSessionData("accountData"));

    // console.log("accountData", accountData);
    async function workListFunction() {
      let workImagesArray = [];
      try {
        // Laravel側から作品詳細データを取得
        const response = await axios.get(workDetailUrl, {
          params: { id: id },
          headers: {
            "Content-Type": "json",
          },
        });

        setWorkDetail(response.data["作品"][0]);
        setWorkComment(response.data["作品コメント"]);

        // console.log("response.data[作品コメント]", response.data["作品コメント"]);
        response.data["作品"][0].images.forEach((value) => {
          // console.log("valuevalue", value);
          if (value.thumbnail_judgement === 1) {
            // サムネイルの場合
            // setThumbnailJudgement(value);
            workImagesArray.unshift(value); //unshift 配列の先頭に追加
            workImagesArray[0].image = workImagesArray[0].imageSrc;
          } else {
            // サムネイル以外の場合
            // setNotThumbnail((prevState) => [...prevState, value]);
            workImagesArray.push(value); // push 配列の末尾に追加
            workImagesArray[workImagesArray.length - 1].image = workImagesArray[workImagesArray.length - 1].imageSrc;
          }
        });

        // console.log("workImagesArray:", workImagesArray);

        setWorkSlide(workImagesArray);
        console.log("workImagesArray", workImagesArray);
        // スライド画像をセットしてから表示するためのステート
        setWorkSlideCheck(true);

        // console.log("setWorkSlide(ThumbnailJudgement, NotThumbnail)", response.data[0]);
      } catch (err) {
        console.log("err:", err);
      }
    }
    workListFunction();
  }, [id]);

  useEffect(() => {
    const initialCommentState = {};
    workComment.forEach((value) => {
      initialCommentState[value.id] = {
        display: "none",
        text: value.content,
        readOnly: true,
      };
    });
    setComment(initialCommentState);
  }, [workComment]);

  // useEffect(() => {
  //   console.log("commentが変更されました。", Comment);
  // }, [Comment]);

  // タグ作成
  useEffect(() => {
    //ジャンル
    setWorkGenre(tagCreate(workDetail.work_genre));
    // 開発言語
    setWorkProgrammingLanguage(tagCreate(workDetail.programming_language));
    // 開発環境
    setWorkDevelopmentEnvironment(tagCreate(workDetail.development_environment));
    // console.log("workDetail", workDetail);
    // console.log("workComment", workComment);
  }, [workDetail]);

  // スライドモーダル
  const openModal = (index) => {
    // スライドモーダルを開く
    setCurrentSlideIndex(index);
    setModalIsOpen(true);
    setGalleryIsOpen(false);
  };

  const closeModal = () => {
    // スライドモーダルを閉じる
    setModalIsOpen(false);

    // モーダルを閉じた後のスライド位置をメインスライドに反映させる
    if (mainSplideRef.current) {
      mainSplideRef.current.go(currentSlideIndex);
    }
  };

  // ギャラリーモーダル
  const openGallery = () => {
    // スライドモーダルを閉じる
    setModalIsOpen(false);
    // ギャラリモーダルを開く
    setGalleryIsOpen(true);
  };

  const closeGallery = () => {
    // ギャラリモーダルを閉じる
    setGalleryIsOpen(false);
  };

  // コメント欄表示
  // const handleTextOpen = () => {
  //   setCommentPost({ ...CommentPost, display: "block" });
  // };

  // コメント投稿キャンセル
  const handlePostCancel = () => {
    setCommentPost({ ...CommentPost, text: "" });
  };

  // コメント投稿内容
  const handlePostChange = (value) => {
    // console.log("valuevaluevaluevalue", value);
    setCommentPost({ ...CommentPost, text: value });
  };

  const workCommentSave = async (text, workId, userId) => {
    try {
      // Laravel側から作品詳細データを取得
      await axios.post(workCommentPostUrl, {
        workCommentContent: text,
        work_id: workId,
        user_id: userId,
      });
      // コメント投稿後にページを再読み込み
      window.location.reload();
    } catch (err) {
      console.log("err:", err);
    }
  };

  // コメント投稿
  const handlePost = () => {
    setCommentPost({ ...CommentPost, display: "none" });
    if (CommentPost.text.trim() !== "") {
      workCommentSave(CommentPost.text, id, AccountData.id);
    } else {
      alert("空白のまま投稿はできません。");
    }
  };

  // コメント編集ボタンクリック
  const handleClick = (commentId) => {
    setComment({
      ...Comment,
      [commentId]: {
        ...Comment[commentId],
        display: "block",
        readOnly: false,
      },
    });

    setCommentCancel(Comment[commentId].text);
  };

  // コメントキャンセル
  const handleCancel = (commentId) => {
    setComment({
      ...Comment,
      [commentId]: {
        ...Comment[commentId],
        display: "none",
        text: CommentCancel,
        readOnly: true,
      },
    });
  };

  // コメント入力内容変更
  const handleChenge = (text, commentId) => {
    setComment({
      ...Comment,
      [commentId]: {
        ...Comment[commentId],
        text: text,
      },
    });
  };

  // コメント保存
  const handleSave = (commentId) => {
    setComment({
      ...Comment,
      [commentId]: {
        ...Comment[commentId],
        display: "none",
        readOnly: true,
      },
    });

    async function workCommentSave() {
      try {
        // Laravel側から作品詳細データを取得
        await axios.post(workCommentUrl, {
          workCommentContent: Comment[commentId].text,
          commentId: commentId,
        });
      } catch (err) {
        console.log("err:", err);
      }
    }
    workCommentSave();
  };

  // コメント削除
  const handleDelete = (commentId) => {
    async function workCommentDeletefunc() {
      try {
        // Laravel側から作品詳細データを取得
        await axios.post(workCommentDelete, {
          commentId: commentId,
        });
        alert("コメントを削除しました。");
        // コメント削除にページを再読み込み
        window.location.reload();
      } catch (err) {
        console.log("err:", err);
      }
    }
    workCommentDeletefunc();
  };

  useEffect(() => {
    console.log("workDetail.icon", workDetail.icon);
  }, [workDetail.icon]);

  // 作品タイトル
  const renderTitle = workDetail.work_name && <h1 className="WorkDetail-title">{workDetail.work_name}</h1>;

  // 作品投稿者アイコン
  const renderIcon = workDetail.icon && (
    <img
      src={
        workDetail.icon
          ? `http://localhost:8000/storage/images/userIcon/${workDetail.icon}`
          : `http://localhost:8000/storage/images/userIcon/subNinja.jpg`
      }
      alt=""
      style={{ width: AVATAR.A_WIDTH, height: AVATAR.A_HEIGHT, borderRadius: AVATAR.A_RADIUS }}
    />
  );

  // 作品投稿者ユーザーネーム
  const renderUserName = workDetail.user_name && <Typography variant="h6">{workDetail.user_name}</Typography>;

  // メインスライド
  const renderMainSlider = WorkSlideCheck && (
    <Splide
      ref={mainSplideRef}
      options={options}
      aria-labelledby="autoplay-example-heading"
      hasTrack={false}
      onMoved={(splide, newIndex) => setCurrentSlideIndex(newIndex)}
      style={{ width: "100%", height: "100%", margin: "0 auto", marginBottom: "80px" }}
    >
      <div style={{ position: "relative" }}>
        {/* <SplideTrack>
          {WorkSlide.map((slide, index) => (
            <SplideSlide key={slide.work_id + slide.id} onClick={() => openModal(index)}>
              <img src={slide.image} alt={slide.image} style={{ aspectRatio: "16 / 9", width: "100%", height: "100%" }} />
            </SplideSlide>
          ))}
        </SplideTrack> */}
        <SplideTrack>
          {/* {WorkSlide.map((slide, index) => ( */}
          <SplideSlide key={"LVGZeHPo5iyKSWOayRufpt1ovYbHNF4L9SLERRrL"} onClick={() => openModal(0)}>
            <img
              src={`/assets/workImages/thumbnail/LVGZeHPo5iyKSWOayRufpt1ovYbHNF4L9SLERRrL.png`}
              style={{ aspectRatio: "16 / 9", width: "100%", height: "100%" }}
            />
          </SplideSlide>
          {/* ))} */}
        </SplideTrack>
      </div>
    </Splide>
  );

  // モーダルスライド
  const renderModalSlider = modalIsOpen && WorkSlideCheck && (
    <>
      <div style={{ borderBottom: "1px dashed #e0e0e0" }}>
        <Button onClick={closeModal} className="close-button">
          <span className="close-button_text">閉じる</span>
        </Button>
        <Button onClick={openGallery} className="oepn-gallery">
          ギャラリー
        </Button>
      </div>

      <div style={{ zIndex: theme.zIndex.modal, display: "flex", height: "calc(100% - 20px)" }}>
        <Stack direction="column" justifyContent="space-around" alignItems="center" spacing={0} style={{ width: SLIDER.MODAL_WIDTH }}>
          {modalIsOpen && WorkSlideCheck && (
            <>
              <Splide
                ref={modalSplideRef}
                options={ModalOptions}
                onMoved={(splide, newIndex) => setCurrentSlideIndex(newIndex)}
                aria-labelledby="modal-autoplay-example-heading"
                hasTrack={false}
              >
                <SplideTrack>
                  {WorkSlide.map((slide) => (
                    <SplideSlide key={slide.work_id + slide.id}>
                      <img src={`/assets/workImages/thumbnail/LVGZeHPo5iyKSWOayRufpt1ovYbHNF4L9SLERRrL.png`} alt={slide.image} />
                    </SplideSlide>
                  ))}
                  {/* {WorkSlide.map((slide) => (
                    <SplideSlide key={slide.work_id + slide.id}>
                      <img src={slide.image} alt={slide.image} />
                    </SplideSlide>
                  ))} */}
                </SplideTrack>
              </Splide>

              {/* モーダルメインスライドの下にある小さなスライド */}
              <Splide
                ref={thumbnailSplideRef}
                options={thumbsOptions}
                aria-labelledby="thumbnail-slider-example"
                onMoved={(splide, newIndex) => setCurrentSlideIndex(newIndex)}
                hasTrack={false}
                arrows={false}
                sx={{
                  ".splide__arrow": {
                    display: "none !important",
                  },
                }}
                aria-label="..."
                // sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}
              >
                <SplideTrack>
                  {/* {WorkSlide.map((slide) => (
                    <SplideSlide key={slide.work_id + slide.id}>
                      <img src={slide.image} alt={slide.image} />
                    </SplideSlide>
                  ))} */}
                  {WorkSlide.map((slide) => (
                    <SplideSlide key={slide.work_id + slide.id}>
                      <img src={`/assets/workImages/thumbnail/LVGZeHPo5iyKSWOayRufpt1ovYbHNF4L9SLERRrL.png`} alt={slide.image} />
                    </SplideSlide>
                  ))}
                </SplideTrack>
                <div className="splide__arrows">
                  <button className="splide__arrow splide__arrow--prev" style={{ left: "-60px" }}>
                    {/* 左矢印アイコン */}
                    <ArrowBackIosNewIcon style={{ transform: "scaleX(1)" }} />
                  </button>
                  <button className="splide__arrow splide__arrow--next" style={{ right: "-60px" }}>
                    {/* 右矢印アイコン */}
                    <ArrowForwardIosIcon />
                  </button>
                </div>
              </Splide>
            </>
          )}
        </Stack>

        {/* overScroll 追加 */}
        {modalIsOpen && (
          <div
            className="annotation-container"
            style={{
              width: SLIDER.ANOTATION,
              wordBreak: "break-word",
              borderLeft: "1px dashed #e0e0e0",
              padding: "10px",
              marginLeft: "10px",
              overflow: "scroll",
            }}
          >
            <div style={{ width: "100%" }}>{WorkSlide[currentSlideIndex].annotation}</div>
          </div>
        )}
      </div>
    </>
  );
  // モーダルギャラリー
  const renderGallery = (
    <>
      <div id="gallery">
        <div className="gallery_images" id="gallery_images">
          <div className="gallery-container">
            {WorkSlide.map((slide, index) => (
              <div key={`${slide}-${index}`} className="GalleryPostCard" style={{ width: "100%" }}>
                <img className="gallery_img" key={slide.work_id + slide.id} src={slide.image} alt={slide.image} onClick={() => openModal(index)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // 作品紹介文
  const renderIntro = workDetail.work_intro && (
    <>
      <Typography variant="h5" className="WorkDetail_typo">
        ●作品の紹介
      </Typography>
      <div className="WorkDetail_info-intro" style={{ fontSize: "16px" }}>
        {workDetail.work_intro}
      </div>
    </>
  );

  // 作品ジャンル
  const renderGenre = WorkGenre && (
    <>
      <Typography variant="h5" className="WorkDetail_typo">
        ●ジャンル
      </Typography>
      <div className="WorkDetail_info">{WorkGenre}</div>
    </>
  );

  // 作品の開発言語
  const renderProgrammingLang = WorkProgrammingLanguage && (
    <>
      <Typography variant="h5" className="WorkDetail_typo">
        ●開発言語
      </Typography>
      <div className="WorkDetail_info">{WorkProgrammingLanguage}</div>
    </>
  );

  // 作品の開発環境
  const renderDevelopmentEnv = WorkDevelopmentEnvironment && (
    <>
      <Typography variant="h5" className="WorkDetail_typo">
        ●開発環境
      </Typography>
      <div className="WorkDetail_info">{WorkDevelopmentEnvironment}</div>
    </>
  );

  const renderWorkURL = workDetail.work_url && (
    <>
      <Typography variant="h5" className="WorkDetail_typo">
        ●作品リンク
      </Typography>
      <div className="WorkDetail_info">
        <Link target="_blank" to={workDetail.work_url}>
          こちら
        </Link>
      </div>
    </>
  );

  // コメント
  const renderComment = workComment && Object.keys(Comment).length > 0 && (
    <>
      {workComment && Object.keys(Comment).length > 0 && <h3>コメント一覧</h3>}
      {workComment.map((item, index) =>
        (item.commenter_id === AccountData.id && item.commenter_user_name === AccountData.user_name) ||
        (item.commenter_id === AccountData.id && item.commenter_company_name === AccountData.company_name) ? (
          <div key={index}>
            {/* {console.log("comment", Comment)} */}
            <Divider sx={{ borderStyle: "dashed", margin: "5px 0px 20px 0px", width: "90%" }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3} sx={{ width: "80%", paddingBottom: "5px" }}>
              <Stack direction="row" justifyContent="left" alignItems="center" spacing={1}>
                <div>{item.commenter_user_name || item.commenter_company_name}</div>
              </Stack>
              <Stack direction="row" justifyContent="right" alignItems="center" spacing={1}>
                <Stack direction="row" justifyContent="left" alignItems="center" spacing={1}>
                  <Button variant="outlined" onClick={() => handleClick(item.id)}>
                    編集
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleCancel(item.id)}
                    className={`comment_${item.id}`}
                    style={{ display: Comment[item.id]?.display }}
                  >
                    キャンセル
                  </Button>
                </Stack>
                <Stack direction="row" justifyContent="left" alignItems="center" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={() => handleSave(item.id)}
                    className={`comment_${item.id}`}
                    style={{ display: Comment[item.id]?.display }}
                  >
                    保存
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ color: "error.main" }}
                    onClick={() => handleDelete(item.id)}
                    className={`comment_${item.id}`}
                    style={{ display: Comment[item.id]?.display }}
                  >
                    削除
                  </Button>
                </Stack>
              </Stack>
            </Stack>

            <textarea
              style={{
                width: "80%",
                height: "100px",
              }}
              className="comment_text_area items"
              value={Comment[item.id].text}
              readOnly={Comment[item.id].readOnly} // 読み取り専用にする場合
              onChange={(e) => handleChenge(e.target.value, item.id)}
            />
          </div>
        ) : (
          <div key={index}>
            <hr />
            <p>{item.commenter_user_name || item.commenter_company_name}</p>
            <textarea
              style={{
                width: "80%",
                height: "100px",
              }}
              className="comment_text_area items"
              value={item.content}
              readOnly // 読み取り専用にする場合
            />
          </div>
        )
      )}
    </>
  );
  const renderCommentButton = (
    <>
      <div
        className="top_comment_area"
        style={{
          display: CommentPost.display,
          marginTop: "100px",
        }}
      >
        <div className="comment_area_parts">
          <textarea
            className="comment_text_area"
            value={CommentPost.text}
            onChange={(e) => handlePostChange(e.target.value)}
            style={{
              height: "100px",
            }}
          ></textarea>
          <div className="comment_operation">
            <div className="comment_button">
              <Button variant="outlined" onClick={() => handlePostCancel()}>
                キャンセル
              </Button>
              <Button variant="contained" onClick={() => handlePost()}>
                コメント
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  useEffect(() => {
    if (modalIsOpen) {
      setTimeout(() => {
        if (modalIsOpen && modalSplideRef.current && thumbnailSplideRef.current) {
          modalSplideRef.current.sync(thumbnailSplideRef.current.splide);
          modalSplideRef.current.go(currentSlideIndex);
        }
      }, 100); // 少し遅延を増やして、非同期初期化を確認
    }
  }, [modalIsOpen]);

  return (
    <>
      <Container>
        <div>
          <Link to={`/Profile/${workDetail.user_name}?page=mypage`}>
            <Stack direction="row" justifyContent="left" alignItems="center" spacing={3}>
              {renderIcon}
              {renderUserName}
            </Stack>
          </Link>
          {renderTitle}
        </div>

        {renderMainSlider}

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Image Modal"
          overlayClassName="custom-overlay"
          style={{
            content: {
              zIndex: theme.zIndex.modal,
              overflow: "",
              padding: "20px 10px 20px 20px",
            },
          }}
        >
          {renderModalSlider}
        </Modal>

        <Modal
          isOpen={galleryIsOpen}
          onRequestClose={closeModal}
          contentLabel="Image Modal"
          overlayClassName="custom-overlay"
          style={{
            content: {
              zIndex: theme.zIndex.modal,
            },
          }}
        >
          <div className="gallery_header">
            <div className="g_h_left"></div>
            <div className="g_h_right">
              <Button onClick={closeGallery} className="close-button">
                <span className="close-button_text">閉じる</span>
              </Button>
              <Button onClick={openGallery} className="oepn-gallery">
                スライド
              </Button>
            </div>
          </div>

          {renderGallery}
        </Modal>

        <Box>
          {renderIntro}
          {renderGenre}
          {renderProgrammingLang}
          {renderDevelopmentEnv}
          {renderWorkURL}
          {renderCommentButton}
          {renderComment}
        </Box>
      </Container>
    </>
  );
};

export default WorkDetailItem;
