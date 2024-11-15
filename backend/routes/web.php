
<?php

use App\Http\Controllers\movie\PostMovieCommentDeleteController;
use App\Http\Controllers\movie\PostMovieCommentPostController;
use App\Http\Controllers\movie\PostMovieCommentSaveController;
use App\Http\Controllers\tag\GetStudentCourseNameTagController;
use App\Http\Controllers\tag\GetStudentDepartmentNameTagController;
use App\Http\Controllers\tag\GetStudentFacultyNameTagController;
use App\Http\Controllers\tag\GetStudentMajorNameTagController;
use App\Http\Controllers\work\PostWorkCommentPostController;
use App\Http\Controllers\work\PostWorkCommentSaveController;
use App\Http\Controllers\work\PostWorkCommentDeleteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Route;


use App\Http\Controllers\ListController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\CompanyInformationController;
use App\Http\Controllers\settings\SettingChangeEmailController;
use App\Http\Controllers\settings\SettingCheckEmailController;
use App\Http\Controllers\login\loginController;
use App\Http\Controllers\login\LoginStatusCheckController;
use App\Http\Controllers\register\pre_registerController;
use App\Http\Controllers\register\preRegisterCheckController;
use App\Http\Controllers\register\registerController;
use App\Http\Controllers\register\userNameCheckController;
use App\Http\Controllers\work\GetWorkListController;
use App\Http\Controllers\movie\GetMovieListController;
use App\Http\Controllers\work\GetWorkDetailController;
use App\Http\Controllers\movie\GetMovieDetailController;
use App\Http\Controllers\student\GetStudentListController;
use App\Http\Controllers\company\GetCompanyListController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\follow\FollowController;
use App\Http\Controllers\follow\FollowCheckController;
use App\Http\Controllers\chat\GetChannelListController;
use App\Http\Controllers\chat\GetChatController;
use App\Http\Controllers\chat\PostChatController;
use App\Http\Controllers\chat\EditChatController;
use App\Http\Controllers\chat\DeleteChatController;
use App\Http\Controllers\chat\AlreadyReadChatController;
use App\Http\Controllers\chat\UpdateChatController;
use App\Http\Controllers\chat\AllUnreadChatController;
use App\Http\Controllers\tag\InsertTagController;
use App\Http\Controllers\tag\GetGenreTagController;
use App\Http\Controllers\tag\GetLanguageTagController;
use App\Http\Controllers\tag\GetEnvironmentTagController;
use App\Http\Controllers\movie\VideoPostingController;
use App\Http\Controllers\tag\GetVideoGenreTagController;
use App\Http\Controllers\tag\GetStudentProgrammingLanguageTagController;
use App\Http\Controllers\tag\GetStudentDevelopmentEnvironmentTagController;
use App\Http\Controllers\tag\GetStudentSoftwareTagController;
use App\Http\Controllers\tag\GetStudentAcquisitionQualificationTagController;
use App\Http\Controllers\tag\GetStudentHobbyTagController;
use App\Http\Controllers\tag\GetStudentDesiredOccupationTagController;
use App\Http\Controllers\tag\GetStudentDesiredWorkRegionTagController;
use App\Http\Controllers\tag\GetCompanyPrefectureTagController;
use App\Http\Controllers\tag\GetCompanySelectedOccupationTagController;
use App\Http\Controllers\tag\GetCompanyIndustryTagController;
use App\Http\Controllers\tag\GetCompanyDevelopmentEnvironmentTagController;
use App\Http\Controllers\tag\GetCompanyProgrammingLanguageTagController;
use App\Http\Controllers\tag\GetCompanyAcquisitionQualificationTagController;
use App\Http\Controllers\tag\GetCompanySoftwareTagController;
use App\Http\Controllers\tag\GetCompanyNameListController;
use App\Http\Controllers\work\WorkPostingController;
use App\Http\Controllers\search\SearchWorkController;
use App\Http\Controllers\search\SearchVideoController;
use App\Http\Controllers\search\SearchStudentController;
use App\Http\Controllers\search\SearchCompanyController;
use App\Http\Controllers\search\SearchInternshipJobOfferController;
use App\Http\Controllers\profile\GetMypageController;
use App\Http\Controllers\profile\PostMypageController;
use App\Http\Controllers\profile\GetMypageKindController;
use App\Http\Controllers\notice\GetNoticeController;
use App\Http\Controllers\notice\PostNoticeAlreadyReadController;
use App\Http\Controllers\notice\PostNoticeDeleteController;
use App\Http\Controllers\notice\PostSelectNoticeDeleteController;


