<?php

namespace App\Http\Controllers\tag;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_tags;


class GetLanguageTagController extends Controller
{
    public function GetLanguageTagController(Request $request)
    {
        if ($request->input("All", "") == "tags") {
            $tag = \DB::table('w_tags')
                ->where('item_id', 12)
                ->get();
        } else {
            $tag = \DB::table('w_tags')
                ->where('item_id', 12)
                ->whereExists(function ($query) {
                    $query->select(\DB::raw(1))
                        ->from('w_works')
                        ->whereRaw('w_works.programming_language REGEXP CONCAT("(^|,)", w_tags.name, "(,|$)")');
                })
                ->get();
        }
        return json_encode($tag);
    }
}
