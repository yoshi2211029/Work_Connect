<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class w_comment extends Model
{
    use HasFactory;

    // テーブル名を指定（省略可能、Laravelはモデル名を複数形にして自動推測する）
    protected $table = 'w_comments';

    // マスアサインメント可能な属性
    protected $fillable = [
        'id',
        'genre',
        'various_id',
        'commenter_id',
        'content',
        'commentDateTime',
        'created_at',
        'updated_at',
    ];
}
