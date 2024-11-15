<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('w_chats', function (Blueprint $table) {
            // 新しいidカラムを追加し、主キーとして設定
            $table->id();
        });
    }

    public function down()
    {
        Schema::table('w_chats', function (Blueprint $table) {
            // idカラムを削除
            $table->dropColumn('id');
        });
    }
};
