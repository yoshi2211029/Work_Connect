import ListView from "src/components/view/list-view";
import { useParams } from 'react-router-dom';
// import SpecialCompanyNewsView from "./specialCompanyNews-view";
// import News from "../News";
import Profile from "../Profile";

const SpecialCompanyNewsListView = () => {
    const { user_name, Genre } = useParams();
    let value = 0;

    if (Genre === "JobOffer") {
        value = 1;
        return (
            <>
                <Profile value={value} />
                <ListView type="specialjoboffers" ParamUserName={user_name} />
            </>
        );
    } else if (Genre === "Internship") {
        value = 1;
        return (
            <>
                <Profile value={value} />
                <ListView type="specialinternships" ParamUserName={user_name} />
            </>
        );
    } else if (Genre === "Blog") {
        value = 1;
        return (
            <>
                <Profile value={value} />
                <ListView type="specialblogs" ParamUserName={user_name} />
            </>
        );
    } else if (Genre === "Forms") {
        value = 1;
        return (
            <>
                <Profile value={value} />
                <ListView type="specialforms" ParamUserName={user_name} />
            </>
        );
    } else {
        return <div>該当するニュースがありません。</div>;
    }
};

export default SpecialCompanyNewsListView;