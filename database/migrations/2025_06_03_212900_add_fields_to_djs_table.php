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
        Schema::table('djs', function (Blueprint $table) {
            $table->json('genres')->after('name');
            $table->enum('status', ['active', 'inactive'])->default('active')->after('genres');
            $table->string('home_city')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('djs', function (Blueprint $table) {
            $table->dropColumn(['genres', 'status', 'home_city']);
        });
    }
};
