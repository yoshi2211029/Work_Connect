<?php

namespace App\Http\Controllers\tag;

use App\Http\Controllers\Controller;
use App\Models\w_tags;
use Illuminate\Http\Request;

class GetCompanyAcquisitionQualificationTagController extends Controller
{
    public function GetCompanyAcquisitionQualificationTagController(Request $request)
    {
        if ($request->input("All", "") == "tags") {
            $tag = \DB::table('w_tags')
                ->where('item_id', 25)
                ->get();
        } else {
            $tag = \DB::table('w_tags')
                ->where('item_id', 25)
                ->whereExists(function ($query) {
                    $query->select(\DB::raw(1))
                        ->from('w_companies')
                        ->whereRaw('w_companies.acquisition_qualification	 REGEXP CONCAT("(^|,)", w_tags.name, "(,|$)")');
                })
                ->get();
        }

        \Log::info('GetCompanyAcquisitionQualificationTagController.php:$tag:');
        \Log::info(json_decode($tag, true));
        return json_encode($tag);
    }
}
