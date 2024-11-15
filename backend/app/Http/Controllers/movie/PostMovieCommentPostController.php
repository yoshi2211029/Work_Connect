<?php

namespace App\Http\Controllers\movie;

use App\Http\Controllers\Controller;
use App\Models\w_comment;
use Illuminate\Http\Request;

class PostMovieCommentPostController extends Controller
{
    public function PostMovieCommentPostController(Request $request)
    {
        $content = $request->input('movieCommentContent');
        $various_id = $request->input('movie_id');
        $commenter_id = $request->input('user_id');

        try {
            $comments = w_comment::create(['genre' => "movies", 'content' => $content, 'various_id' => $various_id, 'commenter_id' => $commenter_id]);

            // $workListがnullでない場合に$workImageListを結合する
            \Log::info('PostMovieCommentPostController:$workListArray:');
            \Log::info(json_encode($comments));
            // echo json_encode($workListArray);
            return json_encode($comments);
        } catch (\Exception $e) {
            \Log::info('PostMovieCommentPostController:エラー');
            \Log::info($e);
            /*reactに返す*/
            echo json_encode($e);
        }
    }
}
