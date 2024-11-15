<?php

namespace App\Http\Controllers\search;

use App\Http\Controllers\Controller;
use App\Models\w_company;
use App\Models\w_news;
use Illuminate\Http\Request;

class SearchInternshipJobOffer extends Controller
{
    /* 企業の検索処理 */
    public function SearchInternshipJobOffer(Request $request)
    {
        try {
            $page = (int) $request->query('page', 1);
            $perPage = 20; //一ページ当たりのアイテム数
            $offset = ($page - 1) * $perPage;
            // 検索文字列を取得
            $searchText = $request->input('searchText', "");

            // 絞り込まれた職種を配列で取得
            $company_name_array = $request->input('company_name', []);

            \Log::info('SearchCompanyController:$company_name_array:');
            \Log::info($company_name_array);

            $query = w_news::query();

            $query->select(
                'w_news.*',
                'w_companies.*'
            );

            $query->join('w_companies', 'w_news.company_id', '=', 'w_companies.id');

            // 企業名で絞り込み
            if (isset($company_name_array)) {
                foreach ($company_name_array as $company_name_array) {
                    $query->where('w_companies.company_name', 'REGEXP', '(^|,)' . preg_quote($company_name_array) . '($|,)');
                }
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
