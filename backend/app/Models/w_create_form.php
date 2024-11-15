<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class w_create_form extends Model
{
    use HasFactory;

    protected $table = 'w_create_forms';
    protected $keyType = 'int';
    protected $fillable = [
        'id',
        'company_id',
        'news_id',
        'create_form',
        'createformDateTime',
    ];

}
