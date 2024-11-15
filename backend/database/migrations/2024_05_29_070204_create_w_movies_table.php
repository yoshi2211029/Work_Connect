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
        Schema::create('w_movies', function (Blueprint $table) {
            $table->id(); // idを主キーとして設定、自動増分
            $table->string('movie_id', 255); // movie_id
            $table->string('kind_id', 255); // kind_id
            $table->string('creator_id', 255); // creator_id
            $table->string('work_id', 255)->nullable(); // work_id
            $table->text('title')->nullable(); // タイトル
            $table->text('youtube_url')->nullable(); // YouTube URL
            $table->text('genre')->nullable(); // ジャンル
            $table->text('intro')->nullable(); // 紹介文
            $table->text('reaction')->nullable(); // リアクション
            $table->text('comment_id')->nullable(); // コメントID
            $table->dateTime('post_datetime')->nullable(); // 投稿日時
            $table->integer('sort_number'); // ソート番号
            $table->timestamps(); // created_atとupdated_atのカラムを自動作成
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('w_movies');
    }
};
