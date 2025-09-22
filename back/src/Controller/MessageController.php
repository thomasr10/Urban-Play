<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Message;
use App\Repository\UserRepository;
use App\Repository\GroupChatRepository;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use WebSocket\Client;

final class MessageController extends AbstractController
{
    #[Route('/api/message/new', name: 'app_new_message')]
    public function newMessage(Request $request, UserRepository $userRepository, GroupChatRepository $groupChatRepository, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $groupChatId = $data['id'];
        $message = $data['message'];
        $userId = $data['userId'];

        $user = $userRepository->findOneById($userId);
        $groupChat = $groupChatRepository->findOneById($groupChatId);

        $newMessage = new Message();
        $newMessage->setUser($user);
        $newMessage->setGroupChat($groupChat);
        $newMessage->setContent($message);
        $newMessage->setSentAt(new \DateTimeImmutable);
        $newMessage->setIsDeleted(false);
        
        $em->persist($newMessage);
        $em->flush();

        $ws = new Client('ws://localhost:8081');
        $ws->send(json_encode([
            'type' => 'message',
            'id' => $newMessage->getId(),
            'content' => $newMessage->getContent(),
            'senderName' => $user->getFirstName(),
            'senderId' => $user->getId(),
            'sentAt' => $newMessage->getSentAt()->format('c')
        ]));

        return $this->json([
            'message' => 'Message envoyé avec succès',
            'success' => true,
        ]);
    }

    #[Route('/api/message/get', name: 'app_message_get', methods: ['POST'])]
    public function getMessages (Request $request, MessageRepository $messageRepository, GroupChatRepository $groupChatRepository): JSONResponse
    {
        $data = json_decode($request->getContent(), true);
        $groupChatId = $data['id'];
        $lastMessageId = $data['lastMessage'];
        $groupChat = $groupChatRepository->findOneById($groupChatId);

        if (!$groupChat) {
            return $this->json([
                'success' => false,
                'message' => 'Discussion non trouvée'
            ]);
        }

        $arrayMessages = [];

        if ($lastMessageId === null) {
            $lastTenMessages = $messageRepository->getLastTenMessages($groupChat);

            foreach ($lastTenMessages as $message) {

                $user = $message->getUser();

                $arrayMessages[] = [
                    'id' => $message->getId(),
                    'senderId' => $user->getId(),
                    'senderName' => $user->getFirstName(),
                    'content' => $message->getContent(),
                    'sentAt' => $message->getSentAt()->format('c'),
                    'is_deleted' => $message->isDeleted()
                ];
            }
            return $this->json([
                'success' => true,
                'message' => 'Messages récupérés',
                'lastMessages' => $arrayMessages
            ]);

        } else {
            $lastTenMessages = $messageRepository->getPreviousMessages($groupChat, $lastMessageId);

            foreach ($lastTenMessages as $message) {

                $user = $message->getUser();

                $arrayMessages[] = [
                    'id' => $message->getId(),
                    'senderId' => $user->getId(),
                    'senderName' => $user->getFirstName(),
                    'content' => $message->getContent(),
                    'sentAt' => $message->getSentAt()->format('c'),
                    'is_deleted' => $message->isDeleted()
                ];
            }

            return $this->json([
                'success' => true,
                'message' => 'Messages récupérés',
                'lastMessages' => $arrayMessages
            ]);
        }
        
    }
}