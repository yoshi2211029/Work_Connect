// import ListView from "src/components/view/list-view";
// import { useParams } from 'react-router-dom';
// import SpecialCompanyNewsView from "./specialCompanyNews-view";
// import News from "../News";
import Profile from "../../Profile";

const SpecialCheckFormListView = () => {
    let value = 3;
    console.log("checkFormListView通ってます!?");
    console.log("checkFormListViewのvalue", value);

    const path = window.location.pathname; // 例: "/Profile/株式会社アーキテクト/Checkform"
    const companyName = decodeURIComponent(path.split('/')[2]); // 企業名は2番目の要素
    console.log("企業名:", decodeURIComponent(companyName)); // URLデコード
    
    return <Profile value={value} companyname={companyName}/>;
};

export default SpecialCheckFormListView;