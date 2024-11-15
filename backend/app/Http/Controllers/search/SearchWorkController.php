<?php

namespace App\Http\Controllers\search;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_works;

class SearchWorkController extends Controller
{
    /* 作品の検索処理 */
    public function SearchWorkController(Request $request)
    {
        try {
            $page = (int) $request->query('page', 1);
            $perPage = 20; //一ページ当たりのアイテム数
            // すでに取得したデータをスキップするためのオフセット計算
            $offset = ($page - 1) * $perPage;

            $sortOption = $request->query('sort');

            // ユーザー名を取得
            $user_name = $request->input('user_name', "");

            // 検索者のIDを取得
            $myId = $request->input('myId', "");

            // 学生プロフィール内の作品一覧かを識別するための情報を取得
            $infoStr = $request->input('info_str', "");

            // 検索文字列を取得
            $searchText = $request->input('searchText', "");

            // 絞り込まれたフォロー状況を配列で取得
            $follow_status_array = $request->input('follow_status', []);

            // 絞り込まれた学校名を配列で取得
            $school_name_array = $request->input('school_name', []);
            // 絞り込まれた学科名を配列で取得
            $department_name_array = $request->input('department_name', []);
            // 絞り込まれた学部名を配列で取得
            $faculty_name_array = $request->input('faculty_name', []);
            // 絞り込まれた専攻名を配列で取得
            $major_name_array = $request->input('major_name', []);
            // 絞り込まれたコース名を配列で取得
            $course_name_array = $request->input('course_name', []);

            // 絞り込まれた作品ジャンルを配列で取得
            $work_genre_array = $request->input('work_genre', []);
            // 絞り込まれたプログラミング言語を配列で取得
            $programming_language_array = $request->input('programming_language', []);
            // 絞り込まれた開発環境を配列で取得
            $development_environment_array = $request->input('development_environment', []);



            $query = w_works::query();

            $query->select(
                'w_users.programming_language AS users_programming_language',
                'w_users.development_environment AS users_development_environment',
                'w_users.other AS users_other',

                'w_users.*',
                'w_works.*',
            );

            // 作品ジャンルで絞り込み
            if (isset($work_genre_array)) {
                foreach ($work_genre_array as $work_genre) {
                    $query->where('w_works.work_genre', 'REGEXP', '(^|,)' . preg_quote($work_genre) . '($|,)');
                }
            }

            // プログラミング言語で絞り込み
            if (isset($programming_language_array)) {
                foreach ($programming_language_array as $programming_language) {
                    $query->where('w_works.programming_language', 'REGEXP', '(^|,)' . preg_quote($programming_language) . '($|,)');
                }
            }

            // 開発環境で絞り込み
            if (isset($development_environment_array)) {
                foreach ($development_environment_array as $development_environment) {
                    $query->where('w_works.development_environment', 'REGEXP', '(^|,)' . preg_quote($development_environment) . '($|,)');
                }
            }

            $query->join('w_users', 'w_works.creator_id', '=', 'w_users.id');

            // ユーザー名で絞り込み
            if ($user_name != "") {
                $query->where('w_users.user_name', $user_name);
            }

            // 学校名で絞り込み
            if (isset($school_name_array)) {
                foreach ($school_name_array as $school_name) {
                    $query->where('w_users.school_name', 'REGEXP', '(^|,)' . preg_quote($school_name) . '($|,)');
                }
            }

            // 学科名で絞り込み
            if (isset($department_name_array)) {
                // \Log::info('SearchWorkController: $department_name_array: ');
                // \Log::info($department_name_array);
                foreach ($department_name_array as $department_name) {
                    $query->where('w_users.department_name', 'REGEXP', '(^|,)' . preg_quote($department_name) . '($|,)');
                }
            }

            // 学部名で絞り込み
            if (isset($faculty_name_array)) {
                foreach ($faculty_name_array as $faculty_name) {
                    $query->where('w_users.faculty_name', 'REGEXP', '(^|,)' . preg_quote($faculty_name) . '($|,)');
                }
            }

            // 専攻名で絞り込み
            if (isset($major_name_array)) {
                foreach ($major_name_array as $major_name) {
                    $query->where('w_users.major_name', 'REGEXP', '(^|,)' . preg_quote($major_name) . '($|,)');
                }
            }

            // コース名で絞り込み
            if (isset($course_name_array)) {
                foreach ($course_name_array as $course_name) {
                    $query->where('w_users.course_name', 'REGEXP', '(^|,)' . preg_quote($course_name) . '($|,)');
                }
            }



            // \Log::info('SearchWorkController:$searchText:');
            // \Log::info($searchText);
            // 検索文字列で絞り込み
            if ($searchText != "") {
                $query->where(function($query) use ($searchText, $infoStr) {
                    // 作品の情報
                    $query->where('w_works.work_genre', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_works.work_name', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_works.work_intro', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_works.programming_language', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_works.development_environment', 'LIKE', '%' . $searchText . '%');

                    // \Log::info('GetWorkListController:$infoStr:');
                    // \Log::info($infoStr);

                    // if(isset($infoStr)) {
                        if($infoStr != "学生プロフィール内作品検索") {
                            // 学生の情報
                            $query->orWhere('w_users.user_name', 'LIKE', '%' . $searchText . '%');
                            $query->orWhere('w_users.student_surname', 'LIKE', '%' . $searchText . '%');
                            $query->orWhere('w_users.student_name', 'LIKE', '%' . $searchText . '%');
                            $query->orWhere('w_users.student_kanasurname', 'LIKE', '%' . $searchText . '%');
                            $query->orWhere('w_users.student_kananame', 'LIKE', '%' . $searchText . '%');
                            $query->orWhere('w_users.school_name', 'LIKE', '%' . $searchText . '%');
                            $query->orWhere('w_users.department_name', 'LIKE', '%' . $searchText . '%');
                            $query->orWhere('w_users.faculty_name', 'LIKE', '%' . $searchText . '%');
                            $query->orWhere('w_users.major_name', 'LIKE', '%' . $searchText . '%');
                            $query->orWhere('w_users.course_name', 'LIKE', '%' . $searchText . '%');

                            // 苗字と名前セットの場合
                            $query->orWhere(\DB::raw('CONCAT(w_users.student_surname,w_users.student_name)'), 'LIKE', '%' . $searchText . '%');
                            $query->orWhere(\DB::raw('CONCAT(w_users.student_kanasurname,w_users.student_kananame)'), 'LIKE', '%' . $searchText . '%');
                            $query->orWhere(\DB::raw('CONCAT(w_users.student_surname," ",w_users.student_name)'), 'LIKE', '%' . $searchText . '%');
                            $query->orWhere(\DB::raw('CONCAT(w_users.student_kanasurname," ",w_users.student_kananame)'), 'LIKE', '%' . $searchText . '%');
                        }
                    // }
                });
            }

            // フォロー状況で検索
            if(in_array("フォローしている", $follow_status_array) && in_array("フォローされている", $follow_status_array)) {
                // 相互フォローの場合
                $query->join('w_follow as f1', 'w_works.creator_id', '=', 'f1.follow_recipient_id');
                $query->where('f1.follow_sender_id', $myId);
                $query->join('w_follow as f2', 'w_works.creator_id', '=', 'f2.follow_sender_id');
                $query->where('f2.follow_recipient_id', $myId);
            } else if(in_array("フォローしている", $follow_status_array)) {
                // フォローしている場合
                $query->join('w_follow', 'w_works.creator_id', '=', 'w_follow.follow_recipient_id');
                $query->where('w_follow.follow_sender_id', $myId);
            } else if(in_array("フォローされている", $follow_status_array)) {
                // フォローされている場合
                $query->join('w_follow', 'w_works.creator_id', '=', 'w_follow.follow_sender_id');
                $query->where('w_follow.follow_recipient_id', $myId);
            }

            if ($sortOption === 'orderNewPostsDate') {
                $query->orderBy('w_works.created_at', 'DESC');
            }
            if ($sortOption === 'orderOldPostsDate') {
                $query->orderBy('w_works.created_at', 'ASC');
            }
            $workList = $query->skip($offset)
                ->take($perPage) //件数
                ->get();


            $resultsArray = json_decode(json_encode($workList), true);

            // \Log::info('SearchWorkController:$resultsArray:');
            // \Log::info($resultsArray);
            // \Log::info('SearchWorkController:$sortOption:');
            // \Log::info($sortOption);

            return json_encode($resultsArray);
            // if (count($resultsArray) == 0) {
            //     return json_encode("検索結果は0件です");
            // } else {
            //     return json_encode($resultsArray);p
            // }
        } catch (\Exception $e) {
            \Log::info('SearchWorkController:エラー');
            \Log::info($e);
            /*reactに返す*/
            return json_encode($e);
        }
    }
}
