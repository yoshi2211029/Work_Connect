<?php

namespace App\Http\Controllers;

use App\Models\w_follow;
use App\Models\w_news;
use App\Models\w_notice;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class EditorController extends Controller
{

    //ニュースをセーブ(保存)する
    public function news_save(Request $request)
    {
        // 日本の現在時刻を取得
        $now = Carbon::now('Asia/Tokyo');

        // react側からのリクエスト
        $value = json_encode($request->input('value')); // JSON文字列に変換
        $title = $request->input('title');
        $news_id = $request->input('news_id');
        $Company_id = $request->input('company_id');
        $message = $request->input('message');
        $genre = $request->input('genre');


        if ($title === NULL) {
            $title = "タイトル未設定";
        }

        if ($news_id == 0) {
            // 新規作成
            $w_news = w_news::create([
                'company_id' => $Company_id,
                'summary' => $value,
                'article_title' => $title,
                'genre' => $genre,
                'message' => $message,
                'created_at' => $now,
                'public_status' => "0"
            ]);
            Log::info("作成");
        } else {
            // 更新
            $w_news = w_news::find($news_id);
            if (!$w_news) {
                return response()->json(['error' => 'Record not found'], 404);
            }
            $w_news->summary = $value;
            $w_news->article_title = $title;
            $w_news->genre = $genre;
            $w_news->message = $message;
            $w_news->updated_at = $now;
            $w_news->save();
        }

        // 作成または更新されたレコードのIDを取得する
        $id = $w_news->id;

        // news_draft_list 関数を呼び出してニュースドラフトリストを取得
        $newsDraftList = $this->news_draft_list($request, $Company_id);


        // IDを返す
        return response()->json(
            [
                'id' => $id,
                'news_draft_list' => $newsDraftList
            ],
            200
        );
    }

    public function thumbnail_image_save(Request $request)
    {
        // 日本の現在時刻を取得
        $now = Carbon::now('Asia/Tokyo');

        // リクエストからnews_idとsession_idを取得
        $news_id = $request->input('news_id');
        $Company_Id = $request->input('session_id');

        // 画像を保存
        if ($request->hasFile('file')) {
            $image = $request->file('file');

            // ランダムなファイル名を生成（画像のハッシュを使用）
            $extension = $image->getClientOriginalExtension();
            $hash = hash_file('sha256', $image->getPathname());
            $filename = $hash . '.' . $extension;

            // 保存先のパスを指定
            $destinationPath = public_path('assets/header_img');
            $path = $destinationPath . '/' . $filename;

            // 画像を指定したパスに保存
            $image->move($destinationPath, $filename);

            // 保存された画像の相対パスを取得
            $relativePath = 'assets/header_img/' . $filename;

            // 公開 URL を生成
            $publicPath = url($relativePath);

            // デバッグ用: 保存パスと公開URLをログに出力
            Log::info('File Path: ' . $path);
            Log::info('Public Image URL: ' . $publicPath);

            if ($news_id == 0) {
                // 新規作成
                $w_news = w_news::create([
                    'company_id' => $Company_Id,
                    'header_img' => $publicPath,
                    'created_at' => $now,
                    'public_status' => "0"
                ]);
            } else {
                // 更新
                $w_news = w_news::find($news_id);
                if (!$w_news) {
                    return response()->json(['error' => 'Record not found'], 404);
                }
                $w_news->header_img = $publicPath; // 相対パスを保存
                $w_news->created_at = $now;
                $w_news->save();
            }

            // 作成または更新されたレコードのIDを取得する
            $id = $w_news->id;

            // news_draft_list 関数を呼び出してニュースドラフトリストを取得
            $newsDraftList = $this->news_draft_list($request, $Company_Id);

            // IDと画像パスを返す
            return response()->json([
                'id' => $id,
                'image' => $publicPath, // 完全な URL を返す
                'success' => true,
                'news_draft_list' => $newsDraftList // 配列が直接返される
            ], 200);
        }

        return response()->json(['error' => '画像が選択されていません'], 400);
    }



    public function contents_image_save(Request $request)
    {
        if ($request->hasFile('file')) {

            $image = $request->file('file');

            // ランダムなファイル名を生成（画像のハッシュを使用）
            $extension = $image->getClientOriginalExtension();
            $hash = hash_file('sha256', $image->getPathname());
            $filename = $hash . '.' . $extension;

            $destinationPath = public_path('storage/images/news_contents'); // 保存先ディレクトリ
            $image->move($destinationPath, $filename); // ファイルを移動

            // 保存された画像の相対パスを取得
            $relativePath = 'storage/images/news_contents/' . $filename;

            // 公開 URL を生成
            $publicPath = url($relativePath);

            Log::info('ニュースコンテンツのURL: ' . $publicPath);

            return response()->json([
                'success' => 1,
                'url' => $publicPath // アップロードされた画像のURLを返す
            ]);
        }

        return response()->json([
            'success' => 0,
            'message' => 'Failed to upload image'
        ]);
    }



    //選んだ画像リンクを削除・別フォルダに移動したファイルを削除
    public function thumbnail_img_delete(Request $request, $id)
    {
        try {

            $Company_Id = $request->input('Company_Id');

            // 条件に一致する画像リンクを取得
            $header_img_delete = w_news::where('id', $id)
                ->select('header_img')
                ->first();

            if ($header_img_delete && $header_img_delete->header_img) {
                // 画像パスを取得
                $imagePath = 'C:/xampp/apps/work_connect/work_connect/frontend/public/header_img/' . $header_img_delete->header_img;

                // ファイルが存在するか確認
                if (file_exists($imagePath)) {
                    // ファイルを削除
                    unlink($imagePath);
                }

                // データベースのheader_imgカラムをnullに更新
                w_news::where('id', $id)->update(['header_img' => null]);

                // news_draft_list 関数を呼び出してニュースドラフトリストを取得
                $prevDraftList = $this->news_draft_list($request, $Company_Id);

                Log::info($prevDraftList);
            }

            // レスポンスとして成功ステータスを返す
            return response()->json([
                'message' => '成功',
                'success' => true,
                'news_draft_list' => $prevDraftList,
            ]);
        } catch (\Exception $e) {
            // エラー発生時のレスポンス
            Log::error('画像削除中にエラーが発生しました: ' . $e->getMessage());

            return response()->json([
                'message' => '画像の削除に失敗しました',
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    //ニュースを公開する
    public function news_upload(Request $request)
    {
        // 日本の現在時刻を取得
        $now = Carbon::now('Asia/Tokyo');

        $company_id = $request->input('company_id');
        $news_id = $request->input('news_id');
        $article_title = $request->input('title');
        $header_img = $request->input('header_img');
        $summary = $request->input('value');
        $message = $request->input('message');
        $genre = $request->input('genre');
        $public_status = 1;

        $notice_genre = "";

        if ($genre == "Internship") {
            $notice_genre = "インターンシップ";
        } else if ($genre == "Session") {
            $notice_genre = "説明会";
        } else if ($genre == "JobOffer") {
            $notice_genre = "求人";
        } else if ($genre == "Blog") {
            $notice_genre = "ブログ";
        }


        Log::info($header_img);

        $w_news = w_news::find($news_id);
        if ($w_news) {
            $w_news->company_id = $company_id;
            $w_news->article_title = $article_title;
            $w_news->genre = $genre;
            $w_news->header_img = $header_img;
            $w_news->summary = $summary;
            $w_news->message = $message;
            $w_news->public_status = $public_status;
            $w_news->created_at = $now;
            $w_news->updated_at = $now;
            $w_news->save();

            // 投稿した人をフォローしている人のIDをすべて挙げる
            $followData = [];
            $followAllData = [];

            $query = w_follow::query();
            $query->select('w_follow.follow_sender_id');
            $followData = $query->where("follow_recipient_id", $company_id)->get();

            foreach ($followData as $follow) {
                $followAllData[] = $follow["follow_sender_id"];
            }

            $oneNoticeData = [];
            foreach ($followData as $follow) {
                if ($oneNoticeData == []) {
                    \Log::info($follow);

                    $oneNoticeData = w_notice::create([
                        'get_user_id' => $follow["follow_sender_id"],
                        'send_user_id' => $company_id,
                        'category' => $notice_genre,
                        'detail' => $news_id,
                        'already_read' => 0,
                    ]);
                    \Log::info("ID");
                    \Log::info($news_id);
                } else {
                    w_notice::create([
                        'get_user_id' => $follow["follow_sender_id"],
                        'send_user_id' => $company_id,
                        'category' => $notice_genre,
                        'detail' => $news_id,
                        'already_read' => 0,
                    ]);
                    \Log::info("ID");
                    \Log::info($news_id);
                }
            }


            // IDに通知を送る
            $queryNotice = w_notice::query();

            $queryNotice->select(
                'w_companies.*',
                'w_notices.*',
            );

            $queryNotice->where('w_notices.id', $oneNoticeData['id']);

            $queryNotice->join('w_companies', 'w_companies.id', '=', 'w_notices.send_user_id');


            $queryNotice->orderBy('w_notices.created_at', 'asc');

            $noticeData = $queryNotice->get();
            $noticeData[0]["message"] = $message;

            return response()->json(['message' => 'successfully', 'follower' => $followAllData, 'noticeData' => $noticeData], 200);
        } else {
            return response()->json(['error' => 'Record not found'], 404);
        }
    }

    public function news_draft_list(Request $request, $id)
    {
        try {

            // 条件に一致するニュースドラフトリストを取得
            $newsDraftList = w_news::where('company_id', $id)
                ->where('public_status', 0)
                ->orderBy('updated_at', 'desc') // 降順でソート
                ->get();


            Log::info($newsDraftList);

            return $newsDraftList;
        } catch (\Exception $e) {
            // エラーレスポンスを返す
            return response()->json([
                'error' => 'Failed to fetch news draft list',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function embed(Request $request)
    {
        $url = $request->query('url'); // クエリパラメータとしてURLを取得

        Log::info("Embed method has been called with URL: " . $url);

        try {
            // URLからHTMLを取得
            $response = Http::get($url);
            $html = $response->body();

            Log::info("HTML fetched successfully.");

            // DOMDocument を使って HTML をパース
            $doc = new \DOMDocument();
            @$doc->loadHTML($html);
            $metaTags = $doc->getElementsByTagName('meta');
            $ogp = [];

            // 各 meta タグをループして OGP データを抽出
            foreach ($metaTags as $metaTag) {
                if ($metaTag instanceof \DOMElement) {
                    $property = $metaTag->getAttribute('property');
                    $content = $metaTag->getAttribute('content');

                    if (preg_match('/^og:([^:]+)$/', $property, $match)) {
                        $ogp[$match[1]] = $content;
                    } elseif (preg_match('/^twitter:image/', $property)) {
                        $ogp['image'] = $content;
                    }
                }
            }

            // URLに基づく埋め込みコードの生成
            if (preg_match('/instagram\.com\/p\/([^\/]+)/', $url, $matches)) {
                $ogp['embedHtml'] = "<iframe src='https://www.instagram.com/p/{$matches[1]}/embed' width='400' height='500' frameborder='0' scrolling='no' allowtransparency='true'></iframe>";
                Log::info("Instagram embed generated.");
            } elseif (preg_match('/twitter\.com\/[^\/]+\/status\/(\d+)/', $url, $matches)) {
                $ogp['embedHtml'] = "<blockquote class='twitter-tweet'><a href='{$url}'></a></blockquote><script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script>";
                Log::info("Twitter embed generated.");
            } elseif (preg_match('/l\.facebook\.com\/l\.php\?u=([^&]+)/', $url, $matches)) {
                $actualUrl = urldecode($matches[1]);
                $ogp['embedHtml'] = "<iframe src='https://www.facebook.com/plugins/post.php?href={$actualUrl}' width='500' height='600' style='border:none;overflow:hidden' scrolling='no' frameborder='0' allowTransparency='true' allow='encrypted-media'></iframe>";
                Log::info("Facebook embed generated.");
            } elseif (preg_match('/github\.com\/([^\/]+\/[^\/\.]+)(\.git)?/', $url, $matches)) {
                $repo = $matches[1];

                $ogp['embedHtml'] = "<iframe src='https://github.com/{$repo}' width='800' height='600' frameborder='0' scrolling='yes' style='border:none;'></iframe>";
                Log::info("GitHub embed generated.");
            } elseif (preg_match('/note\.com\/n\/([^\/?]+)/', $url, $matches)) {
                $noteId = $matches[1];
                $ogp['embedHtml'] = "<iframe class='note-embed' src='https://note.com/embed/notes/{$noteId}' style='border: 0; display: block; max-width: 99%; width: 494px; padding: 0px; margin: 10px 0px; position: static; visibility: visible;' height='400'></iframe><script async src='https://note.com/scripts/embed.js' charset='utf-8'></script>";
                Log::info("Note ID: " . $noteId); // ログにnoteIdを記録
            } else {
                Log::info("No matching patterns for embed.");
            }

            return response()->json($ogp);
        } catch (\Exception $e) {
            Log::error("Error in embed method: " . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }
}
