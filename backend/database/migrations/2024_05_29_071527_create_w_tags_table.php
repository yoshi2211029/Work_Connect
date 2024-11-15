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
        Schema::create('w_tags', function (Blueprint $table) {
            $table->id(); // idを主キーとして設定、自動増分
            $table->text('name')->nullable(); // タグ名
            $table->unsignedBigInteger('item_id')->nullable(); // 関連するアイテムID
            $table->foreign('item_id')->references('id')->on('w_items')->onDelete('cascade'); // 外部キー制約
            $table->timestamps(); // created_atとupdated_atのカラムを自動作成
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('w_tags');
    }
};
