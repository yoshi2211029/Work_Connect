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
        Schema::create('w_images', function (Blueprint $table) {
            $table->id();
            $table->text('image')->nullable();
            $table->text('annotation')->nullable();
            $table->text('work_id')->nullable();
            $table->integer('thumbnail_judgement')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('w_images');
    }
};
