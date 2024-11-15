<?php

namespace App\Http\Controllers\tag;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_tags;


class GetVideoGenreTagController extends Controller
{
    public function GetVideoGenreTagController(Request $request)
    {
        if ($request->input("All", "") == "tags") {
            $tag = \DB::table('w_tags')
                ->where('item_id', 10)
                ->get();
        } else {
            $tag = \DB::table('w_tags')
                ->where('item_id', 10)
                ->whereExists(function ($query) {
                    $query->select(\DB::raw(1))
                        ->from('w_movies')
                        ->whereRaw('w_movies.genre REGEXP CONCAT("(^|,)", w_tags.name, "(,|$)")');
                })
                ->get();
        }
        return json_encode($tag);
    }
}
