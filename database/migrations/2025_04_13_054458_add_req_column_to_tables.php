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
        Schema::table('users', function (Blueprint $table) {
            $table->json('detail')->nullable()->after('status');
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->boolean('status')->default(1)->after('phone');
        });

        Schema::table('roles', function (Blueprint $table) {
            $table->boolean('status')->default(1)->after('name');
            $table->json('detail')->nullable()->after('status');
        });

        Schema::table('cuti_types', function (Blueprint $table) {
            $table->boolean('status')->default(1)->after('name');
            $table->json('detail')->nullable()->after('status');
        });

        Schema::table('cuti_requests', function (Blueprint $table) {
            $table->json('detail')->nullable()->after('document');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['status', 'detail']);
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['status']);
        });

        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn(['status', 'detail']);
        });

        Schema::table('cuti_types', function (Blueprint $table) {
            $table->dropColumn(['status', 'detail']);
        });

        Schema::table('cuti_requests', function (Blueprint $table) {
            $table->dropColumn(['detail']);
        });
    }
};
