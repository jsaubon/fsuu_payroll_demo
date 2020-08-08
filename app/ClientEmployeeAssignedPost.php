<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientEmployeeAssignedPost extends Model
{
    protected $guarded = [];

    public function client_employee() {
        return $this->belongsTo('App\ClientEmployee','employee_id');
    }


    public function client() {
        return $this->belongsTo('App\Client','client_id');
    }

}
