import { useEffect, useState } from "react";
import axios from "axios";

import { faker } from "@faker-js/faker";

// タグボタン作成コンポーネント
import CreateTagElements from "src/components/tag/CreateTagElements";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
// ----------------------------------------------------------------------
/*--------------------------------------------*/
/* 企業一覧のデータを取得する処理を追加しました。 */
/*--------------------------------------------*/
// 下のMovieOfListの形に合わせたオブジェクト(WorkItem～:の形)にしたresponse.dataが入ります
// ! 注意 ! titleやuserNamaなどのキーはDBのカラム名になっています。

export const CompanyListItem = () => {
  // 企業一覧のデータを保持するステート
  const [CompanyOfList, setCompanyOfList] = useState([]);
  const { getSessionData } = useSessionStorage();

  const accountData = getSessionData("accountData");
  const data = {
    id: accountData.id,
  };
  console.log("idは",data.id);

  // 企業の一覧データを取得する用URL
  const url = `http://localhost:8000/get_company_list/${data.id}`;

  useEffect(() => {
    async function CompanyListFunction() {
      try {
        // Laravel側から企業一覧データを取得
        const response = await axios.get(url, {
          params: {},
        });

        // response.dataは配列の中にオブジェクトがある形になっています
        // console.log("response.data:", response.data);

        // 職業(職種)はタグのため、カンマ区切りの文字列を配列に変換する
        response.data.forEach((element) => {
          element.selected_occupation !== null
            ? (element.selected_occupation = element.selected_occupation
                .split(",")
                .map((item) => <CreateTagElements key={item} itemContents={item} />))
            : "";
          element.prefecture !== null
            ? (element.prefecture = element.prefecture
                .split(",")
                .map((item) => <CreateTagElements key={item} itemContents={item} />))
            : "";
        });

        setCompanyOfList(response.data);
        console.log("CompanyListObject:", response.data);
      } catch (err) {
        console.log("err:", err);
      }
    }
    CompanyListFunction();
  }, []); // 空の依存配列を渡すことで初回のみ実行されるようにする

  const posts = CompanyOfList.map((_, key) => ({
    id: CompanyOfList[key].id,
    cover: `/assets/images/covers/cover_${key + 1}.jpg`,
    title: CompanyOfList[key].company_name,
    selectedOccupation: CompanyOfList[key].selected_occupation,
    prefecture: CompanyOfList[key].prefecture,
    view: faker.number.int(99999),
    followStatus: CompanyOfList[key].follow_status,
    comment: faker.number.int(99999),
    favorite: faker.number.int(99999),
    author: {
      //   name: "",
      avatarUrl: `/assets/images/avatars/avatar_${key + 1}.jpg`,
    },
  }));

  return posts;
};

export default CompanyListItem;
