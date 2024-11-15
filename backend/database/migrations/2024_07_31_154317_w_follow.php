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
        Schema::create('w_follow', function (Blueprint $table) {
            $table->id(); // idを主キーとして設定、自動増分
            $table->string('follow_sender_id', 255)->nullable(); // フォローをした人(差出人)
            $table->string('follow_recipient_id', 255)->nullable(); // フォローをされた人(受取人)
            $table->dateTime('follow_datetime')->nullable(); // フォローした日
            $table->timestamps(); // created_atとupdated_atのカラムを自動作成
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('w_follow');
    }
};
