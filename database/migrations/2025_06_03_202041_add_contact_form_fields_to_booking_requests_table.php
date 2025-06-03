<?php

declare(strict_types=1);

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
        Schema::table('booking_requests', function (Blueprint $table) {
            $table->string('event_type')->after('venue');
            $table->string('time_range')->after('end_time');
            $table->integer('guest_count')->after('time_range');
            $table->string('equipment')->after('guest_count');
            $table->json('music_ratings')->after('genres');
            $table->text('additional_music')->nullable()->after('music_ratings');
            
            // Contact Information
            $table->string('contact_street')->after('client_name');
            $table->string('contact_city')->after('contact_street');
            $table->string('contact_postal_code')->after('contact_city');
            $table->string('contact_email')->after('contact_postal_code');
            $table->string('contact_phone')->after('contact_email');
            $table->string('contact_option')->after('contact_phone');
            
            // Make these fields nullable since they're related to DJ assignment which happens later
            $table->foreignId('dj_id')->nullable()->change();
            $table->foreignId('booking_date_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_requests', function (Blueprint $table) {
            // Revert DJ and booking date fields
            $table->foreignId('dj_id')->change();
            $table->foreignId('booking_date_id')->change();
            
            // Drop new fields
            $table->dropColumn([
                'event_type',
                'time_range',
                'guest_count',
                'equipment',
                'music_ratings',
                'additional_music',
                'contact_street',
                'contact_city',
                'contact_postal_code',
                'contact_email',
                'contact_phone',
                'contact_option',
            ]);
        });
    }
};
