<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class w_images extends Model
{
    use HasFactory;


    // テーブル名を指定（省略可能、Laravelはモデル名を複数形にして自動推測する）
    protected $table = 'w_images';

    // マスアサインメント可能な属性
    protected $fillable = [
        'id',
        'image',
        'annotation',
        'work_id',
        'thumbnail_judgement',
        'created_at',
        'updated_at',
    ];

    // タイムスタンプのカラムが存在しない場合は、$timestampsをfalseに設定
    // public $timestamps = false;

    // タイムスタンプのフォーマットを変更する場合
    // const CREATED_AT = 'created_at';
    // const UPDATED
}
