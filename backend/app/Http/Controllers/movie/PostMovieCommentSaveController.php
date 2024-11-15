<?php

namespace App\Http\Controllers\movie;

use App\Http\Controllers\Controller;
use App\Models\w_comment;
use Illuminate\Http\Request;

class PostMovieCommentSaveController extends Controller
{
    public function PostMovieCommentSaveController(Request $request)
    {
        $ComentContent = $request->input('movieCommentContent');
        $CommentId = $request->input('commentId');
        try {
            $comments = w_comment::where('w_comments.id', $CommentId)
                ->update(['content' => $ComentContent]);

            \Log::info('PostMovieCommentSaveController:$comments');
            \Log::info(json_encode($comments));
            // echo json_encode($workListArray);
            return json_encode($comments);
        } catch (\Exception $e) {
            \Log::info('PostMovieCommentSaveController:エラー');
            \Log::info($e);
            /*reactに返す*/
            echo json_encode($e);
        }
    }
}
