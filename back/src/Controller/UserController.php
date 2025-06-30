<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\Request;

final class UserController extends AbstractController
{
    #[Route('/api/me', name: 'app_me', methods: ['GET'])]
    public function getUserId(TokenStorageInterface $tokenStorage, Request $request): JsonResponse
    {
    
        $user = $tokenStorage->getToken()->getUser();


        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'is_banned' => $user->isBanned(),
            'is_public' => $user->isPublic(),
            'activityNotif' => $user->isActivityNotification(),
            'perimeter' => $user->getPerimeter(),
            'birthDate' => $user->getBirthDate(),
            'is_verified' => $user->isVerified(),
            'gender' => $user->getGender(),
            'activities' => count($user->getActivities()),
            'description' => $user->getDescription()
        ]);
    }
}
