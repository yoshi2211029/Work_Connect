<?php

namespace App\Http\Controllers\notice;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_notice;
use Illuminate\Support\Facades\Log;

class PostSelectNoticeDeleteController extends Controller
{
    public function PostSelectNoticeDeleteController(Request $request)
    {
        try {
            $noticeIdArray = $request->input('noticeIdArray', []);

            $query = w_notice::query();

            foreach($noticeIdArray as $noticeId) {
                $query->orWhere('id', $noticeId);
            }

            $query->delete();

            Log::info('PostSelectNoticeDeleteController: 通知削除処理成功');
            return response()->json("通知削除処理成功");
        } catch (\Exception $e) {
            Log::error('PostSelectNoticeDeleteController: エラー');
            Log::error($e);

            // エラーメッセージをJSON形式で返す
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
