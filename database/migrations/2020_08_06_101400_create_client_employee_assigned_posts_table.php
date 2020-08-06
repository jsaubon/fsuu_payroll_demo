<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientEmployeeAssignedPostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('client_employee_assigned_posts', function (Blueprint $table) {
            $table->id();
            $table->integer('employee_id')->unsigned();
            $table->integer('client_id')->unsigned();
            $table->date('date_start');
            $table->date('date_end')->nullable();
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
        Schema::dropIfExists('client_employee_assigned_posts');
    }
}
