<?php

declare(strict_types=1);

namespace App\Enums;

enum DjStatus: string
{
    case Active = 'active';
    case Inactive = 'inactive';
}
