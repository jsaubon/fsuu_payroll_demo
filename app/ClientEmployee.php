<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientEmployee extends Model
{
    protected $guarded = [];

    public function other_infos()
    {
        return $this->morphMany('App\OtherInfo', 'other_infoable');
    }

    public function client() {
        return $this->belongsTo('App\Client','client_id');
    }

    public function client_payrolls() {
        return $this->hasMany('App\ClientPayroll','employee_id');
    }

    public function client_employee_accountings() {
        return $this->hasMany('App\ClientEmployeeAccounting','employee_id');
    }

    public function client_employee_deductions() {
        return $this->hasMany('App\ClientEmployeeDeductions','employee_id');
    }

    
}