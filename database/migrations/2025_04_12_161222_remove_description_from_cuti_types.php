<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('cuti_types', function (Blueprint $table) {
            $table->dropColumn('description'); // Kolom yang mau dihapus
        });
    }

    public function down()
    {
        Schema::table('cuti_types', function (Blueprint $table) {
            $table->text('description')->nullable(); // Restore kalau rollback
        });
    }
};
