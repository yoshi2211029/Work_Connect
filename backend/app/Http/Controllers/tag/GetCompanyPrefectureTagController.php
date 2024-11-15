<?php

namespace App\Http\Controllers\tag;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GetCompanyPrefectureTagController extends Controller
{
    public function GetCompanyPrefectureTagController(Request $request)
    {

        if ($request->input("All", "") == "tags") {
            $tag = \DB::table('w_tags')
                ->where('item_id', 16)
                ->get();
        } else {
            $tag = \DB::table('w_tags')
                ->where('item_id', 16)
                ->whereExists(function ($query) {
                    $query->select(\DB::raw(1))
                        ->from('w_companies')
                        ->whereRaw('w_companies.prefecture REGEXP CONCAT("(^|,)", w_tags.name, "(,|$)")');
                })
                ->get();
        }

        \Log::info('GetAcquisitionQualificationTagController.php:$tag:');
        \Log::info(json_decode($tag, true));
        return json_encode($tag);
    }
}
