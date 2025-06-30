<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

final class MailController extends AbstractController
{
    #[Route('/mail/new-user', name: 'app_mail_new_user')]
    public function verificationMail(): JsonResponse
    {


        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/MailController.php',
        ]);
    }
}
