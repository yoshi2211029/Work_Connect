<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class w_news extends Model
{
    use HasFactory;

        // テーブル名を指定（省略可能、Laravelはモデル名を複数形にして自動推測する）
        protected $table = 'w_news';

            // マスアサインメント可能な属性
    protected $fillable = [
        'id',
        'company_id',
        'article_title',
        'genre',
        'header_img',
        'summary',
        'public_status',
        'created_at',
        'updated_at'
    ];

    // キャストする属性を指定
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}

