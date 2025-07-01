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
use App\Service\TokenGenerator;
use DateTimeImmutable;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use App\Repository\UserRepository;


final class RegisterController extends AbstractController
{
    private AgeVerification $ageVerification;
    private TokenGenerator $tokenGenerator;

    public function __construct(AgeVerification $ageVerification, TokenGenerator $tokenGenerator)
    {
        $this->ageVerification = $ageVerification;
        $this->tokenGenerator = $tokenGenerator;
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
        $user->setGender($userData['gender']);
            
        $hashedPassword = $passwordHasher->hashPassword($user, $userData['password']);
        $user->setPassword($hashedPassword); 
        $user->setIsBanned(false);
        $user->setIsPublic(false);
        $user->setActivityNotification(false);
        $user->setPerimeter(5);
        $user->setIsVerified(false);

        // generate token
        $token = $this->tokenGenerator->generateToken();
        $user->setToken($token);
        $user->setTokenLimit((new \DateTimeImmutable())->modify('+15 minutes'));
     
        try {
            $em->persist($user);
            $em->flush();
            
        } catch (UniqueConstraintViolationException $e) {
            return $this->json([
                'message' => 'Cette adresse email est déjà utilisée.',
            ], 409);
        }

        return $this->json([
            'message' => 'Inscription réussie !',
            'id' => $user->getId()
        ], 201);
    }

    #[Route('/api/verify-token', name: 'app_verify_token', methods: ['POST'])]
    public function verifyToken(Request $request, UserRepository $userRepository, EntityManagerInterface $em): JSONResponse
    {   
        $data = json_decode( $request->getContent(), true);
        $token = $data['token'];
        $user = $userRepository->getUserFromToken($token);
        $token_limit = $user->getTokenLimit();
        $now = new \DateTimeImmutable();

        if ( $now > $token_limit) {
            return $this->json([
                'message' => 'Le lien a expiré',
                'tokenLim' => $token_limit,
                'now' => $now
            ], 403);
        }

        $user->setToken(null);
        $user->setTokenLimit(null);
        $user->setIsVerified(true);
        $em->flush();

        return $this->json([
            'message' => 'Votre compte a été vérifié avec succès !'
        ]);
    }

    #[Route('/api/new-token', name: 'app_new_token')]
    public function newToken(Request $request, UserRepository $userRepository, EntityManagerInterface $em): JSONResponse
    {
        $data = json_decode($request->getContent(), true);
        $token = $data['token'];
        $user = $userRepository->getUserFromToken($token);
        $newToken = $this->tokenGenerator->generateToken();
        $user->setToken($newToken);
        $user->setTokenLimit((new \DateTimeImmutable())->modify('+15 minutes'));
        $em->flush();
        
        return $this->json([
            'message' => 'Nouveau token envoyé',
            'id' => $user->getId()
        ]);
    }
}
