<?php

namespace App\Http\Controllers\settings;

use App\Models\w_users;
use App\Models\w_company;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Mail\mailSend;
use App\Models\w_pre_check_email;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt; // Cryptファサードをインポート

class SettingChangeEmailController extends Controller
{
    public function settingChangeEmail(Request $request)
    {
        $id = $request->input("id");
        $email = $request->input("email");
        \Log::info('ChangeEmaile' . $email);

        // メールを暗号化
        $encryptedEmail = Crypt::encryptString($email);


        try {


            if ($id[0] === "S") {
                // 学生側 

                w_pre_check_email::where("user_id", $id)->delete();

                $w_pre_check_email = w_pre_check_email::create([
                    'user_id' => $id,
                    'urltoken' => Str::random(60), // urltokenに値を設定
                    'mail' => "$encryptedEmail",
                ]);



                $details = [
                    'title' => '【Work&Connect : メールアドレス確認】',
                    'body' => '下記URLをクリックし、メールアドレス変更を完了してください',
                    'url' => 'http://localhost:5174/Settings/CheckEmail/?kind=s&urltoken=' . $w_pre_check_email->urltoken . '&key=' . $encryptedEmail . '&ui=' . $id
                ];

                $w_pre_check_email['mail'] = $email;

                Mail::to($email)->send(new mailSend($w_pre_check_email, $details));

                \Log::info('ChangeEmail STUDENTS');
            } else {
                w_pre_check_email::where("user_id", $id)->delete();

                $w_pre_check_email = w_pre_check_email::create([
                    'user_id' => $id,
                    'urltoken' => Str::random(60), // urltokenに値を設定
                    'mail' => "$encryptedEmail",
                ]);

                $details = [
                    'title' => '【Work&Connect : メールアドレス確認】',
                    'body' => '下記URLをクリックし、メールアドレス変更を完了してください',
                    'url' => 'http://localhost:5174/Settings/CheckEmail/?kind=c&urltoken=' . $w_pre_check_email->urltoken . '&key=' . $encryptedEmail . '&ui=' . $id
                ];

                $w_pre_check_email['mail'] = $email;

                Mail::to($email)->send(new mailSend($w_pre_check_email, $details));

                \Log::info('ChangeEmail COMPANY');
            }


            return json_encode("メールを送信しましたので確認してください");
            \Log::info('ChangeEmailerror' . $encryptedEmail);
        } catch (\Throwable $th) {
            return json_encode("何かの原因でメールを送信できませんでした。再度登録しなおしてください。");
        }
    }
}
