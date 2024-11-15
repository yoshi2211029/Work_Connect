<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('w_chats', function (Blueprint $table) {
            $table->boolean('edit_flag')->default(false)->after('check_read'); // 既存のカラム名の後に追加
        });
    }

    public function down()
    {
        Schema::table('w_chats', function (Blueprint $table) {
            $table->dropColumn('edit_flag');
        });
    }
};
