<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('number')->unique();
            $table->date('date'); 
            $table->string('customer', 250); //foriegn key
            $table->integer('subtotal', 250);
            $table->integer('discount');
            $table->integer('vat'); //foriegn key            
            $table->integer('total');
            $table->enum('status', array('Pending', 'Payed', 'Partial'));
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
        Schema::dropIfExists('invoices');
    }
}
