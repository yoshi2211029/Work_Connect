import { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import '../Profile/View/css/Profile.css';

export default function InternshipJobOfferPage() {
  const [newsData, setNewsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // useNavigateをここで呼び出す

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/Internship_JobOffer');
        console.log("ニュースリスト", response.data);
        setNewsData(response.data);
        setFilteredData(response.data);
        setMessage(''); // メッセージを初期化
      } catch (error) {
        console.error('データの取得中にエラーが発生しました！', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const genre_news_select = (genre) => {
    console.log('Selected Genre:', genre); // デバッグ: 選択されたジャンル確認
    if (genre === '全て') {
      setFilteredData(newsData); // 全てのデータを表示
      setMessage(''); // メッセージをクリア
    } else {
      const filtered = newsData.filter((item) => item.genre === genre);
      console.log('Filtered Data:', filtered); // デバッグ: フィルタリング結果確認
      if (filtered.length === 0) {
        setFilteredData([]);
        setMessage(`「${genre}」に該当するニュースはありません。`);
      } else {
        setFilteredData(filtered);
        setMessage(''); // メッセージをクリア
      }
    }
  };

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    return `${year}/${month}/${day}`;
  };

  const news_detail_jump = (news_id) => {
    const entity = { id: news_id }; // オブジェクトとして扱う
    navigate("/news_detail", { state: entity }); // パラメータを渡して遷移
  };

  const SelectTagsGenre = (genre) => {
    return (
      <Button
        variant="outlined"
        sx={{ borderColor: '#637381', color: '#637381', '&:hover': { borderColor: '#637381' }, cursor: 'pointer' }}
        onClick={() => genre_news_select(genre)}  // 関数の参照を渡す
      >
        {genre}
      </Button>
    );
  };

  const ShowTagsGenre = (genre) => {
    return (
      <Button
        variant="outlined"
        sx={{ borderColor: '#637381', color: '#637381', '&:hover': { borderColor: '#637381' }, cursor: 'pointer' }}
      >
        {genre}
      </Button>
    );
  };

  return (
    <>
      <Helmet>
        <title>ニュース一覧</title>
      </Helmet>

      <div className="genre_select_button">
        {SelectTagsGenre("インターンシップ")}
        {SelectTagsGenre("求人")}
        {SelectTagsGenre("ブログ")}
        {SelectTagsGenre("全て")}  {/* 全データを表示するためのボタン */}
      </div>

      <div className="news-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {message && <p className="no-data-message">{message}</p>} {/* メッセージ表示 */}

            {filteredData.length > 0 ? (
              filteredData.map(post => {
                const { news_id, article_title, header_img, created_at, company_name, icon_id } = post;
                const genre = ShowTagsGenre(post.genre);
                const formattedDate = formatDate(created_at);

                return (
                  <div key={news_id} className="news-item">
                    <figure onClick={() => news_detail_jump(news_id)}>
                      <div className="news_title">
                        <h1 className="news_font">{article_title}</h1>
                      </div>
                      <div className="news_company_icon_container">
                        <img src={icon_id} className="news_company_icon" alt="Company Icon" />
                        <p className="company_name">{company_name}</p>
                      </div>

                      <img src={`./header_img/${header_img}`} className="news-img" alt={article_title} />
                    </figure>
                    <div className="news_meta">
                      <p className="created_at_font">{formattedDate}に投稿されました</p>
                      <p className="genre">{genre}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              // 該当するニュースがない場合のメッセージは、genre_news_select内で処理するため、ここでは削除
              null
            )}
          </>
        )}
      </div>
    </>
  );
}
