<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientPayroll extends Model
{
    protected $guarded = [];

    public function client() {
        return $this->belongsTo('App\Client','client_id');
    }

    public function employee() {
        return $this->belongsTo('App\Employee','client_id');
    }

    public function client_employee_accountings() {
        return $this->hasMany('App\ClientEmployeeAccounting','client_payroll_id');
    }

    public function client_employee_payrolls() {
        return $this->hasMany('App\ClientEmployeePayroll','client_payroll_id');
    }

    public static function boot() {
        parent::boot();

        static::deleting(function($payroll) { // before delete() method call this
             $employee_payrolls = $payroll->client_employee_payrolls()->get();
             foreach ($employee_payrolls as $key => $employee_payroll) {
                 $employee_payroll->client_employee_accountings()->delete();
             }
             $payroll->client_employee_payrolls()->delete();
             // do the rest of the cleanup...
        });
    }
    
}
