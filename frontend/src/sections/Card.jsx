import { useContext, useEffect, useState, useRef } from "react";
import { ColorRing } from "react-loader-spinner";
import useSWR from "swr";
import PropTypes from "prop-types";
import { faker } from "@faker-js/faker";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import LoginStatusCheck from "src/components/account/loginStatusCheck/loginStatusCheck";
import sessionAccountData from "src/components/account/loginStatusCheck/sessionAccountData";
import { AllItemsContext } from "src/layouts/dashboard";
import { useIntersection } from "src/routes/hooks/use-intersection";

import { UseCreateTagbutton } from "src/hooks/use-createTagbutton";

const fetcher = (lastUrl) => fetch(lastUrl).then((res) => res.json());
const setting = {
  rootMargin: "40px",
};
const funcSetWorksItem = (idKey, tags, currentWorkList, setWorkList, newWorks, setLoading, setItemLoading, error, generatePosts, scanAdd) => {

  const { tagCreate } = UseCreateTagbutton();
  console.log("newWorksnewWorks", newWorks)
  if (newWorks) {
    console.log("newWorks", newWorks);

    const existingIds = new Set(currentWorkList.map(item => item[idKey]));

    const filteredNewWorks = newWorks.filter(element => !existingIds.has(element[idKey]));

    // 全作品アイテム
    filteredNewWorks.forEach((element) => {
      // 作品のジャンル取り出す
      console.log("ループ中");
      tags.forEach((tag) => {
        // 取り出した配列の中にあるカンマ区切りの項目をtagCreateに渡す
        if (typeof element[tag] === "string" && element[tag] !== null) {
          element[tag] = tagCreate(element[tag]);
        }
      }
      );
    });


    setWorkList((prev) => {
      const updatedElements = [...prev, ...generatePosts(filteredNewWorks)];
      scanAdd(updatedElements);
      return updatedElements;
    })
    setLoading(false);
    setItemLoading(false);
  }

  if (error) {
    console.error(error);
    setLoading(false);
    setItemLoading(false);
  }
};


// --------------------------------ItemObjectAndPostCard--------------------------------
export default function ItemObjectAndPostCard({ type, ParamUserName }) {
  // sessiondata取得
  const [SessionAccountData, setSessionAccountData] = useState(sessionAccountData);
  const [PathName, setPathName] = useState(window.location.pathname);
  const [PostCard, setPostCard] = useState(null);
  const [PostSort, setPostSort] = useState(null);

  useEffect(() => {
    setSessionAccountData(SessionAccountData);
  }, [SessionAccountData]);

  useEffect(() => {
    setPathName(PathName);
  }, [PathName]);

  useEffect(() => {
    // URLごとにpost-sort、post-card.jsxを各フォルダから取得
    const loadComponents = async () => {
      if (PathName === "/" || PathName === `/Profile/${SessionAccountData.user_name}` || PathName === `/Profile/${ParamUserName}`) {
        const { default: WorkListPostCard } = await import("src/sections/WorkList/post-card");
        const { default: WorkListPostSort } = await import("src/sections/WorkList/post-sort");
        setPostCard(() => WorkListPostCard);
        setPostSort(() => WorkListPostSort);
        console.log("WorkListPostCard");
      }
    };
    loadComponents();
  }, [SessionAccountData.user_name, PathName]);


  const urlMapping = {
    works: {
      ItemName: "作品一覧",
      url: "http://localhost:8000/get_work_list",
      idKey: "work_id",
      tags: ["work_genre"],
      generatePosts: (WorkOfList, key) =>
        WorkOfList.map((work) => ({
          work_id: work.work_id,
          thumbnail: `/assets/images/covers/cover_${key + 1}.jpg`,
          title: work.work_name,
          genre: work.work_genre,
          intro: work.work_intro.length > 200 ? work.work_intro.substring(0, 200) + "..." : work.work_intro,
          author: {
            avatarUrl: `/assets/images/avatars/avatar_${work.icon}.jpg`,
          },
          // view: faker.number.int(99999),
          // comment: faker.number.int(99999),
          favorite: faker.number.int(99999),
          userName: work.user_name,
          createdAt: work.created_at,
        })),
    }
  };

  // console.log("ループしてるか確認");
  return (

    <Card
      SessionAccountData={SessionAccountData}
      PathName={PathName}
      urlMapping={urlMapping[type]}
      PostCard={PostCard}
      PostSort={PostSort}
      ParamUserName={ParamUserName}
    />
  );
}

ItemObjectAndPostCard.propTypes = {
  type: PropTypes.string,
  ParamUserName: PropTypes.string,
};

