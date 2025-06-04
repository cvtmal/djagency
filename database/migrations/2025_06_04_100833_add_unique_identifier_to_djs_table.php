<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('djs', function (Blueprint $table) {
            $table->string('unique_identifier', 36)->after('id')->unique()->nullable();
        });
        
        // Use raw queries to bypass model casting and validation issues
        $djs = DB::table('djs')->get();
        foreach ($djs as $dj) {
            DB::statement('UPDATE djs SET unique_identifier = ? WHERE id = ?', [
                (string) Str::uuid(),
                $dj->id
            ]);
        }
        
        // Make the column required after filling existing records
        Schema::table('djs', function (Blueprint $table) {
            $table->string('unique_identifier', 36)->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('djs', function (Blueprint $table) {
            $table->dropColumn('unique_identifier');
        });
    }
};
