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
        Schema::create('w_users', function (Blueprint $table) {
            $table->string('id', 255)->default("");
            $table->text('student_surname')->nullable()->default(null);
            $table->text('student_name')->nullable()->default(null);
            $table->text('student_kanasurname')->nullable()->default(null);
            $table->text('student_kananame')->nullable()->default(null);
            $table->text('user_name')->nullable()->default(null);
            $table->text('school_name')->nullable()->default(null);
            $table->text('department_name')->nullable()->default(null);
            $table->text('faculty_name')->nullable()->default(null);
            $table->text('major_name')->nullable()->default(null);
            $table->text('course_name')->nullable()->default(null);
            $table->text('password')->nullable()->default(null);
            $table->text('mail')->nullable()->default(null);
            $table->text('intro')->nullable()->default(null);
            $table->text('user_from')->nullable()->default(null);
            $table->text('programming_language')->nullable()->default(null);
            $table->text('development_environment')->nullable()->default(null);
            $table->text('software')->nullable()->default(null);
            $table->text('acquisition_qualification')->nullable()->default(null);
            $table->text('desired_work_region')->nullable()->default(null);
            $table->text('hobby')->nullable()->default(null);
            $table->text('other')->nullable()->default(null);
            $table->text('icon')->nullable()->default(null);
            $table->text('mypr_movie_id')->nullable()->default(null);
            $table->text('resume')->nullable()->default(null);
            $table->text('graduation_year')->nullable()->default(null);
            $table->text('desired_occupation')->nullable()->default(null);
            $table->text('registered_datetime')->nullable()->default(null);
            $table->text('border_color')->nullable()->default(null);
            $table->text('background_color')->nullable()->default(null);
            $table->text('border_style')->nullable()->default(null);
            $table->timestamps(); // created_atとupdated_atのカラムを自動作成
            $table->primary('id');
        });

        \DB::table('w_users')->insert(
            [
                'id' => 'S_000000000001',
                'student_surname' => '吉岡',
                'student_name' => '佑馬',
                'student_kanasurname' => 'ヨシオカ',
                'student_kananame' => 'ユウマ',
                'user_name' => 'yoshioka',
                'school_name' => '清風情報工科学院',
                'mail' => '2211029@i-seifu.jp',
                'password' => '2023gakusei',
                'graduation_year' => '2025年卒業'
            ]
        );
        \DB::table('w_users')->insert(
            [
                'id' => 'S_000000000002',
                'student_surname' => '坂東',
                'student_name' => '航希',
                'student_kanasurname' => 'バンドウ',
                'student_kananame' => 'コウキ',
                'user_name' => 'bandou',
                'school_name' => '清風情報工科学院',
                'mail' => '2211023@i-seifu.jp',
                'password' => '2023gakusei',
                'graduation_year' => '2025年卒業'
            ]
        );
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('w_users');
    }
};
