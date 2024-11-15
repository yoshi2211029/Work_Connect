<?php

namespace App\Http\Controllers\work;

use App\Http\Controllers\Controller;
use App\Models\w_comment;
use Illuminate\Http\Request;

class PostWorkCommentPostController extends Controller
{
    public function PostWorkCommentPostController(Request $request)
    {
        $content = $request->input('workCommentContent');
        $various_id = $request->input('work_id');
        $commenter_id = $request->input('user_id');

        try {
            $comments = w_comment::create(['genre' => "works", 'content' => $content, 'various_id' => $various_id, 'commenter_id' => $commenter_id]);

            // $workListがnullでない場合に$workImageListを結合する
            \Log::info('PostWorkCommentPostController:$workListArray:');
            \Log::info(json_encode($comments));
            // echo json_encode($workListArray);
            return json_encode($comments);
        } catch (\Exception $e) {
            \Log::info('PostWorkCommentPostController:エラー');
            \Log::info($e);
            /*reactに返す*/
            echo json_encode($e);
        }
    }
}
