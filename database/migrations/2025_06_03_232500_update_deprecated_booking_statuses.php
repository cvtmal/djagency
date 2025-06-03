<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Migration is handled at the model level instead.
     * 
     * Instead of updating values in the database (which causes constraint violations),
     * we're handling the deprecated BookingStatusEnum values via a custom accessor
     * in the BookingRequest model.
     * 
     * @see \App\Models\BookingRequest::getStatusAttribute()
     */
    public function up(): void
    {
        // No-op - handled at the model level
    }

    public function down(): void
    {
        // No-op
    }
};
