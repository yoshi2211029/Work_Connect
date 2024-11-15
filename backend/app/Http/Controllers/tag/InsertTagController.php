<?php

namespace App\Http\Controllers\tag;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_tags;

class InsertTagController extends Controller
{
    public function InsertTagController(Request $request)
    {
        $name = $request->input("name");
        $item_id = $request->input("item_id");
        try {
            if (!w_tags::where('name', $name)->where('item_id', $item_id)->exists()) {
                $language_tag = w_tags::create([
                    "name" => $name,
                    "item_id" => $item_id
                ]);
                \Log::info('タグ作成成功');
                \Log::info($language_tag);
            } else {
                \Log::info('タグが重複しています');
            }

        } catch (\Exception $e) {
            $language_tag = $e;
            \Log::info('タグ作成失敗');
            \Log::info($e);
        }
        echo json_encode($language_tag);
    }
}
