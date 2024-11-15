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
function GetTagAllList() {
    // セッションストレージのaccountData.idが正しいidでなければトップページに飛ばす
    const GetTagAllListFunction = async (kind) => {
        try {
            if (kind != undefined) {
                const url = `http://localhost:8000/get_${kind}_tag`;
                let result;
                let optionArray = [];

                result = await axios.get(url, {
                    params: { All: "tags" },
                });

                const tags = result.data;

                tags.map((value) => {
                    optionArray.push({ value: value.name, label: value.name });
                });

                console.log("optionArray: ", optionArray);


                return optionArray;
            }


        } catch (err) {
            console.log("err: ", err);
        }
    };

    return { GetTagAllListFunction };
}
/*-------------------------------------------*/

export default GetTagAllList;
