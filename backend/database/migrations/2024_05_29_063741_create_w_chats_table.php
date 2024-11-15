<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('w_chats', function (Blueprint $table) {
            $table->id(); // 自動インクリメントのデフォルトのid
            $table->text('message'); // メッセージ
            $table->string('send_user_id', 16); // 送信者のユーザーID
            $table->string('get_user_id', 16); // 受信者のユーザーID
            $table->dateTime('send_datetime'); // 送信日時
            $table->tinyInteger('check_read')->default(0); // 既読確認
            $table->timestamps(); // created_atとupdated_atのカラムを自動作成
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('w_chats');
    }
};
