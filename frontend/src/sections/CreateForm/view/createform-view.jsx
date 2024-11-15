import ListView from "src/components/view/list-view";
import { useParams } from "react-router-dom";


const WriteFormView = () => {
  const { NewsId } = useParams();
  console.log("ニュースID",NewsId);
  return <ListView type="createforms" NewsId={NewsId}/>;
};


export default WriteFormView;
