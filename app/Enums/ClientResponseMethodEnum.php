<?php

declare(strict_types=1);

namespace App\Enums;

enum ClientResponseMethodEnum: string
{
    case Email = 'email';
    case Phone = 'phone';
    case InPerson = 'in_person';
    case SMS = 'sms';
    case WhatsApp = 'whatsapp';
    case None = 'none';

    public function label(): string
    {
        return match ($this) {
            self::Email => 'Email',
            self::Phone => 'Phone',
            self::InPerson => 'In Person',
            self::SMS => 'SMS',
            self::WhatsApp => 'WhatsApp',
            self::None => 'None',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::Email => 'mail',
            self::Phone => 'phone',
            self::InPerson => 'users',
            self::SMS => 'message-square',
            self::WhatsApp => 'message-circle',
            self::None => 'x-circle',
        };
    }
}
