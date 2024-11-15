import { useContext, useEffect, useState } from "react";
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

import { useParams } from 'react-router-dom';


const fetcher = (lastUrl) => fetch(lastUrl).then((res) => res.json());
const setting = {
  rootMargin: "40px",
};

const funcSetWorksItem = (idKey, tags, currentWorkList, setWorkList, newWorks, setLoading, setItemLoading, error, generatePosts) => {

  // ジャンル
  // const [WorkGenre, setWorkGenre] = useState("");

  const { tagCreate } = UseCreateTagbutton();
  // useEffect(() => {
  //   setWorkGenre(tagCreate(genre));
  // }, [newWorks])

  if (newWorks) {
    console.log("newWorks", newWorks);

    const existingIds = new Set(currentWorkList.map(item => item[idKey]));

    const filteredNewWorks = newWorks.filter(element => !existingIds.has(element[idKey]));

    // 全作品アイテム
    filteredNewWorks.forEach((element) => {
      // 作品のジャンル取り出す
      tags.forEach((tag) => {
        // 取り出した配列の中にあるカンマ区切りの項目をtagCreateに渡す
        if (typeof element[tag] === "string" && element[tag] !== null) {
          element[tag] = tagCreate(element[tag]);
        }
      }
      );
    });

    // if(SearchFlag == true) {
    //   setWorkList((prev) => [...prev, ...generatePosts(filteredNewWorks)])
    // }else {
    //   setWorkList("検索結果は0件です。");
    // }

    setWorkList((prev) => [...prev, ...generatePosts(filteredNewWorks)])
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
export default function ItemObjectAndPostCard({ type, ParamUserName}) {
  const [SessionAccountData, setSessionAccountData] = useState(sessionAccountData);
  const [PathName, setPathName] = useState(window.location.pathname);
  const [PostCard, setPostCard] = useState(null);
  const [PostSort, setPostSort] = useState(null);
  const { newsdetail_id } = useParams();
  const [NewsDetailId, setNewsDetailId] = useState(newsdetail_id);

  useEffect(() => {
    setSessionAccountData(SessionAccountData);
  }, [SessionAccountData]);

  useEffect(() => {
    setPathName(PathName);
  }, [PathName]);


  useEffect(() => {
    setNewsDetailId(NewsDetailId);
  }, [NewsDetailId]);


  useEffect(() => {
    console.log(PathName);
    console.log(ParamUserName);
    
    // URLごとにpost-sort、post-card.jsxを各フォルダから取得
    const loadComponents = async () => {
      if (PathName === "/" || PathName === `/Profile/${SessionAccountData.user_name}` || PathName === `/Profile/${ParamUserName}`) {
        const { default: WorkListPostCard } = await import("src/sections/WorkList/post-card");
        const { default: WorkListPostSort } = await import("src/sections/WorkList/post-sort");
        setPostCard(() => WorkListPostCard);
        setPostSort(() => WorkListPostSort);
        console.log("WorkListPostCard");
      } else if (PathName === "/VideoList" || PathName === `/Profile/${SessionAccountData.user_name}` || PathName === `/Profile/${ParamUserName}`) {
        const { default: VideoListPostCard } = await import("src/sections/VideoList/post-card");
        const { default: VideoListPostSort } = await import("src/sections/VideoList/post-sort");
        setPostCard(() => VideoListPostCard);
        setPostSort(() => VideoListPostSort);
        console.log("VideoListPostCard");
      } else if (PathName === "/StudentList") {
        const { default: StundetListPostCard } = await import("src/sections/StudentList/post-card");
        setPostCard(() => StundetListPostCard);
        console.log("StundetListPostCard");
      } else if (PathName === "/CompanyList") {
        const { default: CompanyListPostCard } = await import("src/sections/CompanyList/post-card");
        setPostCard(() => CompanyListPostCard);
        console.log("CompanyListPostCard");
      } else if (PathName === `/Internship_JobOffer/joboffers` || 
        PathName === `/Internship_JobOffer/internships` || 
        PathName === `/Internship_JobOffer/blogs` || 
        PathName === `/Profile/${ParamUserName}/News`) {
        const { default: Internship_JobOfferPostCard } = await import("src/sections/InternshipJobOffer/post-card");
        setPostCard(() => Internship_JobOfferPostCard);
        console.log("Internship_JobOfferPostCard");
      }else if (PathName === `/WriteForm/${NewsDetailId}`) {
        const { default: WriteFormPostCard } = await import("src/sections/WriteForm/post-card");
        setPostCard(() => WriteFormPostCard);
        console.log("WriteFormPostCard");
      }
    };
    loadComponents();
  }, [SessionAccountData.user_name,PathName,NewsDetailId,ParamUserName]);


  const urlMapping = {
    works: {
      ItemName: "作品一覧",
      url: "http://localhost:8000/get_work_list",
      idKey: "work_id",
      tags: ["work_genre"],
      generatePosts: (WorkOfList) =>
        WorkOfList.map((work) => ({
          work_id: work.work_id,
          thumbnail: `sss`,
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
    },
    movies: {
      ItemName: "動画一覧",
      url: "http://localhost:8000/get_movie_list",
      idKey: "movie_id",
      tags: ["genre"],
      generatePosts: (WorkOfList) =>
        WorkOfList.map((movie) => ({
          movie_id: movie.movie_id,
          movie: movie.youtube_url,
          title: movie.title,
          genre: movie.genre,
          intro: movie.intro.length > 200 ? movie.intro.substring(0, 200) + "..." : movie.intro,
          author: {
            avatarUrl: `/assets/images/avatars/avatar_${movie.icon}.jpg`,
          },
          // view: faker.number.int(99999),
          // comment: faker.number.int(99999),
          favorite: faker.number.int(99999),
          userName: movie.user_name,
          createdAt: movie.created_at,
        })),
    },
    students: {
      ItemName: "学生一覧",
      url: "http://localhost:8000/get_student_list",
      idKey: "id",
      tags: [
        "desired_occupation",
        "desired_work_region",
        "programming_language",
        "development_environment",
        "software",
        "acquisition_qualification",
        "hobby",
      ],
      generatePosts: (WorkOfList) =>
        WorkOfList.map((student, key) => ({
          student_id: student.id,
          icon: student.icon,
          cover: `/assets/images/covers/cover_${key + 1}.jpg`,
          userName: student.user_name,
          graduationYear: student.graduation_year,
          schoolName: student.school_name,
          desiredWorkRegion: student.desired_work_region,
          desiredOccupation: student.desired_occupation,
          followStatus: student.follow_status,
          author: {
            avatarUrl: `/assets/images/avatars/avatar_0.jpg`,
          },
        })),
    },
    companies: {
      ItemName: "企業一覧",
      url: "http://localhost:8000/get_company_list",
      idKey: "id",
      tags: ["selected_occupation", "prefecture"],
      generatePosts: (WorkOfList) =>
        WorkOfList.map((company, key) => ({
          company_id: company.id,
          icon: company.icon,
          userName: company.user_name,
          companyName: company.company_name,
          selectedOccupation: company.selected_occupation,
          prefecture: company.prefecture,
          cover: `/assets/images/covers/cover_${key + 1}.jpg`,
          author: {
            avatarUrl: `/assets/images/avatars/avatar_${company.icon}.jpg`,
          },
          followStatus: company.follow_status,
        })),
    },
    joboffers: {
      ItemName: "求人一覧",
      url: `http://localhost:8000/Internship_JobOffer/${SessionAccountData.id}/joboffers`,
      idKey: "id",
      tags: ["company_name"],
      generatePosts: (WorkOfList) =>
        WorkOfList.map((company) => ({
          company_id: company.company_id,
          news_id: company.news_id,
          company_name: company.company_name[0].props.children,
          article_title: company.article_title,
          genre: company.genre,
          header_img: company.header_img,
          news_created_at: company.news_created_at,
          icon_id: company.icon_id,
          followStatus: company.follow_status,
        })),
    },
    internships: {
      ItemName: "インターンシップ一覧",
      url: `http://localhost:8000/Internship_JobOffer/${SessionAccountData.id}/internships`,
      idKey: "id",
      tags: ["company_name"],
      generatePosts: (WorkOfList) =>
        WorkOfList.map((company) => ({
          company_id: company.company_id,
          news_id: company.news_id,
          company_name: company.company_name[0].props.children,
          article_title: company.article_title,
          genre: company.genre,
          header_img: company.header_img,
          news_created_at: company.news_created_at,
          icon_id: company.icon_id,
          followStatus: company.follow_status,
        })),
    },
    blogs: {
      ItemName: "ブログ一覧",
      url: `http://localhost:8000/Internship_JobOffer/${SessionAccountData.id}/blogs`,
      idKey: "id",
      tags: ["company_name"],
      generatePosts: (WorkOfList) =>
        WorkOfList.map((company) => ({
          company_id: company.company_id,
          news_id: company.news_id,
          company_name: company.company_name[0].props.children,
          article_title: company.article_title,
          genre: company.genre,
          header_img: company.header_img,
          news_created_at: company.news_created_at,
          icon_id: company.icon_id,
          followStatus: company.follow_status,
        })),
    },
    writeforms: {
      ItemName: "応募用フォーム",
      url: `http://localhost:8000/write_form_get/${NewsDetailId}`,
      idKey: "id",
      tags: ["company_name"],
      generatePosts: (WorkOfList) => {
        return WorkOfList.map((company) => ({
          company_id: company.company_id,
          create_form: company.create_form,
          news_id: company.news_id,

        }));
      },
    },
    specialcompanynews: {
      ItemName: `${ParamUserName}さんのニュース一覧`,
      url: `http://localhost:8000/Internship_JobOffer/special_company_news/${ParamUserName}/${SessionAccountData.id}`,
      idKey: "id",
      tags: ["company_name"],
      generatePosts: (WorkOfList) => {
        return WorkOfList.map((company) => ({
          company_id: company.company_id,
          news_id: company.news_id,
          company_name: company.company_name[0].props.children,
          article_title: company.article_title,
          genre: company.genre,
          header_img: company.header_img,
          news_created_at: company.news_created_at,
          icon_id: company.icon_id,
          follow_status: company.follow_status,
        }));
      },
    },
  };
  
  return (
    <ListView
      SessionAccountData={SessionAccountData}
      PathName={PathName}
      urlMapping={urlMapping[type]}
      PostCard={PostCard}
      PostSort={PostSort}
      ParamUserName={ParamUserName}
      NewsDetailId={NewsDetailId}
    />
  );
}

ItemObjectAndPostCard.propTypes = {
  SessionAccountDat: PropTypes.string,
  type: PropTypes.string,
  ParamUserName: PropTypes.string,
  NewsDetailId: PropTypes.string,
};

// ------------------------------------------------ListView------------------------------------------------
const ListView = ({ SessionAccountData, PathName, urlMapping, PostCard, PostSort, ParamUserName, NewsDetailId}) => {
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
  const { DataList, IsSearch, Page, sortOption, ResetItem } = AllItems;
  // スクロールされたらtrueを返す。
  const [isIntersecting, ref] = useIntersection(setting);

  const { ItemName, url, idKey, tags, generatePosts } = urlMapping || {};

  useEffect(() => {
    loginStatusCheckFunction();
  }, []);

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
  // URLとPathNameが有効かつ、現在のPathNameがProfileページでない場合
  if (url && (PathName === "/" || PathName === "/VideoList" || PathName === "/StudentList" || PathName === "/CompanyList"
    || PathName === "/Internship_JobOffer" || PathName === `/WriteForm/${NewsDetailId}`
    || PathName === "/Internship_JobOffer/joboffer" || PathName === "/Internship_JobOffer/internships" || PathName === "/Internship_JobOffer/blogs"
    || PathName === `Profile/${ParamUserName}/News/`
  )) {
    // console.log(" URLとPathNameが有効かつ、現在のPathNameがProfileページでない場合");
    lastUrl = `${url}?page=${Page}&sort=${sortOption}`;
    console.log("lastUrl", lastUrl);
  } else if (ParamUserName === SessionAccountData.user_name) {
    // console.log("ユーザーネームもセッションネームも同じ場合");
    lastUrl = `${url}?page=${Page}&sort=${sortOption}&userName=${SessionAccountData.user_name}`;
  } else if (ParamUserName && ParamUserName !== SessionAccountData.user_name) {
    // console.log("ユーザーネームとセッションネームが違う場合");
    lastUrl = `${url}?page=${Page}&sort=${sortOption}&userName=${ParamUserName}`;
  }

  const { data, error } = useSWR(lastUrl, fetcher);

  // 検索時にsetWorkOfListをリセット
  useEffect(() => {
    // タグを選択した状態
    if (IsSearch.Check) {
      setWorkOfList([]);
    }
  }, [IsSearch.searchToggle, IsSearch.Check]);

  useEffect(() => {
    // タグを選択していない状態
    if (!IsSearch.Check && DataList.length == 0) {
      console.log("タグを選択していない状態");
      setWorkOfList([]); // 検索結果をクリア
      setAllItems((prevItems) => ({
        ...prevItems,
        Page: 1, // ページを初期化
      }));
    }
  }, [IsSearch.Check, DataList.length]);


  useEffect(() => {
    console.log("WorkOfList", WorkOfList)
    if (ResetItem === true) {
      // ここでアイテム消える
      setWorkOfList([]);
      setAllItems((prevItems) => ({
        ...prevItems,
        ResetItem: false, // リセットが完了したら false に戻す
      }));
    }
  }, [ResetItem, setWorkOfList, setAllItems]);



  // 作品アイテムの一番最後までスクロールされたらデータを取得する。
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
      // console.log("datadataWorkOfList", WorkOfList);
      // console.log("datadata", data);
      funcSetWorksItem(idKey, tags, WorkOfList, setWorkOfList, data, setIsLoadColorLing, setIsLoadItemColorLing, error, generatePosts);
    }
  }, [data, error, ResetItem, IsSearch.Check, IsSearch.searchResultEmpty]);


  /*----- 検索されたかつ、検索結果が帰ってきたとき -----*/
  useEffect(() => {
    if (IsSearch.Check && DataList) {
      // console.log("datadataWorkOfList", WorkOfList);
      // console.log("datadata", DataList);
      funcSetWorksItem(idKey, tags, WorkOfList, setWorkOfList, DataList, setIsLoadColorLing, setIsLoadItemColorLing, error, generatePosts);
    }
  }, [DataList, IsSearch.Check, IsSearch.searchResultEmpty]);

  // workItems = IsSearch.searchResultEmpty
  //   ? "検索結果は0件です" // フラグに基づいて表示
  //   : typeof generatePosts === "function"
  //     ? generatePosts(WorkOfList)
  //     : null;

  // 作品アイテムをHTML要素に当てはめて表示する準備

  const renderWorkItems = WorkOfList && PostCard ?
    WorkOfList.map((post, index) => (
      <PostCard className="mediaCard" ref={index === WorkOfList.length - 1 ? ref : null}
        key={`${post}-${index}`} post={post} index={index} />
    ))
    : null;

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
          {/*
          IsSearch.searchResultEmpty = false 作品データあり
          IsSearch.searchResultEmpty = true 作品データなし

          IsSearch.searchResultEmpty !== true
          「検索結果が0件でない場合に表示」

          // 学生・企業一覧の場合は並び替え必要ないので非表示にする。
          */}

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

ListView.propTypes = {
  SessionAccountData: PropTypes.object,
  PathName: PropTypes.string,
  urlMapping: PropTypes.object,
  generatePosts: PropTypes.func,
  PostCard: PropTypes.elementType,
  PostSort: PropTypes.elementType,
  ParamUserName: PropTypes.string,
  NewsDetailId: PropTypes.string,
};
