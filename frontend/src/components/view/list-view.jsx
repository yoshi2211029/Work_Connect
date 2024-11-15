import { useContext, useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import useSWR from "swr";
import PropTypes from "prop-types";
import { faker } from "@faker-js/faker";

import Stack from "@mui/material/Stack";

import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import LoginStatusCheck from "src/components/account/loginStatusCheck/loginStatusCheck";
import sessionAccountData from "src/components/account/loginStatusCheck/sessionAccountData";
import { AllItemsContext } from "src/layouts/dashboard";
import { useIntersection } from "src/routes/hooks/use-intersection";

import { UseCreateTagbutton } from "src/hooks/use-createTagbutton";

import { useParams } from "react-router-dom";

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

    const existingIds = new Set(currentWorkList.map((item) => item[idKey]));

    let filteredNewWorks;
    if (newWorks.title_contents) {
      filteredNewWorks = newWorks.title_contents.filter((element) => !existingIds.has(element[idKey]));
    } else {
      filteredNewWorks = newWorks.filter((element) => !existingIds.has(element[idKey]));
    }

    // 全作品アイテム
    filteredNewWorks.forEach((element) => {
      // 作品のジャンル取り出す
      tags.forEach((tag) => {
        // 取り出した配列の中にあるカンマ区切りの項目をtagCreateに渡す
        if (typeof element[tag] === "string" && element[tag] !== null) {
          element[tag] = tagCreate(element[tag]);
        }
      });
    });
    setWorkList((prev) => [...prev, ...generatePosts(filteredNewWorks)]);
    // setLoading(false);
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
  const [SessionAccountData, setSessionAccountData] = useState(sessionAccountData);
  const [DecodeURL, setDecode] = useState(decodeURIComponent(window.location.pathname)); // decodeURIComponentを追加
  const [PostCard, setPostCard] = useState(null);
  const [PostSort, setPostSort] = useState(null);
  const { newsdetail_id, NewsId } = useParams();
  const searchParams = new URLSearchParams(window.location.search); // クエリパラメータを取得
  const page = searchParams.get("page");
  const category = searchParams.get("category");
  const [PathName, setPathName] = useState(window.location.pathname);
  const [NewsDetailId, setNewsDetailId] = useState(newsdetail_id || NewsId);

  useEffect(() => {
    setSessionAccountData(SessionAccountData);
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    setDecode(decodeURIComponent(currentPath));
    console.log("パス名", currentPath);
    console.log("DecodeURL", decodeURIComponent(currentPath));
  }, [window.location.pathname]);

  useEffect(() => {
    if (window.location.search !== undefined && window.location.search !== "/") {
      const profileLocation = window.location.pathname + window.location.search;
      setPathName(profileLocation);
    }
  }, [window.location.pathname]);

  useEffect(() => {
    setNewsDetailId(NewsDetailId);
  }, [NewsDetailId]);

  console.log("page", page);
  console.log("category", category);

  useEffect(() => {
    // 各パスに対するコンポーネントを動的にロード
    const loadComponentForPath = async (path, options = {}) => {
      switch (true) {
        case path === "/" || path === `/Profile/${SessionAccountData.user_name}?page=work` || path === `/Profile/${ParamUserName}?page=work`: {
          const { default: WorkListPostCard } = await import("src/sections/WorkList/post-card");
          const { default: WorkListPostSort } = await import("src/sections/WorkList/post-sort");
          setPostCard(() => WorkListPostCard);
          setPostSort(() => WorkListPostSort);
          console.log("WorkListPostCard");
          break;
        }

        case path === "/VideoList" ||
          path === `/Profile/${SessionAccountData.user_name}?page=movie` ||
          path === `/Profile/${ParamUserName}?page=movie`: {
            const { default: VideoListPostCard } = await import("src/sections/VideoList/post-card");
            const { default: VideoListPostSort } = await import("src/sections/VideoList/post-sort");
            setPostCard(() => VideoListPostCard);
            setPostSort(() => VideoListPostSort);
            console.log("VideoListPostCard");
            break;
          }

        case path === "/StudentList": {
          const { default: StudentListPostCard } = await import("src/sections/StudentList/post-card");
          setPostCard(() => StudentListPostCard);
          console.log("StudentListPostCard");
          break;
        }

        case path === "/CompanyList": {
          const { default: CompanyListPostCard } = await import("src/sections/CompanyList/post-card");
          setPostCard(() => CompanyListPostCard);
          console.log("CompanyListPostCard");
          break;
        }

        case path === `/Internship_JobOffer` ||
          (options.DecodeURL === `/Profile/${ParamUserName}` &&
            options.page === "news" &&
            ["JobOffer", "Internship", "Blog", "Session"].includes(options.category)): {
            const { default: Internship_JobOfferPostCard } = await import("src/sections/InternshipJobOffer/post-card");
            setPostCard(() => Internship_JobOfferPostCard);
            console.log("Internship_JobOfferPostCard");
            break;
          }

        case path === `/WriteForm/${NewsDetailId}` || options.DecodeURL === `/Profile/${ParamUserName}/News/Forms`: {
          const { default: WriteFormPostCard } = await import("src/sections/WriteForm/post-card");
          setPostCard(() => WriteFormPostCard);
          console.log("WriteFormPostCard");
          break;
        }

        case path === `/CreateForm/${NewsDetailId}`: {
          const { default: CreateFormPostCard } = await import("src/sections/CreateForm/post-card");
          setPostCard(() => CreateFormPostCard);
          console.log("CreateFormPostCard");
          break;
        }

        case options.DecodeURL === `/Profile/${ParamUserName}` && options.page === "checkform": {
          const { default: CheckFormPostCard } = await import("src/sections/Profile/View/company/CheckForm/post-card");
          setPostCard(() => CheckFormPostCard);
          console.log("CheckFormPostCard");
          break;
        }

        case options.DecodeURL === `/Profile/${ParamUserName}/Checkform` && options.category === "statistical_data": {
          const { default: StatisticalDataPostCard } = await import("src/sections/Profile/View/company/CheckForm/Statistical_Data/post-card");
          setPostCard(() => StatisticalDataPostCard);
          console.log("StatisticalDataPostCard");
          break;
        }

        case options.DecodeURL === `/Profile/${ParamUserName}` && options.page === "companyinformation": {
          const { default: CompanyInformationPostCard } = await import("src/sections/CompanyInformation/post-card");
          setPostCard(() => CompanyInformationPostCard);
          console.log("CompanyInformationPostCard");
          break;
        }

        default:
          console.log("No matching path found.");
          break;
      }

      console.log("パス名", path);
      console.log("パラムユーザーネーム", ParamUserName);
      console.log("デコードURL", options.DecodeURL);
      console.log("カテゴリ名", options.category);
      console.log("ページ名", options.page);
      console.log("PathNamePathNamePathNamePathName", PathName);
    };

    loadComponentForPath(PathName, { DecodeURL, category, page });
  }, [SessionAccountData.user_name, PathName, NewsDetailId, ParamUserName, DecodeURL, category, page]);

  const urlMapping = {
    works: {
      ItemName: "作品一覧",
      url: "http://localhost:8000/get_work_list",
      idKey: "work_id",
      tags: ["work_genre"],
      generatePosts: (WorkOfList) =>
        WorkOfList.map((work /*, key*/) => ({
          work_id: work.work_id,
          thumbnail: `/assets/workImages/thumbnail/LVGZeHPo5iyKSWOayRufpt1ovYbHNF4L9SLERRrL.png`,
          icon: work.icon,
          title: work.work_name,
          genre: work.work_genre,
          intro: work.work_intro.length > 200 ? work.work_intro.trim().substring(0, 200) + "..." : work.work_intro,
          // view: faker.number.int(99999),
          // comment: faker.number.int(99999),
          favorite: faker.number.int(99999),
          userName: work.user_name,
          createdAt: work.created_at,
          author: {
            avatarUrl: `/assets/images/avatars/avatar_0.jpg`,
          },
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
          icon: movie.icon,
          movie: movie.youtube_url,
          title: movie.title,
          genre: movie.genre,
          intro: movie.intro.length > 200 ? movie.intro.substring(0, 200) + "..." : movie.intro,
          // view: faker.number.int(99999),
          // comment: faker.number.int(99999),
          favorite: faker.number.int(99999),
          userName: movie.user_name,
          createdAt: movie.created_at,
          author: {
            avatarUrl: `/assets/images/avatars/avatar_0.jpg`,
          },
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
    Joboffer: {
      ItemName: "求人一覧",
      url: `http://localhost:8000/Internship_JobOffer/${SessionAccountData.id}/JobOffer`,
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
          count: company.form_data_count,
        })),
    },
    Internship: {
      ItemName: "インターンシップ一覧",
      url: `http://localhost:8000/Internship_JobOffer/${SessionAccountData.id}/Internship`,
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
          count: company.form_data_count,
        })),
    },
    Session: {
      ItemName: "説明会一覧",
      url: `http://localhost:8000/Internship_JobOffer/${SessionAccountData.id}/Session`,
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
          count: company.form_data_count,
        })),
    },
    Blog: {
      ItemName: "ブログ一覧",
      url: `http://localhost:8000/Internship_JobOffer/${SessionAccountData.id}/Blog`,
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
          count: company.form_data_count,
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
          article_title: company.article_title,
        }));
      },
    },
    createforms: {
      ItemName: "応募用フォームを作成する",
      url: `http://localhost:8000/create_form_get/${NewsDetailId}`,
      idKey: "id",
      tags: ["company_name"],
      generatePosts: (WorkOfList) => {
        return WorkOfList.map((company) => ({
          company_id: company.company_id,
          create_form: company.create_form,
          news_id: company.news_id,
          article_title: company.article_title,
        }));
      },
    },
    specialjoboffers: {
      ItemName: `${ParamUserName}さんの求人一覧`,
      url: `http://localhost:8000/Internship_JobOffer/special_company_news/${ParamUserName}/${SessionAccountData.id}/JobOffer`,
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
          count: company.form_data_count,
        }));
      },
    },
    specialinternships: {
      ItemName: `${ParamUserName}さんのインターンシップ一覧`,
      url: `http://localhost:8000/Internship_JobOffer/special_company_news/${ParamUserName}/${SessionAccountData.id}/Internship`,
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
          count: company.form_data_count,
        }));
      },
    },
    specialsessions: {
      ItemName: `${ParamUserName}さんの説明会一覧`,
      url: `http://localhost:8000/Internship_JobOffer/special_company_news/${ParamUserName}/${SessionAccountData.id}/Session`,
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
          count: company.form_data_count,
        }));
      },
    },
    specialblogs: {
      ItemName: `${ParamUserName}さんのブログ一覧`,
      url: `http://localhost:8000/Internship_JobOffer/special_company_news/${ParamUserName}/${SessionAccountData.id}/Blog`,
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
          count: company.form_data_count,
        }));
      },
    },
    specialforms: {
      ItemName: `応募フォーム一覧`,
      url: `http://localhost:8000/special_forms/${SessionAccountData.id}`,
      idKey: "id",
      tags: ["company_name"],
      generatePosts: (WorkOfList) => {
        if (Array.isArray(WorkOfList)) {
          const application_form = WorkOfList.map((company) => ({
            article_title: company.article_title,
            user_name: company.users,
          }));
          return [{ application_form }];
        }
      },
    },
    specialstatisticaldata: {
      ItemName: `応募フォーム一覧(グラフ)`,
      url: `http://localhost:8000/special_forms/${SessionAccountData.id}`,
      idKey: "id",
      tags: ["company_name"],
      generatePosts: (WorkOfList) => {
        if (Array.isArray(WorkOfList)) {
          const application_form = WorkOfList.map((company) => ({
            article_title: company.article_title,
            user_name: company.users,
          }));
          return [{ application_form }];
        }
      },
    },
    companyinformations: {
      ItemName: `${ParamUserName}さんの詳細な企業情報`,
      url: `http://localhost:8000/company_informations/${ParamUserName}`,
      idKey: "id",
      tags: ["company_name"],
      generatePosts: (WorkOfList) => {
        if (Array.isArray(WorkOfList)) {
          const title_contents = WorkOfList.map((company) => ({
            title: company.title,
            contents: company.contents,
            company_id: company.company_id,
            id: company.id,
            public_status: company.public_status,
            row_number: company.row_number,
          }));

          return [{ title_contents }]; // 1つのオブジェクトにまとめた配列として返す
        }
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
      DecodeURL={DecodeURL}
      page={page}
      category={category}
    />
  );
}

