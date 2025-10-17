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
    Schema::create('cards', function (Blueprint $table) {
      $table->id();
      $table->text('number')->nullable();
      $table->string('last4', 4)->nullable();
      $table->string('exp_year', 2)->nullable();
      $table->string('exp_month', 2)->nullable();
      $table->string('holder_last_name')->nullable();
      $table->string('holder_first_name')->nullable();
      $table->timestamps();

      $table->foreignId('user_id')
        ->constrained('users')
        ->cascadeOnDelete();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('cards');
  }
};
