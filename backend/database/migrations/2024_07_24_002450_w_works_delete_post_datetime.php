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
        Schema::table('w_works', function (BluePrint $table) {
            if (Schema::hasColumn('w_works', 'post_datetime')) {
                $table->dropColumn('post_datetime');
            }
            if (Schema::hasColumn('w_works', 'id')) {
                $table->dropColumn('id');
            }
            if (Schema::hasColumn('w_works', 'work_id')) {
                $table->dropColumn('work_id');
            }
        });

        Schema::table('w_works', function (BluePrint $table) {
            // 主キーに設定するカラムを指定
            $table->id('work_id');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('w_works', function (BluePrint $table) {
            // 主キーを削除
            $table->dropPrimary(['work_id']);

            // id カラムを再追加
            $table->integer('id')->unsigned()->primary();

            // post_datetime カラムを再追加

            $table->dateTime('post_datetime')->default("0001-01-01 01:01:01")->nullable();
        });
    }
};
