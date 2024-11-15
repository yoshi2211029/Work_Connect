import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
// import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useSessionStorage } from "src/hooks/use-sessionStorage";
import "./news_detail.css"
import { follow } from "src/_mock/follow";

//MUIアイコン
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const InternshipJobOfferPage = () => {
    const [csrfToken, setCsrfToken] = useState("");
    const [NewsDetail, SetNewsDetail] = useState(null);
    const [bookmarked, setBookmarked] = useState(false);
    const [isHover, SetFavoriteIcon_hover] = useState(false);  //ホバーしたら「クリックするとブックマークできます」というテキストが出現
    const [showNav, setShowNav] = useState(false); // ナビゲーションバーを表示するかどうかの状態を管理
    const [followStatus, setFollowStatus] = useState(null);

    const csrf_url = "http://localhost:8000/csrf-token";
    const news_bookmark_url = "http://localhost:8000/news_bookmark";
    // const location = useLocation();
    // const parameter = location.state; // パラメータ(w_newsテーブルのidカラムの値)を代入
    const { news_id } = useParams(); // パラメータから id を取得
    const newsdetail_id = String(news_id); // id を文字列に変換する
    const navigate = useNavigate();
    console.log(csrfToken);

    const { getSessionData } = useSessionStorage();
    const accountData = getSessionData("accountData");
    const data = {
        id: accountData.id,
    };

    useEffect(() => {
        console.log("Myid", data.id);
        console.log("newsdetail_id", newsdetail_id);
        //ニュースのデータを抽出するc
        async function fetchData() {
            try {
                const response = await axios.get(
                    `http://localhost:8000/news_detail/${newsdetail_id}`,
                    {
                        params: {
                            MyId: data.id, //今ログインしている人のid
                        },
                    }
                );
                console.log(response.data);
                SetNewsDetail(response.data);
                setFollowStatus(response.data.follow_status);
            } catch (error) {
                console.error("データの取得中にエラーが発生しました！", error);
            }
        }
        fetchData();
    }, [newsdetail_id]);

    useEffect(() => {
        async function fetchCsrfToken() {
            try {
                const response = await axios.get(csrf_url); // CSRFトークンを取得するAPIエンドポイント
                console.log(response.data.csrf_token); // ログ
                console.log("fetching CSRF token:OK"); // ログ
                const csrfToken = response.data.csrf_token;
                setCsrfToken(csrfToken); // 状態を更新
            } catch (error) {
                console.error("Error fetching CSRF token:", error);
            }
        }

        fetchCsrfToken(); // ページがロードされた時点でCSRFトークンを取得
    }, []);

    const handleFollowClick = async () => {
        try {
            const updatedFollowStatus = await follow(data.id, NewsDetail.company_id);
            if (updatedFollowStatus) {
                setFollowStatus(updatedFollowStatus);
            }
        } catch (error) {
            console.error("フォロー処理中にエラーが発生しました！", error);
        }
    };

    //日付をYY/MM/DDに変換する
    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        return `${year}/${month}/${day}`;
    };

    //ハートをクリックしたらブックマーク(ニュースを保存)し、ハートの中が赤色になる
    const news_bookmark = async () => {
        setBookmarked(!bookmarked); //usestateセット
        //ajax処理
        console.log(newsdetail_id);
        console.log(NewsDetail.genre);
        try {
            const response = await axios.post(
                news_bookmark_url,
                {
                    id: newsdetail_id,              //bookmark_idカラムに入れる
                    category: NewsDetail.genre,   //categoryカラムに入れる
                    sessionid: data.Id,         //企業or学生のid
                },
                {
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                    },
                }
            );
            console.log(response.data);
            // SetNewsDetail(response.data);
        } catch (error) {
            console.error("データの取得中にエラーが発生しました！", error);
        }
    };

    const handleProfileJump = () => {
        navigate(`/Profile/${NewsDetail.company_name}`);
    }

    const handleFormJump = () => {
        navigate(`/WriteForm/${newsdetail_id}`);
    }

    const handleChatJump = () => {
        navigate(`/Chat`);
    }

    useEffect(() => {
        // スクロールイベントのハンドラー関数
        const handleScroll = () => {
            // 現在のスクロール位置を取得
            const ScrollPos = window.scrollY;
            // 目的のスクロール位置を比較
            const TargetPos = 350;

            if (ScrollPos > TargetPos) {
                setShowNav(true);
            } else {
                setShowNav(false);
            }
        };

        // スクロールイベントを追加
        window.addEventListener('scroll', handleScroll);

        // クリーンアップ関数でスクロールイベントを削除
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    let Genre;
    if (NewsDetail && NewsDetail.genre === "Internship") {
        Genre = "インターンシップ";
    } else if (NewsDetail && NewsDetail.genre === "Blog") {
        Genre = "ブログ";
    } else if(NewsDetail && NewsDetail.genre === "Session"){
        Genre = "説明会";
    }else {
        Genre = "求人";
    }

    return (
        <>
            <Helmet>
                <title>ニュースの詳細 | Work&Connect</title>
            </Helmet>


            {NewsDetail ? (
                <div className="NewsDetailContainer">
                    {/* ある程度下へスクロールしたら出てくるメニュー */}
                    {showNav && (
                        <div className="popup_menu">
                            <Stack direction="row" spacing={2}>
                                <p>{NewsDetail.article_title}</p>

                                <Button
                                    variant="contained"
                                    sx={{
                                        fontSize: "10px",
                                        padding: "8px 16px",
                                        margin: "4px",
                                        background: "linear-gradient(#41A4FF, #9198e5)",
                                        "&:hover": {
                                            background: "linear-gradient(#c2c2c2, #e5ad91)",
                                        },
                                    }}
                                    onClick={handleProfileJump}
                                >
                                    プロフィール
                                </Button>

                                {/* data?.id?.[0] === "S" が true の場合にボタンを表示 */}
                                {data?.id?.[0] === "S" && (
                                    <>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                fontSize: "10px",
                                                padding: "8px 16px",
                                                margin: "4px",
                                                background: "linear-gradient(#41A4FF, #9198e5)",
                                                "&:hover": {
                                                    background: "linear-gradient(#c2c2c2, #e5ad91)",
                                                },
                                            }}
                                            onClick={handleFollowClick}
                                        >
                                            {followStatus}
                                            {/* useStateから持ってくる */}
                                        </Button>

                                        <Button
                                            variant="contained"
                                            sx={{
                                                fontSize: "10px",
                                                padding: "8px 16px",
                                                margin: "4px",
                                                background: "linear-gradient(#41A4FF, #9198e5)",
                                                "&:hover": {
                                                    background: "linear-gradient(#c2c2c2, #e5ad91)",
                                                },
                                            }}
                                            onClick={handleFormJump}
                                        >
                                            応募する
                                        </Button>

                                        <Button
                                            variant="contained"
                                            sx={{
                                                fontSize: "10px",
                                                padding: "8px 16px",
                                                margin: "4px",
                                                background: "linear-gradient(#41A4FF, #9198e5)",
                                                "&:hover": {
                                                    background: "linear-gradient(#c2c2c2, #e5ad91)",
                                                },
                                            }}
                                            onClick={handleChatJump}
                                        >
                                            チャットする
                                        </Button>
                                    </>
                                )}
                            </Stack>
                        </div>
                    )}

                    <Button
                        variant="contained"
                        sx={{
                            fontSize: "10px",
                            padding: "8px 16px",
                            margin: "4px",
                            background: "linear-gradient(#41A4FF, #9198e5)",
                            "&:hover": {
                                background: "linear-gradient(#c2c2c2, #e5ad91)",
                            },
                        }}
                    >

                    {Genre}

                    </Button>
                    <h1 className="news_title">{NewsDetail.article_title}</h1>
                    <Stack direction="row" spacing={2}>
                        <p className="news_company_name">{NewsDetail.company_name}</p>
                        <p className="news_created_at">{formatDate(NewsDetail.news_created_at)}</p>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                sx={{
                                    fontSize: "10px",
                                    padding: "8px 16px",
                                    margin: "4px",
                                    background: "linear-gradient(#41A4FF, #9198e5)",
                                    "&:hover": {
                                        background: "linear-gradient(#c2c2c2, #e5ad91)",
                                    },
                                }}
                                onClick={handleProfileJump}
                            >
                                プロフィール
                            </Button>
                            {data?.id?.[0] === "S" && (
                                    <>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                fontSize: "10px",
                                                padding: "8px 16px",
                                                margin: "4px",
                                                background: "linear-gradient(#41A4FF, #9198e5)",
                                                "&:hover": {
                                                    background: "linear-gradient(#c2c2c2, #e5ad91)",
                                                },
                                            }}
                                            onClick={handleFollowClick}
                                        >
                                            {followStatus}
                                            {/* useStateから持ってくる */}
                                        </Button>

                                        <Button
                                            variant="contained"
                                            sx={{
                                                fontSize: "10px",
                                                padding: "8px 16px",
                                                margin: "4px",
                                                background: "linear-gradient(#41A4FF, #9198e5)",
                                                "&:hover": {
                                                    background: "linear-gradient(#c2c2c2, #e5ad91)",
                                                },
                                            }}
                                            onClick={handleFormJump}
                                        >
                                            応募する
                                        </Button>

                                        {followStatus === "フォローしています" && (
                                        <Button
                                            variant="contained"
                                            sx={{
                                                fontSize: "10px",
                                                padding: "8px 16px",
                                                margin: "4px",
                                                background: "linear-gradient(#41A4FF, #9198e5)",
                                                "&:hover": {
                                                    background: "linear-gradient(#c2c2c2, #e5ad91)",
                                                },
                                            }}
                                            onClick={handleChatJump}
                                        >
                                            チャットする
                                        </Button>
                                        )}
                                    </>
                                )}
                        </Stack>
                    </Stack>
                    {/* NewsDetailHeader要素 サムネイルと会社名・お気に入りボタンを一括りにする */}
                    <div className="NewsDetailHeader">
                        <img
                            src={`${NewsDetail.header_img}`}
                            className="news_img"
                            alt={NewsDetail.article_title}
                        />
                    </div>

                    <div className="genre_update">

                        {/* //ログインしていない場合非表示 */}
                        {data.id && (
                            bookmarked ? (
                                <FavoriteIcon
                                    style={{ fontSize: '24px' }}
                                    onClick={news_bookmark}
                                    onMouseEnter={() => SetFavoriteIcon_hover(true)}
                                    onMouseLeave={() => SetFavoriteIcon_hover(false)}
                                />
                            ) : (
                                <FavoriteBorderIcon
                                    style={{ fontSize: '24px' }}
                                    onClick={news_bookmark}
                                    onMouseEnter={() => SetFavoriteIcon_hover(true)}
                                    onMouseLeave={() => SetFavoriteIcon_hover(false)}
                                />
                            )
                        )}
                        {isHover && <div style={{ position: 'absolute', top: '30px', left: '10px', color: 'red' }}>クリックするとブックマークできます</div>}
                    </div>


                    {/* Editor.jsのプラグインによって内容を１行ずつ解釈し、それぞれにあった形でreturn */}
                    <div className="news_summary">
                        {NewsDetail.summary.blocks.map((block, index) => {
                            switch (block.type) {
                                case "paragraph":
                                    return <p key={index} className="news_font" dangerouslySetInnerHTML={{ __html: block.data.text }} />;
                                case "header":
                                    return React.createElement(
                                        `h${block.data.level}`,
                                        { key: index, className: "news_font", dangerouslySetInnerHTML: { __html: block.data.text } }
                                    );
                                case "image":
                                    return (
                                        <img
                                            key={index}
                                            src={block.data.file.url}
                                            className="news_img"
                                            alt={block.data.caption}
                                        />
                                    );
                                case "embed":
                                    return (
                                        <div key={index} dangerouslySetInnerHTML={{ __html: block.data.embed }} />
                                    );
                                case "table":
                                    return (
                                        <table key={index} className="news_font">
                                            <tbody>
                                                {block.data.content.map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        {row.map((cell, cellIndex) => (
                                                            <td key={cellIndex} dangerouslySetInnerHTML={{ __html: cell }} />
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    );
                                case "checklist":
                                    return (
                                        <ul key={index} className="news_font">
                                            {block.data.items.map((item, itemIndex) => (
                                                <li key={itemIndex} style={{ textDecoration: item.checked ? "line-through" : "none" }} dangerouslySetInnerHTML={{ __html: item.text }} />
                                            ))}
                                        </ul>
                                    );
                                case "delimiter":
                                    return <hr key={index} />;
                                case "raw":
                                    return <div key={index} dangerouslySetInnerHTML={{ __html: block.data.html }} />;
                                case "quote":
                                    return (
                                        <blockquote key={index} className="news_font" dangerouslySetInnerHTML={{ __html: block.data.text }}>
                                            <cite>{block.data.caption}</cite>
                                        </blockquote>
                                    );
                                case "inlineCode":
                                    return <code key={index} className="news_font" dangerouslySetInnerHTML={{ __html: block.data.text }} />;
                                case "alert":
                                    return <div key={index} className="news_font" dangerouslySetInnerHTML={{ __html: block.data.message }} />;
                                case "toggle":
                                    return (
                                        <details key={index} className="news_font">
                                            <summary>{block.data.title}</summary>
                                            <div dangerouslySetInnerHTML={{ __html: block.data.content }} />
                                        </details>
                                    );
                                case "audioPlayer":
                                    return (
                                        <audio key={index} controls>
                                            <source src={block.data.url} type={block.data.mimeType} />
                                        </audio>
                                    );
                                case "carousel":
                                    return (
                                        <div key={index} className="news_font">
                                            {block.data.slides.map((slide, slideIndex) => (
                                                <img key={slideIndex} src={slide.url} alt={slide.caption} className="news_img" />
                                            ))}
                                        </div>
                                    );
                                // 他のブロックタイプもここで処理できます
                                default:
                                    return null;
                            }
                        })}
                    </div>
                </div >
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
};

export default InternshipJobOfferPage;