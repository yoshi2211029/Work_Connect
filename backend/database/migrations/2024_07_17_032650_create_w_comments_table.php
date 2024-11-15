<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('w_comments', function (Blueprint $table) {
            $table->id(); // idを主キーとして設定、自動増分
            $table->string('genre', 255)->nullable();
            $table->string('various_id', 255)->nullable(); // 作品または動画のID
            $table->string('commenter_id', 255)->nullable(); // コメント投稿者のID
            $table->text('content')->nullable(); // コメント内容    
            $table->dateTime('commentDateTime')->nullable(); // 投稿日時
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('w_comments');
    }
};
