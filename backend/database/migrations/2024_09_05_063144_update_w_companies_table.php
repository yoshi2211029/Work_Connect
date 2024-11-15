<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateWCompaniesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('w_companies', function (Blueprint $table) {
            // 新しいtextカラムを追加
            $table->text('development_environment')->nullable();
            $table->text('programming_language')->nullable();
            $table->text('acquisition_qualification')->nullable();
            $table->text('software')->nullable();

            // icon_id列をiconに名前変更
            $table->renameColumn('icon_id', 'icon');

            // thumbnail_idとoffice列を削除
            $table->dropColumn('thumbnail_id');
            $table->dropColumn('office');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('w_companies', function (Blueprint $table) {
            // 新しいカラムを削除
            $table->dropColumn('development_environment');
            $table->dropColumn('programming_language');
            $table->dropColumn('acquisition_qualification');
            $table->dropColumn('software');

            // icon列をicon_idに名前変更
            $table->renameColumn('icon', 'icon_id');

            // 削除されたカラムを再追加
            $table->unsignedBigInteger('thumbnail_id')->nullable();
            $table->string('office')->nullable();
        });
    }
}
