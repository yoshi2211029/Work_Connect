import { useEffect, useState } from "react";
import axios from "axios";

import { faker } from "@faker-js/faker";

// タグボタン作成コンポーネント
import CreateTagElements from "src/components/tag/CreateTagElements";

// ----------------------------------------------------------------------
/*--------------------------------------------*/
/* 動画一覧のデータを取得する処理を追加しました。 */
/*--------------------------------------------*/
// 下のMovieOfListの形に合わせたオブジェクト(WorkItem～:の形)にしたresponse.dataが入ります
// ! 注意 ! titleやuserNamaなどのキーはDBのカラム名になっています。

export const VideoListItem = () => {
  // 動画一覧のデータを保持するステート
  const [MovieOfList, setMovieOfList] = useState([]);

  // 動画の一覧データを取得する用URL
  const url = "http://localhost:8000/get_movie_list";

  useEffect(() => {
    // 非同期関数
    async function MovieListFunction() {
      try {
        // Laravel側から動画一覧データを取得
        const response = await axios.get(url, {
          params: {},
        });

        // response.dataは配列の中にオブジェクトがある形になっています
        // console.log("response.data:", response.data);

        // ジャンルはタグのため、カンマ区切りの文字列を配列に変換する
        response.data.forEach((element) => {
          element.genre !== null
            ? (element.genre = element.genre.split(",").map((item) => <CreateTagElements key={item} itemContents={item} />))
            : "";
        });

        setMovieOfList(response.data);
        console.log("MovieListObject:", response.data);
      } catch (err) {
        console.log("err:", err);
      }
    }
    MovieListFunction();
  }, []); // 空の依存配列を渡すことで初回のみ実行されるようにする

  const posts = MovieOfList.map((_, key) => ({
    id: MovieOfList[key].movie_id,
    cover: `/assets/images/covers/cover_${5 + 1}.jpg`,
    thumbnail: `/assets/videoImages/thumbnail/cover_${key + 1}.jpg`,
    title: MovieOfList[key].title,
    genre: MovieOfList[key].genre,
    // substring(0, 200) 第一引数：文字列の開始位置。第二引数：開始位置から何文字目を取得する。
    // introの文字数が200文字以上の時、「...」を表示する。
    intro: MovieOfList[key].intro.length > 200 ? MovieOfList[key].intro.substring(0, 200) + "..." : MovieOfList[key].intro,

    author: {
      avatarUrl: `/assets/images/avatars/avatar_${MovieOfList[key].icon}.jpg`,
    },
    view: faker.number.int(99999),
    comment: faker.number.int(99999),
    favorite: faker.number.int(99999),
    userName: MovieOfList[key].user_name,
    createdAt: MovieOfList[key].post_datetime,
  }));

  console.log("aadlkmbadkmbkmda;", posts);
  return posts;
};

export default VideoListItem;
