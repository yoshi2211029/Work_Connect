import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// import { AllItemsContext } from "src/layouts/dashboard/index";
import ListView from "src/components/view/list-view";
import { AllItemsContext } from "src/layouts/dashboard/index";


function samePageLinkNavigation(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 || // ignore everything but left-click
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  ) {
    return false;
  }
  return true;
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        if (samePageLinkNavigation(event)) {
          event.preventDefault();
        }
      }}
      aria-current={props.selected && 'page'}
      {...props}
    />
  );
}

LinkTab.propTypes = {
  selected: PropTypes.bool,
};

export default function NavTabs() {
  const { getSessionData } = useSessionStorage();
  const { AllItems, setAllItems } = useContext(AllItemsContext);
  const { /*DataList,*/ IsSearch, Page, sortOption } = AllItems;

  // const { setAllItems } = useContext(AllItemsContext);
  // const { IsSearch, Page, sortOption } = AllItems;

  const getInitialNewsTabState = () => {
    const accountData = getSessionData("accountData");
    return accountData.NewsTabState ? accountData.NewsTabState : 0;
  };
  const [value, setValue] = useState(getInitialNewsTabState);

  // タブがクリックされたら
  const handleTabClick = (event, newValue) => {
    console.log("handleTabClick");
    setAllItems((prevItems) => ({
      ...prevItems,
      IsLoading : true, // 一時的にローディングを解除
    }));
    if (sortOption !== "orderNewPostsDate" || Page > 1 || IsSearch.Check == true) {
      console.log("あいうえお")
      setAllItems((prevItems) => ({
        ...prevItems, //既存のパラメータ値を変更するためにスプレッド演算子を使用
        ResetItem: true,
        DataList: [], //検索してない状態にするために初期化 //searchbar.jsxのsearchSourceも初期化
        IsSearch: { searchToggle: 0, Check: false, searchResultEmpty: false },
        Page: 1, //スクロールする前の状態にするために初期化
        sortOption: "orderNewPostsDate", //並び替える前の状態にするために初期化
      }));
      // 必要に応じて、スクロール位置や他の状態もリセット
    }
    if (
      event.type !== 'click' ||
      (event.type === 'click' && samePageLinkNavigation(event))
    ) {
      setValue(newValue);

      let category;
      switch (newValue) {
        case 0:
          category = 'JobOffer';
          break;
        case 1:
          category = 'Internship';
          break;
        case 2:
          category = 'Session';
          break;
        case 3:
          category = 'Blog';
          break;
        default:
          category = 'JobOffer';
      }

      // ページ遷移または状態の更新処理
      pageCheck(category);

    }
  };

  function pageCheck(pageStr) {
    // navigate(`/Profile/${user_name}?page=${pageStr}`);
    const url = new URL(window.location.href);
    const urlStr = url.pathname.split('?')[0]; // クエリパラメータを取り除く
    window.history.pushState({}, '', `${urlStr}?page=${pageStr}`);
  }

  // useEffect(() => {
  //   setAllItems((prevItems) => ({
  //     ...prevItems,
  //     ResetItem: true,
  //     DataList: [],
  //     IsSearch: { searchToggle: 0, Check: false, searchResultEmpty: false },
  //     Page: 1,
  //     sortOption: "orderNewPostsDate",
  //   }));
  // }, [setAllItems]);

  //ブラウザの戻るボタンを押してもタブやURLに合ったニュースを表示させる
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get('page');
      let number = 0;

      switch (page) {
        case 'JobOffer':
          setValue(0);
          number = 0;
          break;
        case 'Internship':
          setValue(1);
          number = 1;
          break;
        case 'Blog':
          setValue(2);
          number = 2;
          break;
        case 'Session':
          setValue(3);
          number = 3;
          break;
        default:
          setValue(0); // デフォルトは求人に戻す
          number = 0;
          break;
      }

      console.log("値は→", number);
    };

    // popstate イベントをリスニング
    window.addEventListener('popstate', handlePopState);

    // コンポーネントのアンマウント時にリスナーを削除
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        aria-label="nav tabs example"
        role="navigation"
      >
        <Tab label="求人" onClick={(e) => handleTabClick(e, 0)} />
        <Tab label="インターンシップ" onClick={(e) => handleTabClick(e, 1)} />
        <Tab label="説明会" onClick={(e) => handleTabClick(e, 2)} />
        <Tab label="ブログ" onClick={(e) => handleTabClick(e, 3)} />

      </Tabs>
      {value === 0 && <ListView type="Joboffer" />}
      {value === 1 && <ListView type="Internship" />}
      {value === 2 && <ListView type="Session" />}
      {value === 3 && <ListView type="Blog" />}
    </Box>
  );
}
