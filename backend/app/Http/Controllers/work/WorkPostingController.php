<?php

namespace App\Http\Controllers\work;

use App\Models\w_images;
use App\Models\w_works;
use App\Http\Controllers\Controller;
use App\Models\w_follow;
use App\Models\w_notice;
use Illuminate\Http\Request;

class WorkPostingController extends Controller
{
    public function store(Request $request)
    {
        $userId = $request->input('creatorId');
        $WorkTitle = $request->input('WorkTitle');
        $WorkGenre = $request->input('WorkGenre');
        $YoutubeURL = $request->input('YoutubeURL');
        $Introduction = $request->input('Introduction');
        $Obsession = $request->input('Obsession');
        $Language = $request->input('Language');
        $Environment = $request->input('Environment');
        $images = $request->input('imagesName'); // 画像のバリデーション
        $imagesArray = $request->file('images');
        $annotation = $request->input('annotation');

        $pathArray = [];
        if (is_array($imagesArray) && count($imagesArray) > 0) {
            foreach ($imagesArray as $value) {
                // \Log::info('$value: ', $value);
                $pathArray[] = explode('/', $value->store('public/images/work'))[3];
            }
        } else {
            // エラーハンドリング：nullが渡された場合
            return response()->json(['error' => 'No images provided.'], 400);
        }

        \Log::info('$pathArray: ', $pathArray);
        $annotation_json = json_encode($annotation);

        // データ保存 (例: DBに保存)
        $workItem = w_works::create([
            'kind_id' => 4,
            'creator_id' => $userId,
            'work_name' => $WorkTitle,
            'work_genre' => $WorkGenre,
            'youtube_url' => $YoutubeURL,
            'work_intro' => $Introduction,
            'obsession' => $Obsession,
            'programming_language' => $Language,
            'development_environment' => $Environment,
            'thumbnail' => $pathArray[0]
        ]);

        // 作成したw_worksのIDを取得
        // $work_id = $work->id;
        foreach ($pathArray as $index => $data) {
            w_images::create([
                'image' => $data, // 'column_name'は実際のカラム名に変更
                'annotation' => $annotation[$index],
                // 'work_id' => $work_id // w_worksのIDを関連付け
            ]);
        }


        // 投稿した人をフォローしている人のIDをすべて挙げる
        $followData = [];
        $followAllData = [];

        $query = w_follow::query();
        $query->select('w_follow.follow_sender_id');
        $followData = $query->where("follow_recipient_id", $userId)->get();

        foreach ($followData as $follow) {
            $followAllData[] = $follow["follow_sender_id"];
        }

        \Log::info("workItem");
        \Log::info($workItem);
        $oneNoticeData = [];
        foreach ($followData as $follow) {
            if ($oneNoticeData == []) {
                \Log::info($follow);

                $oneNoticeData = w_notice::create([
                    'get_user_id' => $follow["follow_sender_id"],
                    'send_user_id' => $userId,
                    'category' => "作品",
                    'detail' => $workItem["id"],
                    'already_read' => 0,
                ]);

                \Log::info("作品ID");
                \Log::info($workItem["id"]);
            } else {
                w_notice::create([
                    'get_user_id' => $follow["follow_sender_id"],
                    'send_user_id' => $userId,
                    'category' => "作品",
                    'detail' => $workItem["id"],
                    'already_read' => 0,
                ]);
                \Log::info("作品ID");
                \Log::info($workItem["id"]);
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
