<?php

namespace App\Http\Controllers\notice;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_notice;
use Illuminate\Support\Facades\Log;

class PostNoticeAlreadyReadController extends Controller
{
    public function PostNoticeAlreadyReadController(Request $request)
    {
        try {
            $myId = $request->input('myId');

            $query = w_notice::query();

            $query->where('get_user_id', $myId);

            $query->update(['already_read' => 1]);

            return response()->json("既読処理成功");
        } catch (\Exception $e) {
            Log::error('PostNoticeAlreadyReadController: エラー');
            Log::error($e);

            // エラーメッセージをJSON形式で返す
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
