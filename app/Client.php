<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $guarded = [];

    public function other_infos()
    {
        return $this->morphMany('App\OtherInfo', 'other_infoable');
    }

    public function employees() {
        return $this->hasMany('App\Employee','client_id');
    }

    public function client_payrolls() {
        return $this->hasMany('App\ClientPayroll','client_id');
    }

    public function client_accounting_entries() {
        return $this->hasMany('App\ClientAccountingEntry','client_id');
    }

    public function client_employee_assigned_posts() {
        return $this->hasMany('App\ClientEmployeeAssignedPost','client_id');
    }
}