<?php

namespace App\Http\Controllers\notice;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_notice;
use Illuminate\Support\Facades\Log;

class GetNoticeController extends Controller
{
    public function GetNoticeController(Request $request)
    {
        try {
            $myId = $request->input('myId');

            $query = w_notice::query();

            if($myId[0] == 'S') {
                $query->select(
                    'w_companies.*',
                    'w_notices.*',
                    // 'w_notices.created_at',
                );
            } else {
                $query->select(
                    'w_users.*',
                    'w_notices.*',
                    // 'w_notices.created_at',
                );
            }

            $query->where('w_notices.get_user_id', $myId);

            if($myId[0] == 'S') {
                $query->join('w_companies', 'w_companies.id', '=', 'w_notices.send_user_id');
            } else {
                $query->join('w_users', 'w_users.id', '=', 'w_notices.send_user_id');
            }

            $query->orderBy('w_notices.created_at', 'asc');

            $noticeData = $query->get();

            return response()->json($noticeData);
        } catch (\Exception $e) {
            Log::error('GetNoticeController: エラー');
            Log::error($e);

            // エラーメッセージをJSON形式で返す
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
