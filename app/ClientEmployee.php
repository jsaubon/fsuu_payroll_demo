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
        return $this->hasMany('App\ClientEmployeeDeduction','employee_id');
    }

    public function client_employee_assigned_posts() {
        return $this->hasMany('App\ClientEmployeeAssignedPost','employee_id');
    }

    public function bonds() {
        return $this->hasMany('App\ClientEmployeeAccounting', 'employee_id')->
                selectRaw('client_employee_accountings.employee_id,client_employee_accountings.amount as total,client_payrolls.date_start')
                ->join('client_accounting_entries','client_accounting_entries.id','=','client_employee_accountings.client_accounting_entry_id')
                ->where('client_accounting_entries.title','Bond')
                ->leftJoin('client_employee_payrolls','client_employee_payrolls.id','=','client_employee_accountings.client_employee_payroll_id')
                ->leftJoin('client_payrolls','client_payrolls.id','=','client_employee_payrolls.client_payroll_id');
                // ->groupBy(['client_employee_accountings.employee_id',\DB::raw('YEAR(client_payrolls.date_start)')]);
    }

    
}