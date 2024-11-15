<?php

namespace App\Http\Controllers\notice;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_notice;
use Illuminate\Support\Facades\Log;

class PostNoticeDeleteController extends Controller
{
    public function PostNoticeDeleteController(Request $request)
    {
        try {
            $noticeId = $request->input('noticeId', "");

            $query = w_notice::query();

            $query->where('id', $noticeId);

            $query->delete();

            // Log::info('PostNoticeDeleteController: 通知削除処理成功');
            return response()->json("通知削除処理成功");
        } catch (\Exception $e) {
            Log::error('PostNoticeDeleteController: エラー');
            Log::error($e);

            // エラーメッセージをJSON形式で返す
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
