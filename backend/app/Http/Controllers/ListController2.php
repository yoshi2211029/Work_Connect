<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ListController2 extends Controller
{

 
    //postの場合
    public function DB_connection2(Request $request){
      // POSTされたデータを取得
      //$userName = filter_input(INPUT_POST, 'inputValue', FILTER_SANITIZE_STRING);
      // // リクエストデータを取得
      // $rawData = file_get_contents('php://input');
      /////////////////////////////////////////////
      //$userName = $request->input('inputValue');
      /////////////////////////////////////////////

      $userName = $request->all();
    
      
      // // JSON をデコード
      //$userName = 'bandou';
  
      // // リクエストデータの取得
      // $userName = $data['inputValue'] ?? null;
     
       \Log::info('post_InputValue: ' . $userName);
  
      if (empty($userName)) {
        Log::error('UserName is empty or null');
      }
      //$user_name = $_GET['user_name'];
      // データベースから情報を取得
      /////////////////////////////////////////
      // $userInfo = DB::table('w_users')
      // ->where('user_name', $userName)
      // ->first();
      ////////////////////////////////////////////////
      try{
        \Log::info('userInfoaaaaaaaaaaaaaaaaaa: ');
        $userInfo = DB::table('w_users')->where('user_name', $result['inputValue'])->exists();
        
      }catch(\Exception $e){
        \Log::info('userInfoaiiiiiiiiiiiiiiiiiii: ');
        $e->getMessage();
        
      }
      
      
      //json_encode($userInfo,JSON_UNESCAPED_UNICODE);
      // 取得した情報を返す
      return response()->json($userInfo, 200, [], JSON_UNESCAPED_UNICODE);
      //return response()->json($userInfo, 200, [], JSON_UNESCAPED_UNICODE);
      }
 }

