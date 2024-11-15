<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class w_notice extends Model
{
    use HasFactory;

    // テーブル名を指定（省略可能、Laravelはモデル名を複数形にして自動推測する）
    protected $table = 'w_notices';

    // マスアサインメント可能な属性
    protected $fillable = [
        'get_user_id',
        'send_user_id',
        'category',
        'detail',
        'already_read',
        'notice_datetime',
    ];

    // タイムスタンプのカラムが存在しない場合は、$timestampsをfalseに設定
    // public $timestamps = false;

    // キャストする属性を指定
    protected $casts = [
        'notice_datetime' => 'datetime',
    ];
}
