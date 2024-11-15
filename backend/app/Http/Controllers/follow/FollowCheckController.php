<?php

namespace App\Http\Controllers\follow;

use App\Http\Controllers\Controller;
use App\Models\w_follow;
use Illuminate\Http\Request;

class FollowCheckController extends Controller
{
    public function FollowCheckController(Request $request)
    {

        // react側からのリクエスト
        $sender_id = $request->input('sender_id');
        $recipient_id = $request->input('recipient_id');

        $isFollowing = w_follow::where('follow_sender_id', $sender_id)
            ->where('follow_recipient_id', $recipient_id)
            ->exists();

        $isFollowedByUser = w_follow::where('follow_sender_id', $recipient_id)
            ->where('follow_recipient_id', $sender_id)
            ->exists();


        // フォロー状態を決定
        if ($isFollowing && $isFollowedByUser) {
            $followStatus = '相互フォローしています';
        } elseif ($isFollowing) {
            $followStatus = 'フォローしています';
        } elseif ($isFollowedByUser) {
            $followStatus = 'フォローされています';
        } else {
            $followStatus = 'フォローする';
        }

        return response()->json($followStatus);
    }
}
