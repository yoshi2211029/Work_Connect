import axios from "axios";

/*--------------------------------------------*/
/*          指定のタグ一覧取得処理              */
/*--------------------------------------------*/
/*
import GetTagList from "～/GetTagList";
const { GetTagListFunction } = GetTagList();
GetTagListFunction();
*/
/* ↑この3行でこの関数を使用可能です */
/*--------------------------------------------*/
function GetTagList() {
  // セッションストレージのaccountData.idが正しいidでなければトップページに飛ばす
  const GetTagListFunction = async (kind) => {
    try {
      if (kind != undefined) {
        const url = `http://localhost:8000/get_${kind}_tag`;
        let result;
        result = await axios.get(url, {});
        return result.data;
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

  return { GetTagListFunction };
}
/*-------------------------------------------*/

export default GetTagList;
