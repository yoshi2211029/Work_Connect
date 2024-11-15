<?php

namespace App\Http\Controllers\work;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\w_works;
use App\Models\w_images;
use App\Models\w_comment;

class GetWorkDetailController extends Controller
{
    public function GetWorkDetailController(Request $request)
    {
        $id = $request->input('id');
        try {
            $workList = w_works::join('w_users', 'w_works.creator_id', '=', 'w_users.id')
                ->select(
                    'w_users.programming_language AS users_programming_language',
                    'w_users.development_environment AS users_development_environment',
                    'w_users.other AS users_other',

                    'w_users.*',
                    'w_works.*',

                )->where('work_id', $id)->get();

            \Log::info('GetWorkDetailController:$id:');
            \Log::info($id);

            // $workList[0]-
            $workImageList = w_images::select('*')->where('work_id', $id)->get();

            \Log::info('GetWorkDetailController:$workList[0]:');
            \Log::info(json_decode(json_encode($workList[0]), true));

            $workImageSrc = "";
            foreach ($workImageList as $key => $imageList) {
                $workImageSrc = asset("storage/images/work/" . "$imageList->image");
                $workImageList[$key]->imageSrc = $workImageSrc;
            }

            if ($workList[0]) {
                $workList[0]->images = $workImageList;
            }

            $comments = w_comment::select('w_comments.*')
                ->leftJoin('w_users', function ($join) {
                    $join->on('w_comments.commenter_id', '=', 'w_users.id')
                        ->whereRaw('LEFT(w_comments.commenter_id, 1) = "S"');
                })
                ->leftJoin('w_companies', function ($join) {
                    $join->on('w_comments.commenter_id', '=', 'w_companies.id')
                        ->whereRaw('LEFT(w_comments.commenter_id, 1) = "C"');
                })
                ->select(
                    'w_comments.*',
                    'w_users.user_name AS commenter_user_name',
                    'w_companies.company_name AS commenter_company_name'
                )
                ->where('w_comments.various_id', $id)
                ->where('w_comments.genre', 'works')
                ->get();

            $workListArray = [];
            $workListArray["作品"] = json_decode(json_encode($workList), true);
            $workListArray["作品コメント"] = json_decode(json_encode($comments), true);


            // $workListがnullでない場合に$workImageListを結合する
            \Log::info('GetWorkDetailController:$workListArray:');
            \Log::info(json_encode($workListArray));
            // echo json_encode($workListArray);
            return json_encode($workListArray);
        } catch (\Exception $e) {
            \Log::info('GetWorkDetailController:user_name重複チェックエラー');
            \Log::info($e);
            /*reactに返す*/
            echo json_encode($e);
        }
    }
}
