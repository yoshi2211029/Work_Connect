<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('w_chats', function (Blueprint $table) {
            // カラムの型をTINYINTからTEXTに変更
            $table->text('check_read')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('w_chats', function (Blueprint $table) {
            // 変更を元に戻す（TINYINTに戻す）
            $table->tinyInteger('check_read')->change();
        });
    }
};
