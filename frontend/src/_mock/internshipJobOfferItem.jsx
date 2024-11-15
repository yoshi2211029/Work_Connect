// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useSessionStorage } from "src/hooks/use-sessionStorage";

// // ----------------------------------------------------------------------
// /*--------------------------------------------*/
// /* ニュース一覧のデータを取得する処理を追加しました。 */
// /*--------------------------------------------*/
// // ! 注意 ! article_titleやheader_imgなどのキーはDBのカラム名になっています。

// export const InternshipJobOfferItem = () => {
//   // ニュースの一覧のデータを保持するステート
//   const { getSessionData } = useSessionStorage();
//   const [newsData, setNewsData] = useState([]);

//   const accountData = getSessionData("accountData");
//   const data = {
//     id: accountData.id,
//   };
//   console.log("idは",data.id);

//   // ニュースの一覧データを取得する用URL
//   const url = "http://localhost:8000/Internship_JobOffer";

//   useEffect(() => {
//     async function InternshipJobOfferFunction() {
//       try {
//         // Laravel側から企業一覧データを取得
//         const response = await axios.get(url, {
//           params: {},
//         });

//         // response.dataは配列の中にオブジェクトがある形になっています
//         // console.log("response.data:", response.data);

//         console.log("ニュースリスト", response.data);
//         setNewsData(response.data);
//       } catch (err) {
//         console.log("err:", err);
//       }
//     }
//     InternshipJobOfferFunction();
//   }, []); // 空の依存配列を渡すことで初回のみ実行されるようにする

//   const posts = newsData.map((_, key) => ({
//     company_id: newsData[key].company_id,
//     news_id: newsData[key].news_id,
//     company_name: newsData[key].company_name,
//     article_title: newsData[key].article_title,
//     genre: newsData[key].genre,
//     header_img: newsData[key].header_img,
//     news_created_at: newsData[key].news_created_at,
//     icon_id: newsData[key].icon_id,
//   }));

//   return posts;
// };

// export default InternshipJobOfferItem;
