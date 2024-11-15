<?php

namespace App\Http\Controllers\search;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_users;

class SearchStudentController extends Controller
{
    /* 学生の検索処理 */
    public function SearchStudentController(Request $request)
    {
        try {
            $page = (int) $request->query('page', 1);
            $perPage = 20; //一ページ当たりのアイテム数
            // すでに取得したデータをスキップするためのオフセット計算
            $offset = ($page - 1) * $perPage;

            // 検索者のIDを取得
            $myId = $request->input('myId', "");

            // 検索文字列を取得
            $searchText = $request->input('searchText', "");

            // 絞り込まれたフォロー状況を配列で取得
            $follow_status_array = $request->input('follow_status', []);

            // 絞り込まれた学校名を配列で取得
            $graduation_year_array = $request->input('graduation_year', []);
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
            // 絞り込まれた希望職種を配列で取得
            $desired_occupation_array = $request->input('desired_occupation', []);
            // 絞り込まれた希望勤務地を配列で取得
            $desired_work_region_array = $request->input('desired_work_region', []);
            // 絞り込まれたプログラミング言語を配列で取得
            $student_programming_language_array = $request->input('student_programming_language', []);
            // 絞り込まれた開発環境を配列で取得
            $student_development_environment_array = $request->input('student_development_environment', []);
            // 絞り込まれたソフトウェアを配列で取得
            $software_array = $request->input('software', []);
            // 絞り込まれた取得資格を配列で取得
            $acquisition_qualification_array = $request->input('acquisition_qualification', []);
            // 絞り込まれた趣味を配列で取得
            $hobby_array = $request->input('hobby', []);

            // \Log::info('SearchStudentController:$student_programming_language_array:');
            // \Log::info($student_programming_language_array);

            $query = w_users::query();

            $query->select(
                'w_users.*',
            );

            // 卒業年で絞り込み
            if (isset($graduation_year_array)) {
                foreach ($graduation_year_array as $graduation_year) {
                    $query->where('w_users.graduation_year', 'REGEXP', '(^|,)' . preg_quote($graduation_year) . '($|,)');
                }
            }

            // 学校名で絞り込み
            if (isset($school_name_array)) {
                foreach ($school_name_array as $school_name) {
                    $query->where('w_users.school_name', 'REGEXP', '(^|,)' . preg_quote($school_name) . '($|,)');
                }
            }

            // 学科名で絞り込み
            if (isset($department_name_array)) {
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

            // 希望職種で絞り込み
            if (isset($desired_occupation_array)) {
                foreach ($desired_occupation_array as $desired_occupation) {
                    $query->where('w_users.desired_occupation', 'REGEXP', '(^|,)' . preg_quote($desired_occupation) . '($|,)');
                }
            }

            // 希望勤務地で絞り込み
            if (isset($desired_work_region_array)) {
                foreach ($desired_work_region_array as $desired_work_region) {
                    $query->where('w_users.desired_work_region', 'REGEXP', '(^|,)' . preg_quote($desired_work_region) . '($|,)');
                }
            }

            // プログラミング言語で絞り込み
            if (isset($student_programming_language_array)) {
                foreach ($student_programming_language_array as $student_programming_language) {
                    $query->where('w_users.programming_language', 'REGEXP', '(^|,)' . preg_quote($student_programming_language) . '($|,)');
                }
            }

            // 開発環境で絞り込み
            if (isset($student_development_environment_array)) {
                foreach ($student_development_environment_array as $student_development_environment) {
                    $query->where('w_users.development_environment', 'REGEXP', '(^|,)' . preg_quote($student_development_environment) . '($|,)');
                }
            }

            // ソフトウェアで絞り込み
            if (isset($software_array)) {
                foreach ($software_array as $software) {
                    $query->where('w_users.software', 'REGEXP', '(^|,)' . preg_quote($software) . '($|,)');
                }
            }

            // 取得資格で絞り込み
            if (isset($acquisition_qualification_array)) {
                foreach ($acquisition_qualification_array as $acquisition_qualification) {
                    $query->where('w_users.acquisition_qualification', 'REGEXP', '(^|,)' . preg_quote($acquisition_qualification) . '($|,)');
                }
            }

            // 趣味で絞り込み
            if (isset($hobby_array)) {
                foreach ($hobby_array as $hobby) {
                    $query->where('w_users.hobby', 'REGEXP', '(^|,)' . preg_quote($hobby) . '($|,)');
                }
            }

            // 検索文字列で絞り込み
            if ($searchText != "") {
                $query->where(function($query) use ($searchText) {
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
                    $query->orWhere('w_users.programming_language', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_users.development_environment', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_users.software', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_users.acquisition_qualification', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_users.desired_work_region', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_users.hobby', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_users.other', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_users.graduation_year', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_users.desired_occupation', 'LIKE', '%' . $searchText . '%');

                    // 苗字と名前セットの場合
                    $query->orWhere(\DB::raw('CONCAT(w_users.student_surname,w_users.student_name)'), 'LIKE', '%' . $searchText . '%');
                    $query->orWhere(\DB::raw('CONCAT(w_users.student_kanasurname,w_users.student_kananame)'), 'LIKE', '%' . $searchText . '%');
                    $query->orWhere(\DB::raw('CONCAT(w_users.student_surname," ",w_users.student_name)'), 'LIKE', '%' . $searchText . '%');
                    $query->orWhere(\DB::raw('CONCAT(w_users.student_kanasurname," ",w_users.student_kananame)'), 'LIKE', '%' . $searchText . '%');
                });
            }

            // フォロー状況で検索
            if(in_array("フォローしている", $follow_status_array) && in_array("フォローされている", $follow_status_array)) {
                // 相互フォローの場合
                $query->join('w_follow as f1', 'w_users.id', '=', 'f1.follow_recipient_id');
                $query->where('f1.follow_sender_id', $myId);
                $query->join('w_follow as f2', 'w_users.id', '=', 'f2.follow_sender_id');
                $query->where('f2.follow_recipient_id', $myId);
            } else if(in_array("フォローしている", $follow_status_array)) {
                // フォローしている場合
                $query->join('w_follow', 'w_users.id', '=', 'w_follow.follow_recipient_id');
                $query->where('w_follow.follow_sender_id', $myId);
            } else if(in_array("フォローされている", $follow_status_array)) {
                // フォローされている場合
                $query->join('w_follow', 'w_users.id', '=', 'w_follow.follow_sender_id');
                $query->where('w_follow.follow_recipient_id', $myId);
            }

            $results = $query->skip($offset)
                ->take($perPage) //件数
                ->get();

            $resultsArray = json_decode(json_encode($results), true);

            // \Log::info('SearchStudentController:$resultsArray:');
            // \Log::info($resultsArray);

            return json_encode($resultsArray);

            // if (count($resultsArray) == 0) {
            //     return json_encode("検索結果0件");
            // } else {
            //     return json_encode($resultsArray);
            // }
        } catch (\Exception $e) {
            \Log::info('SearchStudentController:user_name重複チェックエラー');
            \Log::info($e);
            /*reactに返す*/
            return json_encode($e);
        }
    }
}
