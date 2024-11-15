<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class w_users extends Model
{
    protected $table = 'w_users'; // テーブル名を指定
    
    protected $primaryKey = 'user_id'; // プライマリキーを指定（デフォルトは'id'カラム）
    
    public $timestamps = false; // タイムスタンプを使用しない場合はfalseにする
    
    // 可変項目（Mass Assignment）を指定する場合
    protected $fillable = [
        'id',
        'student_surname',
        'student_name',
        'student_kanasurname',
        'student_kananame',
        'user_name',
        'school_name',
        'department_name',
        'faculty_name',
        'major_name',
        'course_name',
        'password',
        'mail',
        'intro',
        'user_from',
        'programming_language',
        'development_environment',
        'software',
        'acquisition_qualification',
        'desired_work_region',
        'hobby',
        'other',
        'icon',
        'mypr_movie_id',
        'resume',
        'graduation_year',
        'desired_occupation',
        'registered_datetime',
        'border_color',
        'background_color',
        'border_style',
        'created_at',
        'updated_at',
        // 他のカラム
    ];
}
