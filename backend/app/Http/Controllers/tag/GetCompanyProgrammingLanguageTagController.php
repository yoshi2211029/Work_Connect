<?php

namespace App\Http\Controllers\tag;

use App\Http\Controllers\Controller;
use App\Models\w_tags;
use Illuminate\Http\Request;

class GetCompanyProgrammingLanguageTagController extends Controller
{
    public function GetCompanyProgrammingLanguageTagController(Request $request)
    {
        if ($request->input("All", "") == "tags") {
            $tag = \DB::table('w_tags')
                ->where('item_id', 24)
                ->get();
        } else {
            $tag = \DB::table('w_tags')
                ->where('item_id', 24)
                ->whereExists(function ($query) {
                    $query->select(\DB::raw(1))
                        ->from('w_companies')
                        ->whereRaw('w_companies.programming_language REGEXP CONCAT("(^|,)", w_tags.name, "(,|$)")');
                })
                ->get();
        }

        \Log::info('GetCompanyProgrammingLanguageTagController.php:$tag:');
        \Log::info(json_decode($tag, true));
        return json_encode($tag);
    }
}
