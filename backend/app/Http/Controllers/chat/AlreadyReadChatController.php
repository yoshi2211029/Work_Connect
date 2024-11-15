<?php

namespace App\Http\Controllers\chat;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_chat;
use Illuminate\Support\Facades\Log;


class AlreadyReadChatController extends Controller
{

    public function AlreadyReadChatController(Request $request)
    {
        try {
            // Reactからidを取得
            $MyUserId = $request->input('MyUserId');
            $PairUserId = $request->input('PairUserId');

            /*
            w_chatsテーブルのget_user_idと$PairUserIdが同じかつ、
            w_chatsテーブルのsend_user_idと$MyUserIdが一致するレコードをすべてとりだし、
            未読から既読にする。*/

            w_chat::where('get_user_id', $MyUserId)
            ->where('send_user_id', $PairUserId)
            ->where('check_read', '未読') // "未読"のレコードに絞り込む
            ->update(['check_read' => '既読']); // "既読"に更新

            $responseData = ['send_user_id' => $PairUserId];

            // Reactに返す
            return response()->json($responseData);


        } catch (\Exception $e) {
            Log::error('GetCompanyListController: エラー', ['exception' => $e]);

            // エラーメッセージをJSON形式で返す
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
