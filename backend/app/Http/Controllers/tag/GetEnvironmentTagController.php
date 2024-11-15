<?php

namespace App\Http\Controllers\tag;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_tags;


class GetEnvironmentTagController extends Controller
{
    public function GetEnvironmentTagController(Request $request)
    {
        if ($request->input("All", "") == "tags") {
            $tag = \DB::table('w_tags')
                ->where('item_id', 13)
                ->get();
        } else {
            $tag = \DB::table('w_tags')
                ->where('item_id', 13)
                ->whereExists(function ($query) {
                    $query->select(\DB::raw(1))
                        ->from('w_works')
                        ->whereRaw('w_works.development_environment REGEXP CONCAT("(^|,)", w_tags.name, "(,|$)")');
                })
                ->get();
        }
        return json_encode($tag);
    }
}
