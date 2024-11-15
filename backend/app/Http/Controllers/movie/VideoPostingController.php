<?php

namespace App\Http\Controllers\movie;

use App\Models\w_movies;
use App\Http\Controllers\Controller;
use App\Models\w_follow;
use App\Models\w_notice;
use Illuminate\Http\Request;

class VideoPostingController extends Controller
{
    public function VideoPostingController(Request $request)
    {
        $userId = $request->input('creatorId');
        \Log::info($userId);
        \Log::info($userId);

        $VideoTitle = $request->input('VideoTitle');
        $VideoGenre = $request->input('VideoGenre');
        $YoutubeURL = $request->input('YoutubeURL');
        $Introduction = $request->input('Introduction');

        $movieItem = w_movies::create([
            'kind_id' => 5,
            'creator_id' => $userId,
            'title' => $VideoTitle,
            'genre' => $VideoGenre,
            'youtube_url' => $YoutubeURL,
            'intro' => $Introduction,
            'sort_number' => 0,
        ]);


        // 投稿した人をフォローしている人のIDをすべて挙げる
        $followData = [];
        $followAllData = [];

        $query = w_follow::query();
        $query->select('w_follow.follow_sender_id');
        $followData = $query->where("follow_recipient_id", $userId)->get();

        foreach ($followData as $follow) {
            $followAllData[] = $follow["follow_sender_id"];
        }

        \Log::info("movieItem");
        \Log::info($movieItem);
        $oneNoticeData = [];
        foreach ($followData as $follow) {
            if ($oneNoticeData == []) {
                \Log::info($follow);

                $oneNoticeData = w_notice::create([
                    'get_user_id' => $follow["follow_sender_id"],
                    'send_user_id' => $userId,
                    'category' => "動画",
                    'detail' => $movieItem["id"],
                    'already_read' => 0,
                ]);

                \Log::info("動画ID");
                \Log::info($movieItem["id"]);
            } else {
                w_notice::create([
                    'get_user_id' => $follow["follow_sender_id"],
                    'send_user_id' => $userId,
                    'category' => "動画",
                    'detail' => $movieItem["id"],
                    'already_read' => 0,
                ]);
                \Log::info("動画ID");
                \Log::info($movieItem["id"]);
            }
        }

        $noticeData = [];
        if(count($followData) != 0){
            // IDに通知を送る
            $queryNotice = w_notice::query();

            $queryNotice->select(
                'w_users.*',
                'w_notices.*',
            );

            $queryNotice->where('w_notices.id', $oneNoticeData['id']);

            $queryNotice->join('w_users', 'w_users.id', '=', 'w_notices.send_user_id');


            $queryNotice->orderBy('w_notices.created_at', 'asc');

            $noticeData = $queryNotice->get();
        }
        return response()->json(['message' => 'Work data saved successfully', 'follower' => $followAllData, 'noticeData' => $noticeData], 200);
    }
}
