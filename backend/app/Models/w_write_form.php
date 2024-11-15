<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class w_write_form extends Model
{
    use HasFactory;

    protected $table = 'w_write_forms';
    protected $keyType = 'int';

    protected $fillable = [
        'id',
        'user_id',
        'news_id',
        'recipient_company_id',
        'write_form',
        'writeformDateTime',
    ];

}
