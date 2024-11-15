<?php

namespace App\Http\Controllers\tag;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_tags;

class GetStudentSoftwareTagController extends Controller
{
    public function GetStudentSoftwareTagController(Request $request)
    {
        if ($request->input("All", "") == "tags") {
            $tag = \DB::table('w_tags')
                ->where('item_id', 5)
                ->get();
        } else {
            $tag = \DB::table('w_tags')
                ->where('item_id', 5)
                ->whereExists(function ($query) {
                    $query->select(\DB::raw(1))
                        ->from('w_users')
                        ->whereRaw('w_users.software REGEXP CONCAT("(^|,)", w_tags.name, "(,|$)")');
                })
                ->get();
        }

        \Log::info('GetSoftwareTagController.php:$tag:');
        \Log::info(json_decode($tag, true));
        return json_encode($tag);
    }
}
