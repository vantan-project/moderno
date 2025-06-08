<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transitions', function (Blueprint $table) {
            $table->unsignedBigInteger('from_furniture_id');
            $table->unsignedBigInteger('to_furniture_id');
            $table->unsignedInteger('count');
            $table->timestamps();

            $table->primary(['from_furniture_id','to_furniture_id']);

            $table->foreign('from_furniture_id')
                ->references('id')
                ->on('furnitures')
                ->onDelete('cascade');
            $table->foreign('to_furniture_id')
                ->references('id')
                ->on('furnitures')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transitions');
    }
};
