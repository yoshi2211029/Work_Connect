<?php

namespace App\Http\Controllers\register;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_users;
use App\Models\w_pre_user;
use App\Models\w_company;
use App\Models\w_pre_company;

class registerController extends Controller
{
    public function registerController(Request $request){

        $kind = $request->input("kind");

        if($kind == "s"){

        /// 学生側 ここから ////////////////////////////////////////////////////////////////////////////////

            // idの初期値セット
            $id = "";

            $requestData = $request['sessionData'];

            /* 学生アカウント新規登録のデータをリクエストから取得 */
            // メールアドレス
            \Log::info('$requestData');
            \Log::info($requestData);
            $mail = $requestData['mail'];
            // ユーザー名
            $user_name = $requestData['user_name'];
            // パスワード
            $password = $requestData['password'];
            // 苗字
            $student_surname = $requestData['student_surname'];
            // 名前
            $student_name = $requestData['student_name'];
            // フリガナ苗字
            $student_kanasurname = $requestData['student_kanasurname'];
            // フリガナ名前
            $student_kananame = $requestData['student_kananame'];
            // 学校名
            $school_name = $requestData['school_name'];
            // 学科名
            $department_name = $requestData['department_name'];
            // 学部名
            $faculty_name = $requestData['faculty_name'];
            // 専攻名
            $major_name = $requestData['major_name'];
            // コース名
            $course_name = $requestData['course_name'];
            // 出身地
            $user_from = $requestData['user_from'];
            // プログラミング言語
            $programming_language = $requestData['programming_language'];
            // 開発環境
            $development_environment = $requestData['development_environment'];
            // ソフトウェア
            $software = $requestData['software'];
            // 取得資格
            $acquisition_qualification = $requestData['acquisition_qualification'];
            // 希望勤務地
            $desired_work_region = $requestData['desired_work_region'];
            // 趣味
            $hobby = $requestData['hobby'];
            // その他
            $other = $requestData['other'];
            // 卒業年
            $graduation_year = $requestData['graduation_year'];
            // 希望職種
            $desired_occupation = $requestData['desired_occupation'];

            /* 学生アカウントのID生成 */
            try {
                // ユーザー名重複チェック

                $userNameDuplicateCheck = w_users::where('user_name', $user_name)->exists();
                // idが存在しなかった場合にフラグをtrueにする
                if($userNameDuplicateCheck) {
                    return json_encode("ユーザーネームが重複しています。");
                } 

                // フラグをセット
                $flg = false;

                // 重複しないidが生成されるまでループ
                while(!$flg) {
                    // 12桁(0埋め有)のランダムな数値を生成
                    $randNum = str_pad(rand(1, 999999999999), 12, 0, STR_PAD_LEFT);

                    // id用に「S_」を前に付ける
                    $id = "S_" . "$randNum";

                    // w_usersテーブルに同じidのデータが存在するかチェック
                    // idが存在すればtrue、存在しなければfalse
                    $idExists = w_users::where('id', $id)->exists();

                    // idが存在しなかった場合にフラグをtrueにする
                    if(!$idExists) {
                        $flg = true;
                    }
                }

                \Log::info('registerController:id重複チェック');
                \Log::info($id);
            } catch (\Exception $e) {
                \Log::info('registerController:id重複チェックエラー');
                \Log::info($e);

                /*reactに返す*/
                echo json_encode($e);
            }

            /* DBにデータを登録 */
            if(!empty($mail)){
                try {
                    // w_usersにデータをINSERT
                    w_users::create([
                        'id' => $id,
                        'student_surname' => $student_surname,
                        'student_name' => $student_name,
                        'student_kanasurname' => $student_kanasurname,
                        'student_kananame' => $student_kananame,
                        'user_name' => $user_name,
                        'school_name' => $school_name,
                        'department_name' => $department_name,
                        'faculty_name' => $faculty_name,
                        'major_name' => $major_name,
                        'course_name' => $course_name,
                        'password' => $password,
                        'mail' => $mail,
                        'user_from' => $user_from,
                        'programming_language' => $programming_language,
                        'development_environment' => $development_environment,
                        'software' => $software,
                        'acquisition_qualification' => $acquisition_qualification,
                        'desired_work_region' => $desired_work_region,
                        'hobby' => $hobby,
                        'other' => $other,
                        'graduation_year' => $graduation_year,
                        'desired_occupation' => $desired_occupation,
                    ]);

                    // w_pre_usersテーブルのflgを0から1にUPDATEする
                    w_pre_user::where('mail', $mail)->update(['flag' => 1]);

                    \Log::info('新規登録データのDB保存処理成功');

                    /*reactに返す*/

                    $data = [
                        'message' => '新規登録データのDB保存処理成功',
                        'id' => $id,
                        'user_name' => $user_name,
                        'mail' => $mail,
                        'icon' => "cover_19.jpg",
                    ];
                    echo json_encode($data);

                } catch (\Exception $e) {

                    \Log::info('registerController:新規登録データのDB保存処理エラー');
                    \Log::info($e);

                    /*reactに返す*/
                    echo json_encode($e);
                }
            } else {
                \Log::info('registerController:INSERTエラー');

                /*reactに返す*/
                echo json_encode('「mail」が送られていません');
            }

        /// 学生側 ここまで ////////////////////////////////////////////////////////////////////////////////

        } else if($kind == "c"){

        /// 企業側 ここから ////////////////////////////////////////////////////////////////////////////////

        // idの初期値セット
        $c_id = "";

        $c_requestData = $request['sessionData'];

        /* 企業アカウント新規登録のデータをリクエストから取得 */
        // メールアドレス
        \Log::info('$c_requestData');
        \Log::info($c_requestData);
        $c_mail = $c_requestData['mail'];
        // ユーザー名
        $c_user_name = $c_requestData['user_name'];
        // パスワード
        $c_password = $c_requestData['password'];
        // 企業名
        $c_company_name = $c_requestData['company_name'];
        // 企業名(カナ)
        $c_company_nameCana = $c_requestData['company_nameCana'];
        // 職種
        $c_selectedOccupation = $c_requestData['selectedOccupation'];
        // 勤務地
        $c_Prefecture = $c_requestData['Prefecture'];
        // ホームページURL
        $c_HP_URL = $c_requestData['HP_URL'];



        /* 企業アカウントのID生成 */
        try {
            // フラグをセット
            $c_flg = false;

            // 重複しないidが生成されるまでループ
            while(!$c_flg) {
                // 12桁(0埋め有)のランダムな数値を生成
                $c_randNum = str_pad(rand(1, 999999999999), 12, 0, STR_PAD_LEFT);

                // id用に「C_」を前に付ける
                $c_id = "C_" . "$c_randNum";

                // w_usersテーブルに同じidのデータが存在するかチェック
                // idが存在すればtrue、存在しなければfalse
                $c_idExists = w_company::where('id', $c_id)->exists();

                // idが存在しなかった場合にフラグをtrueにする
                if(!$c_idExists) {
                    $c_flg = true;
                }
            }

            \Log::info('registerController:id重複チェック');
            \Log::info($c_id);
        } catch (\Exception $e) {
            \Log::info('registerController:id重複チェックエラー');
            \Log::info($e);

            /*reactに返す*/
            echo json_encode($e);
        }

        /* DBにデータを登録 */
        if(!empty($c_mail)){
            try {
                // w_usersにデータをINSERT
                w_company::create([
                    'id' => $c_id,
                    'mail' => $c_mail,
                    'user_name' => $c_user_name,
                    'password' => $c_password,
                    'company_name' => $c_company_name,
                    'company_nameCana' => $c_company_nameCana,
                    'selectedOccupation' => $c_selectedOccupation,
                    'Prefecture' => $c_Prefecture,
                    'hp_url' => $c_HP_URL,
                ]);

                // w_pre_usersテーブルのflgを0から1にUPDATEする
                w_pre_company::where('mail', $c_mail)->update(['flag' => 1]);

                \Log::info('新規登録データのDB保存処理成功');

                $c_data = [
                    'message' => '新規登録データのDB保存処理成功',
                    'id' => $c_id,
                    'user_name' => $c_user_name,
                    'mail' => $c_mail,
                    'icon' => "cover_19.jpg",
                ];
                echo json_encode($c_data);


            } catch (\Exception $e) {

                \Log::info('registerController:新規登録データのDB保存処理エラー');
                \Log::info($e);

                /*reactに返す*/
                echo json_encode($e);
            }
        } else {
            \Log::info('registerController:INSERTエラー');

            /*reactに返す*/
            echo json_encode('「mail」が送られていません');
        }

        /// 企業側 ここまで ////////////////////////////////////////////////////////////////////////////////

        } else {
            \Log::info("kindが空です");
        }
    }
}
