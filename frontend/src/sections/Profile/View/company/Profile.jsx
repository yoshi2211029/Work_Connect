import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ProfileMypage from './Mypage';
import ProfileNews from './News';
import ProfileCompanyInformation from './CompanyInformation';
import ProfileCheckForm from './CheckForm';
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import { AllItemsContext } from "src/layouts/dashboard/index";


// 同一ページ内リンク用のナビゲーション制御
function samePageLinkNavigation(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 || // 左クリックのみ許可
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  ) {
    return false;
  }
  return true;
}

// カスタムリンクタブ
function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        if (samePageLinkNavigation(event)) {
          event.preventDefault(); // ナビゲーションを防止
        }
      }}
      aria-current={props.selected ? 'page' : undefined}
      {...props}
    />
  );
}

LinkTab.propTypes = {
  selected: PropTypes.bool,
};

//応募フォームタブを表示させるか否かの判断
const Profile = ({ value, companyname: initialCompanyname }) => {
  const [companyname, setCompanyname] = useState(initialCompanyname);

  useEffect(() => {
    if (!initialCompanyname) {
      const url = new URL(window.location.href);
      const urlCompanyname = decodeURIComponent(url.pathname.split('/')[2]); // 2番目の「/」の隣に企業名を取得
      setCompanyname(urlCompanyname);
      console.log("urlCompanyname", urlCompanyname);
    }
  }, [initialCompanyname]);


  return (
    <div>
      <NavTabs initialTabValue={value} companyname={companyname} /> {/* value を initialTabValue として渡す */}
    </div>
  );
};

export default Profile;

// NavTabs コンポーネント
export function NavTabs({ initialTabValue, companyname }) {
  const { getSessionData, updateSessionData } = useSessionStorage();
  const [ProfileTabState, setProfileTabState] = useState(getInitialProfileTabState);
  const { setAllItems } = useContext(AllItemsContext);
  const [value, setValue] = useState(initialTabValue);
  const [checkformboolean, setCheckFormBoolean] = useState(false);
  console.log(companyname);
  console.log(checkformboolean);

  useEffect(() => {
    updateSessionData("accountData", "ProfileTabState", ProfileTabState);
  }, [ProfileTabState]);

  function getInitialProfileTabState() {
    const accountData = getSessionData("accountData");
    return accountData.ProfileTabState || 0; // 初期値を設定
  }


  useEffect(() => {
    function getInitialCheckFormBoolean() {
      const accountData = getSessionData("accountData");
      console.log("アカウントのユーザーネーム", accountData.user_name);
      console.log("企業名", companyname);
      return accountData.user_name === companyname;
    }

    setCheckFormBoolean(getInitialCheckFormBoolean());
  }, [companyname, getSessionData]);

  useEffect(() => {
    console.log("profileのvalue", value);
    if (value !== undefined) {
      setValue(value);
    } else {
      setValue(0);
    }
  }, [value]);

  const handleTabClick = (event, newValue) => {

    // event.type can be equal to focus with selectionFollowsFocus.
    if (
      event.type !== 'click' ||
      (event.type === 'click' && samePageLinkNavigation(event))
    ) {
      setValue(newValue);
    }
    if (newValue === 0) {
      // マイページが押されたとき
      setProfileTabState(0);
      pageCheck('?page=mypage');
      // 検索アイコン非表示にする
    } else if (newValue === 1) {
      // ニュースが押されたとき
      setProfileTabState(1);
      pageCheck('?page=news&category=JobOffer');
    } else if (newValue === 2) {
      // 企業情報が押されたとき
      setProfileTabState(2);
      pageCheck('?page=companyinformation');
    } else if (newValue === 3) {
      // 応募フォームが押されたとき
      setProfileTabState(3);
      pageCheck('?page=checkform');
    }
    setAllItems((prevItems) => ({
      ...prevItems, //既存のパラメータ値を変更するためにスプレッド演算子を使用
      ResetItem: true,
      DataList: [], //検索してない状態にするために初期化 //searchbar.jsxのsearchSourceも初期化
      IsSearch: { searchToggle: 0, Check: false, searchResultEmpty: false },
      Page: 1, //スクロールする前の状態にするために初期化
      sortOption: "orderNewPostsDate", //並び替える前の状態にするために初期化
    }));
  };

  function pageCheck(pageStr) {
    const url = new URL(window.location.href);
    const urlStr = url.pathname.split('?')[0]; // クエリパラメータを取り除く
    window.history.pushState({}, '', `${urlStr}${pageStr}`);
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        aria-label="nav tabs example"
        role="navigation"
      >
        <Tab label="マイページ" onClick={(e) => handleTabClick(e, 0)} />
        <Tab label="ニュース" onClick={(e) => handleTabClick(e, 1)} />
        <Tab label="企業情報" onClick={(e) => handleTabClick(e, 2)} />
        {/* 今ログインしている企業だけに出るタブ */}
        {checkformboolean &&
          <Tab label="応募フォーム" onClick={(e) => handleTabClick(e, 3)} />
        }
      </Tabs>
      {value === 0 && <ProfileMypage />} {/* value が 0 の場合マイページ */}
      {value === 1 && <ProfileNews />}   {/* value が 1 の場合ニュース */}
      {value === 2 && <ProfileCompanyInformation />}   {/* value が 2 の場合企業情報 */}
      {value === 3 && <ProfileCheckForm />}   {/* value が 3 の場合応募フォーム一覧 */}
    </Box>
  );
}

NavTabs.propTypes = {
  initialTabValue: PropTypes.number, // 初期タブを指定するためのプロパティ
  companyname: PropTypes.string,
};

Profile.propTypes = {
  value: PropTypes.number,
  companyname: PropTypes.string,
};
