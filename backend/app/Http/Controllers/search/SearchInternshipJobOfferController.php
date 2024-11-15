<?php

namespace App\Http\Controllers\search;

use App\Http\Controllers\Controller;
use App\Models\w_company;
use App\Models\w_news;
use Illuminate\Http\Request;

class SearchInternshipJobOfferController extends Controller
{
    /* 企業の検索処理 */
    public function SearchInternshipJobOfferController(Request $request)
    {
        try {
            $page = (int) $request->query('page', 1);
            $perPage = 20; //一ページ当たりのアイテム数
            $offset = ($page - 1) * $perPage;
            // 検索文字列を取得
            $searchText = $request->input('searchText', "");

            // 検索者のIDを取得
            $myId = $request->input('myId', "");

            // 開いている企業プロフィール画面の企業のユーザー名を取得
            $user_name = $request->input('user_name', "");

            // 検索文字列を取得
            $searchText = $request->input('searchText', "");

            // 絞り込まれたフォロー状況を配列で取得
            $follow_status_array = $request->input('follow_status', []);

            // 絞り込まれた企業名を配列で取得
            $company_name_array = $request->input('company_name', []);

            // 絞り込まれた職種を配列で取得
            $selected_occupation_array = $request->input('selected_occupation', []);
            // 絞り込まれた勤務地を配列で取得
            $prefecture_array = $request->input('prefecture', []);
            // 絞り込まれた業界キーワードを配列で取得
            $industry_array = $request->input('industry', []);
            // 絞り込まれた開発環境を配列で取得
            $development_environment_array = $request->input('development_environment', []);
            // 絞り込まれたプログラミング言語を配列で取得
            $programming_language_array = $request->input('programming_language', []);
            // 絞り込まれた歓迎資格を配列で取得
            $acquisition_qualification_array = $request->input('acquisition_qualification', []);
            // 絞り込まれたソフトウェアを配列で取得
            $software_array = $request->input('software', []);
            // ジャンル取得
            $genre = $request->input('genre', "");

            \Log::info('SearchCompanyController:$company_name_array:');
            \Log::info($company_name_array);

            $query = w_news::query();

            $query->select(
                'w_companies.*',
                'w_news.*'
            );

            $query->join('w_companies', 'w_news.company_id', '=', 'w_companies.id');

            if (isset($genre)) {
                    $query->where('w_news.genre', $genre);
            }

            // ユーザー名で絞り込み
            if (isset($user_name) && $user_name != "") {
                $query->where('w_companies.user_name', "$user_name");
            }

            // 企業名で絞り込み
            if (isset($company_name_array)) {
                foreach ($company_name_array as $company_name_array) {
                    $query->where('w_companies.company_name', 'REGEXP', '(^|,)' . preg_quote($company_name_array) . '($|,)');
                }
            }

            // 職種で絞り込み
            if (isset($selected_occupation_array)) {
                foreach ($selected_occupation_array as $selected_occupation) {
                    $query->where('w_companies.selected_occupation', 'REGEXP', '(^|,)' . preg_quote($selected_occupation) . '($|,)');
                }
            }
            // 勤務地で絞り込み
            if (isset($prefecture_array)) {
                foreach ($prefecture_array as $prefecture) {
                    $query->where('w_companies.prefecture', 'REGEXP', '(^|,)' . preg_quote($prefecture) . '($|,)');
                }
            }
            // 業界キーワードで絞り込み
            if (isset($industry_array)) {
                foreach ($industry_array as $industry) {
                    $query->where('w_companies.industry', 'REGEXP', '(^|,)' . preg_quote($industry) . '($|,)');
                }
            }
            // 開発環境で絞り込み
            if (isset($development_environment_array)) {
                foreach ($development_environment_array as $development_environment) {
                    $query->where('w_companies.development_environment', 'REGEXP', '(^|,)' . preg_quote($development_environment) . '($|,)');
                }
            }
            // プログラミング言語で絞り込み
            if (isset($programming_language_array)) {
                foreach ($programming_language_array as $programming_language) {
                    $query->where('w_companies.programming_language', 'REGEXP', '(^|,)' . preg_quote($programming_language) . '($|,)');
                }
            }
            // 歓迎資格で絞り込み
            if (isset($acquisition_qualification_array)) {
                foreach ($acquisition_qualification_array as $acquisition_qualification) {
                    $query->where('w_companies.acquisition_qualification', 'REGEXP', '(^|,)' . preg_quote($acquisition_qualification) . '($|,)');
                }
            }
            // ソフトウェアで絞り込み
            if (isset($software_array)) {
                foreach ($software_array as $software) {
                    $query->where('w_companies.software', 'REGEXP', '(^|,)' . preg_quote($software) . '($|,)');
                }
            }

            // 検索文字列で絞り込み
            if ($searchText != "") {
                $query->where(function($query) use ($searchText) {
                    // 企業の情報
                    $query->orWhere('w_companies.user_name', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_companies.company_name', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_companies.company_namecana', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_companies.selected_occupation', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_companies.intro', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_companies.industry', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_companies.others', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_companies.development_environment', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_companies.programming_language', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_companies.acquisition_qualification', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_companies.software', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_companies.office', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_news.article_title', 'LIKE', '%' . $searchText . '%');
                    $query->orWhere('w_news.summary', 'LIKE', '%' . $searchText . '%');
                });
            }

            // フォロー状況で検索
            if(in_array("フォローしている", $follow_status_array) && in_array("フォローされている", $follow_status_array)) {
                // 相互フォローの場合
                $query->join('w_follow as f1', 'w_companies.id', '=', 'f1.follow_recipient_id');
                $query->where('f1.follow_sender_id', $myId);
                $query->join('w_follow as f2', 'w_companies.id', '=', 'f2.follow_sender_id');
                $query->where('f2.follow_recipient_id', $myId);
            } else if(in_array("フォローしている", $follow_status_array)) {
                // フォローしている場合
                $query->join('w_follow', 'w_companies.id', '=', 'w_follow.follow_recipient_id');
                $query->where('w_follow.follow_sender_id', $myId);
            } else if(in_array("フォローされている", $follow_status_array)) {
                // フォローされている場合
                $query->join('w_follow', 'w_companies.id', '=', 'w_follow.follow_sender_id');
                $query->where('w_follow.follow_recipient_id', $myId);
            }

            $results = $query->skip($offset)
                ->take($perPage) //件数
                ->get();

            $resultsArray = json_decode(json_encode($results), true);

            \Log::info('SearchInternshipJobOffer:$resultsArray:');
            \Log::info($resultsArray);

            return json_encode($resultsArray);
            // if (count($resultsArray) == 0) {
            //     return json_encode("検索結果0件");
            // } else {
            //     return json_encode($resultsArray);
            // }
        } catch (\Exception $e) {
            \Log::info('SearchInternshipJobOffer:エラー');
            \Log::info($e);
            /*reactに返す*/
            return json_encode($e);
        }
    }
}
