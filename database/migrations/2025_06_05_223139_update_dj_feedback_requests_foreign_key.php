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
        Schema::table('dj_feedback_requests', function (Blueprint $table): void {
            // Drop the existing foreign key constraint
            $table->dropForeign(['booking_id']);
            
            // Add the new foreign key constraint pointing to dj_availabilities
            $table->foreign('booking_id')
                ->references('id')
                ->on('dj_availabilities')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dj_feedback_requests', function (Blueprint $table): void {
            // Drop the new foreign key constraint
            $table->dropForeign(['booking_id']);
            
            // Restore the original foreign key constraint
            $table->foreign('booking_id')
                ->references('id')
                ->on('booking_requests')
                ->onDelete('cascade');
        });
    }
};
