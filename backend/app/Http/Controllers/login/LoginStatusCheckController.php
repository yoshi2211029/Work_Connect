<?php

namespace App\Http\Controllers\login;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_users;
use App\Models\w_company;

class LoginStatusCheckController extends Controller
{
    public function LoginStatusCheckController(Request $request)
    {
        // idを取得 
        $id = $request->input('id');
        // \Log::info('LoginStatusCheckController: $id: ');
        // \Log::info($id);

        // idの一文字目を取得
        $kind = substr($id, 0, 1);
        // \Log::info('LoginStatusCheckController: $kind: ');
        // \Log::info($kind);

        // Reactに返す時用の変数を宣言
        $accountCheckString = "";

        try {
            // idの一文字目が「S」か「C」かを判断
            if ($kind == "S") {
                $accountCheck = w_users::where('id', $id)->exists();
            } else if ($kind == "C") {
                $accountCheck = w_company::where('id', $id)->exists();
            } else {
                \Log::info('LoginStatusCheckController: $kindがSでもCでもない');
                $accountCheck = false;
            }

            // trueかfalseをセット
            if ($accountCheck) {
                $accountCheckString = "true";
            } else {
                $accountCheckString = "false";
            }

            // \Log::info('LoginStatusCheckController: $accountCheckString');
            // \Log::info($accountCheckString);

            // Reactに結果を返す
            echo json_encode($accountCheckString);
        } catch (\Exception $e) {
            // \Log::info('LoginStatusCheckControllerエラー: ');
            // \Log::info($e);
            // Reactに結果を返す
            echo json_encode($e);
        }
    }
}
