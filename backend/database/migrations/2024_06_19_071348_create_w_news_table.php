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
        Schema::create('w_news', function (Blueprint $table) {
            $table->id();
            $table->integer('company_id');
            $table->string('article_title')->nullable();
            $table->string('genre')->nullable();
            $table->longtext('header_img')->nullable();
            $table->longtext('summary')->nullable();
            $table->string('message')->nullable();
            $table->string('public_status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('w_news');
    }
};
