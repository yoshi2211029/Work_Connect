<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class w_work extends Model
{
    use HasFactory;

    // テーブル名を指定（省略可能、Laravelはモデル名を複数形にして自動推測する）
    protected $table = 'w_works';

    // マスアサインメント可能な属性
    protected $fillable = [
        'work_id',
        'kind_id',
        'creator_id',
        'work_name',
        'work_genre',
        'youtube_url',
        'thumbnail',
        'work_intro',
        'obsession',
        'programming_language',
        'development_environment',
        'work_url',
        'work_path',
        'proposal_url',
        'proposal_path',
        'other',
        'reaction',
        'comment_id',
        'post_datetime',
        'sort_number',
        
    ];

    // タイムスタンプのカラムが存在しない場合は、$timestampsをfalseに設定
    // public $timestamps = false;

    // タイムスタンプのフォーマットを変更する場合
    // const CREATED_AT = 'created_at';
    // const UPDATED
}