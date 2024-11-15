<?php

namespace App\Http\Controllers\movie;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_movies;

class GetMovieListController extends Controller
{
    public function GetMovieListController(Request $request)
    {
        try {
            $page = (int) $request->query('page', 1);
            $perPage = 20; //一ページ当たりのアイテム数
            // すでに取得したデータをスキップするためのオフセット計算
            $offset = ($page - 1) * $perPage;

            $sortOption = $request->query('sort');

            $userName = $request->query('userName');



            $movieList = w_movies::select(
                'w_movies.*',
                'w_users.user_name',
                'w_users.icon',
            )->join('w_users', 'w_movies.creator_id', '=', 'w_users.id');

            if ($userName !== null) {
                // `userName` が指定されている場合のみフィルタリング
                $movieList->where('w_users.user_name', $userName);
            }

            if ($sortOption === 'orderNewPostsDate') {
                $movieList->orderBy('w_movies.created_at', 'desc');
            }
            if ($sortOption === 'orderOldPostsDate') {
                $movieList->orderBy('w_movies.created_at', 'asc');
            }
            $movieList = $movieList->skip($offset)
                ->take($perPage) //件数
                ->get();

            $movieListArray = json_decode(json_encode($movieList), true);

            \Log::info('GetMovieListController:$movieListArray:');
            \Log::info(json_encode($movieListArray));
            \Log::info('GetMovieListController:$:');
            \Log::info(json_encode($sortOption));

            return json_encode($movieListArray);
        } catch (\Exception $e) {
            \Log::info('GetMovieListController:user_name重複チェックエラー');
            \Log::info($e);

            /*reactに返す*/
            echo json_encode($e);
        }
    }
}