// トップ画面
Route::get('/', function () {
    return view('welcome');
});

// /list
// Route::get('list',[ListController::class, 'index']);
// =======

// プロフィールのマイページ(get)
Route::get('/get_profile_mypage', [GetMypageController::class, 'GetMypageController']);
// プロフィールのマイページ(post)
Route::post('/post_profile_mypage', [PostMypageController::class, 'PostMypageController']);
// 企業プロフィールのマイページ(post)
Route::post('/company_post_profile_mypage', [PostMypageController::class, 'CompanyPostMypageController']);
// プロフィールのマイページ画像(post)
Route::post('/post_profile_mypage_upload', [PostMypageController::class, 'UploadImageController']);
// プロフィールのマイページルーティング設定(get)
Route::get('/get_profile_mypage_kind', [GetMypageKindController::class, 'GetMypageKindController']);

/* 検索 */
// 作品検索
Route::get('/search_work', [SearchWorkController::class, 'SearchWorkController']);
// 動画検索
Route::get('/search_video', [SearchVideoController::class, 'SearchVideoController']);
// 学生検索
Route::get('/search_student', [SearchStudentController::class, 'SearchStudentController']);
// 企業検索
Route::get('/search_company', [SearchCompanyController::class, 'SearchCompanyController']);
// 求人・インターンシップ検索
Route::get('/search_internship_job_offer', [SearchInternshipJobOfferController::class, 'SearchInternshipJobOfferController']);

/* タグ関係 */
// タグ作成
Route::post('/insert_tag', [InsertTagController::class, 'InsertTagController']);
// 作品ジャンルタグ取得
Route::get('/get_work_genre_tag', [GetGenreTagController::class, 'GetGenreTagController']);
// 作品のプログラミング言語タグ取得
Route::get('/get_work_language_tag', [GetLanguageTagController::class, 'GetLanguageTagController']);
// 作品の開発環境タグ取得
Route::get('/get_work_environment_tag', [GetEnvironmentTagController::class, 'GetEnvironmentTagController']);
// 動画投稿
Route::post('/video_posting', [VideoPostingController::class, 'VideoPostingController']);
// 動画ジャンルタグ取得
Route::get('/get_video_genre_tag', [GetVideoGenreTagController::class, 'GetVideoGenreTagController']);

// 学生の学部名タグ取得
Route::get('/get_student_faculty_name_tag', [GetStudentFacultyNameTagController::class, 'GetStudentFacultyNameTagController']);
// 学生の学科名タグ取得
Route::get('/get_student_department_name_tag', [GetStudentDepartmentNameTagController::class, 'GetStudentDepartmentNameTagController']);
// 学生の専攻名タグ取得
Route::get('/get_student_major_name_tag', [GetStudentMajorNameTagController::class, 'GetStudentMajorNameTagController']);
// 学生のコース名タグ取得
Route::get('/get_student_course_name_tag', [GetStudentCourseNameTagController::class, 'GetStudentCourseNameTagController']);
// 学生の開発環境タグ取得
Route::get('/get_student_development_environment_tag', [GetStudentDevelopmentEnvironmentTagController::class, 'GetStudentDevelopmentEnvironmentTagController']);
// 学生の趣味タグ取得
Route::get('/get_student_hobby_tag', [GetStudentHobbyTagController::class, 'GetStudentHobbyTagController']);
// 学生の希望勤務地タグ取得
Route::get('/get_student_prefecture_tag', [GetStudentDesiredWorkRegionTagController::class, 'GetStudentDesiredWorkRegionTagController']);
// 学生の希望職種タグ取得
Route::get('/get_student_desired_occupation_tag', [GetStudentDesiredOccupationTagController::class, 'GetStudentDesiredOccupationTagController']);
// 学生のプログラミング言語タグ取得
Route::get('/get_student_programming_language_tag', [GetStudentProgrammingLanguageTagController::class, 'GetStudentProgrammingLanguageTagController']);
// 学生の取得資格タグ取得
Route::get('/get_student_acquisition_qualification_tag', [GetStudentAcquisitionQualificationTagController::class, 'GetStudentAcquisitionQualificationTagController']);
// 学生のソフトウェアタグ取得
Route::get('/get_student_software_tag', [GetStudentSoftwareTagController::class, 'GetStudentSoftwareTagController']);

