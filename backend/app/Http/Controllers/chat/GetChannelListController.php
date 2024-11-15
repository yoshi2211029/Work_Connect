<?php

namespace App\Http\Controllers\chat;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_follow;
use App\Models\w_chat;
use App\Models\w_users;
use App\Models\w_company;
use Illuminate\Support\Facades\Log;


class GetChannelListController extends Controller
{

    public function GetChannelListController(Request $request)
    {
        try {
            // Reactからログイン中のidを取得
            $MyUserId = $request->input('MyUserId');

            // 配列の初期化
            $follower_list = [];
            $unique_list = [];
            $channel_list = [];

            // follow_sender_id または follow_recipient_id のどちらかが $MyUserId と一致する場合のみ追加
            $follower_list = w_follow::where('follow_sender_id', $MyUserId)
                ->orWhere('follow_recipient_id', $MyUserId)
                ->get();

            // channel_list[]にフォロー関係にある人すべて入れる
            foreach($follower_list as $record){
                //\Log::info('record11111: ' .$record);
                if($record->follow_sender_id === $MyUserId){
                    // 相手のid
                    $follow_recipient_id = $record->follow_recipient_id;

                    if($MyUserId[0] === "S"){
                        // 自分のidが学生(1文字目がS)の場合、企業のテーブルを参照
                        $data = w_company::where('id', $follow_recipient_id)->first();
                    } else if($MyUserId[0] === "C"){
                        // 自分のidが企業(1文字目がC)の場合、学生のテーブルを参照
                        $data = w_users::where('id', $follow_recipient_id)->first();
                    }
                    // 相手側とのフォロー状態
                    $followStatus = $this->profileFollowStatusCheck($follow_recipient_id, $MyUserId);

                } else if($record->follow_recipient_id === $MyUserId){
                    // 相手のid
                    $follow_sender_id = $record->follow_sender_id;

                    if($MyUserId[0] === "S"){
                        // 自分のidが学生(1文字目がS)の場合、企業のテーブルを参照
                        $data = w_company::where('id', $follow_sender_id)->first();
                    } else if($MyUserId[0] === "C"){
                        // 自分のidが企業(1文字目がC)の場合、学生のテーブルを参照
                        $data = w_users::where('id', $follow_sender_id)->first();
                    }
                    // 相手側とのフォロー状態
                    $followStatus = $this->profileFollowStatusCheck($follow_sender_id, $MyUserId);
                }

                //  in_array関数で$unique_list配列にidが存在しない場合、$channel_listに追加する
                if (!in_array($data->id, $unique_list)) {

                    // 未読の件数取得
                    $unreadCount = w_chat::where('get_user_id', $MyUserId)
                    ->where('send_user_id', $data->id)
                    ->where('check_read', '未読')
                    ->count();

                    if($MyUserId[0] === "S"){
                        // 自分のidが学生(1文字目がS)の場合、企業のテーブルを参照
                        $channel_list[] = [
                            'id' => $data->id,
                            'user_name' => $data->user_name,
                            'company_name' => $data->company_name,
                            'icon' => $data->icon,
                            'follow_status' => $followStatus,
                            'unread' => $unreadCount,
                        ];
                    } else if($MyUserId[0] === "C"){
                        // 自分のidが企業(1文字目がC)の場合、学生のテーブルを参照
                        $channel_list[] = [
                            'id' => $data->id,
                            'user_name' => $data->user_name,
                            'icon' => $data->icon,
                            'follow_status' => $followStatus,
                            'unread' => $unreadCount,
                        ];
                    }
                }
                // $unique_list配列にidを追加(相互でも重複しなくなる)
                $unique_list[] = $data->id;

            }

            if($channel_list){
                // Reactに返す
                return response()->json($channel_list);
            }

        } catch (\Exception $e) {
            Log::error('GetCompanyListController: エラー', ['exception' => $e]);

            // エラーメッセージをJSON形式で返す
            return response()->json(['error' => $e->getMessage()], 500);
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
         }
     }
}
