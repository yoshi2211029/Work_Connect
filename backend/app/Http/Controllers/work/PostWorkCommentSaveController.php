<?php

namespace App\Http\Controllers\work;

use App\Http\Controllers\Controller;
use App\Models\w_comment;
use Illuminate\Http\Request;

class PostWorkCommentSaveController extends Controller
{
    public function PostWorkCommentSaveController(Request $request)
    {
        $ComentContent = $request->input('workCommentContent');
        $CommentId = $request->input('commentId');
        try {
            $comments = w_comment::where('w_comments.id', $CommentId)
                ->update(['content' => $ComentContent]);

            // $workListがnullでない場合に$workImageListを結合する
            \Log::info('PostWorkCommentSaveController:$workListArray:');
            \Log::info(json_encode($comments));
            // echo json_encode($workListArray);
            return json_encode($comments);
        } catch (\Exception $e) {
            \Log::info('PostWorkCommentSaveController:エラーPostWorkCommentSaveController');
            \Log::info($e);
            /*reactに返す*/
            echo json_encode($e);
        }
    }
}
