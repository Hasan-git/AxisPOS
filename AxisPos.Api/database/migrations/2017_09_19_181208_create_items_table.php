<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->increments('id');
            $table->string('barcode', 250)->unique();
            $table->string('brand', 250); //foriegn key
            $table->string('category', 250); //foriegn key
            $table->string('type', 250);
            $table->string('name', 250);
            $table->integer('qty');
            $table->integer('price');
            $table->integer('cost');
            $table->text('note');
            $table->boolean('taxed');
            $table->boolean('enabled');
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
        Schema::dropIfExists('items');
    }
}
