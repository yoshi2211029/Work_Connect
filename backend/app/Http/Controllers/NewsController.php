<?php

namespace App\Http\Controllers;

use App\Models\w_news;
use App\Models\w_follow;
use App\Models\w_company;
use App\Models\w_bookmark;
use App\Models\w_write_form;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class NewsController extends Controller
{
    // パラメータから取得したIDを元にニュースのデータを取得するメソッド
    public function news_detail_get(Request $request, $newsdetail_id)
    {
        $MyId = $request->input("MyId");

        $news_detail = w_news::where('w_news.id', $newsdetail_id)
            ->join('w_companies', 'w_news.company_id', '=', 'w_companies.id')
            ->select('w_news.*', 'w_companies.*', 'w_news.created_at as news_created_at', 'w_news.id as news_id')
            ->first();

        if ($news_detail) {
            $news_detail->summary = json_decode($news_detail->summary);

            $isFollowing = w_follow::where('follow_sender_id', $MyId)
                ->where('follow_recipient_id', $news_detail->id)
                ->exists();

            $isFollowedByUser = w_follow::where('follow_sender_id', $news_detail->id)
                ->where('follow_recipient_id', $MyId)
                ->exists();

            if ($isFollowing && $isFollowedByUser) {
                $followStatus = '相互フォローしています';
            } elseif ($isFollowing) {
                $followStatus = 'フォローしています';
            } elseif ($isFollowedByUser) {
                $followStatus = 'フォローされています';
            } elseif ($news_detail->id === $MyId) {
                $followStatus = 'フォローできません';
            } else {
                $followStatus = 'フォローする';
            }

            $news_detail->follow_status = $followStatus;

            return response()->json($news_detail);
        } else {
            return response()->json(['error' => 'ニュースが見つかりませんでした。'], 404);
        }
    }

    // ブックマーク機能
    public function news_bookmark(Request $request)
    {
        $now = Carbon::now('Asia/Tokyo');
        $session_id = $request->input('session_id');
        $bookmark_id = $request->input('id');
        $category = $request->input('category');

        $news_bookmark = w_bookmark::where('position_id', $session_id)
            ->where('bookmark_id', $bookmark_id)
            ->exists();

        if ($news_bookmark) {
            w_bookmark::where('position_id', $session_id)
                ->where('bookmark_id', $bookmark_id)
                ->delete();

            return response()->json(["message" => "削除成功しました"], 200);
        } else {
            w_bookmark::create([
                'position_id' => $session_id,
                'category' => $category,
                'bookmark_id' => $bookmark_id,
                'created_at' => $now,
            ]);

            return response()->json(["message" => "新規追加成功しました"], 201);
        }
    }

    // 企業ニュース取得
    // public function special_company_news(Request $request, $username, $Myid, $Genre)
    // {
    //     //$usernameは今プロフィールで見ている人のユーザーネーム
    //     //$Myidはログイン中のid

    //     Log::info("special_company_news通ってます");
    //     $page = (int) $request->query('page', 1);
    //     $perPage = 20;
    //     $offset = ($page - 1) * $perPage;
    //     $sortOption = $request->query('sort');

    //     // w_companiesテーブルからIdを取得
    //     $company = w_company::where('user_name', $username)->first();

    //     if (!$company) {
    //         return response()->json(['error' => '指定されたユーザーが見つかりません。'], 404);
    //     } else {
    //         $special_company_news_id = $company->id; // IDを取得
    //     }

    //     // ニュースの取得
    //     $query = w_news::where('company_id', $special_company_news_id)
    //         ->where('genre', $Genre)
    //         ->where('public_status', 1)
    //         ->join('w_companies', 'w_news.company_id', '=', 'w_companies.id')
    //         ->select('w_news.*', 'w_companies.*', 'w_news.created_at as news_created_at', 'w_news.id as news_id');

    //     // ソート処理
    //     if ($sortOption === 'orderNewPostsDate') {
    //         $query->orderBy('w_news.created_at', 'desc');
    //     } elseif ($sortOption === 'orderOldPostsDate') {
    //         $query->orderBy('w_news.created_at', 'asc');
    //     } else {
    //         // デフォルトのソート（最新の投稿が最初）
    //         $query->orderBy('news_created_at', 'desc');
    //     }

    //     // ページネーションの適用
    //     $posts = $query->skip($offset)->take($perPage)->get();

    //     foreach ($posts as $post) {
    //         $isFollowing = w_follow::where('follow_sender_id', $Myid)
    //             ->where('follow_recipient_id', $post->company_id)
    //             ->exists();

    //         $isFollowedByUser = w_follow::where('follow_sender_id', $post->company_id)
    //             ->where('follow_recipient_id', $Myid)
    //             ->exists();

    //         Log::info($Myid);
    //         Log::info($post->company_id);

    //         if ($Myid[0] == $post->company_id[0]) {
    //             $post->follow_status = 'フォローできません';
    //         } else if ($isFollowing && $isFollowedByUser) {
    //             $post->follow_status = '相互フォローしています';
    //         } elseif ($isFollowing) {
    //             $post->follow_status = 'フォローしています';
    //         } elseif ($isFollowedByUser) {
    //             $post->follow_status = 'フォローされています';
    //         } else {
    //             $post->follow_status = 'フォローする';
    //         }
    //     }

    //     return response()->json($posts);
    //     // if ($posts->isNotEmpty()) {
    //     //     return response()->json($posts);
    //     // } else {
    //     //     return response()->json([['error' => 'ニュースが見つかりませんでした。']], 404);
    //     // }
    // }

    //自社が投稿したニュースの中で応募フォームを作成したニュースを表示させる
    //応募フォームの回答(面談の日程とか?)とその人のプロフィールを確認することができる
    public function special_forms(Request $request, $CompanyId)
    {
        Log::info("special_forms通ってます");
        $page = (int) $request->query('page', 1);
        $perPage = 20;
        $offset = ($page - 1) * $perPage;
        $sortOption = $request->query('sort');

        // ニュースタイトル一覧を取得
        $title = w_write_form::where('recipient_company_id', $CompanyId)
            ->join('w_news', 'w_write_forms.news_id', '=', 'w_news.id')
            ->where('w_news.public_status', 1)
            ->groupBy('w_news.article_title')
            ->select('w_news.article_title');

        // ニュースデータを取得
        $query = w_write_form::where('recipient_company_id', $CompanyId)
            ->join('w_news', 'w_write_forms.news_id', '=', 'w_news.id')
            ->join('w_users', 'w_write_forms.user_id', '=', 'w_users.id')
            ->where('w_news.public_status', 1)
            ->select('w_write_forms.*', 'w_news.*', 'w_users.*', 'w_news.created_at as news_created_at','w_write_forms.id as write_form_id')
            ->get();

        // ソート処理
        if ($sortOption === 'orderNewPostsDate') {
            $title->orderBy('w_news.created_at', 'desc');
        } elseif ($sortOption === 'orderOldPostsDate') {
            $title->orderBy('w_news.created_at', 'asc');
        } else {
            $title->orderBy('news_created_at', 'desc');
        }

        // ページネーション適用
        $posts = $title->skip($offset)->take($perPage)->get();


        // ユーザー情報の追加
        foreach ($posts as $post) {
            // usersプロパティを配列として初期化
            $users = [];

            // $queryのデータから一致するタイトルのユーザーデータを追加
            foreach ($query as $q) {
                if ($q->article_title === $post->article_title) {
                    // 該当するユーザー情報を配列として追加
                    $users[] = [
                        'write_form' => json_decode($q->write_form), // ここでデコード
                        'user_name' => $q->user_name,
                        'write_form_id' => $q->write_form_id,
                        'news_created_at' => $q->news_created_at,
                        // 他の必要なフィールドもここで追加
                    ];
                }
            }

            // ここで users を設定
            $post->users = $users;
            Log::info("special_forms処理しています");
        }



        return response()->json($posts);
    }

    // 全ニュース取得
    public function all_news_get(Request $request, $id, $category)
    {
        try {
            Log::info("all_news_get通ってます");
            $page = (int) $request->query('page', 1);
            $perPage = 20;
            $offset = ($page - 1) * $perPage;
            $sortOption = $request->query('sort');
            $userName = $request->query('userName');

            $postsQuery = w_news::where('w_news.public_status', 1)
                ->where('w_news.genre', $category)
                ->join('w_companies', 'w_news.company_id', '=', 'w_companies.id')
                ->select('w_news.*', 'w_companies.*', 'w_news.created_at as news_created_at', 'w_news.id as news_id');

            if ($userName !== null) {
                $postsQuery->where('w_companies.user_name', $userName);
            }

            if ($sortOption === 'orderNewPostsDate') {
                $postsQuery->orderBy('w_news.created_at', 'desc');
            } elseif ($sortOption === 'orderOldPostsDate') {
                $postsQuery->orderBy('w_news.created_at', 'asc');
            }

            $posts = $postsQuery->skip($offset)
                ->take($perPage)
                ->get();

            foreach ($posts as $post) {

                // w_write_formsテーブルからすべてのフォームデータを取得
                $formData = w_write_form::where('news_id', $post->news_id)->get();

                // 取得したフォームデータの数をpostsに追加
                $post->form_data_count = $formData->count();

                $isFollowing = w_follow::where('follow_sender_id', $id)
                    ->where('follow_recipient_id', $post->id)
                    ->exists();

                $isFollowedByUser = w_follow::where('follow_sender_id', $post->id)
                    ->where('follow_recipient_id', $id)
                    ->exists();

                if ($isFollowing && $isFollowedByUser) {
                    $post->follow_status = '相互フォローしています';
                } elseif ($isFollowing) {
                    $post->follow_status = 'フォローしています';
                } elseif ($isFollowedByUser) {
                    $post->follow_status = 'フォローされています';
                } else {
                    $post->follow_status = 'フォローする';
                }
            }
            Log::info("all_news_get:posts");
            Log::info($posts);
            return response()->json($posts);
        } catch (\Exception $e) {
            Log::error('all_news_get エラー: ' . $e->getMessage());
            return response()->json(['error' => 'データ取得中にエラーが発生しました。'], 500);
        }
    }

    public function special_company_news(Request $request, $username, $Myid, $Genre)
    {
        Log::info("special_combined_news_forms通ってます");
        $page = (int) $request->query('page', 1);
        $perPage = 20;
        $offset = ($page - 1) * $perPage;
        $sortOption = $request->query('sort');

        // w_companiesテーブルからIdを取得
        $company = w_company::where('user_name', $username)->first();

        if (!$company) {
            return response()->json(['error' => '指定されたユーザーが見つかりません。'], 404);
        }

        $special_company_news_id = $company->id; // IDを取得
        Log::info($special_company_news_id);
        Log::info($Genre);

        // ニュースの取得
        $newsQuery = w_news::where('company_id', $special_company_news_id)
            ->where('genre', $Genre)
            ->where('public_status', 1)
            ->join('w_companies', 'w_news.company_id', '=', 'w_companies.id')
            ->select('w_news.*', 'w_companies.*', 'w_news.created_at as news_created_at', 'w_news.id as news_id');

        // ソート処理
        if ($sortOption === 'orderNewPostsDate') {
            $newsQuery->orderBy('w_news.created_at', 'desc');
        } elseif ($sortOption === 'orderOldPostsDate') {
            $newsQuery->orderBy('w_news.created_at', 'asc');
        } else {
            // デフォルトのソート（最新の投稿が最初）
            $newsQuery->orderBy('news_created_at', 'desc');
        }

        // ページネーションの適用
        $posts = $newsQuery->skip($offset)->take($perPage)->get();

        // フォームデータの取得
        foreach ($posts as $post) {
            // w_write_formsテーブルからすべてのフォームデータを取得
            $formData = w_write_form::where('news_id', $post->news_id)->get();

            // 取得したフォームデータの数をpostsに追加
            $post->form_data_count = $formData->count();

            // フォロー状況の確認
            $isFollowing = w_follow::where('follow_sender_id', $Myid)
                ->where('follow_recipient_id', $post->company_id)
                ->exists();

            $isFollowedByUser = w_follow::where('follow_sender_id', $post->company_id)
                ->where('follow_recipient_id', $Myid)
                ->exists();

            if ($Myid[0] == $post->company_id[0]) {
                $post->follow_status = 'フォローできません';
            } elseif ($isFollowing && $isFollowedByUser) {
                $post->follow_status = '相互フォローしています';
            } elseif ($isFollowing) {
                $post->follow_status = 'フォローしています';
            } elseif ($isFollowedByUser) {
                $post->follow_status = 'フォローされています';
            } else {
                $post->follow_status = 'フォローする';
            }
        }

        return response()->json($posts);
    }
}
