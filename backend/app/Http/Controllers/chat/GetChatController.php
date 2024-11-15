<?php

namespace App\Http\Controllers\chat;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_chat;
use Illuminate\Support\Facades\Log;


class GetChatController extends Controller
{

    public function GetChatController(Request $request)
    {
        try {
            // Reactからログイン中のidを取得
            $MyUserId = $request->input('MyUserId');
            $PairUserId = $request->input('PairUserId');

            \Log::info('MyUserIdは: ' . $MyUserId);
            \Log::info('PairUserIdは: ' . $PairUserId);

            $chat_list = w_chat::where(function($query) use ($MyUserId, $PairUserId) {
                $query->where('send_user_id', $MyUserId)
                      ->where('get_user_id', $PairUserId);
            })->orWhere(function($query) use ($MyUserId, $PairUserId) {
                $query->where('send_user_id', $PairUserId)
                      ->where('get_user_id', $MyUserId);
            })->get();

            if ($chat_list->isEmpty()) {
                // チャットリストが空の場合の処理
                Log::error('Chat list is empty.');
                return response()->json("null");
            }

            // 正常に結果が得られた場合の処理
             \Log::info('$chat_list: ' . $chat_list);


            if($chat_list){
                // Reactに返す
                return response()->json($chat_list);
            }

        } catch (\Exception $e) {
            Log::error('GetCompanyListController: エラー', ['exception' => $e]);

            // エラーメッセージをJSON形式で返す
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
