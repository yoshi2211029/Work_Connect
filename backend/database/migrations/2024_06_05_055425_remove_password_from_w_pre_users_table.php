<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemovePasswordFromWPreUsersTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('w_pre_users', function (Blueprint $table) {
            $table->dropColumn('user_name'); // passwordカラムを削除
            $table->dropColumn('password'); // passwordカラムを削除
            $table->dropColumn('date'); // passwordカラムを削除
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('w_pre_users', function (Blueprint $table) {
            $table->text('user_name')->nullable(); // ユーザー名
            $table->text('password')->nullable(); // passwordカラムを再追加
            $table->dateTime('date')->nullable(); // 日付
        });
    }
}
