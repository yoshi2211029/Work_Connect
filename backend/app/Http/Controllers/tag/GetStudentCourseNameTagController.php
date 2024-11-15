<?php

namespace App\Http\Controllers\tag;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_tags;

class GetStudentCourseNameTagController extends Controller
{
    public function GetStudentCourseNameTagController(Request $request)
    {
        if ($request->input("All", "") == "tags") {
            $tag = \DB::table('w_tags')
                ->where('item_id', 20)
                ->get();
        } else {
            $tag = \DB::table('w_tags')
                ->where('item_id', 20)
                ->whereExists(function ($query) {
                    $query->select(\DB::raw(1))
                        ->from('w_users')
                        ->whereRaw('w_users.course_name REGEXP CONCAT("(^|,)", w_tags.name, "(,|$)")');
                })
                ->get();
        }


        \Log::info('GetCourseNameTagController.php:$tag:');
        \Log::info($tag);
        return json_encode($tag);
    }
}
