<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientEmployeeAccountingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('client_employee_accountings', function (Blueprint $table) {
            $table->id();
            $table->integer('client_employee_payroll_id')->unsigned();
            $table->integer('client_accounting_entry_id')->unsigned();
            $table->integer('employee_id')->unsigned();
            $table->double('amount');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('client_employee_accountings');
    }
}
