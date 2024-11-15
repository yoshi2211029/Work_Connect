<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class w_pre_check_email extends Model
{
    use HasFactory;

    // テーブル名を指定（省略可能、Laravelはモデル名を複数形にして自動推測する）
    protected $table = 'w_pre_check_email';

    // // 主キーのカラム名を指定（省略可能、Laravelは"id"を自動使用する）
    // protected $primaryKey = 'id';

    // 主キーが自動増分ではない場合は、$incrementingをfalseに設定
    public $incrementing = false;

    // 主キーの型を指定（文字列の場合は'string'）
    protected $keyType = 'string';

    // マスアサインメント可能な属性
    protected $fillable = [
        'id',
        'user_id',
        'urltoken',
        'mail',
    ];

    // タイムスタンプのカラムが存在しない場合は、$timestampsをfalseに設定
    // public $timestamps = false;

    // キャストする属性を指定
    protected $casts = [
        'registered_datetime' => 'datetime',
    ];
}
