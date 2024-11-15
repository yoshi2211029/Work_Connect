<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WItem extends Model
{
    use HasFactory;

    // テーブル名を指定（省略可能、Laravelはモデル名を複数形にして自動推測する）
    protected $table = 'w_items';

    // マスアサインメント可能な属性
    protected $fillable = [
        'item_name',
        'kind_id',
    ];

    // タイムスタンプのカラムが存在しない場合は、$timestampsをfalseに設定
    // public $timestamps = false;
}

