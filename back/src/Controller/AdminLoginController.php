<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\AdminRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class AdminLoginController extends AbstractController
{
    #[Route('/admin/login', name: 'app_admin_login')]
    public function adminLogin(Request $request, AdminRepository $adminRepository, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'];
        $password = $data['password'];

        $adminEntity = $adminRepository->getAdminByEmail($email);

        if ($adminEntity === null || !$passwordHasher->isPasswordValid($adminEntity, $password)) {
            return $this->json([
                'success' => false,
                'message' => 'Adresse mail ou mot de passe incorrect'
            ]);
        }

        $token = $jwtManager->create($adminEntity);

        return $this->json([
            'success' => true,
            'token' => $token,
        ]);
    }
}
