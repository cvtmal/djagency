<?php

use App\Enums\BookingStatusEnum;
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
        Schema::create('booking_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dj_id')->constrained();
            $table->foreignId('booking_date_id')->constrained();
            $table->string('client_name');
            $table->string('venue');
            $table->json('genres');
            $table->string('start_time');
            $table->string('end_time');
            $table->text('notes')->nullable();
            $table->string('status')->default(BookingStatusEnum::New->value);
            $table->string('request_number')->unique();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_requests');
    }
};
