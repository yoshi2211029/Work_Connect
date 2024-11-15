<?php

namespace App\Http\Controllers\register;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_users;
use App\Models\w_company;

class userNameCheckController extends Controller
{
    public function userNameCheckController(Request $request){

        $user_name = $request->input("user_name");
        $kind = $request->input("kind");


        try {
            $userNameExists = w_users::where('user_name', $user_name)->exists();
            $userNameExists2 = w_company::where('user_name', $user_name)->exists();
           
            if(!$userNameExists && !$userNameExists2) {
                echo json_encode("重複なし");
            } else {
                echo json_encode("重複あり");
            }

        } catch (\Exception $e) {
            \Log::info('userNameCheckController:user_name重複チェックエラー');
            \Log::info($e);

            /*reactに返す*/
            echo json_encode($e);
        }
    
    }
}
