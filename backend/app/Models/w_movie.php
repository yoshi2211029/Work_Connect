<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class w_movie extends Model
{
    use HasFactory;

    // テーブル名を指定（省略可能、Laravelはモデル名を複数形にして自動推測する）
    protected $table = 'w_movies';

    // マスアサインメント可能な属性
    protected $fillable = [
        'movie_id',
        'kind_id',
        'creator_id',
        'work_id',
        'title',
        'youtube_url',
        'genre',
        'intro',
        'reaction',
        'comment_id',
        'post_datetime',
        'sort_number',
    ];

    // タイムスタンプのカラムが存在しない場合は、$timestampsをfalseに設定
    // public $timestamps = false;

    // キャストする属性を指定
    protected $casts = [
        'post_datetime' => 'datetime',
    ];
}
