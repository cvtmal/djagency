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
        Schema::table('booking_requests', function (Blueprint $table) {
            $table->boolean('has_responded')->default(false)->after('status');
            $table->string('response_method')->nullable()->default(ClientResponseMethodEnum::None->value)->after('has_responded');
            $table->timestamp('last_response_at')->nullable()->after('response_method');
            $table->timestamp('next_follow_up_at')->nullable()->after('last_response_at');
            $table->integer('follow_up_count')->default(0)->after('next_follow_up_at');
            $table->json('follow_up_history')->nullable()->after('follow_up_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_requests', function (Blueprint $table) {
            $table->dropColumn([
                'has_responded',
                'response_method',
                'last_response_at',
                'next_follow_up_at',
                'follow_up_count',
                'follow_up_history'
            ]);
        });
    }
};
