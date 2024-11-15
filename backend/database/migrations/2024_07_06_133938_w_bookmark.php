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
        Schema::create('w_bookmark', function (Blueprint $table) {
            $table->id();
            $table->string('position_id')->nullable(); //会社や学生のid
            $table->string('category')->nullable();
            $table->text('bookmark_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('w_bookmark');
    }
};
