<?php

declare(strict_types=1);

namespace App\Enums;

enum FeedbackStatusEnum: string
{
    case Pending = 'pending';
    case Completed = 'completed';
    case ClientContacted = 'client_contacted';
}
