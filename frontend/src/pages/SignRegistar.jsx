// インポート
import { useLocation } from 'react-router-dom';
import PreSignUrlCheck from "src/components/account/students/PreSignUrlCheck";
import PreSignUrlCheck2 from "src/components/account/company/PreSignUrlCheck";

export default function SignRegistar() {

  // URLを取得
  const searchParams = new URLSearchParams(useLocation().search);
  // URLに付与した'kind'を取得
  const kind = searchParams.get('kind');
  if(kind == "s"){
    // 学生側
    return (
      <>
        <PreSignUrlCheck />
      </>
    );
  } else if(kind == "c"){
    // 企業側
    return (
      <>
        <PreSignUrlCheck2 />
      </>
    );
  } 
  
}



