<?php

declare(strict_types=1);

use App\Enums\DjAvailabilityStatusEnum;
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
        Schema::create('dj_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dj_id')->constrained('djs')->onDelete('cascade');
            $table->date('date');
            $table->string('status')->default(DjAvailabilityStatusEnum::Available->value);
            $table->boolean('is_custom_date')->default(false);
            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Ensure each DJ has unique dates
            $table->unique(['dj_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dj_availabilities');
    }
};
