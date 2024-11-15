<?php

namespace App\Http\Controllers\tag;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_tags;

class GetStudentProgrammingLanguageTagController extends Controller
{
    public function GetStudentProgrammingLanguageTagController(Request $request)
    {
        if ($request->input("All", "") == "tags") {
            $tag = \DB::table('w_tags')
                ->where('item_id', 4)
                ->get();
        } else {
            $tag = \DB::table('w_tags')
                ->where('item_id', 4)
                ->whereExists(function ($query) {
                    $query->select(\DB::raw(1))
                        ->from('w_users')
                        ->whereRaw('w_users.programming_language REGEXP CONCAT("(^|,)", w_tags.name, "(,|$)")');
                })
                ->get();
        }

        \Log::info('GetStudentProgrammingLanguageTagController.php:$tag:');
        \Log::info(json_decode($tag, true));
        return json_encode($tag);
    }
}