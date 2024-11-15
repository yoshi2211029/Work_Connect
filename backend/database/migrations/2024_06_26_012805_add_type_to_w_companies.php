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
        Schema::table('w_companies', function (Blueprint $table) {
            // user_name列を追加
            $table->text('user_name')->nullable()->after('mail'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('w_companies', function (Blueprint $table) {
            //
            $table->dropColumn('user_name'); 
        });
    }
        
};
