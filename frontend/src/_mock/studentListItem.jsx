import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { faker } from "@faker-js/faker";

// タグボタン作成コンポーネント
import CreateTagElements from "src/components/tag/CreateTagElements";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
// ----------------------------------------------------------------------
/*--------------------------------------------*/
/* 学生一覧のデータを取得する処理を追加しました。 */
/*--------------------------------------------*/
// 下のMovieOfListの形に合わせたオブジェクト(WorkItem～:の形)にしたresponse.dataが入ります
// ! 注意 ! titleやuserNamaなどのキーはDBのカラム名になっています。

export const StudentListItem = () => {
  // 学生一覧のデータを保持するステート
  const [StudentOfList, setStudentOfList] = useState([]);
  const { getSessionData } = useSessionStorage();

const accountData = getSessionData("accountData");
  const data = {
    id: accountData.id,
  };

  // dataオブジェクトの中のidを使ってURLを作成
  const url = `http://localhost:8000/get_student_list/${data.id}`;

  // URLをコンソールに出力して確認
  console.log("urlは", url);


  // 学生の一覧データを取得する用URL

  useEffect(() => {
    async function StudentListFunction() {
      try {
        // Laravel側から学生一覧データを取得
        const response = await axios.get(url, {
          params: {},
        });

        // response.dataは配列の中にオブジェクトがある形になっています
        // console.log("response.data:", response.data);

        // 卒業年度、学校名、希望職業、希望勤務地、はタグのため、カンマ区切りの文字列を配列に変換する
        response.data.forEach((element) => {
          element.desired_work_region !== null
            ? (element.desired_work_region = element.desired_work_region
                .split(",")
                .map((item) => <CreateTagElements key={item} itemContents={item} />))
            : "";
          element.desired_occupation !== null
            ? (element.desired_occupation = element.desired_occupation.split(",").map((item) => <CreateTagElements key={item} itemContents={item} />))
            : "";
        });

        setStudentOfList(response.data);
        console.log("StudentListObject:", response.data);
      } catch (err) {
        console.log("err:", err);
      }
    }
    StudentListFunction();
  }, []); // 空の依存配列を渡すことで初回のみ実行されるようにする

  console.log("posts:", StudentOfList[0]);
  const posts = StudentOfList.map((_, key) => ({
    id: StudentOfList[key].id,
    cover: `/assets/images/covers/cover_${key + 1}.jpg`,
    user_name: StudentOfList[key].user_name,
    graduationYear: StudentOfList[key].graduation_year,
    title: StudentOfList[key].student_surname + StudentOfList[key].student_name,
    schoolName: StudentOfList[key].school_name,
    desiredWorkRegion: StudentOfList[key].desired_work_region,
    desiredOccupation: StudentOfList[key].desired_occupation,
    view: faker.number.int(99999),
    followStatus: StudentOfList[key].follow_status,
    comment: faker.number.int(99999),
    favorite: faker.number.int(99999),
    author: {
      avatarUrl: `/assets/images/avatars/avatar_${key + 1}.jpg`,
    },
  }));

  return posts;
};

CreateTagElements.propTypes = {
  itemContents: PropTypes.string.isRequired, // ここで型と必須の設定を行う
};

export default StudentListItem;