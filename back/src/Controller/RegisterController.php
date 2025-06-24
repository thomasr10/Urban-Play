<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Service\AgeVerification;
use DateTimeImmutable;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;


final class RegisterController extends AbstractController
{
    private AgeVerification $ageVerification;

    public function __construct(AgeVerification $ageVerification)
    {
        $this->ageVerification = $ageVerification;
    }

    #[Route('/api/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em): JsonResponse
    {

        $userData = json_decode($request->getContent(), true);

        $birthDate = new \DateTimeImmutable($userData['birthDate']);
        $isValid = $this->ageVerification->verifyAge($birthDate);

        if ($isValid === false) {
            return $this->json([
                'message' => 'Erreur lors de l\'inscription. L\'age minimum est de 16 ans.'
            ], 400);
        }
    
        $user = new User();
        $user->setFirstName($userData['firstName']);
        $user->setLastName($userData['lastName']);
        $user->setEmail($userData['email']);
        $user->setBirthDate(\DateTime::createFromImmutable($birthDate));
            
        $hashedPassword = $passwordHasher->hashPassword($user, $userData['password']);
        $user->setPassword($hashedPassword); 
        $user->setIsBanned(false);
        $user->setIsPublic(false);
        $user->setActivityNotification(false);
        $user->setPerimeter(5);
        $user->setIsVerified(false);

        try {
            $em->persist($user);
            $em->flush();
            
        } catch (UniqueConstraintViolationException $e) {
            return $this->json([
                'message' => 'Cette adresse email est déjà utilisée.',
            ], 409);
        }

        return $this->json([
            'message' => 'Inscription réussie !'
        ], 201);
    }
}