// 企業の勤務地タグ取得
Route::get('/get_company_prefecture_tag', [GetCompanyPrefectureTagController::class, 'GetCompanyPrefectureTagController']);
// 企業の社員の職種・募集職種タグ取得
Route::get('/get_company_selected_occupation_tag', [GetCompanySelectedOccupationTagController::class, 'GetCompanySelectedOccupationTagController']);
// 企業の業界キーワードタグ取得
Route::get('/get_company_industry_tag', [GetCompanyIndustryTagController::class, 'GetCompanyIndustryTagController']);
// 企業の開発環境タグ取得
Route::get('/get_company_development_environment_tag', [GetCompanyDevelopmentEnvironmentTagController::class, 'GetCompanyDevelopmentEnvironmentTagController']);
// 企業のプログラミング言語タグ取得
Route::get('/get_company_programming_language_tag', [GetCompanyProgrammingLanguageTagController::class, 'GetCompanyProgrammingLanguageTagController']);
// 企業の社員が取得している資格・取得支援資格・歓迎資格・必須資格タグ取得
Route::get('/get_company_acquisition_qualification_tag', [GetCompanyAcquisitionQualificationTagController::class, 'GetCompanyAcquisitionQualificationTagController']);
// 企業のソフトウェアタグ取得
Route::get('/get_company_software_tag', [GetCompanySoftwareTagController::class, 'GetCompanySoftwareTagController']);

// 企業名一覧を取得
Route::get('/get_company_name_list', [GetCompanyNameListController::class, 'GetCompanyNameListController']);

// 作品投稿
Route::post('/work_posting', [WorkPostingController::class, 'store']);
// ログイン状態のチェック
Route::post('/login_status_check', [LoginStatusCheckController::class, 'LoginStatusCheckController']);

// 作品一覧取得
Route::get('/get_work_list', [GetWorkListController::class, 'GetWorkListController']);
// 動画一覧取得
Route::get('/get_movie_list', [GetMovieListController::class, 'GetMovieListController']);
// 学生一覧取得
Route::get('/get_student_list', [GetStudentListController::class, 'GetStudentListController']);
// 企業一覧取得

Route::get('/get_company_list/{id}', [GetCompanyListController::class, 'GetCompanyListController']);

Route::get('/get_company_list', [GetCompanyListController::class, 'GetCompanyListController']);


// 作品詳細取得
Route::get('/get_work_detail', [GetWorkDetailController::class, 'GetWorkDetailController']);
// 動画詳細取得
Route::get('/get_movie_detail', [GetMovieDetailController::class, 'GetMovieDetailController']);
// // 学生詳細取得
// Route::get('/get_student_list',[GetStudentListController::class, 'GetStudentListController']);
// // 企業詳細取得
// Route::get('/get_company_list',[GetCompanyListController::class, 'GetCompanyListController']);
// >>>>>>> f74bb114622c2917b98d0449d67e8b7e25daac84

// 作品コメント投稿
Route::post('/post_work_comment_post', [PostWorkCommentPostController::class, 'PostWorkCommentPostController']);
// 作品コメント更新
Route::post('/post_work_comment', [PostWorkCommentSaveController::class, 'PostWorkCommentSaveController']);
// 作品コメント削除
Route::post('/post_work_comment_delete', [PostWorkCommentDeleteController::class, 'PostWorkCommentDeleteController']);

// 動画コメント投稿
Route::post('/post_movie_comment_post', [PostMovieCommentPostController::class, 'PostMovieCommentPostController']);
// 動画コメント更新
Route::post('/post_movie_comment', [PostMovieCommentSaveController::class, 'PostMovieCommentSaveController']);
// 動画コメント削除
Route::post('/post_movie_comment_delete', [PostMovieCommentDeleteController::class, 'PostMovieCommentDeleteController']);

// フォロー
Route::post('/follow', [FollowController::class, 'FollowController']);


// フォローチェック
Route::post('/followCheck', [FollowCheckController::class, 'FollowCheckController']);