ItemObjectAndPostCard.propTypes = {
  SessionAccountData: PropTypes.string,
  type: PropTypes.string,
  ParamUserName: PropTypes.string,
  NewsDetailId: PropTypes.string,
  DecodeURL: PropTypes.string,
  page: PropTypes.string,
  category: PropTypes.string,
};

// ------------------------------------------------ListView------------------------------------------------
const ListView = ({ SessionAccountData, PathName, urlMapping, PostCard, PostSort, ParamUserName, NewsDetailId, DecodeURL, page, category }) => {
  // ログインチェック
  const { loginStatusCheckFunction } = LoginStatusCheck();
  // 作品アイテム格納
  const [WorkOfList, setWorkOfList] = useState([]);
  // 一覧アイテム最後尾ローディング
  const [isLoadItemColorLing, setIsLoadItemColorLing] = useState(false);
  // AllItemsContextから状態を取得
  const { AllItems, setAllItems } = useContext(AllItemsContext);
  const { IsLoading, DataList, IsSearch, Page, sortOption, ResetItem } = AllItems;
  const [isLoadItem, setIsLoadItem] = useState(false);
  // スクロールされたらtrueを返す。
  const [isIntersecting, ref] = useIntersection(setting);

  const { ItemName, url, idKey, tags, generatePosts } = urlMapping || {};
  // 初回ロード完了のフラグ
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => { }, [IsLoading]);
  useEffect(() => {
    loginStatusCheckFunction();
  }, []);

  useEffect(() => {
    if (IsLoading) {
      setIsLoadItem(true);
    } else {
      setHasLoadedOnce(true);
      setIsLoadItem(false);
    }
  }, [IsLoading]);

  // 並べ替え
  const handleSortChange = (event) => {
    // 並べ替え内容「例：投稿日が新しい順」を取得
    const newValue = event.target.value;
    // URLパラメータにセットしてLaravel側でデータを1取得するための準備
    setAllItems((prevItems) => ({
      ...prevItems,
      IsLoading: true,
      Page: 1,
      sortOption: newValue,
    }));
    // 無駄なアイテム追加を防ぐために一度綺麗にする
    setWorkOfList([]);
  };

  //   一覧データ取得URL
  let lastUrl = "";
  console.log(url);
  console.log(DecodeURL);
  // URLとPathNameが有効かつ、現在のPathNameがProfileページでない場合
  if (
    url &&
    (PathName === "/" ||
      PathName === "/VideoList" ||
      PathName === "/StudentList" ||
      PathName === "/CompanyList" ||
      PathName === "/Internship_JobOffer" ||
      PathName === `/WriteForm/${NewsDetailId}` ||
      PathName === `/CreateForm/${NewsDetailId}` ||
      PathName === "/Internship_JobOffer?page=JobOffer" ||
      PathName === "/Internship_JobOffer?page=Internship" ||
      PathName === "/Internship_JobOffer?page=Session" ||
      PathName === "/Internship_JobOffer?page=Blog" ||
      (DecodeURL === `/Profile/${ParamUserName}` &&
        page === "news" &&
        (category === "JobOffer" || category === "Internship" || category === "Blog" || category === "Session")) ||
      (DecodeURL === `/Profile/${ParamUserName}` && page === "companyinformation") ||
      (DecodeURL === `/Profile/${ParamUserName}` && page === "checkform"))
  ) {
    // console.log(" URLとPathNameが有効かつ、現在のPathNameがProfileページでない場合");
    lastUrl = `${url}?page=${Page}&sort=${sortOption}`;
    console.log("lastUrl", lastUrl);
  } else if (ParamUserName === SessionAccountData.user_name) {
    // console.log("ユーザーネームもセッションネームも同じ場合");
    lastUrl = `${url}?page=${Page}&sort=${sortOption}&userName=${SessionAccountData.user_name}`;
  } else if (ParamUserName && ParamUserName !== SessionAccountData.user_name) {
    // console.log("ユーザーネームとセッションネームが違う場合");
    lastUrl = `${url}?page=${Page}&sort=${sortOption}&userName=${ParamUserName}`;
  } else {
    console.log("lastUrllastUrl", url);
    console.log("lastUrllastUrl:PathName", PathName);
  }

  const fetcher = (lastUrl) => fetch(lastUrl).then((res) => {
    return res.json().then((data) => {
      console.log("fetcher:res:data:  ", data);
      if (data.length == 0) {
        setAllItems((prevItems) => ({
          ...prevItems,
          IsLoading: false,
          DataList: [],
        }));
      }
      return data;
    });
  });

  const { data, error, isLoading } = useSWR(lastUrl, fetcher);

  // const [SWRLoadFlg, setSWRLoadFlg] = useState(false);

  let LaravelResponse = isLoading;


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
    console.log("WorkOfListResetItem", WorkOfList);
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
    console.log("検索されていないかつ作品データがあるとき:page", Page);
    console.log("検索されていないかつ作品データがあるとき:data", data);
    if (!ResetItem && !IsSearch.Check && data) {
      console.log("検索されていないかつ作品データがあるとき:WorkOfList", WorkOfList);
      console.log("検索されていないかつ作品データがあるとき:data", data);

      funcSetWorksItem(idKey, tags, WorkOfList, setWorkOfList, data, setIsLoadItem, setIsLoadItemColorLing, error, generatePosts);

      // データが更新されてからisLoadingをfalseに設定
      console.log("data:", data);
      if (data.length !== 0) {
        setIsLoadItem(false);
        console.log("data:setIsLoadItem:false");
      }
      if (data.length !== 0 || Page !== 1) {
        console.log("ローディング削除:2");
        setAllItems((prev) => ({
          ...prev,
          IsLoading: false, // データが空のときはtrueにしてローディングを維持
        }));
      }
    }
  }, [data, error, ResetItem, IsSearch.Check, IsSearch.searchResultEmpty]);

  // 検索された場合
  useEffect(() => {
    if (IsSearch.Check && DataList) {
      console.log("検索されたかつ、検索結果が帰ってきたとき", WorkOfList);
      console.log("datadataDataList", DataList);
      console.log("datadataDataList:AllItems", AllItems);

      funcSetWorksItem(idKey, tags, WorkOfList, setWorkOfList, DataList, setIsLoadItem, setIsLoadItemColorLing, error, generatePosts);

      // データ取得後にisLoadingをfalseにする
      if (DataList.length !== 0) {
        setIsLoadItem(false);
        console.log("DataList:setIsLoadItem:false");
      }
      if (DataList.length !== 0 || Page !== 1) {
        console.log("ローディング削除:3");
        setAllItems((prev) => ({
          ...prev,
          IsLoading: false, // データが空のときはtrueにしてローディングを維持
        }));
      }
    }
  }, [DataList, IsSearch.Check, IsSearch.searchResultEmpty]);

  useEffect(() => {
    console.log("IsLoadingIsLoading  ", IsLoading);
  }, [IsLoading]);

  useEffect(() => {
    console.log("WorkOfList", WorkOfList);
  }, [WorkOfList]);

  useEffect(() => {
    console.log("useSWR:lastUrl:", lastUrl);
    console.log("useSWR:LaravelResponse:", LaravelResponse);
    console.log("useSWR:page:", Page);
    console.log("useSWR:WorkOfList:", WorkOfList);
    if ((LaravelResponse == false && Page != 1)) {
      console.log("ローディング削除:1");
      setAllItems((prevItems) => ({
        ...prevItems,
        IsLoading: false, // 一時的にローディングを解除
      }));
    }
  }, [LaravelResponse, lastUrl]);

  // const renderWorkItems = WorkOfList.length !== 0 && PostCard ?
  //   WorkOfList.map((post, index) => (
  //     <PostCard className="mediaCard" ref={index === WorkOfList.length - 1 ? ref : null}
  //       key={`${post}-${index}`} post={post} index={index} />
  //   ))
  //   : WorkOfList.length === 0 && IsLoading === false && LaravelResponse === false ? "0件です" : null;
  // WorkOfList の表示ロジック
  const renderWorkItems =
    WorkOfList.length !== 0 && PostCard
      ? WorkOfList.map((post, index) => (
        <PostCard className="mediaCard" ref={index === WorkOfList.length - 1 ? ref : null} key={`${post}-${index}`} post={post} index={index} />
      ))
      : WorkOfList.length === 0 && !IsLoading && !LaravelResponse && hasLoadedOnce
        ? "0件です"
        : null;
  return (
    <>
      {isLoadItem && (
        <ColorRing
          visible={true}
          height="100"
          width="100"
          ariaLabel="color-ring-loading"
          wrapperStyle={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          wrapperClass="custom-color-ring-wrapper" // カスタムクラスを指定
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          style={{ flexDirection: "column" }}
        />
      )}
      {/* <Container  style={{ width: "100%" }}> */}
      <div className="list-view-Container">
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
          <div className="column-container">{renderWorkItems}</div>

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
      </div>
      {/* </Container> */}
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
  DecodeURL: PropTypes.string,
  page: PropTypes.string,
  category: PropTypes.string,
};
