<?php

namespace App\Http\Controllers\register;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\w_pre_user;
use App\Models\w_pre_company;

class preRegisterCheckController extends Controller
{
    public function preRegisterCheckController(Request $request){

        // react側からのリクエスト
        $url_token = $request->input('url_token');
        $kind = $request->input('kind');
        // w_pre_usersテーブルから$url_tokenと一致するユーザー情報を抽出
        if($kind == "s"){
            // 学生側
            $userInfo = DB::table('w_pre_users')
            ->where('urltoken', "$url_token")
            ->where('flag', 0)
            ->first();
        } else {
            // 企業側
            $userInfo = DB::table('w_pre_companies')
            ->where('urltoken', "$url_token")
            ->where('flag', 0)
            ->first();
        }
         

        if($userInfo != null){
            // w_pre_usersテーブルのurltokenと一致した場合、本登録ができる
            // \Log::info('url_token：'.$url_token);
            // \Log::info('url_tokenが存在します');
            // \Log::info("userInfo");
            // \Log::info(json_encode($userInfo));
            
            $arrayUserInfo = json_decode(json_encode($userInfo), true);

            // \Log::info($arrayUserInfo);
            
            $return_json_data = [
                "tf" => "true",
                "email" => "{$arrayUserInfo['mail']}"
            ];
        
            return json_encode($return_json_data);
        } else {
            // w_pre_usersテーブルのurltokenと一致しない場合、本登録はできない
            \Log::info('url_token：'.$url_token);
            \Log::info('url_tokenが正しくありません');
        
            $return_json_data = [
                "tf" => "false",
                "email" => ""
            ];

            return json_encode($return_json_data);
        }
    }
}
