<?php

namespace App\Http\Controllers;

use App\Models\w_users;
use App\Models\w_company_information;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;


class SettingController extends Controller
{
    // 色を変更する
    public function color_save(Request $request)
    {
        $color = $request->input('color');
        $colorType = $request->input('colorType');  // カラム名を取得する

        $id = "C_000000000002";

        // ユーザーをIDで検索する
        $user_color = w_users::where('id', $id)->first();

        // ユーザーが見つからない場合のエラーハンドリング
        if (!$user_color) {
            return response()->json(['error' => 'Record not found'], 404);
        }

        // カラム名に応じて色の値を更新して保存
        switch ($colorType) {
            case 'backgroundcolor':
                $user_color->background_color = $color;
                break;
            case 'fontcolor':
                $user_color->font_color = $color;
                break;
            default:
                return response()->json(['error' => 'Invalid color type'], 400);
        }

        $user_color->save();

        return response()->json(['message' => 'Color saved successfully', 'color' => $color, 'colortype' => $colorType]);
    }

    public function company_information(Request $request, $id)
    {
        $title = $request->input('title');
        $contents = $request->input('contents');
        $row_number = $request->input('row_number');
        $public_status = $request->input('public_status');
        // 日本の現在時刻を取得
        $now = Carbon::now('Asia/Tokyo');

        // レコードを取得
        $company_information = w_company_information::where('company_id', $id)
            ->where('id', $row_number)
            ->first();

        // レコードが存在しない場合は新しく作成
        if (!$company_information) {
            w_company_information::create([
                'company_id' => $id,
                'title' => $title,
                'contents' => $contents,
                'public_status' => $public_status,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            return response()->json(['message' => 'Company information created successfully']);
        } else {
            // タイトルとコンテンツが両方とも空でない場合
            if (!empty($title) && !empty($contents)) {
                $company_information->update([
                    'title' => $title,
                    'contents' => $contents,
                    'public_status' => $public_status,
                ]);

                return response()->json(['message' => 'タイトルとコンテンツどちらも入っている']);
            }
            // タイトルが空でない場合
            else if (!empty($title)) {
                $company_information->update([
                    'title' => $title,
                    'public_status' => $public_status,
                    'updated_at' => $now,
                ]);

                return response()->json(['message' => 'Company information title updated successfully']);
            }
            // コンテンツが空でない場合
            else if (!empty($contents)) {
                $company_information->update([
                    'contents' => $contents,
                    'public_status' => $public_status,
                    'updated_at' => $now,
                ]);

                return response()->json(['message' => 'Company information contents updated successfully']);
            }
        }

        // タイトルもコンテンツも空の場合
        return response()->json(['message' => 'No updates made'], 400);
    }

    public function add_new_row(Request $request, $id)
    {
        $title = $request->input('title');
        $contents = $request->input('contents');
        $row_number = $request->input('row_number');
        $public_status = $request->input('public_status');
        // 日本の現在時刻を取得
        $now = Carbon::now('Asia/Tokyo');

        // 新しいレコードを作成
        try {
            $add_new_record = w_company_information::create([
                'company_id' => $id,
                'title' => $title,
                'contents' => $contents,
                'public_status' => $public_status,
                'row_number' => $row_number,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
            Log::info('New Record ID Value: ', ['id' => $add_new_record->id]);
        } catch (\Exception $e) {
            Log::error('Error creating record: ' . $e->getMessage());
        }


        // 作成されたレコードのIDを含む$saved_rowを構築
        $saved_row = [
            'id' => "row" . $add_new_record->id,
            'title' => $add_new_record->title,
            'contents' => $add_new_record->contents,
            'public_status' => $add_new_record->public_status,
        ];

        return response()->json(['message' => 'Company information created successfully', 'saved_row' => $saved_row]);
    }



    public function setting_company_information(Request $request, $id)
    {
        $setting_company_information = w_company_information::where('company_id', $id)
            ->orderBy('row_number', 'asc')
            ->get();

        return response()->json(['company_information' => $setting_company_information]);

    }

    public function sortable_row_number(Request $request, $id)
    {
        $rowsData = $request->input('rowsData');

        // $rowsData は配列として渡されるため、その順番に従って row_number を更新する
        foreach ($rowsData as $index => $row) {
            $row_id = str_replace('row', '', $row['id']); // 'row1' などの 'row' を削除して数字のみを取得
            $item = w_company_information::where('company_id', $id)
                ->where('id', $row_id) // company_id の条件を追加
                ->firstOrFail();

            if ($item) {
                $item->update([
                    'row_number' => $index + 1
                ]);
            }
        }


        return response()->json(['message' => 'Row numbers updated successfully', 'rows_data' => $rowsData]);
    }


    public function row_delete(Request $request, $id)
    {
        $delete_id = $request->input('delete_id');

        $row_delete = w_company_information::where('id', $delete_id)
            ->where('company_id', $id)
            ->first();

        if ($row_delete) {
            $row_delete->delete();
            return response()->json(['message' => 'Row deleted successfully']);
        }

        return response()->json(['message' => 'Row not found'], 404);
    }



}