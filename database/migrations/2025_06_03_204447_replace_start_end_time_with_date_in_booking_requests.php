<?php

declare(strict_types=1);

use App\Models\BookingRequest;
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
        // Step 1: Add the date column as nullable
        Schema::table('booking_requests', function (Blueprint $table) {
            $table->date('date')->nullable()->after('request_number');
        });

        // Step 2: Update the date column with data from start_time
        // We'll convert any valid date from start_time
        $requests = BookingRequest::all();

        foreach ($requests as $request) {
            // Only update if start_time contains a valid date
            if (! empty($request->start_time) && $request->start_time !== '0000-00-00') {
                try {
                    // Try to parse the date from start_time
                    $dateObj = new \DateTime($request->start_time);
                    $formattedDate = $dateObj->format('Y-m-d');

                    // Only update if we got a valid date
                    if ($formattedDate && $formattedDate !== '0000-00-00') {
                        $request->date = $formattedDate;
                        $request->save();
                    }
                } catch (\Exception $e) {
                    // Silently ignore invalid dates
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_requests', function (Blueprint $table) {
            $table->dropColumn('date');
        });
    }
};
