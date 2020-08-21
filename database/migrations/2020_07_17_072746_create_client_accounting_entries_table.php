<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientAccountingEntriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('client_accounting_entries', function (Blueprint $table) {
            $table->id();
            $table->integer('client_id')->unsigned();
            $table->boolean('visible')->default(true);
            $table->string('type');
            $table->integer('order');
            $table->string('title');
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
        Schema::dropIfExists('client_accounting_entries');
    }
}
