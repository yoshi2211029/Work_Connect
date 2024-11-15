<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class w_follow extends Model
{
    use HasFactory;

    protected $table = 'w_follow';

        // マスアサインメント可能な属性
        protected $fillable = [
            'id',
            'follow_sender_id',
            'follow_recipient_id',
            'follow_datetime',
        ];


}
