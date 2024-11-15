<?php

namespace App\Http\Controllers\register;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Mail\mailSend;
use App\Models\w_pre_user;
use App\Models\w_pre_company;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;


class pre_registerController extends Controller
{
    //
    public function pre_registerController(Request $request){

        // react側からのリクエスト
        $mail = $request->input('mail');
        $kind = $request->input('kind');
        
        /* w_users.mailもしくはw_companies.mailに$mailがある場合、
           アカウントは作れない */
        $userInfo = DB::table('w_users')
            ->where('mail', $mail)
            ->first();

        $userInfo2 = DB::table('w_companies')
            ->where('mail', $mail)
            ->first();
            
        // w_users.mailかつw_companies.mailがnullの場合
        if($userInfo == null && $userInfo2 == null){

            // w_pre_users,w_pre_companyテーブルから$mailと一致するデータを削除
            w_pre_user::where('mail', "$mail")->delete();
            w_pre_company::where('mail', "$mail")->delete();

            // w_usersテーブルにアドレスが存在しない場合、アカウント作成ができる
            \Log::info('アドレス：'.$mail);
            \Log::info('アカウント作れます');

            if($kind == "s"){
                // 学生側 
                // w_pre_usersテーブルにトークンとメールアドレスを挿入
                        // Eloquentモデルを使用
                        $w_pre_user = w_pre_user::create([
                            'urltoken' => Str::random(60), // urltokenに値を設定
                            'mail' => "$mail", 
                        ]);

                        $details = [
                            'title' => '仮登録ありがとうございます。',
                            'body' => '下記URLをクリックして、本登録を完了させてください。',
                            'url' => 'http://localhost:5174/SignRegistar/?kind=s&urltoken='.$w_pre_user->urltoken
                        ];
                    
                        Mail::to($mail)->send(new mailSend($w_pre_user,$details));
            } else {
                // 企業側
                // w_pre_companyテーブルにトークンとメールアドレスを挿入
                        // Eloquentモデルを使用
                        $w_pre_company = w_pre_company::create([
                            'urltoken' => Str::random(60), // urltokenに値を設定
                            'mail' => "$mail", 
                        ]);

                        $details = [
                            'title' => '仮登録ありがとうございます。',
                            'body' => '下記URLをクリックして、本登録を完了させてください。',
                            'url' => 'http://localhost:5174/SignRegistar/?kind=c&urltoken='.$w_pre_company->urltoken
                        ];
                    
                        Mail::to($mail)->send(new mailSend($w_pre_company,$details));
            }

            
        
            return json_encode("true");
        } else {
            // w_usersテーブルにアドレスが存在する場合、アカウントは作れない
            \Log::info('アドレス：'.$mail);
            \Log::info('アカウント作れません');
        
            return json_encode("false");
        }

        
        
    }

}



