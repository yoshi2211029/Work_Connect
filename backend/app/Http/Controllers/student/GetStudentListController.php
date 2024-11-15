<?php

namespace App\Http\Controllers\student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_users;
use App\Models\w_follow;
use Illuminate\Support\Facades\Log;

class GetStudentListController extends Controller
{
    public function GetStudentListController(Request $request)
    {
        try {
            // ページネーションの設定
            $page = (int) $request->query('page', 1);
            $perPage = 20; // 一ページ当たりのアイテム数
            $offset = ($page - 1) * $perPage;

            // ユーザーリストを取得
            $StudentOfList = w_users::skip($offset)
                ->take($perPage)
                ->get();

            // 各ユーザーのフォロー状態を確認して更新
            $StudentOfList = $StudentOfList->map(function ($user) {
                // ユーザーのIDを取得
                $id = $user->id;
                // Log::info('$user->id');
                // Log::info($id);
                // もしも $id の最初の文字が "C" であれば、フォロー状態を確認
                if ("C" === $id[0]) {
                    // Log::info('ID[0]が "C" の場合の処理を実行');
                    // Log::info('IDの値: ' . $id);

                    // ユーザーがログインしているアカウントをフォローしているかどうか
                    $isFollowing = w_follow::where('follow_sender_id', $id)
                        ->where('follow_recipient_id', $user->id)
                        ->exists();

                    // ログインしているアカウントがユーザーをフォローしているかどうか
                    $isFollowedByUser = w_follow::where('follow_sender_id', $user->id)
                        ->where('follow_recipient_id', $id)
                        ->exists();

                    // フォロー状態を設定
                    if ($isFollowing && $isFollowedByUser) {
                        $user->follow_status = '相互フォローしています';
                    } elseif ($isFollowing) {
                        $user->follow_status = 'フォローしています';
                    } elseif ($isFollowedByUser) {
                        $user->follow_status = 'フォローされています';
                    } else {
                        $user->follow_status = 'フォローする';
                    }
                } else {
                    // $id の最初の文字が "C" でない場合はフォローできないメッセージを設定
                    $user->follow_status = 'フォローできません';
                }

                return $user;
            });

            // Log::info('GetStudentListController: $StudentOfList:');
            // Log::info(json_encode($StudentOfList));

            // 結果をJSON形式で返す
            return response()->json($StudentOfList);
        } catch (\Exception $e) {
            Log::error('GetStudentListController: エラー');
            Log::error($e);

            // エラーメッセージをJSON形式で返す
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
