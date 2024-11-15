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

        Schema::table('w_movies', function (BluePrint $table) {
            if (Schema::hasColumn('w_movies', 'post_datetime')) {
                $table->dropColumn('post_datetime');
            }
            if (Schema::hasColumn('w_movies', 'id')) {
                $table->dropColumn('id');
            }
            if (Schema::hasColumn('w_movies', 'movie_id')) {
                $table->dropColumn('movie_id');
            }
        });

        Schema::table('w_movies', function (BluePrint $table) {
            // 主キーに設定するカラムを指定
            $table->id('movie_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('w_movies', function (Blueprint $table) {
            // // id カラムを追加する（自動増分の主キーとして）
            // 主キーを削除
            $table->dropPrimary(['movie_id']);

            // id カラムを再追加
            $table->integer('id')->unsigned()->primary();

            // post_datetime カラムを再追加
        });
    }
};
