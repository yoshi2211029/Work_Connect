import axios from "axios";

/*--------------------------------------------*/
/*               タグ作成処理                  */
/*--------------------------------------------*/
/*
import InsertTag from "～/InsertTag";
const { InsertTagFunction } = InsertTag();
InsertTagFunction();
*/
/* ↑この3行でこの関数を使用可能です */
/*--------------------------------------------*/
function InsertTag() {

  // セッションストレージのaccountData.idが正しいidでなければトップページに飛ばす
  const InsertTagFunction = async (name, item_id) => {

    if (name != undefined) {
      if (item_id != undefined) {
        await axios.post(
          "http://localhost:8000/insert_tag",
          {
            name: name,
            item_id: item_id
          }
        );
      }
    }
  };

  return { InsertTagFunction };
}
/*-------------------------------------------*/

export default InsertTag;
