<?php

namespace App\Http\Controllers\profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_users;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PostMypageController extends Controller
{
    public function PostMypageController(Request $request)
    {

        // 学生か企業か判断
        $kind = $request->input('kind');

        if($kind === "s"){

            // 学生側の処理

            // reactからデータを取得
            // 必須項目
            $ProfileUserName = $request->input('ProfileUserName');

            $StudentSurName = $request->input('StudentSurName');
            $StudentName = $request->input('StudentName');
            $StudentKanaSurName = $request->input('StudentKanaSurName');
            $StudentKanaName = $request->input('StudentKanaName');
            $Intro = $request->input('Intro');
            $Graduation = $request->input('Graduation');
            $SchoolName = $request->input('SchoolName');
            // 詳細項目(自動的にNULLを設定)
            $Icon = $request->input('Icon') === "" ? null : $request->input('Icon');
            $DepartmentName = $request->input('DepartmentName') === "" ? null : $request->input('DepartmentName');
            $FacultyName = $request->input('FacultyName') === "" ? null : $request->input('FacultyName');
            $MajorName = $request->input('MajorName') === "" ? null : $request->input('MajorName');
            $CourseName = $request->input('CourseName') === "" ? null : $request->input('CourseName');
            $Environment = $request->input('Environment') === "" ? null : $request->input('Environment');
            $Hobby = $request->input('Hobby') === "" ? null : $request->input('Hobby');
            $Prefecture = $request->input('Prefecture') === "" ? null : $request->input('Prefecture');
            $DesiredOccupation = $request->input('DesiredOccupation') === "" ? null : $request->input('DesiredOccupation');
            $ProgrammingLanguage = $request->input('ProgrammingLanguage') === "" ? null : $request->input('ProgrammingLanguage');
            $Qualification = $request->input('Qualification') === "" ? null : $request->input('Qualification');
            $Software = $request->input('Software') === "" ? null : $request->input('Software');

            try {
                // updateする項目
                $data = [
                    'icon' => $Icon,
                    'student_surname' => $StudentSurName,
                    'student_name' => $StudentName,
                    'student_kanasurname' => $StudentKanaSurName,
                    'student_kananame' => $StudentKanaName,
                    'intro' => $Intro,
                    'graduation_year' => $Graduation,
                    'school_name' => $SchoolName,
                    'department_name' => $DepartmentName,
                    'faculty_name' => $FacultyName,
                    'major_name' => $MajorName,
                    'course_name' => $CourseName,
                    'development_environment' => $Environment,
                    'hobby' => $Hobby,
                    'desired_work_region' => $Prefecture,
                    'desired_occupation' => $DesiredOccupation,
                    'programming_language' => $ProgrammingLanguage,
                    'acquisition_qualification' => $Qualification,
                    'software' => $Software,
                ];
                // user_nameを指定しデータを更新
                DB::table('w_users')
                ->where('user_name', $ProfileUserName)
                ->update($data);

                return json_encode(true);

            } catch (\Exception $e) {

                \Log::info('registerController:新規登録データのDB保存処理エラー');
                \Log::info($e);

            }

        } if($kind === "c") {

            // 学生側の処理

            // reactからデータを取得
            // 必須項目
            $ProfileUserName = $request->input('ProfileUserName');

            $CompanyName = $request->input('CompanyName');
            $CompanyKanaName = $request->input('CompanyKanaName');
            $Intro = $request->input('Intro');
            $IntroVideo = $request->input('IntroVideo');
            $CompanyAddress = $request->input('CompanyAddress');
            $CompanyAddressMap = $request->input('CompanyAddressMap');
            // 詳細項目(自動的にNULLを設定)
            $Icon = $request->input('Icon') === "" ? null : $request->input('Icon');
            $Prefecture = $request->input('Prefecture') === "" ? null : $request->input('Prefecture');
            $SelectedOccupation = $request->input('SelectedOccupation') === "" ? null : $request->input('SelectedOccupation');
            $Industry = $request->input('Industry') === "" ? null : $request->input('Industry');
            $Environment = $request->input('Environment') === "" ? null : $request->input('Environment');
            $ProgrammingLanguage = $request->input('ProgrammingLanguage') === "" ? null : $request->input('ProgrammingLanguage');
            $Qualification = $request->input('Qualification') === "" ? null : $request->input('Qualification');
            $Software = $request->input('Software') === "" ? null : $request->input('Software');
            $CompanyHPMap = $request->input('CompanyHPMap') === "" ? null : $request->input('CompanyHPMap');

            try {
                // updateする項目
                $data = [
                    'icon' => $Icon,///変更
                    'company_name' => $CompanyName,
                    'company_namecana' => $CompanyKanaName,
                    'intro' => $Intro,
                    'video_url' => $IntroVideo,
                    'address' => $CompanyAddress,
                    'map_url' => $CompanyAddressMap,

                    'prefecture' => $Prefecture,
                    'selected_occupation' => $SelectedOccupation,
                    'industry' => $Industry,
                    'development_environment' => $Environment,
                    'programming_language' => $ProgrammingLanguage,
                    'acquisition_qualification' => $Qualification,
                    'software' => $Software,
                    'hp_url' => $CompanyHPMap,
                ];
                // user_nameを指定しデータを更新
                DB::table('w_companies')
                ->where('user_name', $ProfileUserName)
                ->update($data);

                return json_encode(true);

            } catch (\Exception $e) {

                \Log::info('registerController:新規登録データのDB保存処理エラー');
                \Log::info($e);

            }

        }



    }


