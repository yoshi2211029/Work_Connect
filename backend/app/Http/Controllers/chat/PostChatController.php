<?php

namespace App\Http\Controllers\chat;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\w_chat;
use Illuminate\Support\Facades\Log;


class PostChatController extends Controller
{

    public function PostChatController(Request $request)
    {
        try {
            // Reactからログイン中のidを取得
            $MyUserId = $request->input('MyUserId');
            $PairUserId = $request->input('PairUserId');
            $Message = $request->input('Message');

            // 現在の日時を取得
            $sendDateTime = Carbon::now('Asia/Tokyo');

            $responseData = w_chat::create([
                'send_user_id' => $MyUserId,
                'get_user_id' => $PairUserId,
                'message' => $Message,
                'check_read' => "未読",
                'send_datetime' => $sendDateTime,
            ]);
            Log::info(':', ['send_user_id' => $responseData]);
            // Reactに返す
            return response()->json($responseData);


        } catch (\Exception $e) {
            Log::error('GetCompanyListController: エラー', ['exception' => $e]);

            // エラーメッセージをJSON形式で返す
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
