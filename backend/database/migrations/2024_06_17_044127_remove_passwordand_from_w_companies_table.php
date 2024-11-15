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
        Schema::table('w_pre_companies', function (Blueprint $table) {
            $table->dropColumn('company_name'); // company_nameカラムを削除
            $table->dropColumn('password'); // passwordカラムを削除
            $table->dropColumn('date'); // passwordカラムを削除
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('w_pre_companies', function (Blueprint $table) {
            $table->string('company_name')->nullable(); // company_nameカラムを再追加
            $table->text('password')->nullable(); // passwordカラムを再追加
            $table->dateTime('date')->nullable(); // 日付
        });
    }
};
