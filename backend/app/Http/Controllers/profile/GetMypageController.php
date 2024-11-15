<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_users;
use App\Models\w_company;
use App\Models\w_company_information;
use App\Models\w_follow;
use Illuminate\Support\Facades\Log;

class GetMypageController extends Controller
{
    public function GetMypageController(Request $request)
    {
        try {
            $profileId = $request->input('ProfileUserName'); // プロフィールを見ている人のユーザーネーム
            $myuserId = $request->input('MyUserId'); // ログイン中のID

            // 学生のプロフィール取得
            $userList = w_users::where('user_name', $profileId)->get();

            // 企業のプロフィール取得
            $companyList = w_company::where('user_name', $profileId)->get();

            // もしも学生だったら
            if (!$userList->isEmpty()) {
                $userId = $userList->first()->id;

                // フォロー状態をチェック
                $followStatus = $this->profileFollowStatusCheck($userId, $myuserId);

                // $userList の各要素に $followStatus を追加する
                $userList->each(function ($user) use ($followStatus) {
                    $user->follow_status = $followStatus;
                });

                return response()->json($userList);

            } elseif (!$companyList->isEmpty()) {
                // もしも企業側だったら
                $companyId = $companyList->first()->id;

                // 企業情報の取得
                $companyInformation = w_company_information::where('company_id', $companyId)
                    ->where('public_status', 1)
                    ->get();

                // $companyList の各要素に $companyInformation を追加する
                foreach ($companyList as $company) {
                    $company->companyInformation = $companyInformation->isNotEmpty() ? $companyInformation : '公開可能な企業情報はありません';
                }

                // フォロー状態をチェック
                $followStatus = $this->profileFollowStatusCheck($companyId, $myuserId);

                // $companyList の各要素に $followStatus を追加する
                $companyList->each(function ($company) use ($followStatus) {
                    $company->follow_status = $followStatus;
                });

                return response()->json($companyList);
            } else {
                return response()->json(['message' => 'データが見つかりません'], 404);
            }
        } catch (\Exception $e) {
            Log::error('GetMypageController: エラーが発生しました', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'エラーが発生しました'], 500);
        }
    }

    // フォローの状況をチェックする関数
    private function profileFollowStatusCheck($partner_follow_id, $id)
    {
        // フォロー状態を確認
        $isFollowing = w_follow::where('follow_sender_id', $partner_follow_id)
            ->where('follow_recipient_id', $id)
            ->exists();

        $isFollowedByUser = w_follow::where('follow_sender_id', $id)
            ->where('follow_recipient_id', $partner_follow_id)
            ->exists();

        // フォロー状態を決定
        if ($isFollowing && $isFollowedByUser) {
            return '相互フォローしています';
        } elseif ($isFollowing) {
            return 'フォローされています';
        } elseif ($isFollowedByUser) {
            return 'フォローしています';
        } else {
            return 'フォローする';
        }
    }
}
