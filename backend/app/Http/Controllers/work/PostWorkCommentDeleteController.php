<?php

namespace App\Http\Controllers\work;

use App\Http\Controllers\Controller;
use App\Models\w_comment;
use Illuminate\Http\Request;

class PostWorkCommentDeleteController extends Controller
{
    public function PostWorkCommentDeleteController(Request $request)
    {
        $CommentId = $request->input('commentId');
        try {
            // コメントを削除
            $comment = w_comment::find($CommentId);

            if ($comment) {
                $comment->delete();
                \Log::info('コメントが削除されました: ' . $CommentId);
                return response()->json(['message' => 'コメントが削除されました'], 200);
            } else {
                \Log::info('コメントが見つかりませんでした: ' . $CommentId);
                return response()->json(['message' => 'コメントが見つかりませんでした'], 404);
            }
        } catch (\Exception $e) {
            \Log::error('コメント削除中にエラーが発生しました: ' . $e->getMessage());
            return response()->json(['message' => 'コメント削除中にエラーが発生しました'], 500);
        }
    }
}
