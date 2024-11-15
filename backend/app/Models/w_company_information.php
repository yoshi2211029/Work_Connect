<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class w_company_information extends Model
{
    use HasFactory;

    // テーブル名を指定（省略可能、Laravelはモデル名を複数形にして自動推測する）
    protected $table = 'w_companies_information';

    // 主キーが自動インクリメントすることを指定
    public $incrementing = true;

    // 主キーのデータ型が整数型であることを指定
    protected $keyType = 'int';

    // マスアサインメント可能な属性
    protected $fillable = [
        'id',
        'company_id',
        'title',
        'contents',
        'row_number',
        'public_status',
        'created_at',
        'updated_at'
    ];

    // タイムスタンプのカラムが存在しない場合は、$timestampsをfalseに設定
    public $timestamps = false;

}
