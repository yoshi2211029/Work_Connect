import { Container, RegistarCard } from "../css/RegistarStyled";

import Environment from "./detailInformation/EnvironmentDropdown";
import Hobby from "./detailInformation/Hobby";
import PrefectureSelect from "./detailInformation/PrefectureDropdown";
import DesiredOccupation from "./detailInformation/DesiredOccupation";
import ProgrammingLanguage from "./detailInformation/ProgrammingLanguage";
import Qualification from "./detailInformation/Qualification";
import Software from "./detailInformation/SoftwareDropdown";

const MoreInformation = () => {
  return (
    <Container>
      <RegistarCard>
        
        {/* 開発環境 */}
        <Environment />
        
        {/* 趣味 */}
        <Hobby />
        
        {/* 希望勤務地 */}
        <PrefectureSelect />
        
        {/* 希望職種 */}
        <DesiredOccupation />
        
        {/* プログラミング言語 */}
        <ProgrammingLanguage />
        
        {/* 取得資格 */}
        <Qualification />
        
        {/* ソフトウェア */}
        <Software />
        
      </RegistarCard>
    </Container>
  );
};

export default MoreInformation;
