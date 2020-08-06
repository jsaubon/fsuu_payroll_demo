<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientEmployeePayroll extends Model
{
    protected $guarded = [];

    public function client_employee() {
        return $this->belongsTo('App\ClientEmployee','employee_id');
    }
    public function client_employee_accountings() {
        return $this->hasMany('App\ClientEMployeeAccounting','client_employee_payroll_id');
    }
    public function client_payroll() {
        return $this->belongsTo('App\ClientPayroll','client_payroll_id');
    }

}