// ------------------------------------------------Card------------------------------------------------
const Card = ({ PathName, urlMapping, PostCard, PostSort }) => {
  // ログインチェック
  const { loginStatusCheckFunction } = LoginStatusCheck();
  // 作品アイテム格納
  const [WorkOfList, setWorkOfList] = useState([]);
  // 画面全体ローディング
  const [isLoadColorLing, setIsLoadColorLing] = useState(true);
  // 一覧アイテム最後尾ローディング
  const [isLoadItemColorLing, setIsLoadItemColorLing] = useState(false);
  // AllItemsContextから状態を取得
  const { AllItems, setAllItems } = useContext(AllItemsContext);
  const { IsSearch, Page, sortOption, ResetItem } = AllItems;
  // スクロールされたらtrueを返す。
  const [isIntersecting, ref] = useIntersection(setting);

  const { ItemName, url, idKey, tags, generatePosts } = urlMapping || {};
  // 列数
  const row = 4;

  // 挿入先コンテナとボタンの参照を取得
  const cardsContainerRef = useRef(null);



  useEffect(() => {
    loginStatusCheckFunction();
  }, []);
  useEffect(() => {
    console.log("urlMapping", urlMapping);
  }, [urlMapping]);

  // 並べ替え
  const handleSortChange = (event) => {
    // 並べ替え内容「例：投稿日が新しい順」を取得
    const newValue = event.target.value;
    // URLパラメータにセットしてLaravel側でデータを1取得するための準備
    setAllItems((prevItems) => ({
      ...prevItems,
      Page: 1,
      sortOption: newValue,
    }));
    // ローディング表示
    setIsLoadColorLing(true);
    // 無駄なアイテム追加を防ぐために一度綺麗にする
    setWorkOfList([]);
  };


  //   一覧データ取得URL
  let lastUrl = "";
  if (url && (PathName === "/TestPage")) {
    console.log(" URLとPathNameが有効かつ、現在のPathNameがProfileページでない場合");
    lastUrl = `${url}?page=${Page}&sort=${sortOption}`;
  }

  const { data, error } = useSWR(lastUrl, fetcher);

  useEffect(() => {
    if (isIntersecting) {
      setIsLoadItemColorLing(true);
      setAllItems((prevItems) => ({
        ...prevItems,
        Page: prevItems.Page + 1,
      }));
    }
  }, [isIntersecting]);

  /*----- 検索されていないかつ作品データがあるとき -----*/
  useEffect(() => {
    if (!ResetItem && !IsSearch.Check && data) {
      console.log("datadataWorkOfList", WorkOfList);
      console.log("datadata", data);
      funcSetWorksItem(idKey, tags, WorkOfList, setWorkOfList, data, setIsLoadColorLing, setIsLoadItemColorLing, error, generatePosts, scanAdd);
    }
  }, [data, error, ResetItem, IsSearch.Check, IsSearch.searchResultEmpty]);

  const renderWorkItems = WorkOfList && PostCard ?
    <div ref={cardsContainerRef} className="p-cards-render" id="card-container">
      {
        WorkOfList.map((post, index) => (
          <PostCard className="mediaCard c-card-container" ref={index === WorkOfList.length - 1 ? ref : null}
            key={`${post}-${index}`} post={post} index={index} />


        ))
      }
    </div>
    : null;


  // カードをDOMに追加し位置を決定
  const scanAdd = (updatedElements) => {
    updatedElements.forEach((ele, index) => {
      // index、つまりカードが何番目かと列数でx,yの位置を決定する
      const height = ele.selfHeight;
      ele.y = index < row ? height : updatedElements[index - row].y + height;

      const x = `${(index % row) * 100}%`;
      const y = index < row ? 0 : updatedElements[index - row].y;

      // カードに対してスタイルを適用
      const cardDom = document.getElementById(ele.id);
      if (cardDom) {
        cardDom.style.height = `${height}px`;
        cardDom.style.transform = `translate(${x}, ${y}px)`;

        // アニメーション用のスタイルを追加
        setTimeout(() => {
          cardDom.classList.add("u-animate");
        }, 500);
      }
    });
  };


  return (
    <>
      {isLoadColorLing && (
        <ColorRing
          visible={true}
          height="100"
          width="100"
          ariaLabel="color-ring-loading"
          wrapperStyle={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          wrapperClass="custom-color-ring-wrapper" // カスタムクラスを指定
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      )}
      <Container maxWidth="xl" >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          {typeof ItemName === "string" ? (
            <>
              <Typography variant="h4">{ItemName}</Typography>
            </>
          ) : null}
        </Stack>
        <Stack mb={5} direction="row" alignItems="center" justifyContent="flex-end">

          {PostSort && PathName !== "CompanyList" && PathName !== "StudentList" && IsSearch.searchResultEmpty !== true && (
            <PostSort

              options={[
                { value: "orderNewPostsDate", label: "投稿日が新しい順" },
                { value: "orderOldPostsDate", label: "投稿日が古い順" },
              ]}
              sortOption={sortOption}
              onSort={handleSortChange}

            />
          )}
        </Stack>

        <Grid container spacing={3}>
          {/* 作品アイテムの表示 */}
          {renderWorkItems}

          {isLoadItemColorLing && (
            <ColorRing
              visible={true}
              height="50"
              width="50"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          )}
        </Grid>
      </Container>
    </>
  );
};

Card.propTypes = {
  SessionAccountData: PropTypes.object,
  PathName: PropTypes.string,
  urlMapping: PropTypes.object,
  generatePosts: PropTypes.func,
  PostCard: PropTypes.elementType,
  PostSort: PropTypes.elementType,
  ParamUserName: PropTypes.string,
};
