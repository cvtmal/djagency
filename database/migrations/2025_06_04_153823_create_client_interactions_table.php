<?php

declare(strict_types=1);

use App\Enums\ClientResponseMethodEnum;
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
        Schema::create('client_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_request_id')->constrained()->cascadeOnDelete();
            $table->string('interaction_method')->default(ClientResponseMethodEnum::None->value);
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->boolean('is_follow_up')->default(false);
            $table->boolean('is_client_response')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_interactions');
    }
};
