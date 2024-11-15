<?php

namespace App\Http\Controllers\tag;

use App\Http\Controllers\Controller;
use App\Models\w_tags;
use Illuminate\Http\Request;

class GetCompanyDevelopmentEnvironmentTagController extends Controller
{
    public function GetCompanyDevelopmentEnvironmentTagController(Request $request)
    {
        if ($request->input("All", "") == "tags") {
            $tag = \DB::table('w_tags')
                ->where('item_id', 23)
                ->get();
        } else {
            $tag = \DB::table('w_tags')
                ->where('item_id', 23)
                ->whereExists(function ($query) {
                    $query->select(\DB::raw(1))
                        ->from('w_companies')
                        ->whereRaw('w_companies.development_environment	 REGEXP CONCAT("(^|,)", w_tags.name, "(,|$)")');
                })
                ->get();
        }

        \Log::info('GetCompanyDevelopmentEnvironmentTagController.php:$tag:');
        \Log::info(json_decode($tag, true));
        return json_encode($tag);
    }
}
