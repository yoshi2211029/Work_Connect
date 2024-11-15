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
        Schema::create('w_companies', function (Blueprint $table) {
            $table->string('id', 16)->primary(); // idを主キーとして設定
            $table->text('company_name')->nullable(); // 会社名
            $table->text('mail')->nullable(); // メール
            $table->text('password')->nullable(); // パスワード
            $table->text('thumbnail_id')->nullable(); // サムネイルID
            $table->text('icon_id')->nullable(); // アイコンID
            $table->text('intro')->nullable(); // 紹介文
            $table->text('office')->nullable(); // オフィス
            $table->text('industry')->nullable(); // 業界
            $table->text('others')->nullable(); // その他
            $table->text('address')->nullable(); // 住所
            $table->text('map_url')->nullable(); // 地図URL
            $table->text('hp_url')->nullable(); // ホームページURL
            $table->text('video_url')->nullable(); // ビデオURL
            $table->text('background_color')->nullable(); // 背景色
            $table->dateTime('registered_datetime')->nullable(); // 登録日時
            $table->timestamps(); // created_atとupdated_atのカラムを自動作成
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('w_companies');
    }
};
