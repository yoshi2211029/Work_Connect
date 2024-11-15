import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";
import DashboardLayout from "src/layouts/dashboard";

// 新規登録
export const SignRegistar = lazy(() => import("src/pages/SignRegistar"));

// トップ画面
export const TopPage = lazy(() => import("../pages/topPage"));

// 作品投稿画面
export const WorkPosting = lazy(() => import("src/components/account/students/WorkPosting"));
// 動画投稿画面
export const VideoPosting = lazy(() => import("src/components/account/students/VideoPosting"));
// 作品選択画面
export const WorkSelect = lazy(() => import("src/sections/work/WorkPosting/WorkSelect"));
// 動画選択画面
export const VideoSelect = lazy(() => import("src/sections/video/VideoSelect"));

// 作品・動画・学生・企業一覧画面
export const WorksListPage = lazy(() => import("src/pages/workList"));
export const VideoListPage = lazy(() => import("src/pages/videoList"));
export const StudentListPage = lazy(() => import("src/pages/studentList"));
export const CompanyListPage = lazy(() => import("src/pages/companyList"));

// 作品・動画・学生・企業詳細画面
export const WorkDetail = lazy(() => import("src/sections/WorkList/view/WorkDetail"));
export const VideoDetail = lazy(() => import("src/sections/VideoList/view/VideoDetail"));
export const TestPage = lazy(() => import("src/sections/TestPage"));
export const Follow = lazy(() => import("src/sections/Follow"));

// export const StudentListPage = lazy(() => import("src/sections/WorkList/view/WorkDetail.jsx"));
// export const CompanyListPage = lazy(() => import("src/sections/WorkList/view/WorkDetail.jsx"));

// 設定画面
export const SettingsPage = lazy(() => import("src/pages/Settings"));
// メールアドレス変更
export const ChangeEmail = lazy(() => import("src/pages/ChangeEmail"));
// メールアドレス確認
export const CheckEmail = lazy(() => import("src/pages/CheckEmail"));

//
export const InternshipJobOfferPage = lazy(() => import("src/pages/internshipJobOffer"));

//ニュースを編集・投稿画面
export const EditorPage = lazy(() => import("src/pages/Editor/Editor"));

//応募用フォームを編集・回答画面
export const CreateFormPage = lazy(() => import("src/pages/CreateForm/CreateForm"));

export const WriteFormPage = lazy(() => import("src/pages/WriteForm/WriteForm"));


// リンク無し画面
export const Page404 = lazy(() => import("src/pages/page-not-found"));

// プロフィール
export const ProfilePage = lazy(() => import("src/pages/Profile"));
export const ProfileNewsPage = lazy(() => import("src/sections/Profile/View/company/News"));
export const SpecialCompanyNewsPage = lazy(() => import("src/sections/Profile/View/company/SpecialCompanyNews/specialCompanyNews-view"));
// export const CheckFormPage = lazy(() => import("src/sections/Profile/View/company/CheckForm"));
// チャット
export const Chat = lazy(() => import("src/pages/Chat"));

//20240704
export const NewsDetailPage = lazy(() => import('src/sections/InternshipJobOffer/news_detail'));



// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
        // <DashboardLayout>
        //   <Suspense fallback={<div>Loading...</div>}>
        //     <Outlet />
        //   </Suspense>
        // </DashboardLayout>
      ),
      children: [
        { path: "SignRegistar", element: <SignRegistar /> },

        { element: <WorksListPage />, index: true },
        { path: "VideoList", element: <VideoListPage /> },
        { path: "StudentList", element: <StudentListPage /> },
        { path: "CompanyList", element: <CompanyListPage /> },
        { path: "Internship_JobOffer", element: <InternshipJobOfferPage /> },

        { path: "WorkDetail/:id", element: <WorkDetail /> },
        { path: "VideoDetail/:id", element: <VideoDetail /> },

        //20240619
        { path: "Settings", element: <SettingsPage /> },
        { path: "Settings/ChangeEmail", element: <ChangeEmail /> },
        { path: "Settings/CheckEmail", element: <CheckEmail /> },
        { path: "Editor/:genre", element: <EditorPage /> },
        { path: "CreateForm/:NewsId", element: <CreateFormPage /> },
        { path: "WriteForm/:newsdetail_id", element: <WriteFormPage /> },


        //20240704
        { path: "news_detail/:news_id", element: <NewsDetailPage /> },

        // トップ画面追加
        { path: "Top", element: <TopPage /> },
        // 作品投稿画面
        { path: "WorkPosting", element: <WorkPosting /> },
        // 動画投稿画面
        { path: "VideoPosting", element: <VideoPosting /> },
        // 作品選択画面
        { path: "WorkSelect", element: <WorkSelect /> },
        // 動画選択画面
        { path: "VideoSelect", element: <VideoSelect /> },
        // プロフィール
        // Profile/の後ろにユーザーネームを指定
        { path: "Profile/:user_name", element: <ProfilePage /> },
        { path: "Profile/:user_name/News", element: <ProfileNewsPage /> },
        { path: "Profile/:user_name", element: <SpecialCompanyNewsPage /> },
        //企業が応募フォームを見る画面
        // { path: "Profile/:user_name/Checkform", element: <CheckFormPage /> },

        // チャット
        { path: "Chat", element: <Chat /> },
        // テストページ何か試したいものがあればこのページで行う。
        { path: "TestPage", element: <TestPage /> },
        { path: "follow", element: <Follow /> },
      ],
    },
    {
      path: "404",
      element: <Page404 />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
