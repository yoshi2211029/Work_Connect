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
        //
        Schema::create('w_write_forms', function (Blueprint $table) {
            $table->id(); // idを主キーとして設定、自動増分
            $table->string('user_id', 255)->nullable(); //学生のID
            $table->string('news_id')->nullable(); // どのニュースの応募用フォームなのか
            $table->string('recipient_company_id')->nullable(); // 送信先の企業のID
            $table->json('write_form')->nullable(); // JSON形式のフォームデータ
            $table->dateTime('writeformDateTime')->nullable(); // 最終編集/公開日時
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::dropIfExists('w_write_forms');

    }
};
