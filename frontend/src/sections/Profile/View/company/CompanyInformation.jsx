import { Helmet } from "react-helmet-async";
import ListView from "src/components/view/list-view";
import { useParams } from "react-router-dom";


// ----------------------------------------------------------------------

export default function CompanyNewsPage() {

const { user_name } = useParams();
console.log(user_name);

  return (
    <>
      <Helmet>
        <title> 企業の詳細情報 | Minimal UI </title>
      </Helmet>

      <ListView type="companyinformations" ParamUserName={user_name}/>
    </>
  );
}
