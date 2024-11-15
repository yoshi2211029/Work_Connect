import * as React from 'react';
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import { useSessionStorage } from "src/hooks/use-sessionStorage";

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


import ProfileMypage from './Mypage';
import { AllItemsContext } from "src/layouts/dashboard/index";
import ListView from "src/components/view/list-view";

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
        // Routing libraries handle this, you can remove the onClick handle when using them.
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
  // タブ状態のチェック
  const { getSessionData, updateSessionData } = useSessionStorage();
  const { setAllItems } = useContext(AllItemsContext);
  /* セッションストレージからaccountDataを取得し、ProfileTabStateを初期値として設定
     ProfileTabStateがない場合は0をセットする */
  const getInitialProfileTabState = () => {
    const accountData = getSessionData("accountData");
    return accountData.ProfileTabState ? accountData.ProfileTabState : 0;
  };

  const [ProfileTabState, setProfileTabState] = useState(getInitialProfileTabState);
  const [value, setValue] = React.useState(getInitialProfileTabState);
  // パラメータから取得したユーザーネーム
  const { user_name } = useParams();
  // ProfileTabStateが変化したとき
  useEffect(() => {
    updateSessionData("accountData", "ProfileTabState", ProfileTabState);
  }, [ProfileTabState]);

  const navigate = useNavigate();

  /* 作品か動画かを判断する用のパラメータ追加処理 */
  function pageCheck(pageStr) {
    navigate(`/Profile/${user_name}?page=${pageStr}`);
  }

  useEffect(() => {
    setValue(0);
  }, []);

  useEffect(() => {
    if (value === 0) {
      // マイページが押されたとき
      setProfileTabState(0);
      pageCheck('mypage');


    } else if (value === 1) {
      // 作品が押されたとき
      setProfileTabState(1);
      pageCheck('work');
    } else if (value === 2) {
      // 動画が押されたとき
      setProfileTabState(2);
      pageCheck('movie');
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
      pageCheck('mypage');
      // 検索アイコン非表示にする
    } else if (newValue === 1) {
      // 作品が押されたとき
      setProfileTabState(1);
      pageCheck('work');
    } else if (newValue === 2) {
      // 動画が押されたとき
      setProfileTabState(2);
      pageCheck('movie');
    }
    // 作品・動画一覧を正常に再表示するために必要な処理
    setAllItems((prevItems) => ({
      ...prevItems, //既存のパラメータ値を変更するためにスプレッド演算子を使用
      IsLoading: true,
      ResetItem: true,
      DataList: [], //検索してない状態にするために初期化 //searchbar.jsxのsearchSourceも初期化
      IsSearch: { searchToggle: 0, Check: false, searchResultEmpty: false },
      Page: 1, //スクロールする前の状態にするために初期化
      sortOption: "orderNewPostsDate", //並び替える前の状態にするために初期化
    }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/*
        2024/09/13 14:38 Tabsコンポーネントに直接onClickイベントをすると動かないので
        子コンポーネントにそれぞれhandleTabClickを適応させました。
      */}
      <Tabs
        value={value}
        aria-label="nav tabs example"
        role="navigation"
      >
        <Tab label="マイページ" onClick={(e) => handleTabClick(e, 0)} />
        <Tab label="作品" onClick={(e) => handleTabClick(e, 1)} />
        <Tab label="動画" onClick={(e) => handleTabClick(e, 2)} />
      </Tabs>
      {value === 0 && <ProfileMypage />}
      {value === 1 && <ListView type="works" ParamUserName={user_name} />}
      {value === 2 && <ListView type="movies" ParamUserName={user_name} />}
    </Box>
  );

}

