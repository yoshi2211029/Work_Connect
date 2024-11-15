<?php

namespace App\Http\Controllers\company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_company;
use App\Models\w_follow;
use Illuminate\Support\Facades\Log;


class GetCompanyListController extends Controller
{

    public function GetCompanyListController(Request $request)
    {
        try {
            $page = (int) $request->query('page', 1);
            $perPage = 20; // 一ページ当たりのアイテム数
            $offset = ($page - 1) * $perPage;

            // 企業リストを取得
            $companyList = w_company::skip($offset)
                ->take($perPage)
                ->get();
            // Log::info('GetCompanyListController:companyList');
            // Log::info(json_encode($companyList));

            // 各企業のフォロー状態を確認して更新
            $companyList = $companyList->map(function ($company) {
                $id = $company->id;

                // IDの最初の文字が "S" の場合にフォロー状態を確認
                if ($id[0] === "S") {
                    // Log::info('ID[0]が "S" の場合の処理を実行');
                    // Log::info('IDの値: ' . $id);

                    // ログインしているユーザーのIDを取得する必要があります（例: auth()->id()）
                    $currentUserId = auth()->id();

                    // ユーザーがログインしているアカウントをフォローしているかどうか
                    $isFollowing = w_follow::where('follow_sender_id', $currentUserId)
                        ->where('follow_recipient_id', $id)
                        ->exists();

                    // ログインしているアカウントがユーザーをフォローしているかどうか
                    $isFollowedByUser = w_follow::where('follow_sender_id', $id)
                        ->where('follow_recipient_id', $currentUserId)
                        ->exists();

                    // フォロー状態を設定
                    if ($isFollowing && $isFollowedByUser) {
                        $company->follow_status = '相互フォローしています';
                    } elseif ($isFollowing) {
                        $company->follow_status = 'フォローしています';
                    } elseif ($isFollowedByUser) {
                        $company->follow_status = 'フォローされています';
                    } else {
                        $company->follow_status = 'フォローする';
                    }
                } else {
                    // IDの最初の文字が "S" でない場合はフォローできないメッセージを設定
                    $company->follow_status = 'フォローできません';
                }

                return $company;
            });

            // Log::info(json_encode($companyList));

            // 結果をJSON形式で返す
            return response()->json($companyList);
        } catch (\Exception $e) {
            Log::error('GetCompanyListController: エラー', ['exception' => $e]);

            // エラーメッセージをJSON形式で返す
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
