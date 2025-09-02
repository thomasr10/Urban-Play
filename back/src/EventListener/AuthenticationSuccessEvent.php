<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\JsonResponse;

class AuthenticationSuccessListener
{
    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event): void
    {
        $user = $event->getUser();

        if ($user->isVerified() !== true) {
            $event->setData([
                'success' => false,
                'message' => 'Veuillez vérifier votre compte pour pouvoir y accéder'
            ]);

            $event->getResponse()->setStatusCode(JsonResponse::HTTP_UNAUTHORIZED);
        }
    }
}
