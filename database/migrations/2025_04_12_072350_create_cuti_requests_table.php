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
        Schema::create('cuti_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
    
            $table->uuid('employee_id');
            $table->uuid('cuti_type_id');

            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->text('reason')->nullable();
            $table->boolean('approved')->default(false);
            $table->string('document')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Foreign Keys (optional)
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('cuti_type_id')->references('id')->on('cuti_types')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuti_requests');
    }
};
