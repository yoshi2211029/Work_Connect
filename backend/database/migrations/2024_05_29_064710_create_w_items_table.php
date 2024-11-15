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
        Schema::create('w_items', function (Blueprint $table) {
            $table->id(); // idを主キーとして設定、自動増分
            $table->text('item_name')->nullable(); // アイテム名
            $table->integer('kind_id')->nullable(); // 種類ID
            $table->timestamps(); // created_atとupdated_atのカラムを自動作成
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('w_items');
    }
};

