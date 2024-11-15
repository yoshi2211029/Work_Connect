<?php

namespace App\Http\Controllers\chat;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_chat;
use Illuminate\Support\Facades\Log;


class AllUnreadChatController extends Controller
{

    public function AllUnreadChatController(Request $request)
    {
        try {
            // Reactからidを取得
            $MyUserId = $request->input('MyUserId');

            /*
            w_chatsテーブルのget_user_idと$MyUserIdが一致するレコードをすべてとりだし、
            件数を数える。*/

            $unreadCount = w_chat::where('get_user_id', $MyUserId)
            ->where('check_read', '未読')
            ->count();

            Log::info('未読数は'.$unreadCount.'。idは'.$MyUserId);


            // Reactに返す
            return response()->json($unreadCount);


        } catch (\Exception $e) {
            Log::error('GetCompanyListController: エラー', ['exception' => $e]);

            // エラーメッセージをJSON形式で返す
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
