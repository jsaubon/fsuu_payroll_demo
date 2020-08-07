<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientAccountingEntry extends Model
{
    protected $guarded = [];

    public function client_accounting_entries() {
        return $this->hasMany('App\ClientAccountingEntry','client_accounting_entry_id');
    }

    public function client() {
        return $this->belongsTo('App\Client','client_id');
    }
}
