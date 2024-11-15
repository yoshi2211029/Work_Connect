<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('w_chats', function (Blueprint $table) {
        // check_readカラムを元のデータ型に戻す
        $table->text('check_read')->change();

        // check_deleteカラムを削除
        $table->dropColumn('check_delete');
    });
}

public function down()
{
    Schema::table('w_chats', function (Blueprint $table) {
        // 再度 check_readカラムをboolean型に変更
        $table->boolean('check_read')->change();

        // check_deleteカラムを再追加
        $table->boolean('check_delete')->after('check_read')->default(false);
    });
}

};
