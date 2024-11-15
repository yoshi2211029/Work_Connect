<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::create('w_companies_information', function (Blueprint $table) {
        $table->id(); // 自動インクリメントする主キー
        $table->string('company_id');
        $table->string('title');
        $table->text('contents');
        $table->integer('row_number');
        $table->boolean('public_status');
        $table->timestamps(); // created_at と updated_at を作成
    });
}

public function down()
{
    Schema::dropIfExists('w_companies_information');
}

};
