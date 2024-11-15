<?php

namespace App\Http\Controllers\tag;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_tags;

class GetCompanyNameListController extends Controller
{
    public function GetCompanyNameListController()
    {
        $tag = \DB::table('w_companies')
            ->select('company_name')
            ->get();

        // \Log::info('GetCompanyNameListController.php:$tag:');
        // \Log::info($tag);
        return json_encode($tag);
    }
}
