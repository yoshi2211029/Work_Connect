<?php

namespace App\Http\Controllers\movie;

use App\Http\Controllers\Controller;
use App\Models\w_comment;
use Illuminate\Http\Request;
use App\Models\w_movies;

class GetMovieDetailController extends Controller
{
    public function GetMovieDetailController(Request $request)
    {
        $id = $request->input('id');
        try {
            $movieList = w_movies::join('w_users', 'w_movies.creator_id', '=', 'w_users.id')
                ->select(
                    'w_users.programming_language AS users_programming_language',
                    'w_users.development_environment AS users_development_environment',
                    'w_users.other AS users_other',

                    'w_users.*',
                    'w_movies.*',

                )->where('movie_id', $id)->get();


            $comments = w_comment::select('w_comments.*')
                ->leftJoin('w_users', function ($join) {
                    $join->on('w_comments.commenter_id', '=', 'w_users.id')
                        ->whereRaw('LEFT(w_comments.commenter_id, 1) = "S"');
                })
                ->leftJoin('w_companies', function ($join) {
                    $join->on('w_comments.commenter_id', '=', 'w_companies.id')
                        ->whereRaw('LEFT(w_comments.commenter_id, 1) = "C"');
                })
                ->select(
                    'w_comments.*',
                    'w_users.user_name AS commenter_user_name',
                    'w_companies.company_name AS commenter_company_name'
                )
                ->where('w_comments.various_id', $id)
                ->where('w_comments.genre', 'movies')
                ->get();

            $movieListArray = [];
            $movieListArray["動画"] = json_decode(json_encode($movieList), true);
            $movieListArray["動画コメント"] = json_decode(json_encode($comments), true);

            \Log::info('GetMovieDetailController:$id:');
            \Log::info($id);

            \Log::info('GetMovieDetailController:$comments:');
            \Log::info($comments);

            \Log::info('GetMovieDetailController:$movieListArray:');
            \Log::info(json_decode(json_encode($movieListArray), true));

            return json_encode($movieListArray);
        } catch (\Exception $e) {
            \Log::info('GetMovieDetailController:user_name重複チェックエラー');
            \Log::info($e);
            /*reactに返す*/
            echo json_encode($e);
        }
    }
}
