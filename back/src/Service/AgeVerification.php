<?php

namespace App\Service;

use DateTimeImmutable;

class AgeVerification {

    public function verifyAge(\DateTimeImmutable $birthDate): bool
    {
        $todaysDate = new DateTimeImmutable('today');
        $difference = $todaysDate->diff($birthDate);
        $age = $difference->y;

        return $age >= 16;
    }
}