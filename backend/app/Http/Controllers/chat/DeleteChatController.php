<?php

namespace App\Http\Controllers\chat;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_chat;
use Illuminate\Support\Facades\Log;


class DeleteChatController extends Controller
{

    public function DeleteChatController(Request $request)
    {
        try {
            // Reactからチャットのidを取得
            $Id = $request->input('Id');

            $ChatId = w_chat::find($Id);
            if ($ChatId) {
                // check_read列を'削除'に変更
                $ChatId->check_read = '削除';
                $ChatId->save();

                $responseData = [
                    'send_user_id' => $ChatId->send_user_id,
                    'get_user_id' => $ChatId->get_user_id,
                ];
                // Reactに返す
                return response()->json($responseData);
            }

        } catch (\Exception $e) {
            Log::error('GetCompanyListController: エラー', ['exception' => $e]);

            // エラーメッセージをJSON形式で返す
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