    // 画像のアップロード
    public function UploadImageController(Request $request){

        if ($request->hasFile('image')) {
            // 画像の読み込み
            $file = $request->file('image');
            // 重複しない名前を作る
            $filename = time() . '-' . $file->getClientOriginalName();
            // パスを生成
            $destinationPath = public_path('storage/images/userIcon');
            // アップロード
            $file->move($destinationPath, $filename);

            // reactにデータを返す。
            return response()->json(['fileName' => $filename, 'path' => asset('storage/images/userIcon/' . $filename)]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }

    public function CompanyPostMypageController(Request $request)
    {
        // reactからデータを取得
        // 必須項目
        $CompanyName = $request->input('CompanyName');
        $CompanyKanaName = $request->input('CompanyKanaName');
        $UserName = $request->input('UserName');
        $Intro = $request->input('Intro');
        $IntroVideo = $request->input('IntroVideo');
        $CompanyAddress = $request->input('CompanyAddress');
        $CompanyAddressMap = $request->input('CompanyAddressMap');

        // 詳細項目(自動的にNULLを設定)
        $Prefecture = $request->input('Prefecture') ? $request->input('Prefecture') : null;
        $SelectedOccupation = $request->input('SelectedOccupation') ? $request->input('SelectedOccupation') : null;
        $Industry = $request->input('Industry') ? $request->input('Industry') : null;
        $Environment = $request->input('Environment') ? $request->input('Environment') : null;
        $ProgrammingLanguage = $request->input('ProgrammingLanguage') ? $request->input('ProgrammingLanguage') : null;
        $Qualification = $request->input('Qualification') ? $request->input('Qualification') : null;
        $Software = $request->input('Software') ? $request->input('Software') : null;
        $CompanyHPMap = $request->input('CompanyHPMap') ? $request->input('CompanyHPMap') : null;

        try {
            // updateする項目
            $data = [
                'company_name' => $CompanyName,
                'company_namecana' => $CompanyKanaName,
                'selected_occupation' => $SelectedOccupation,
                'user_name' => $UserName,
                'intro' => $Intro,
                'office' => $Prefecture,
                'industry' => $Industry,
                'programming_language' => $ProgrammingLanguage,
                'development_environment' => $Environment,
                'software' => $Software,
                'qualification' => $Qualification,
                'address' => $CompanyAddress,
                'map_url' => $CompanyAddressMap,
                'video_url' => $IntroVideo,
                'hp_url' => $CompanyHPMap
            ];

            \Log::info(var_export($data, true));

            // user_nameを指定しデータを更新
            DB::table('w_companies')
                ->where('user_name', $UserName)
                ->update($data);

            return json_encode(true);
        } catch (\Exception $e) {

            \Log::info('registerController:新規登録データのDB保存処理エラー');
            \Log::info($e);
        }
    }


}
