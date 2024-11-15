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
        Schema::create('w_pre_companies', function (Blueprint $table) {
            $table->id(); // idを主キーとして設定、自動増分
            $table->string('urltoken', 128)->unique(); // URLトークン
            $table->text('company_name'); // 会社名
            $table->string('mail', 50); // メール
            $table->text('password'); // パスワード
            $table->dateTime('date'); // 日付
            $table->tinyInteger('flag')->default(0); // フラグ
            $table->timestamps(); // created_atとupdated_atのカラムを自動作成
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('w_pre_companies');
    }
};