// チャット相手取得
Route::get('/get_channel_list', [GetChannelListController::class, 'GetChannelListController']);
// チャット取得
Route::get('/get_chat', [GetChatController::class, 'GetChatController']);
// チャット送信
Route::post('/post_chat', [PostChatController::class, 'PostChatController']);
// チャット編集
Route::post('/edit_chat', [EditChatController::class, 'EditChatController']);
// チャット削除
Route::post('/delete_chat', [DeleteChatController::class, 'DeleteChatController']);
// チャット既読
Route::post('/already_read_chat', [AlreadyReadChatController::class, 'AlreadyReadChatController']);
// チャット更新
Route::post('/update_chat', [UpdateChatController::class, 'UpdateChatController']);
// チャット未読数取得
Route::get('/all_unread_chat', [AllUnreadChatController::class, 'AllUnreadChatController']);


// 通知取得
Route::get('/get_notice', [GetNoticeController::class, 'GetNoticeController']);
// 未読通知を既読にする
Route::post('/post_notice_already_read', [PostNoticeAlreadyReadController::class, 'PostNoticeAlreadyReadController']);
// 一つの通知を削除する
Route::post('/post_notice_delete', [PostNoticeDeleteController::class, 'PostNoticeDeleteController']);
// 選択した通知を削除する
Route::post('/post_select_notice_delete', [PostSelectNoticeDeleteController::class, 'PostSelectNoticeDeleteController']);

Route::get('/user_name_check', [userNameCheckController::class, 'userNameCheckController']);

Route::get('/s_pre_register_check', [preRegisterCheckController::class, 'preRegisterCheckController']);

Route::get('/s_register', [registerController::class, 'registerController']);

Route::get('/list', [ListController::class, 'DB_connection']);
Route::post('/list', [ListController::class, 'DB_connection']);

Route::get('/s_login', [loginController::class, 'loginController']);
Route::get('/s_pre_register', [pre_registerController::class, 'pre_registerController']);


//ニュース編集・投稿・閲覧機能
Route::post('/news_save', [EditorController::class, 'news_save']);
Route::post('/news_upload', [EditorController::class, 'news_upload']);
Route::post('/thumbnail_image_save', [EditorController::class, 'thumbnail_image_save']);
Route::post('/contents_image_save', [EditorController::class, 'contents_image_save']);
Route::post('/contents_url_image_save', [EditorController::class, 'contents_url_image_save']);
Route::get('/news_draft_list/{id}', [EditorController::class, 'news_draft_list']);
Route::get('/Internship_JobOffer/{id}/{category}', [NewsController::class, 'all_news_get']);
Route::get('/Internship_JobOffer/special_company_news/{username}/{Myid}/{genre}', [NewsController::class, 'special_company_news']);
Route::get('/special_forms/{CompanyId}', [NewsController::class, 'special_forms']);
Route::get('/news_detail/{newsdetail_id}', [NewsController::class, 'news_detail_get']);
Route::post('/news_bookmark', [NewsController::class, 'news_bookmark']);
Route::get('/thumbnail_img_delete/{id}', [EditorController::class, 'thumbnail_img_delete']);
Route::get('/api/embed', action: [EditorController::class, 'embed']);

//企業の詳細情報を取得
Route::get('/company_informations/{CompanyName}', action: [CompanyInformationController::class, 'company_informations']);
Route::post('/company_informations_save', action: [CompanyInformationController::class, 'company_informations_save']);
Route::post('/all_company_informations_pull', action: [CompanyInformationController::class, 'all_company_informations_pull']);


//応募用フォーム作成機能
Route::post('/create_form_save', [FormController::class, 'create_form_save']);
Route::get('/create_form_get/{NewsDetailId}', [FormController::class, 'create_form_get']);
Route::get('/write_form_get/{NewsDetailId}', [FormController::class, 'write_form_get']);
Route::post('/write_form_save', [FormController::class, 'write_form_save']);


//設定機能
Route::get('/color_save', [SettingController::class, 'color_save']);

//設定メールアドレス変更
Route::post('/change_email', [SettingChangeEmailController::class, 'settingChangeEmail']);

//設定メールアドレス変更確認
Route::post('/check_email', [SettingCheckEmailController::class, 'settingCheckEmail']);

// ミドルウェア
Route::group(['middleware' => ['api', 'cors']], function () {
    Route::options('articles', function () {
        return response()->json();
    });
    Route::resource('articles', 'Api\ArticlesController');
});

// 新しいエンドポイントを作成し、CSRFトークンを返す
Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});



Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('{any}', function () {

    return view('app');
})->where('any', '.*');
