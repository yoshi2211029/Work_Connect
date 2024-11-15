// import { useEffect, useState } from "react";
// import sessionAccountData from "src/components/account/loginStatusCheck/sessionAccountData";
// import { useParams } from "react-router-dom";
import { NewsSelectView } from "src/sections/InternshipJobOffer/view";


const InternshipJobOfferView = () => {
  // const { Category } = useParams();
  // const [SessionAccountData, setSessionAccountData] = useState(sessionAccountData);
  // console.log("カテゴリー",Category);

  // useEffect(() => {
  //   setSessionAccountData(SessionAccountData);
  // }, [SessionAccountData]);

  return (
    <div>
        <NewsSelectView />
    </div>
  );
};

export default InternshipJobOfferView;
