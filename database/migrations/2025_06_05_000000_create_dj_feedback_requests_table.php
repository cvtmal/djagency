<?php

declare(strict_types=1);

use App\Enums\FeedbackStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dj_feedback_requests', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('booking_id')->constrained('booking_requests')->cascadeOnDelete();
            $table->foreignId('dj_id')->constrained('djs')->cascadeOnDelete();
            $table->uuid('token')->unique();
            $table->string('status')->default(FeedbackStatusEnum::Pending->value);
            $table->boolean('was_party_good')->nullable();
            $table->boolean('request_review')->nullable();
            $table->string('client_email')->nullable();
            $table->text('additional_comments')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamp('client_contacted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dj_feedback_requests');
    }
};
