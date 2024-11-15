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
        Schema::create('w_create_forms', function (Blueprint $table) {
            $table->id(); // idを主キーとして設定、自動増分
            $table->string('company_id', 255)->nullable();
            $table->string('news_id')->nullable(); // どのニュースの応募用フォームなのか
            $table->json('create_form')->nullable(); // JSON形式のフォームデータ
            $table->dateTime('createformDateTime')->nullable(); // 最終編集/公開日時
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::dropIfExists('w_create_forms');

    }
};
