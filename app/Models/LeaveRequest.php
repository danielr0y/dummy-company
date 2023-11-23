<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        "employee",
        "type",
        "start_date",
        "end_date",
        "start_time",
        "end_time",
        "total_days",
        "reason",
    ];
}
