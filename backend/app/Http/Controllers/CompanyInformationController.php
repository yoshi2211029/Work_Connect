<?php

namespace App\Http\Controllers;

use App\Models\w_company_information;
use App\Models\w_company;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;


class CompanyInformationController extends Controller
{

    public function company_informations($CompanyName)
    {
        $title_contents_array = $this->getCompanyInformationData($CompanyName);

        if ($title_contents_array === null) {
            return response()->json(['error' => '会社が見つかりません'], 404);
        }

        return response()->json(['title_contents' => $title_contents_array]);
    }

    public function company_informations_save(Request $request)
    {
        Log::info("company_informations_save通りました");

        $companyInformationArray = $request->input("CompanyInformation");
        $CompanyName = $request->input("CompanyName");

        foreach ($companyInformationArray as $companyInformation) {
            Log::info("Processing ID: {$companyInformation['id']}");

            $updated = w_company_information::where('id', $companyInformation['id'])
                ->update([
                    'title' => $companyInformation['title'],
                    'contents' => $companyInformation['contents'],
                    'company_id' => $companyInformation['company_id'],
                    'public_status' => $companyInformation['public_status'],
                    'row_number' => $companyInformation['row_number'],
                ]);

            if ($updated === 0) {
                $existingRecord = w_company_information::where('title', $companyInformation['title'])
                    ->where('contents', $companyInformation['contents'])
                    ->where('company_id', $companyInformation['company_id'])
                    ->first();

                if (!$existingRecord) {
                    w_company_information::create([
                        'title' => $companyInformation['title'],
                        'contents' => $companyInformation['contents'],
                        'company_id' => $companyInformation['company_id'],
                        'public_status' => $companyInformation['public_status'],
                        'row_number' => $companyInformation['row_number'],
                    ]);
                } else {
                    Log::info("Duplicate entry found, not creating a new record for ID: {$companyInformation['id']}");
                }
            }
        }

        $title_contents_array = $this->getCompanyInformationData($CompanyName);

        return response()->json(['message' => '処理が完了しました', 'title_contents' => $title_contents_array]);
    }

    private function getCompanyInformationData($CompanyName)
    {
        $company = w_company::where('user_name', $CompanyName)->first();

        if (!$company) {
            Log::info("会社が見つかりませんでした: {$CompanyName}");
            return null;
        }

        $Company_Id = $company->id;

        $company_information = w_company_information::where('company_id', $Company_Id)
            ->where('public_status', 1)
            ->join('w_companies', 'w_companies_information.company_id', '=', 'w_companies.id')
            ->select(
                'w_companies_information.*',
                'w_companies.*',
                'w_companies_information.id as company_information_id',
                'w_companies.company_name as company_name'
            )
            ->orderBy('w_companies_information.row_number', 'asc')
            ->get();

        if ($company_information->isNotEmpty()) {
            return $company_information->map(function ($item) {
                return [
                    'title' => $item->title,
                    'contents' => $item->contents,
                    'company_name' => $item->company_name,
                    'id' => $item->company_information_id,
                    'company_id' => $item->company_id,
                    'public_status' => $item->public_status,
                ];
            })->toArray();
        }

        Log::info("企業情報が見つかりませんでした");
        return [];
    }

    public function all_company_informations_pull(Request $request)
    {

        // リクエストから名前を取得し、w_compinesテーブルからidを取得
        $InformationUserName = $request->input("InformationUserName");

        $company = w_company::where('user_name', $InformationUserName)->first();

        $CompanyId = $company->id;

        // 企業情報が存在するかチェック
        $company_information = w_company_information::where('company_id', $CompanyId)
            ->join('w_companies', 'w_companies_information.company_id', '=', 'w_companies.id')
            ->select(
                'w_companies_information.*',
                'w_companies.*',
                'w_companies_information.id as company_information_id',
                'w_companies.company_name as company_name'
            )
            ->orderBy('w_companies_information.row_number', 'asc')
            ->get();

        // 企業情報が存在するかチェック
        if ($company_information->isNotEmpty()) {
            // title と contents を配列にまとめる
            $title_contents_array = $company_information->map(function ($item) {
                return [
                    'title' => $item->title,
                    'contents' => $item->contents,
                    'company_name' => $item->company_name,  // 直接アクセス
                    'id' => $item->company_information_id,  // 直接アクセス
                    'company_id' => $item->company_id,       // 直接アクセス
                    'public_status' => $item->public_status, // 直接アクセス
                    'row_number' => $item->row_number // 直接アクセス
                ];
            });
        } else {
            // 企業情報がない場合は未保存のままの配列をデフォルトとして入れる
            $title_contents_array = $this->CompanyInformationDefaultInsert($company);
            Log::info("企業情報が見つかりませんでした");
        }

        return response()->json([
            'title_contents' => $title_contents_array,
            'id' => $CompanyId
        ]);
    }

    //企業情報が0件の場合に、テンプレートの情報を保存する
    public function CompanyInformationDefaultInsert($company)
    {
        $DefaultInsertArray = [
            ['title' => '企業名', 'contents' => $company->company_name],
            ['title' => '企業概要', 'contents' => $company->intro],
            ['title' => '本社所在地', 'contents' => $company->address]
        ];

        foreach ($DefaultInsertArray as $index => $data) {
            w_company_information::create([
                'title' => $data['title'],
                'contents' => $data['contents'],
                'company_id' => $company->id,
                'public_status' => 0,
                'row_number' => $index + 1,
            ]);
        }

        // 追加した企業情報を取得
        $company_information = w_company_information::where('company_id', $company->id)
            ->join('w_companies', 'w_companies_information.company_id', '=', 'w_companies.id')
            ->select(
                'w_companies_information.*',
                'w_companies.*',
                'w_companies_information.id as company_information_id',
                'w_companies.company_name as company_name'
            )
            ->orderBy('w_companies_information.row_number', 'asc')
            ->get();

        // title と contents を配列にまとめる
        return $company_information->map(function ($item) {
            return [
                'title' => $item->title,
                'contents' => $item->contents,
                'company_name' => $item->company_name,  // 直接アクセス
                'id' => $item->company_information_id,  // 直接アクセス
                'company_id' => $item->company_id,       // 直接アクセス
                'public_status' => $item->public_status, // 直接アクセス
                'row_number' => $item->row_number // 直接アクセス
            ];
        });
    }
}
