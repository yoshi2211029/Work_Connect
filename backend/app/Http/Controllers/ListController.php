<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ListController extends Controller
{
 public function index(){
  return response()->json(
   [
    "post" => [
         [
	  "id" => 1,
          "title" => "タイトルです",
          "content" => "投稿内容です投稿内容です投稿内容です投稿内容です投稿内容です。"
         ],
         [
	  "id" => 2,
          "title" => "ういういうい",
          "content" => "ああああああああああああああああああ"
         ],
         
       ]
    ],
    200,[],
    JSON_UNESCAPED_UNICODE //文字化け対策
   );
  }
  //getの場合
  public function DB_connection(Request $request){

    // POSTされたデータを取得
    //$userName = filter_input(INPUT_POST, 'inputValue', FILTER_SANITIZE_STRING);
    // // リクエストデータを取得
    // $rawData = file_get_contents('php://input');
    $userName = $request->input('inputValue');
    // $userall = $request->all();
   
    // // JSON をデコード
    $eeeee = 'kaneda';
    // // リクエストデータの取得
    // $userName = $data['inputValue'] ?? null;
    //\Log::info('Request data: ', $userall);
    \Log::info('****************************************');
    \Log::info('eeeee: ' . $eeeee);
    \Log::info('get_InputValue: ' . json_encode($userName));

    //$user_name = $_GET['user_name'];
    // データベースから情報を取得
    if(empty($userName)){
      $userInfo1 = DB::table('w_users')
      ->where('user_name', $eeeee)
      ->first();
      \Log::info('userInfo1: ' . json_encode($userInfo1));
      return response()->json($userInfo1, 200, [], JSON_UNESCAPED_UNICODE);
      
      // \Log::info('get_InputValue(a): ' . $userName);
    } else {
      
      $userInfo2 = DB::table('w_users')
      // ->where('user_name', json_encode($userName))
      ->where('user_name', "$userName")
      ->first();
      \Log::info('get_InputValue(b): ' . json_encode($userName));
      \Log::info('userInfo2: ' . json_encode($userInfo2));
      // return json_encode($userInfo2);
      /*reactに返す*/
      echo json_encode($userInfo2);
      //return response()->json($userInfo2, 200, [], JSON_UNESCAPED_UNICODE);
      //return '<script>alert("やあ")</script>';
    }
    
    //json_encode($userInfo,JSON_UNESCAPED_UNICODE);
    // 取得した情報を返す
    
    //return response()->json($userInfo, 200, [], JSON_UNESCAPED_UNICODE);
    }
    //postの場合
    // public function DB_connection2(Request $request){
    //   // POSTされたデータを取得
    //   //$userName = filter_input(INPUT_POST, 'inputValue', FILTER_SANITIZE_STRING);
    //   // // リクエストデータを取得
    //   // $rawData = file_get_contents('php://input');
    //   /////////////////////////////////////////////
    //   //$userName = $request->input('inputValue');
    //   /////////////////////////////////////////////

    //   $userName = $request->all();
    
      
    //   // // JSON をデコード
    //   //$userName = 'bandou';
  
    //   // // リクエストデータの取得
    //   // $userName = $data['inputValue'] ?? null;
     
    //    \Log::info('InputValue1111: ' . $userName);
  
    //   if (empty($userName)) {
    //     Log::error('UserName is empty or null');
    //   }
    //   //$user_name = $_GET['user_name'];
    //   // データベースから情報を取得
    //   /////////////////////////////////////////
    //   // $userInfo = DB::table('w_users')
    //   // ->where('user_name', $userName)
    //   // ->first();
    //   ////////////////////////////////////////////////
    //   try{
    //     \Log::info('userInfoaaaaaaaaaaaaaaaaaa: ');
    //     $userInfo = DB::table('w_users')->where('user_name', $result['inputValue'])->exists();
        
    //   }catch(\Exception $e){
    //     \Log::info('userInfoaiiiiiiiiiiiiiiiiiii: ');
    //     $e->getMessage();
        
    //   }
      
      
    //   //json_encode($userInfo,JSON_UNESCAPED_UNICODE);
    //   // 取得した情報を返す
    //   return response()->json($userInfo, 200, [], JSON_UNESCAPED_UNICODE);
    //   //return response()->json($userInfo, 200, [], JSON_UNESCAPED_UNICODE);
    //   }
 }

