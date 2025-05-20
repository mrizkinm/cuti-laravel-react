<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use OwenIt\Auditing\Contracts\Auditable;

class CutiRequest extends Model implements Auditable
{
    use SoftDeletes;
    use \OwenIt\Auditing\Auditable;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = [];

    protected $casts = [
        'approved' => 'boolean',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'detail' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function cutiType()
    {
        return $this->belongsTo(CutiType::class);
    }
}
