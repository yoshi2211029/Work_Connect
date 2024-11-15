import { useLocation, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import Select from "react-select";
import axios from "axios";

import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import { createTheme } from "@mui/material/styles";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

import { IconAdjustmentsHorizontal, IconSearch } from "@tabler/icons-react";
import { MyContext } from "src/layouts/dashboard/index";
import HeaderAvatar from "src/components/header/HeaderAvatar.jsx";
import GetTagList from "src/components/tag/GetTagList";
import { AllItemsContext } from "src/layouts/dashboard/index";
import { useSessionStorage } from "src/hooks/use-sessionStorage";

// ----------------------------------------------------------------------

// const HEADER_MOBILE = 64;
// const HEADER_DESKTOP = 92;
// const HEADER_DESKTOP = "auto";

// const StyledSearchbar = styled("div")(({ theme }) => ({
//   ...bgBlur({
//     color: theme.palette.background.default,
//   }),
//   top: 0,
//   left: 0,
//   zIndex: 10,
//   width: "100%",
//   display: "flex",
//   position: "absolute",
//   alignItems: "center",
//   height: HEADER_MOBILE,
//   padding: theme.spacing(0, 3),
//   boxShadow: theme.customShadows.z8,
//   [theme.breakpoints.up("md")]: {
//     height: HEADER_DESKTOP,
//     padding: theme.spacing(0, 5),
//   },
//   marginTop: 20,
//   marginBottom: 20,
//   paddingTop: 20,
//   paddingBottom: 20,
// }));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "80%",
  // overflowY: "auto",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

// ----------------------------------------------------------------------

const useStyles = makeStyles(() => {
  const theme = createTheme({
    breakpoints: {
      values: {
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });
  return {
    width: "100%",
    "& .MuiInputBase-root": {
      fontSize: "1rem",
      [theme.breakpoints.up("sm")]: {
        fontSize: "1.2rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1.4rem",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "1.6rem",
      },
    },
  };
});

// Searchbar親コンポーネント
export default function Searchbar() {
  const location = useLocation();
  const searchParams = useSearchParams();
  const classes = useStyles();
  /* 検索欄の上にカーソルが乗っているときは背景がスライドしないようにする */
  const areaRef = useRef(null);
  const [isScrollDisabled, setIsScrollDisabled] = useState(false); // スクロールの状態を管理
  useEffect(() => {
    const handleMouseOver = (event) => {
      if (areaRef.current && areaRef.current.contains(event.target)) {
        document.body.classList.add("disable-scroll");
      } else {
        document.body.classList.remove("disable-scroll");
      }
    };

    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.body.classList.remove("disable-scroll"); // クリーンアップ時にスクロールを有効化
    };
  }, []);
  useEffect(() => {
    if (isScrollDisabled) {
      document.body.classList.add("disable-scroll");
    } else {
      document.body.classList.remove("disable-scroll");
    }
  }, [isScrollDisabled]);

  const { getSessionData } = useSessionStorage();
  const accountData = getSessionData("accountData");

  let myId = "";
  if (accountData != undefined) {
    myId = accountData.id;
  }

  const [PathName, setPathName] = useState("");
  // Topページであれば検索ボタンを非表示にする。
  const Display = useContext(MyContext);
  // AllItemsContextから状態を取得
  const { AllItems, setAllItems } = useContext(AllItemsContext);
  const { Page, IsSearch, ResetItem, sortOption } = AllItems;

  // 検索結果を反映させるためのContext
  // const { setDataList } = useContext(DataListContext);
  const [open, setOpen] = useState(false);
  const [searchSource, setsearchSource] = useState({
    searchText: "",
    follow_status: [],
    work_genre: [],
    programming_language: [],
    development_environment: [],
    video_genre: [],
    school_name: [],
    department_name: [],
    faculty_name: [],
    major_name: [],
    course_name: [],
    student_programming_language: [],
    student_development_environment: [],
    software: [],
    acquisition_qualification: [],
    hobby: [],
    other: [],
    graduation_year: [],
    desired_occupation: [],
    desired_work_region: [],
    selected_occupation: [],
    prefecture: [],
    company_name: [],
    industry: [],
  });

  const [options, setOptions] = useState({
    searchText: "",
    follow_status: [],
    work_genre: [],
    programming_language: [],
    development_environment: [],
    school_name: [],
    department_name: [],
    faculty_name: [],
    major_name: [],
    course_name: [],
    student_programming_language: [],
    student_development_environment: [],
    software: [],
    acquisition_qualification: [],
    hobby: [],
    other: [],
    graduation_year: [],
    desired_occupation: [],
    desired_work_region: [],
    selected_occupation: [],
    prefecture: [],
    company_name: [],
    industry: [],
  });

  const [saveOptions, setSaveOptions] = useState({
    searchText: "",
    follow_status: [],
    work_genre: [],
    programming_language: [],
    development_environment: [],
    school_name: [],
    department_name: [],
    faculty_name: [],
    major_name: [],
    course_name: [],
    student_programming_language: [],
    student_development_environment: [],
    software: [],
    acquisition_qualification: [],
    hobby: [],
    other: [],
    graduation_year: [],
    desired_occupation: [],
    desired_work_region: [],
    selected_occupation: [],
    prefecture: [],
    company_name: [],
    industry: [],
  });

  const { GetTagListFunction } = GetTagList();

  const getTag = (urlIn, option) => {
    // console.log("urlIn", urlIn);
    // console.log("option", option);
    let optionArray = [];
    let optionArrayPromise = GetTagListFunction(urlIn);
    optionArrayPromise.then((result) => {
      // console.log("result: ", result);
      result.map((value) => {
        optionArray.push({ value: value.name, label: value.name });
      });
      // console.log("optionArray", optionArray);
      setOptions((prevOptions) => ({
        ...prevOptions,
        [option]: optionArray,
      }));
    });
  };

  const getGraduationYearTag = async () => {
    let optionArray = [];
    let result = [
      "2025年卒業",
      "2026年卒業",
      "2027年卒業",
      "2028年卒業",
      "2029年卒業",
      "2030年卒業",
    ];

    // console.log("result: ", result);
    result.map((value) => {
      optionArray.push({ value: value, label: value });
    });
    // console.log("optionArray", optionArray);
    setOptions((prevOptions) => ({
      ...prevOptions,
      graduation_year: optionArray,
    }));
  };

  const schoolTypeCodes = ["H1", "H2"]; // 複数のschool_type_codeを配列として定義
  const fetchSchoolNameData = async () => {
    let allSchools = [];
    let page = 1;
    let hasMore = true;
    const accessToken = "268|G5fHGAGA7Col8FetXAQ6EMNHnjDIA5TInN2uByIB";

    try {
      for (const code of schoolTypeCodes) {
        hasMore = true;
        page = 1;

        while (hasMore) {
          const response = await axios.get(
            `https://api.edu-data.jp/api/v1/school?school_type_code=${code}&pref_code=27&page=${page}&school_status_code=1,2`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`, // アクセストークンをBearerトークンとしてヘッダーに含める
                Accept: "application/json",
              },
            }
          );

          // console.log(`API response for code ${code} and page ${page}:`, response.data); // レスポンスデータを詳細にログ出力

          // console.log("allSchools response: ");
          // console.log(response.data.schools.data);

          // allSchools = response.data.schools.data;

          if (Array.isArray(response.data.schools.data)) {
            allSchools = [...allSchools, ...response.data.schools.data]; // 取得したデータを蓄積
            hasMore = response.data.schools.data.length > 0; // データが存在する限り繰り返す
            page += 1; // 次のページを設定
          } else {
            console.error("Unexpected response format:", response.data);
            hasMore = false;
          }
        }
      }

      // console.log("allSchools: ");
      // console.log(allSchools);

      return allSchools;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getSchoolNameTag = async () => {
    let optionArray = [];
    let result = await fetchSchoolNameData();

    // console.log("result: ", result);
    result.map((value) => {
      optionArray.push({ value: value.school_name, label: value.school_name });
    });
    // console.log("optionArray", optionArray);
    setOptions((prevOptions) => ({
      ...prevOptions,
      school_name: optionArray,
    }));
  };

  const fetchCompanyNameData = async () => {
    try {
      // console.log("fetchCompanyNameData: OK");
      const response = await axios.get(
        `http://localhost:8000/get_company_name_list`,
        {}
      );

      // console.log("fetchCompanyNameData response: ");
      // console.log(response.data);

      // allSchools = response.data.schools.data;
      // if (Array.isArray(response.data.schools.data)) {
      //   allSchools = [...allSchools, ...response.data.schools.data]; // 取得したデータを蓄積
      //   hasMore = response.data.schools.data.length > 0; // データが存在する限り繰り返す
      //   page += 1; // 次のページを設定
      // } else {
      //   console.error("Unexpected response format:", response.data);
      //   hasMore = false;
      // }
      // console.log("allSchools: ");
      // console.log(allSchools);

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCompanyNameTag = async () => {
    // console.log("getCompanyNameTag: OK");
    let optionArray = [];
    let result = await fetchCompanyNameData();

    // console.log("result: ", result);
    result.map((value) => {
      optionArray.push({
        value: value.company_name,
        label: value.company_name,
      });
    });
    // console.log("optionArray", optionArray);
    setOptions((prevOptions) => ({
      ...prevOptions,
      company_name: optionArray,
    }));
  };

  const getFollowStatusTag = () => {
    let optionArray = [];
    let result = ["フォローしている", "フォローされている"];

    // console.log("result: ", result);
    result.map((value) => {
      optionArray.push({ value: value, label: value });
    });
    // console.log("optionArray", optionArray);
    setOptions((prevOptions) => ({
      ...prevOptions,
      follow_status: optionArray,
    }));
  };

  // useEffect(() => {
  //   console.log("options", options);
  // }, [options]);

  useEffect(() => {
    let url = new URL(window.location.href);
    let urlPageParams = url.searchParams.get("page");
    let urlCategoryParams = url.searchParams.get("category");
    if (urlPageParams != null) {
      setPathName(location.pathname + "/" + urlPageParams);
    } else if (urlPageParams == "news") {
      setPathName(location.pathname + "/" + urlCategoryParams);
    } else {
      setPathName(location.pathname);
    }
    // console.log("urlCategoryParams", urlCategoryParams);
  }, [location]);
  useEffect(() => {
    let url = new URL(window.location.href);
    let urlPageParams = url.searchParams.get("page");
    let urlCategoryParams = url.searchParams.get("category");
    if (urlPageParams == "news") {
      // console.log("ababab2");
      setPathName(location.pathname + "/" + urlCategoryParams);
    } else if (urlPageParams != null) {
      // console.log("ababab1");
      setPathName(location.pathname + "/" + urlPageParams);
      // let a = location.pathname + "/" + urlPageParams;
      // console.log("location.pathname + + urlPageParams", a);
    } else {
      // console.log("ababab3");
      setPathName(location.pathname);
    }
    // console.log("setPathName(urlPageParams):search", urlPageParams);
    // console.log("setPathName(urlCategoryParams):search", urlCategoryParams);
  }, [searchParams]);

  useEffect(() => {
    // console.log("PathNamePathNamePathNamePathName: ", PathName);
    // console.log(PathName);
    // タグ一覧取得

    if (PathName == "/") {
      // 作品一覧の場合
      // console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
      // フォロー状況のタグ一覧を取得
      getFollowStatusTag();

      // 学校名のタグ一覧を取得
      getSchoolNameTag();

      // 学科のタグ一覧を取得
      getTag("student_department_name", "department_name");

      // 学部のタグ一覧を取得
      getTag("student_faculty_name", "faculty_name");

      // 専攻のタグ一覧を取得
      getTag("student_major_name", "major_name");

      // コースのタグ一覧を取得
      getTag("student_course_name", "course_name");

      // 作品ジャンルのタグ一覧を取得
      getTag("work_genre", "work_genre");

      // プログラミング言語のタグ一覧を取得
      getTag("work_language", "programming_language");

      // 開発環境のタグ一覧を取得
      getTag("work_environment", "development_environment");
    } else if (PathName == "/VideoList") {
      // 動画一覧の場合
      // フォロー状況のタグ一覧を取得
      getFollowStatusTag();

      // 学校名のタグ一覧を取得
      getSchoolNameTag();

      // 学科のタグ一覧を取得
      getTag("student_department_name", "department_name");

      // 学部のタグ一覧を取得
      getTag("student_faculty_name", "faculty_name");

      // 専攻のタグ一覧を取得
      getTag("student_major_name", "major_name");

      // コースのタグ一覧を取得
      getTag("student_course_name", "course_name");

      // 動画ジャンルのタグ一覧を取得
      getTag("video_genre", "video_genre");
    } else if (PathName == "/StudentList") {
      // 学生一覧の場合

      // フォロー状況のタグ一覧を取得
      getFollowStatusTag();

      // 卒業年のタグ一覧を取得
      getGraduationYearTag();

      // 学校名のタグ一覧を取得
      getSchoolNameTag();

      // 学科のタグ一覧を取得
      getTag("student_department_name", "department_name");

      // 学部のタグ一覧を取得
      getTag("student_faculty_name", "faculty_name");

      // 専攻のタグ一覧を取得
      getTag("student_major_name", "major_name");

      // コースのタグ一覧を取得
      getTag("student_course_name", "course_name");

      // 希望職種のタグ一覧を取得
      getTag("student_desired_occupation", "desired_occupation");

      // 希望勤務地のタグ一覧を取得
      getTag("student_desired_work_region", "desired_work_region");

      // プログラミング言語のタグ一覧を取得
      getTag("student_programming_language", "programming_language");

      // 開発環境のタグ一覧を取得
      getTag("student_development_environment", "development_environment");

      // ソフトウェアのタグ一覧を取得
      getTag("student_software", "software");

      // 取得資格のタグ一覧を取得
      getTag("student_acquisition_qualification", "acquisition_qualification");

      // 趣味のタグ一覧を取得
      getTag("student_hobby", "hobby");
    } else if (PathName == "/Profile/yoshioka/work") {
      // 学生プロフィール内の作品一覧の場合
      // 作品ジャンルのタグ一覧を取得
      getTag("work_genre", "work_genre");

      // プログラミング言語のタグ一覧を取得
      getTag("work_language", "programming_language");

      // 開発環境のタグ一覧を取得
      getTag("work_environment", "development_environment");
    } else if (PathName == "/Profile/yoshioka/movie") {
      // 学生プロフィール内の動画一覧の場合
      // 動画ジャンルのタグ一覧を取得
      getTag("video_genre", "video_genre");
    } else if (PathName == "/CompanyList") {
      // console.log("Internship_JobOfferCompanyList: OK");
      // 企業一覧の場合
      // フォロー状況のタグ一覧を取得
      getFollowStatusTag();

      // 職種のタグ一覧を取得
      getTag("company_selected_occupation", "selected_occupation");

      // 勤務地のタグ一覧を取得
      getTag("company_prefecture", "prefecture");

      // 業界キーワードのタグ一覧を取得
      getTag("company_industry", "industry");

      // 開発環境のタグ一覧を取得
      getTag("company_development_environment", "development_environment");

      // プログラミング言語のタグ一覧を取得
      getTag("company_programming_language", "programming_language");

      // 歓迎資格のタグ一覧を取得
      getTag("company_acquisition_qualification", "acquisition_qualification");

      // ソフトウェアのタグ一覧を取得
      getTag("company_software", "software");
    } else if (
      PathName == "/Internship_JobOffer/JobOffer" ||
      PathName == "/Internship_JobOffer/Internship" ||
      PathName == "/Internship_JobOffer/Session" ||
      PathName == "/Internship_JobOffer/Blog"
    ) {
      // 求人一覧の場合
      // フォロー状況のタグ一覧を取得
      getFollowStatusTag();

      // 企業名一覧を取得
      getCompanyNameTag();

      // 職種のタグ一覧を取得
      getTag("company_selected_occupation", "selected_occupation");

      // 勤務地のタグ一覧を取得
      getTag("company_prefecture", "prefecture");

      // 業界キーワードのタグ一覧を取得
      getTag("company_industry", "industry");

      // 開発環境のタグ一覧を取得
      getTag("company_development_environment", "development_environment");

      // プログラミング言語のタグ一覧を取得
      getTag("company_programming_language", "programming_language");

      // 歓迎資格のタグ一覧を取得
      getTag("company_acquisition_qualification", "acquisition_qualification");

      // ソフトウェアのタグ一覧を取得
      getTag("company_software", "software");
    }
    console.log("PathNamePathName: ", PathName);
  }, [PathName]);

  // useEffect(() => {
  //   console.log("options: ", options);
  // }, [options]);

  // console.log("RefineSearch", location.pathname);

  // マイページ、Topページ、
  let RefineSearch =
    location.pathname !=
      "/Profile/" + location.pathname.split("/")[2] + "/mypage" &&
    location.pathname != "/Top" &&
    location.pathname != "/Settings" &&
    location.pathname != "/Chat" &&
    location.pathname != "/WorkPosting" &&
    location.pathname != "/VideoPosting"
      ? true
      : false;
  // console.log("let RefineSearch =", RefineSearch);

  const handleOpen = () => {
    setIsScrollDisabled(true);
    let url = new URL(window.location.href);
    let urlPageParams = url.searchParams.get("page");
    if (urlPageParams != null) {
      setPathName(location.pathname + "/" + urlPageParams);
    } else {
      setPathName(location.pathname);
    }
    setOpen(!open);
  };

  const responseItems = (data) => {
    // 作品などのデータがあるとき
    if (data.length > 0) {
      setAllItems((prevItems) => ({
        ...prevItems,
        DataList: data,
        IsSearch: { ...prevItems.IsSearch, searchResultEmpty: false },
      }));
    }

    //ローディングアニメーション止めるため
    if (data.length === 0) {
      setAllItems((prevItems) => ({
        ...prevItems,
        IsLoading: false,
        DataList: [],
      }));
    }

    // ”検索結果0件だ”を表示するため
    if (data.length === 0 && Page === 1) {
      setAllItems((prevItems) => ({
        ...prevItems,
        IsSearch: { ...prevItems.IsSearch, searchResultEmpty: true },
      }));
    }
  };

  // Laravel側から絞り込んだ作品一覧データを取得
  async function searchSourceList() {
    try {
      if (PathName == "/") {
        // 作品一覧の場合
        // const url = `http://localhost:8000/search_work`;
        const url = `http://localhost:8000/search_work?page=${Page}&sort=${sortOption}`;
        // const url = `http://localhost:8000/search_work?page=${Page}&sort=${`;
        // console.log("searchbar : Page = ", Page);

        let follow_status = [];
        let school_name = [];
        let department_name = [];
        let faculty_name = [];
        let major_name = [];
        let course_name = [];
        let work_genre = [];
        let programming_language = [];
        let development_environment = [];

        // console.log("検証:searchSource", searchSource);
        searchSource.follow_status.map((value) => {
          follow_status.push(value.value);
        });
        searchSource.school_name.map((value) => {
          school_name.push(value.value);
        });
        searchSource.department_name.map((value) => {
          department_name.push(value.value);
        });
        searchSource.faculty_name.map((value) => {
          faculty_name.push(value.value);
        });
        searchSource.major_name.map((value) => {
          major_name.push(value.value);
        });
        searchSource.course_name.map((value) => {
          course_name.push(value.value);
        });
        searchSource.work_genre.map((value) => {
          work_genre.push(value.value);
        });

        searchSource.programming_language.map((value) => {
          programming_language.push(value.value);
        });

        searchSource.development_environment.map((value) => {
          development_environment.push(value.value);
        });

        const response = await axios.get(url, {
          params: {
            myId: myId,
            searchText: searchSource.searchText,
            follow_status: follow_status,
            school_name: school_name,
            department_name: department_name,
            faculty_name: faculty_name,
            major_name: major_name,
            course_name: course_name,
            work_genre: work_genre,
            programming_language: programming_language,
            development_environment: development_environment,
          },
        });

        // console.log("search.response.data", response.data);

        // WorkOfList-view.jsxにデータを渡す
        const responseData = response.data;
        responseItems(responseData);
      } else if (PathName == "/VideoList") {
        // 動画一覧の場合
        const url = `http://localhost:8000/search_video?page=${Page}&sort=${sortOption}`;

        let follow_status = [];
        let school_name = [];
        let department_name = [];
        let faculty_name = [];
        let major_name = [];
        let course_name = [];
        let video_genre = [];

        searchSource.follow_status.map((value) => {
          follow_status.push(value.value);
        });
        searchSource.school_name.map((value) => {
          school_name.push(value.value);
        });
        searchSource.department_name.map((value) => {
          department_name.push(value.value);
        });
        searchSource.faculty_name.map((value) => {
          faculty_name.push(value.value);
        });
        searchSource.major_name.map((value) => {
          major_name.push(value.value);
        });
        searchSource.course_name.map((value) => {
          course_name.push(value.value);
        });
        searchSource.video_genre.map((value) => {
          video_genre.push(value.value);
        });

        const response = await axios.get(url, {
          params: {
            myId: myId,
            searchText: searchSource.searchText,
            follow_status: follow_status,
            school_name: school_name,
            department_name: department_name,
            faculty_name: faculty_name,
            major_name: major_name,
            course_name: course_name,
            video_genre: video_genre,
          },
        });
        // console.log("response.data", response.data);

        // videoList-view.jsxにデータを渡す
        const responseData = response.data;
        responseItems(responseData);
      } else if (PathName == "/StudentList") {
        // 学生一覧の場合
        const url = `http://localhost:8000/search_student?page=${Page}`;

        let follow_status = [];
        let graduation_year = [];
        let school_name = [];
        let department_name = [];
        let faculty_name = [];
        let major_name = [];
        let course_name = [];
        let desired_occupation = [];
        let desired_work_region = [];
        let student_programming_language = [];
        let student_development_environment = [];
        let software = [];
        let acquisition_qualification = [];
        let hobby = [];

        searchSource.follow_status.map((value) => {
          follow_status.push(value.value);
        });
        searchSource.graduation_year.map((value) => {
          graduation_year.push(value.value);
        });
        searchSource.school_name.map((value) => {
          school_name.push(value.value);
        });
        searchSource.department_name.map((value) => {
          department_name.push(value.value);
        });
        searchSource.faculty_name.map((value) => {
          faculty_name.push(value.value);
        });
        searchSource.major_name.map((value) => {
          major_name.push(value.value);
        });
        searchSource.course_name.map((value) => {
          course_name.push(value.value);
        });
        searchSource.desired_occupation.map((value) => {
          desired_occupation.push(value.value);
        });
        searchSource.desired_work_region.map((value) => {
          desired_work_region.push(value.value);
        });
        searchSource.student_programming_language.map((value) => {
          student_programming_language.push(value.value);
        });
        searchSource.student_development_environment.map((value) => {
          student_development_environment.push(value.value);
        });
        searchSource.software.map((value) => {
          software.push(value.value);
        });
        searchSource.acquisition_qualification.map((value) => {
          acquisition_qualification.push(value.value);
        });
        searchSource.hobby.map((value) => {
          hobby.push(value.value);
        });

        const response = await axios.get(url, {
          params: {
            myId: myId,
            searchText: searchSource.searchText,
            follow_status: follow_status,
            graduation_year: graduation_year,
            school_name: school_name,
            department_name: department_name,
            faculty_name: faculty_name,
            major_name: major_name,
            course_name: course_name,
            desired_occupation: desired_occupation,
            desired_work_region: desired_work_region,
            student_programming_language: student_programming_language,
            student_development_environment: student_development_environment,
            software: software,
            acquisition_qualification: acquisition_qualification,
            hobby: hobby,
          },
        });
        // console.log("response.data", response.data);

        // StudentList-view.jsxにデータを渡す
        const responseData = response.data;
        responseItems(responseData);
      } else if (
        PathName.startsWith("/Profile/") &&
        PathName.endsWith("/work")
      ) {
        // 学生プロフィール内の作品一覧の場合
        const url = `http://localhost:8000/search_work?page=${Page}&sort=${sortOption}`;

        let work_genre = [];
        let programming_language = [];
        let development_environment = [];

        // console.log("検証:searchSource", searchSource);
        searchSource.work_genre.map((value) => {
          work_genre.push(value.value);
        });

        searchSource.programming_language.map((value) => {
          programming_language.push(value.value);
        });

        searchSource.development_environment.map((value) => {
          development_environment.push(value.value);
        });

        let urlUserNameStr = location.pathname.split("/")[2];

        const response = await axios.get(url, {
          params: {
            info_str: "学生プロフィール内作品検索",
            user_name: urlUserNameStr,
            searchText: searchSource.searchText,
            work_genre: work_genre,
            programming_language: programming_language,
            development_environment: development_environment,
          },
        });
        // console.log("response.data", response.data);

        // company-view.jsxにデータを渡す
        const responseData = response.data;
        responseItems(responseData);
      } else if (
        PathName.startsWith("/Profile/") &&
        PathName.endsWith("/movie")
      ) {
        // 学生プロフィール内の作品一覧の場合
        const url = `http://localhost:8000/search_video?page=${Page}&sort=${sortOption}`;

        let video_genre = [];

        // console.log("検証:searchSource", searchSource);
        searchSource.video_genre.map((value) => {
          video_genre.push(value.value);
        });

        let urlUserNameStr = location.pathname.split("/")[2];

        const response = await axios.get(url, {
          params: {
            info_str: "学生プロフィール内動画検索",
            user_name: urlUserNameStr,
            searchText: searchSource.searchText,
            video_genre: video_genre,
          },
        });
        // console.log("response.data", response.data);

        // company-view.jsxにデータを渡す
        const responseData = response.data;
        responseItems(responseData);
      } else if (PathName == "/CompanyList") {
        // 企業一覧の場合
        const url = `http://localhost:8000/search_company?page=${Page}`;

        let follow_status = [];
        let selected_occupation = [];
        let prefecture = [];
        let industry = [];
        let development_environment = [];
        let programming_language = [];
        let acquisition_qualification = [];
        let software = [];

        searchSource.follow_status.map((value) => {
          follow_status.push(value.value);
        });
        searchSource.selected_occupation.map((value) => {
          selected_occupation.push(value.value);
        });
        searchSource.prefecture.map((value) => {
          prefecture.push(value.value);
        });
        searchSource.industry.map((value) => {
          industry.push(value.value);
        });
        searchSource.development_environment.map((value) => {
          development_environment.push(value.value);
        });
        searchSource.programming_language.map((value) => {
          programming_language.push(value.value);
        });
        searchSource.acquisition_qualification.map((value) => {
          acquisition_qualification.push(value.value);
        });
        searchSource.software.map((value) => {
          software.push(value.value);
        });

        const response = await axios.get(url, {
          params: {
            myId: myId,
            searchText: searchSource.searchText,
            follow_status: follow_status,
            selected_occupation: selected_occupation,
            prefecture: prefecture,
            industry: industry,
            development_environment: development_environment,
            programming_language: programming_language,
            acquisition_qualification: acquisition_qualification,
            software: software,
          },
        });
        // console.log("response.data", response.data);

        // company-view.jsxにデータを渡す
        const responseData = response.data;
        responseItems(responseData);
      } else if (
        PathName.startsWith("/Profile/") &&
        PathName.endsWith("/JobOffer")
      ) {
        // 企業プロフィール内での求人の場合
        const url = `http://localhost:8000/search_internship_job_offer?page=${Page}`;

        let follow_status = [];
        let company_name = [];
        let selected_occupation = [];
        let prefecture = [];
        let industry = [];
        let development_environment = [];
        let programming_language = [];
        let acquisition_qualification = [];
        let software = [];

        searchSource.follow_status.map((value) => {
          follow_status.push(value.value);
        });
        searchSource.company_name.map((value) => {
          company_name.push(value.value);
        });
        searchSource.selected_occupation.map((value) => {
          selected_occupation.push(value.value);
        });
        searchSource.prefecture.map((value) => {
          prefecture.push(value.value);
        });
        searchSource.industry.map((value) => {
          industry.push(value.value);
        });
        searchSource.development_environment.map((value) => {
          development_environment.push(value.value);
        });
        searchSource.programming_language.map((value) => {
          programming_language.push(value.value);
        });
        searchSource.acquisition_qualification.map((value) => {
          acquisition_qualification.push(value.value);
        });
        searchSource.software.map((value) => {
          software.push(value.value);
        });

        let urlUserNameStr = location.pathname.split("/")[2];

        const response = await axios.get(url, {
          params: {
            myId: myId,
            user_name: urlUserNameStr,
            searchText: searchSource.searchText,
            follow_status: follow_status,
            company_name: company_name,
            selected_occupation: selected_occupation,
            prefecture: prefecture,
            industry: industry,
            development_environment: development_environment,
            programming_language: programming_language,
            acquisition_qualification: acquisition_qualification,
            software: software,
            genre: "Joboffer",
          },
        });

        // company-view.jsxにデータを渡す
        const responseData = response.data;
        responseItems(responseData);
      } else if (
        PathName.startsWith("/Profile/") &&
        PathName.endsWith("/Internship")
      ) {
        // 企業プロフィール内での求人の場合
        const url = `http://localhost:8000/search_internship_job_offer?page=${Page}`;

        let follow_status = [];
        let company_name = [];
        let selected_occupation = [];
        let prefecture = [];
        let industry = [];
        let development_environment = [];
        let programming_language = [];
        let acquisition_qualification = [];
        let software = [];

        searchSource.follow_status.map((value) => {
          follow_status.push(value.value);
        });
        searchSource.company_name.map((value) => {
          company_name.push(value.value);
        });
        searchSource.selected_occupation.map((value) => {
          selected_occupation.push(value.value);
        });
        searchSource.prefecture.map((value) => {
          prefecture.push(value.value);
        });
        searchSource.industry.map((value) => {
          industry.push(value.value);
        });
        searchSource.development_environment.map((value) => {
          development_environment.push(value.value);
        });
        searchSource.programming_language.map((value) => {
          programming_language.push(value.value);
        });
        searchSource.acquisition_qualification.map((value) => {
          acquisition_qualification.push(value.value);
        });
        searchSource.software.map((value) => {
          software.push(value.value);
        });

        let urlUserNameStr = location.pathname.split("/")[2];

        const response = await axios.get(url, {
          params: {
            myId: myId,
            user_name: urlUserNameStr,
            searchText: searchSource.searchText,
            follow_status: follow_status,
            company_name: company_name,
            selected_occupation: selected_occupation,
            prefecture: prefecture,
            industry: industry,
            development_environment: development_environment,
            programming_language: programming_language,
            acquisition_qualification: acquisition_qualification,
            software: software,
            genre: "Internship",
          },
        });

        // company-view.jsxにデータを渡す
        const responseData = response.data;
        responseItems(responseData);
      } else if (
        PathName.startsWith("/Profile/") &&
        PathName.endsWith("/Session")
      ) {
        // 企業プロフィール内での求人の場合
        const url = `http://localhost:8000/search_internship_job_offer?page=${Page}`;

        let follow_status = [];
        let company_name = [];
        let selected_occupation = [];
        let prefecture = [];
        let industry = [];
        let development_environment = [];
        let programming_language = [];
        let acquisition_qualification = [];
        let software = [];

        searchSource.follow_status.map((value) => {
          follow_status.push(value.value);
        });
        searchSource.company_name.map((value) => {
          company_name.push(value.value);
        });
        searchSource.selected_occupation.map((value) => {
          selected_occupation.push(value.value);
        });
        searchSource.prefecture.map((value) => {
          prefecture.push(value.value);
        });
        searchSource.industry.map((value) => {
          industry.push(value.value);
        });
        searchSource.development_environment.map((value) => {
          development_environment.push(value.value);
        });
        searchSource.programming_language.map((value) => {
          programming_language.push(value.value);
        });
        searchSource.acquisition_qualification.map((value) => {
          acquisition_qualification.push(value.value);
        });
        searchSource.software.map((value) => {
          software.push(value.value);
        });

        let urlUserNameStr = location.pathname.split("/")[2];

        const response = await axios.get(url, {
          params: {
            myId: myId,
            user_name: urlUserNameStr,
            searchText: searchSource.searchText,
            follow_status: follow_status,
            company_name: company_name,
            selected_occupation: selected_occupation,
            prefecture: prefecture,
            industry: industry,
            development_environment: development_environment,
            programming_language: programming_language,
            acquisition_qualification: acquisition_qualification,
            software: software,
            genre: "Session",
          },
        });

        // company-view.jsxにデータを渡す
        const responseData = response.data;
        responseItems(responseData);
      } else if (
        PathName.startsWith("/Profile/") &&
        PathName.endsWith("/Blog")
      ) {
        // 企業プロフィール内での求人の場合
        const url = `http://localhost:8000/search_internship_job_offer?page=${Page}`;

        let follow_status = [];
        let company_name = [];
        let selected_occupation = [];
        let prefecture = [];
        let industry = [];
        let development_environment = [];
        let programming_language = [];
        let acquisition_qualification = [];
        let software = [];

        searchSource.follow_status.map((value) => {
          follow_status.push(value.value);
        });
        searchSource.company_name.map((value) => {
          company_name.push(value.value);
        });
        searchSource.selected_occupation.map((value) => {
          selected_occupation.push(value.value);
        });
        searchSource.prefecture.map((value) => {
          prefecture.push(value.value);
        });
        searchSource.industry.map((value) => {
          industry.push(value.value);
        });
        searchSource.development_environment.map((value) => {
          development_environment.push(value.value);
        });
        searchSource.programming_language.map((value) => {
          programming_language.push(value.value);
        });
        searchSource.acquisition_qualification.map((value) => {
          acquisition_qualification.push(value.value);
        });
        searchSource.software.map((value) => {
          software.push(value.value);
        });

        let urlUserNameStr = location.pathname.split("/")[2];

        const response = await axios.get(url, {
          params: {
            myId: myId,
            user_name: urlUserNameStr,
            searchText: searchSource.searchText,
            follow_status: follow_status,
            company_name: company_name,
            selected_occupation: selected_occupation,
            prefecture: prefecture,
            industry: industry,
            development_environment: development_environment,
            programming_language: programming_language,
            acquisition_qualification: acquisition_qualification,
            software: software,
            genre: "Blog",
          },
        });

        // company-view.jsxにデータを渡す
        const responseData = response.data;
        responseItems(responseData);
      } else if (PathName === "/Internship_JobOffer/JobOffer") {
        // 企業一覧の場合
        const url = `http://localhost:8000/search_internship_job_offer?page=${Page}`;

        let follow_status = [];
        let company_name = [];
        let selected_occupation = [];
        let prefecture = [];
        let industry = [];
        let development_environment = [];
        let programming_language = [];
        let acquisition_qualification = [];
        let software = [];

        searchSource.follow_status.map((value) => {
          follow_status.push(value.value);
        });
        searchSource.company_name.map((value) => {
          company_name.push(value.value);
        });
        searchSource.selected_occupation.map((value) => {
          selected_occupation.push(value.value);
        });
        searchSource.prefecture.map((value) => {
          prefecture.push(value.value);
        });
        searchSource.industry.map((value) => {
          industry.push(value.value);
        });
        searchSource.development_environment.map((value) => {
          development_environment.push(value.value);
        });
        searchSource.programming_language.map((value) => {
          programming_language.push(value.value);
        });
        searchSource.acquisition_qualification.map((value) => {
          acquisition_qualification.push(value.value);
        });
        searchSource.software.map((value) => {
          software.push(value.value);
        });

        const response = await axios.get(url, {
          params: {
            myId: myId,
            searchText: searchSource.searchText,
            follow_status: follow_status,
            company_name: company_name,
            selected_occupation: selected_occupation,
            prefecture: prefecture,
            industry: industry,
            development_environment: development_environment,
            programming_language: programming_language,
            acquisition_qualification: acquisition_qualification,
            software: software,
            genre: "Joboffer",
          },
        });

        // company-view.jsxにデータを渡す
        const responseData = response.data;
        responseItems(responseData);
      } else if (PathName === "/Internship_JobOffer/Internship") {
        // 企業一覧の場合
        const url = `http://localhost:8000/search_internship_job_offer?page=${Page}`;

        let follow_status = [];
        let company_name = [];
        let selected_occupation = [];
        let prefecture = [];
        let industry = [];
        let development_environment = [];
        let programming_language = [];
        let acquisition_qualification = [];
        let software = [];

        searchSource.follow_status.map((value) => {
          follow_status.push(value.value);
        });
        searchSource.company_name.map((value) => {
          company_name.push(value.value);
        });
        searchSource.selected_occupation.map((value) => {
          selected_occupation.push(value.value);
        });
        searchSource.prefecture.map((value) => {
          prefecture.push(value.value);
        });
        searchSource.industry.map((value) => {
          industry.push(value.value);
        });
        searchSource.development_environment.map((value) => {
          development_environment.push(value.value);
        });
        searchSource.programming_language.map((value) => {
          programming_language.push(value.value);
        });
        searchSource.acquisition_qualification.map((value) => {
          acquisition_qualification.push(value.value);
        });
        searchSource.software.map((value) => {
          software.push(value.value);
        });

        const response = await axios.get(url, {
          params: {
            myId: myId,
            searchText: searchSource.searchText,
            follow_status: follow_status,
            company_name: company_name,
            selected_occupation: selected_occupation,
            prefecture: prefecture,
            industry: industry,
            development_environment: development_environment,
            programming_language: programming_language,
            acquisition_qualification: acquisition_qualification,
            software: software,
            genre: "Internship",
          },
        });
        // console.log("response.data", response.data);
        // console.log("response.data:PathName", PathName);
        // console.log("response.data:internships");

        // company-view.jsxにデータを渡す
        const responseData = response.data;
        responseItems(responseData);
      } else if (PathName === "/Internship_JobOffer/Session") {
        // 企業一覧の場合
        const url = `http://localhost:8000/search_internship_job_offer?page=${Page}`;

        let follow_status = [];
        let company_name = [];
        let selected_occupation = [];
        let prefecture = [];
        let industry = [];
        let development_environment = [];
        let programming_language = [];
        let acquisition_qualification = [];
        let software = [];

        searchSource.follow_status.map((value) => {
          follow_status.push(value.value);
        });
        searchSource.company_name.map((value) => {
          company_name.push(value.value);
        });
        searchSource.selected_occupation.map((value) => {
          selected_occupation.push(value.value);
        });
        searchSource.prefecture.map((value) => {
          prefecture.push(value.value);
        });
        searchSource.industry.map((value) => {
          industry.push(value.value);
        });
        searchSource.development_environment.map((value) => {
          development_environment.push(value.value);
        });
        searchSource.programming_language.map((value) => {
          programming_language.push(value.value);
        });
        searchSource.acquisition_qualification.map((value) => {
          acquisition_qualification.push(value.value);
        });
        searchSource.software.map((value) => {
          software.push(value.value);
        });

        const response = await axios.get(url, {
          params: {
            myId: myId,
            searchText: searchSource.searchText,
            follow_status: follow_status,
            company_name: company_name,
            selected_occupation: selected_occupation,
            prefecture: prefecture,
            industry: industry,
            development_environment: development_environment,
            programming_language: programming_language,
            acquisition_qualification: acquisition_qualification,
            software: software,
            genre: "Session",
          },
        });
        // console.log("response.data", response.data);
        // console.log("response.data:PathName", PathName);
        // console.log("response.sessions");

        // company-view.jsxにデータを渡す
        const responseData = response.data;
        responseItems(responseData);
      } else if (PathName === "/Internship_JobOffer/Blog") {
        // 企業一覧の場合
        const url = `http://localhost:8000/search_internship_job_offer?page=${Page}`;

        let follow_status = [];
        let company_name = [];
        let selected_occupation = [];
        let prefecture = [];
        let industry = [];
        let development_environment = [];
        let programming_language = [];
        let acquisition_qualification = [];
        let software = [];

        searchSource.follow_status.map((value) => {
          follow_status.push(value.value);
        });
        searchSource.company_name.map((value) => {
          company_name.push(value.value);
        });
        searchSource.selected_occupation.map((value) => {
          selected_occupation.push(value.value);
        });
        searchSource.prefecture.map((value) => {
          prefecture.push(value.value);
        });
        searchSource.industry.map((value) => {
          industry.push(value.value);
        });
        searchSource.development_environment.map((value) => {
          development_environment.push(value.value);
        });
        searchSource.programming_language.map((value) => {
          programming_language.push(value.value);
        });
        searchSource.acquisition_qualification.map((value) => {
          acquisition_qualification.push(value.value);
        });
        searchSource.software.map((value) => {
          software.push(value.value);
        });

        const response = await axios.get(url, {
          params: {
            myId: myId,
            searchText: searchSource.searchText,
            follow_status: follow_status,
            company_name: company_name,
            selected_occupation: selected_occupation,
            prefecture: prefecture,
            industry: industry,
            development_environment: development_environment,
            programming_language: programming_language,
            acquisition_qualification: acquisition_qualification,
            software: software,
            genre: "Blog",
          },
        });
        // console.log("response.data", response.data);
        // console.log("response.blogs");

        // company-view.jsxにデータを渡す
        const responseData = response.data;
        responseItems(responseData);
      } else if (PathName == "/Profile") {
        // 学生一覧の場合
        const url = `http://localhost:8000/search_company?page=${Page}`;

        let selected_occupation = [];
        let prefecture = [];

        searchSource.selected_occupation.map((value) => {
          selected_occupation.push(value.value);
        });
        searchSource.prefecture.map((value) => {
          prefecture.push(value.value);
        });

        const response = await axios.get(url, {
          params: {
            searchText: searchSource.searchText,
            selected_occupation: selected_occupation,
            prefecture: prefecture,
          },
        });
        // console.log("response.data", response.data);

        // company-view.jsxにデータを渡す
        const responseData = response.data;
        responseItems(responseData);
      }
    } catch (err) {
      console.log("err:", err);
    }
  }

  // サイドバーが押されたらログインされて一番初めに表示される作品一覧の状態にするために、
  // 検索させないよう初期化する。
  useEffect(() => {
    if (ResetItem) {
      setsearchSource((prevSearchtags) => ({
        ...prevSearchtags,
        searchText: "",
        work_genre: [],
        programming_language: [],
        development_environment: [],
        video_genre: [],
        school_name: [],
        department_name: [],
        faculty_name: [],
        major_name: [],
        course_name: [],
        student_programming_language: [],
        student_development_environment: [],
        software: [],
        acquisition_qualification: [],
        hobby: [],
        other: [],
        graduation_year: [],
        desired_occupation: [],
        desired_work_region: [],
        selected_occupation: [],
        prefecture: [],
        company_name: [],
      }));

      setSaveOptions((prevState) => ({
        ...prevState,
        searchText: "",
        follow_status: [],
        work_genre: [],
        programming_language: [],
        development_environment: [],
        video_genre: [],
        school_name: [],
        department_name: [],
        faculty_name: [],
        major_name: [],
        course_name: [],
        student_programming_language: [],
        student_development_environment: [],
        software: [],
        acquisition_qualification: [],
        hobby: [],
        other: [],
        graduation_year: [],
        desired_occupation: [],
        desired_work_region: [],
        selected_occupation: [],
        prefecture: [],
        company_name: [],
        industry: [],
      }));
    }
  }, [ResetItem]);

  // 検索バーを閉じる
  const handleClose = () => {
    setOpen(false);
  };

  // 全ての絞り込みタグを非選択状態にする
  const handleTagReset = () => {
    setsearchSource((prevState) => ({
      ...prevState,
      searchText: "",
      follow_status: [],
      work_genre: [],
      programming_language: [],
      development_environment: [],
      video_genre: [],
      school_name: [],
      department_name: [],
      faculty_name: [],
      major_name: [],
      course_name: [],
      student_programming_language: [],
      student_development_environment: [],
      software: [],
      acquisition_qualification: [],
      hobby: [],
      other: [],
      graduation_year: [],
      desired_occupation: [],
      desired_work_region: [],
      selected_occupation: [],
      prefecture: [],
      company_name: [],
      industry: [],
    }));
  };

  // タグの選択状態を元に戻す
  const handleCancel = () => {
    setsearchSource((prevState) => ({
      ...prevState,
      ...saveOptions,
    }));
  };

  // useEffect(() => {
  //   console.log("searchSource: ", searchSource);

  // }, saveOptions);

  // 空だったらtrue
  const isAllEmpty = (obj) =>
    Object.values(obj).every((value) => value.length === 0);

  // 検索ボタンを押したとき
  const handleSearch = () => {
    // 検索バーを閉じる
    setOpen(false);
    // 文字列やタグを選択している場合
    if (!isAllEmpty(searchSource)) {
      // 「並び替え順」「一覧データ」初期化
      setAllItems((prevItems) => ({
        ...prevItems,
        IsLoading: true,
        DataList: [],
        IsSearch: {
          ...prevItems.IsSearch,
          searchToggle: prevItems.IsSearch.searchToggle === 0 ? 1 : 0,
          Check: !isAllEmpty(searchSource), // 検索タグが選択されていなければfalse
          searchResultEmpty: false,
        },
        Page: 1,
        sortOption: "orderNewPostsDate",
      }));
    }

    // 文字列やタグを選択していない場合
    if (isAllEmpty(searchSource)) {
      // 「検索文字列・タグ」「並び替え順」「一覧データ」初期化
      setAllItems((prevItems) => ({
        ...prevItems, //既存のパラメータ値を変更するためにスプレッド演算子を使用
        IsLoading: true,
        ResetItem: true,
        DataList: [], //検索してない状態にするために初期化 //searchbar.jsxのsearchSourceも初期化
        IsSearch: { searchToggle: 0, Check: false, searchResultEmpty: false },
        Page: 1, //スクロールする前の状態にするために初期化
        sortOption: "orderNewPostsDate", //並び替える前の状態にするために初期化
      }));
    }

    // タグ選択のキャンセルしたとき用の保存オブジェクトに絞り込み情報をセット
    setSaveOptions((prevState) => ({
      ...prevState,
      ...searchSource,
    }));
  };

  // ページが変更された時に次のデータを取得する
  useEffect(() => {
    // 検索タグが入力されているかつ、pageが変更されたて値があれば検索する
    if (IsSearch.Check && Page) {
      let url = new URL(window.location.href);
      let urlPageParams = url.searchParams.get("page");
      let urlCategoryParams = url.searchParams.get("category");
      console.log(
        "searchSourceList:urlPageParams",
        "/Internship_JobOffer/" + urlPageParams
      );
      console.log(
        "searchSourceList:urlCategoryParams",
        "/Profile/" + urlCategoryParams
      );
      console.log("searchSourceList:PathName", PathName);
      if ("/Internship_JobOffer/" + urlPageParams == PathName) {
        console.log("searchSourceList:Page", Page);
        console.log(
          "IsSearch.Check, Page, IsSearch.searchToggle, sortOption",
          PathName
        );
        searchSourceList();
      } else if ("/Internship_JobOffer" != location.pathname) {
        searchSourceList();
      }
    }
  }, [IsSearch.Check, Page, IsSearch.searchToggle, sortOption, PathName]);

  // useEffect(() => {
  //   console.log("Effect!IsSearch.Check! : ", PathName);
  // }, [IsSearch.Check]);
  // useEffect(() => {
  //   console.log("Effect!Page! : ", PathName);
  // }, [Page]);
  // useEffect(() => {
  //   console.log("Effect!IsSearch.searchToggle! : ", PathName);
  // }, [IsSearch.searchToggle]);
  // useEffect(() => {
  //   console.log("Effect!sortOption! : ", PathName);
  // }, [sortOption]);

  // 検索欄に入力したとき
  const handleChangeText = (e) => {
    // console.log("e.target.value", e.target.value);
    setsearchSource({
      ...searchSource,
      searchText: e.target.value,
    });
  };

  const tagAction = (optionName, selectedOption) => {
    // console.log("selectedOption: ");
    // console.log(selectedOption);
    if (selectedOption != null) {
      let selectedOptionArray = [];
      if (!Array.isArray(selectedOption)) {
        selectedOptionArray[0] = selectedOption;
        // console.log(selectedOptionArray);
      } else {
        selectedOptionArray = selectedOption;
      }
      let tagArray = [];
      selectedOptionArray.map((value) => {
        tagArray.push(value.value);
      });
      setsearchSource((prevOptions) => ({
        ...prevOptions,
        [optionName]: selectedOptionArray,
      }));
    } else {
      setsearchSource((prevOptions) => ({
        ...prevOptions,
        [optionName]: [],
      }));
    }
  };

  // 作品ジャンルのタグを操作したとき
  const handleChangeWorkGenre = (selectedOption) => {
    tagAction("work_genre", selectedOption);
  };

  // 作品のプログラミング言語のタグを操作したとき
  const handleChangeProgrammingLanguage = (selectedOption) => {
    tagAction("programming_language", selectedOption);
  };

  // 作品の開発環境のタグを操作したとき
  const handleChangeDevelopmentEnvironment = (selectedOption) => {
    tagAction("development_environment", selectedOption);
  };

  // 動画ジャンルのタグを操作したとき
  const handleChangeVideoGenre = (selectedOption) => {
    tagAction("video_genre", selectedOption);
  };

  // 卒業年タグを操作したとき
  const handleChangeGraduationYear = (selectedOption) => {
    tagAction("graduation_year", selectedOption);
  };

  // 学校名タグを操作したとき
  const handleChangeSchoolName = (selectedOption) => {
    tagAction("school_name", selectedOption);
  };

  // 学科名タグを操作したとき
  const handleChangeDepartmentName = (selectedOption) => {
    tagAction("department_name", selectedOption);
  };

  // 学部名タグを操作したとき
  const handleChangeFacultyName = (selectedOption) => {
    tagAction("faculty_name", selectedOption);
  };

  // 専攻名タグを操作したとき
  const handleChangeMajorName = (selectedOption) => {
    tagAction("major_name", selectedOption);
  };

  // コース名タグを操作したとき
  const handleChangeCourseName = (selectedOption) => {
    tagAction("course_name", selectedOption);
  };

  // 希望職種タグを操作したとき
  const handleChangeDesiredOccupation = (selectedOption) => {
    tagAction("desired_occupation", selectedOption);
  };

  // 希望勤務地タグを操作したとき
  const handleChangeDesiredWorkRegion = (selectedOption) => {
    tagAction("desired_work_region", selectedOption);
  };

  // 学生のプログラミング言語のタグを操作したとき
  const handleChangeStudentProgrammingLanguage = (selectedOption) => {
    tagAction("student_programming_language", selectedOption);
  };

  // 学生の開発環境のタグを操作したとき
  const handleChangeStudentDevelopmentEnvironment = (selectedOption) => {
    tagAction("student_development_environment", selectedOption);
  };

  // ソフトウェアのタグを操作したとき
  const handleChangeSoftware = (selectedOption) => {
    tagAction("software", selectedOption);
  };

  // 取得資格のタグを操作したとき
  const handleChangeAcquisitionQualification = (selectedOption) => {
    tagAction("acquisition_qualification", selectedOption);
  };

  // 趣味のタグを操作したとき
  const handleChangeHobby = (selectedOption) => {
    tagAction("hobby", selectedOption);
  };

  // 企業の勤務地のタグを操作したとき
  const handleChangeSelectedOccupation = (selectedOption) => {
    tagAction("selected_occupation", selectedOption);
  };
  // 企業の勤務地のタグを操作したとき
  const handleChangePrefecture = (selectedOption) => {
    tagAction("prefecture", selectedOption);
  };
  // 企業名のタグを操作したとき
  const handleChangeCompanyName = (selectedOption) => {
    tagAction("company_name", selectedOption);
  };
  // 業界タグのタグを操作したとき
  const handleChangeIndustry = (selectedOption) => {
    tagAction("industry", selectedOption);
  };
  // フォロー状況のタグを操作したとき
  const handleChangeFollowStatus = (selectedOption) => {
    tagAction("follow_status", selectedOption);
  };

  // useEffect(() => {
  //   console.log("searchSource: ", searchSource);
  // }, [searchSource]);

  // useEffect(() => {
  //   console.log("options: ", options);
  // }, [options]);

  return (
    // <ClickAwayListener>
    <div>
      {RefineSearch && (
        <>
          {(PathName.startsWith("/Profile/") &&
          PathName.endsWith("/mypage")) ||
          (PathName.startsWith("/WorkDetail/") &&
          PathName.endsWith("")) ||
          (PathName.startsWith("/VideoDetail/") &&
          PathName.endsWith("")) ? null : (
            <>
              <Box>
                <OutlinedInput
                  id="input-search-header"
                  autoComplete="off"
                  value={searchSource.searchText}
                  onChange={handleChangeText}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      searchSource.searchText.trim() !== ""
                    ) {
                      handleSearch();
                    } else if (e.key === "Enter") {
                      e.preventDefault(); //入力が空の場合はEnterキーを無効化
                    }
                  }}
                  placeholder="検索"
                  startAdornment={
                    // INPUT要素に何か入力されていたら
                    searchSource.searchText.trim() !== "" ? (
                      <InputAdornment
                        className="mushimeganeSearch"
                        onClick={handleSearch}
                        position="start"
                        sx={{ mr: 1, fontWeight: "fontWeightBold" }}
                      >
                        <IconSearch stroke={1.5} size="16px" />
                      </InputAdornment>
                    ) : (
                      <InputAdornment
                        position="start"
                        sx={{ mr: 1, fontWeight: "fontWeightBold" }}
                      >
                        <IconSearch stroke={1.5} size="16px" />
                      </InputAdornment>
                    )
                  }
                  endAdornment={
                    // 絞り込みアイコン

                    <InputAdornment
                      position="end"
                      style={{ display: Display.thisCompanyNews }}
                    >
                      <HeaderAvatar onClick={handleOpen}>
                        <IconAdjustmentsHorizontal stroke={1.5} size="18px" />
                      </HeaderAvatar>
                    </InputAdornment>
                  }
                  aria-describedby="search-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                    sx: { bgcolor: "transparent", pl: 0.5 },
                    padding: 0,
                  }}
                  sx={{
                    width: { md: 200, lg: 434 },
                    height: 50,
                    ml: 2,
                    px: 2,
                  }}
                />
              </Box>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Stack
                    direction="column"
                    spacing={2}
                    sx={{
                      height: "100%",
                      justifyContent: "space-between",
                      alignItems: "stretch",
                    }}
                  >
                    <Typography variant="h5">絞り込み検索</Typography>
                    <Divider
                      sx={{ borderStyle: "dashed", m: 0, display: "block" }}
                    />
                    {/* ---------------------------------------------------------- */}
                    <Stack
                      sx={{
                        overflowY: "scroll",
                        height: "100%",
                      }}
                    >
                      {/* <StyledSearchbar> */}
                      <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 2, sm: 8, md: 12 }}
                        style={{
                          width: "inherit",
                          height: "inherit",
                          padding: "5px 8px 5px 5px",
                        }}
                      >
                        {/* <div
                      style={{
                        minHeight: "40vh",
                        maxHeight: "60vh",
                        width: "100%",
                      }}
                    > */}
                        {PathName === "/" ? (
                          <>
                            {myId[0] === "C" ? (
                              <>
                                <Grid item xs={2} sm={4} md={4}>
                                  <div
                                    style={{
                                      display: "",
                                      marginTop: "20px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: "Bold",
                                        color: "#666",
                                      }}
                                    >
                                      フォロー状況
                                    </div>
                                    <div style={{ color: "#444" }}>
                                      <Select
                                        placeholder="▼"
                                        options={options.follow_status}
                                        value={searchSource.follow_status}
                                        isClearable
                                        isMulti
                                        onChange={handleChangeFollowStatus}
                                      />
                                    </div>
                                  </div>
                                </Grid>
                              </>
                            ) : (
                              ""
                            )}
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: "Bold",
                                    color: "#666",
                                    display: "flex",
                                    flexGrow: "2",
                                    gap: "5px",
                                    alignItems: "center",
                                  }}
                                >
                                  {/* <LuSchool /> */}
                                  <span style={{ flexGrow: 1 }}>学校名</span>
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.school_name}
                                    value={searchSource.school_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeSchoolName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  学科名
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.department_name}
                                    value={searchSource.department_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeDepartmentName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  学部名
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.faculty_name}
                                    value={searchSource.faculty_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeFacultyName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  専攻名
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.major_name}
                                    value={searchSource.major_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeMajorName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  コース名
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.course_name}
                                    value={searchSource.course_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeCourseName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  ジャンル
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.work_genre}
                                    value={searchSource.work_genre}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeWorkGenre}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  プログラミング言語
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.programming_language}
                                    value={searchSource.programming_language}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeProgrammingLanguage}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  開発環境
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.development_environment}
                                    value={searchSource.development_environment}
                                    isClearable
                                    isMulti
                                    onChange={
                                      handleChangeDevelopmentEnvironment
                                    }
                                  />
                                </div>
                              </div>
                            </Grid>
                          </>
                        ) : PathName === "/VideoList" ? (
                          <>
                            {myId[0] === "C" ? (
                              <>
                                <Grid item xs={2} sm={4} md={4}>
                                  <div
                                    style={{
                                      display: "",
                                      marginTop: "20px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: "Bold",
                                        color: "#666",
                                      }}
                                    >
                                      フォロー状況
                                    </div>
                                    <div style={{ color: "#444" }}>
                                      <Select
                                        placeholder="▼"
                                        options={options.follow_status}
                                        value={searchSource.follow_status}
                                        isClearable
                                        isMulti
                                        onChange={handleChangeFollowStatus}
                                      />
                                    </div>
                                  </div>
                                </Grid>
                              </>
                            ) : (
                              ""
                            )}
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  学校名
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.school_name}
                                    value={searchSource.school_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeSchoolName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  学科名
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.department_name}
                                    value={searchSource.department_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeDepartmentName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  学部名
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.faculty_name}
                                    value={searchSource.faculty_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeFacultyName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  専攻名
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.major_name}
                                    value={searchSource.major_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeMajorName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  コース名
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.course_name}
                                    value={searchSource.course_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeCourseName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  ジャンル
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.video_genre}
                                    value={searchSource.video_genre}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeVideoGenre}
                                  />
                                </div>
                              </div>
                            </Grid>
                          </>
                        ) : PathName === "/StudentList" ? (
                          <>
                            {myId[0] === "C" ? (
                              <>
                                <Grid item xs={2} sm={4} md={4}>
                                  <div
                                    style={{
                                      display: "",
                                      marginTop: "20px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: "Bold",
                                        color: "#666",
                                      }}
                                    >
                                      フォロー状況
                                    </div>
                                    <div style={{ color: "#444" }}>
                                      <Select
                                        placeholder="▼"
                                        options={options.follow_status}
                                        value={searchSource.follow_status}
                                        isClearable
                                        isMulti
                                        onChange={handleChangeFollowStatus}
                                      />
                                    </div>
                                  </div>
                                </Grid>
                              </>
                            ) : (
                              ""
                            )}
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  卒業年
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.graduation_year}
                                    value={searchSource.graduation_year}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeGraduationYear}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  学校名
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.school_name}
                                    value={searchSource.school_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeSchoolName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  学科名
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.department_name}
                                    value={searchSource.department_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeDepartmentName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  学部名
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.faculty_name}
                                    value={searchSource.faculty_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeFacultyName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  専攻名
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.major_name}
                                    value={searchSource.major_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeMajorName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  コース名
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.course_name}
                                    value={searchSource.course_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeCourseName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  希望職種
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.desired_occupation}
                                    value={searchSource.desired_occupation}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeDesiredOccupation}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  希望勤務地
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.desired_work_region}
                                    value={searchSource.desired_work_region}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeDesiredWorkRegion}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  プログラミング言語
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={
                                      options.student_programming_language
                                    }
                                    value={
                                      searchSource.student_programming_language
                                    }
                                    isClearable
                                    isMulti
                                    onChange={
                                      handleChangeStudentProgrammingLanguage
                                    }
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  開発環境
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={
                                      options.student_development_environment
                                    }
                                    value={
                                      searchSource.student_development_environment
                                    }
                                    isClearable
                                    isMulti
                                    onChange={
                                      handleChangeStudentDevelopmentEnvironment
                                    }
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  ソフトウェア
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.software}
                                    value={searchSource.software}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeSoftware}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  取得資格
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.acquisition_qualification}
                                    value={
                                      searchSource.acquisition_qualification
                                    }
                                    isClearable
                                    isMulti
                                    onChange={
                                      handleChangeAcquisitionQualification
                                    }
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  趣味
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.hobby}
                                    value={searchSource.hobby}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeHobby}
                                  />
                                </div>
                              </div>
                            </Grid>
                          </>
                        ) : PathName === "/Profile/yoshioka/work" ? (
                          <>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  ジャンル
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.work_genre}
                                    value={searchSource.work_genre}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeWorkGenre}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  プログラミング言語
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.programming_language}
                                    value={searchSource.programming_language}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeProgrammingLanguage}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  開発環境
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.development_environment}
                                    value={searchSource.development_environment}
                                    isClearable
                                    isMulti
                                    onChange={
                                      handleChangeDevelopmentEnvironment
                                    }
                                  />
                                </div>
                              </div>
                            </Grid>
                          </>
                        ) : PathName === "/Profile/yoshioka/movie" ? (
                          <>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  ジャンル
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.work_genre}
                                    value={searchSource.work_genre}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeWorkGenre}
                                  />
                                </div>
                              </div>
                            </Grid>
                          </>
                        ) : PathName === "/CompanyList" ? (
                          <>
                            {myId[0] === "S" ? (
                              <>
                                <Grid item xs={2} sm={4} md={4}>
                                  <div
                                    style={{
                                      display: "",
                                      marginTop: "20px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: "Bold",
                                        color: "#666",
                                      }}
                                    >
                                      フォロー状況
                                    </div>
                                    <div style={{ color: "#444" }}>
                                      <Select
                                        placeholder="▼"
                                        options={options.follow_status}
                                        value={searchSource.follow_status}
                                        isClearable
                                        isMulti
                                        onChange={handleChangeFollowStatus}
                                      />
                                    </div>
                                  </div>
                                </Grid>
                              </>
                            ) : (
                              ""
                            )}
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  職種
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.selected_occupation}
                                    value={searchSource.selected_occupation}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeSelectedOccupation}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  勤務地
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.prefecture}
                                    value={searchSource.prefecture}
                                    isClearable
                                    isMulti
                                    onChange={handleChangePrefecture}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  業界キーワード
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.industry}
                                    value={searchSource.industry}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeIndustry}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  開発環境
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.development_environment}
                                    value={searchSource.development_environment}
                                    isClearable
                                    isMulti
                                    onChange={
                                      handleChangeDevelopmentEnvironment
                                    }
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  プログラミング言語
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.programming_language}
                                    value={searchSource.programming_language}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeProgrammingLanguage}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  歓迎資格
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.acquisition_qualification}
                                    value={
                                      searchSource.acquisition_qualification
                                    }
                                    isClearable
                                    isMulti
                                    onChange={
                                      handleChangeAcquisitionQualification
                                    }
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  ソフトウェア
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.software}
                                    value={searchSource.software}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeSoftware}
                                  />
                                </div>
                              </div>
                            </Grid>
                          </>
                        ) : PathName === "/Internship_JobOffer/JobOffer" ||
                          PathName === "/Internship_JobOffer/Internship" ||
                          PathName === "/Internship_JobOffer/Session" ||
                          PathName === "/Internship_JobOffer/Blog" ? (
                          <>
                            {myId[0] === "S" ? (
                              <>
                                <Grid item xs={2} sm={4} md={4}>
                                  <div
                                    style={{
                                      display: "",
                                      marginTop: "20px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: "Bold",
                                        color: "#666",
                                      }}
                                    >
                                      フォロー状況
                                    </div>
                                    <div style={{ color: "#444" }}>
                                      <Select
                                        options={options.follow_status}
                                        value={searchSource.follow_status}
                                        isClearable
                                        isMulti
                                        onChange={handleChangeFollowStatus}
                                      />
                                    </div>
                                  </div>
                                </Grid>
                              </>
                            ) : (
                              ""
                            )}
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  企業名
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    placeholder="▼"
                                    options={options.company_name}
                                    value={searchSource.company_name}
                                    isClearable
                                    // isMulti
                                    onChange={handleChangeCompanyName}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  職種
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    options={options.selected_occupation}
                                    value={searchSource.selected_occupation}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeSelectedOccupation}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  勤務地
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    options={options.prefecture}
                                    value={searchSource.prefecture}
                                    isClearable
                                    isMulti
                                    onChange={handleChangePrefecture}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  業界キーワード
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    options={options.industry}
                                    value={searchSource.industry}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeIndustry}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  開発環境
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    options={options.development_environment}
                                    value={searchSource.development_environment}
                                    isClearable
                                    isMulti
                                    onChange={
                                      handleChangeDevelopmentEnvironment
                                    }
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  プログラミング言語
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    options={options.programming_language}
                                    value={searchSource.programming_language}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeProgrammingLanguage}
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  歓迎資格
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    options={options.acquisition_qualification}
                                    value={
                                      searchSource.acquisition_qualification
                                    }
                                    isClearable
                                    isMulti
                                    onChange={
                                      handleChangeAcquisitionQualification
                                    }
                                  />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <div
                                style={{
                                  display: "",
                                  marginTop: "20px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "Bold", color: "#666" }}
                                >
                                  ソフトウェア
                                </div>
                                <div style={{ color: "#444" }}>
                                  <Select
                                    options={options.software}
                                    value={searchSource.software}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeSoftware}
                                  />
                                </div>
                              </div>
                            </Grid>
                          </>
                        ) : (
                          ""
                        )}
                        {/* </div> */}
                      </Grid>
                      {/* </StyledSearchbar> */}
                    </Stack>

                    {/* ---------------------------------------------------------- */}
                    <Divider
                      sx={{ borderStyle: "dashed", m: 0, display: "block" }}
                    />
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Stack
                        spacing={2}
                        direction="row"
                        sx={{ alignItems: "center" }}
                      >
                        <Button
                          className={classes.textField}
                          variant="outlined"
                          onClick={handleClose}
                        >
                          閉じる
                        </Button>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{ alignItems: "center" }}
                      >
                        <Button
                          className={classes.textField}
                          variant="outlined"
                          onClick={handleTagReset}
                        >
                          タグをリセット
                        </Button>
                        <Button
                          className={classes.textField}
                          variant="outlined"
                          onClick={handleCancel}
                        >
                          キャンセル
                        </Button>
                        <Button
                          className={classes.textField}
                          variant="contained"
                          onClick={handleSearch}
                        >
                          検索
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              </Modal>
            </>
          )}
        </>
      )}
    </div>
    // </ClickAwayListener>
  );
}
