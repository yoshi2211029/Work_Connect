<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up() {
        Schema::table('w_companies', function (Blueprint $table) {
            $table->text('company_namecana')->nullable()->after('company_name'); 
            $table->text('selected_occupation')->nullable()->after('company_namecana'); 
            $table->text('prefecture')->nullable()->after('selected_occupation'); 
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down() {
        Schema::table('w_companies', function (Blueprint $table) { 
            $table->dropColumn('company_namecana'); 
            $table->dropColumn('selected_occupation'); 
            $table->dropColumn('prefecture'); 
        });
    }
        
};
