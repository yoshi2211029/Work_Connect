<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('w_chats', function (Blueprint $table) {
            // chat_idの主キーを削除
            $table->dropPrimary('chat_id');
        });
    }

    public function down()
    {
        Schema::table('w_chats', function (Blueprint $table) {
            // chat_idを主キーとして再設定
            $table->primary('chat_id');
        });
    }
};
