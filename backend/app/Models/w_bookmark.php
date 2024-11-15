<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class w_bookmark extends Model
{
    use HasFactory;

    // テーブル名を指定（省略可能、Laravelはモデル名を複数形にして自動推測する）
    protected $table = 'w_bookmark';

    protected $fillable = [
        'id',
        'position_id',
        'category',
        'bookmark_id',
        'created_at',
        'updated_at'
    ];

    // キャストする属性を指定
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
