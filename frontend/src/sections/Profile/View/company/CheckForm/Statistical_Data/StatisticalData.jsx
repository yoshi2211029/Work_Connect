import { Helmet } from "react-helmet-async";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import ListView from "src/components/view/list-view";
import { useParams } from "react-router-dom";


// ----------------------------------------------------------------------

export default function StatisticalDataPage() {

const { user_name } = useParams();
console.log(user_name);

const { getSessionData} = useSessionStorage();
const accountData = getSessionData("accountData") || {};
const data = {
  user_name:accountData.user_name
};

const UserName = data.user_name;
console.log("企業名",UserName);


  return (
    <>
      <Helmet>
        <title> 応募フォーム一覧-グラフ- | Minimal UI </title>
      </Helmet>

      <ListView type="specialstatisticaldata" ParamUserName={UserName}/>
    </>
  );
}
