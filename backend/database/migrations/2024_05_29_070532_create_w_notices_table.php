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
        Schema::create('w_notices', function (Blueprint $table) {
            $table->id(); // idを主キーとして設定、自動増分
            $table->string('get_user_id', 16)->nullable(); // 受信ユーザーID
            $table->string('send_user_id', 16)->nullable(); // 送信ユーザーID
            $table->text('category')->nullable(); // カテゴリー
            $table->text('detail')->nullable(); // 詳細
            $table->integer('already_read')->nullable(); // 既読フラグ
            $table->dateTime('notice_datetime')->nullable(); // 通知日時
            $table->timestamps(); // created_atとupdated_atのカラムを自動作成
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('w_notices');
    }
};
