import { Helmet } from "react-helmet-async";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import ListView from "src/components/view/list-view";

// ----------------------------------------------------------------------

export default function SpecialFormsPage() {

  const { getSessionData } = useSessionStorage();
  const accountData = getSessionData("accountData") || {};
  const UserName = accountData.user_name; // 直接取得する
  console.log("UserName",UserName);

  return (
    <>
      <Helmet>
        <title>応募フォーム一覧 | Minimal UI</title>
      </Helmet>

      <ListView type="specialforms" ParamUserName={UserName} />
    </>
  );
}
