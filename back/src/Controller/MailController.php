<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use App\Repository\UserRepository;


final class MailController extends AbstractController
{
    #[Route('/api/mail/new-user', name: 'app_mail_new_user')]
    public function verificationMail(Request $request,  UserRepository $userRepository, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $id = $data['id'];

        $user = $userRepository->findOneById($id);

        $newEmail = (new Email())
            ->from('no-reply@urban-play.com')
            ->to($user->getEmail())
            ->subject('Vérification de votre compte')
            ->html('<p>Bonjour,</p>
                    <p>Bienvenue chez Urban Play</p>
                    <p>Pour pouvoir utiliser les fonctionnalités de notre site, vous devez faire vérifier votre compte en cliquant sur ce <a href="http://localhost:5173/verify-token?token=' . $user->getToken() . '">lien</a>.</p>
                    <p>L\'équipe d\'Urban Play.</p>');
            $mailer->send($newEmail);


        return $this->json([
            'message' => 'E-mail envoyé à votre adresse mail.'
        ]);
    }

    public function sendNewVerificationMail()
    {
        // suite du code
    }
}
