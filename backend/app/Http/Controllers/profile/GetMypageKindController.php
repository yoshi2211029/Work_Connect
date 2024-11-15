<?php

namespace App\Http\Controllers\profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_users;
use App\Models\w_company;

class GetMypageKindController extends Controller
{
    public function GetMypageKindController(Request $request)
    {
        try {
            // どちらかのProfileUserNameを取得
            $profileUserName = $request->input('ProfileUserName');

            \Log::info("profileUserName:".$profileUserName);

            $student_user_check = w_users::where('user_name', $profileUserName)->get();
            $company_user_check = w_company::where('user_name', $profileUserName)->get();
            \Log::info("student_user_check:".$student_user_check);
            \Log::info("company_user_check:".$company_user_check);
            if(count($student_user_check) > 0){
                // 受け取ったデータが学生だった場合
                return json_encode("s");
            } else if (count($company_user_check) > 0){
                // 受け取ったデータが企業だった場合
                return json_encode("c");
            } else {
                return json_encode("");
                \Log::info("ユーザーが見つかりませんでした。");
            }

        } catch (\Exception $e) {
            \Log::info('GetMypageKindController:user_name重複チェックエラー');
            \Log::info($e);

            /*reactに返す*/
            return json_encode("");
        }
    }
}