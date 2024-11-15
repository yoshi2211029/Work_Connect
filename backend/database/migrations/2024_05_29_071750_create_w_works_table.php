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
        Schema::create('w_works', function (Blueprint $table) {
            $table->id(); // idを主キーとして設定、自動増分
            $table->string('work_id', 255)->nullable(); // work_id
            $table->string('kind_id', 255)->nullable(); // kind_id
            $table->string('creator_id', 255)->nullable(); // creator_id
            $table->text('work_name')->nullable(); // 作品名
            $table->text('work_genre')->nullable(); // 作品ジャンル
            $table->text('youtube_url')->nullable(); // YouTube URL
            $table->json('thumbnail')->nullable(); // サムネイル
            $table->text('work_intro')->nullable(); // 作品紹介
            $table->text('obsession')->nullable(); // こだわり
            $table->text('programming_language')->nullable(); // プログラミング言語
            $table->text('development_environment')->nullable(); // 開発環境
            $table->text('work_url')->nullable(); // 作品URL
            $table->text('work_path')->nullable(); // 作品パス
            $table->text('proposal_url')->nullable(); // 提案URL
            $table->text('proposal_path')->nullable(); // 提案パス
            $table->text('other')->nullable(); // その他
            $table->text('reaction')->nullable(); // リアクション
            $table->text('comment_id')->nullable(); // コメントID
            $table->dateTime('post_datetime')->nullable(); // 投稿日時
            $table->integer('sort_number')->nullable(); // ソート番号
            $table->timestamps(); // created_atとupdated_atのカラムを自動作成
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('w_works');
    }
};
