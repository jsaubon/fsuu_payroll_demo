<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientEmployeeAccounting extends Model
{
    protected $guarded = [];

    public function client_employee_payroll() {
        return $this->belongsTo('App\ClientEmployeePayroll','client_employee_payroll_id');
    }
    
    public function client_accounting_entry() {
        return $this->belongsTo('App\ClientAccountingEntry','client_accounting_entry_id');
    }

    public function client_employee() {
        return $this->belongsTo('App\ClientEmployee','employee_id');
    }
}
