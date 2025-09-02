<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use App\Repository\ActivityRepository;
use App\Repository\UserRepository;
use App\Repository\UserGroupChatRepository;
use App\Repository\GroupChatRepository;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;

final class UserController extends AbstractController
{
    private $param;

    public function __construct(ParameterBagInterface $param)
    {
        $this->param = $param;
    }

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
    
    #[Route('/api/sports-location', name: 'app_sports_location', methods: ['POST'])]
    public function getSportsLocationFromApi(Request $request, HttpClientInterface $httpClient): JSONResponse
    {
        $data = json_decode($request->getContent(), true);
        $latitude = $data['userInfos']['lat'];
        $longitude = $data['userInfos']['long'];
        $perimeter = $data['userInfos']['perimeter'];
        $perimeter = intval($perimeter) * 1000;

        if ($latitude === null || $longitude === null || $perimeter === null) {
            return $this->json([
                'message' => 'Coordonnées manquantes'
            ]);
        }

        try {
            $baseUrl = $this->param->get('app.base_url');

            $url = $baseUrl . "?dataset=data-es&rows=20&refine.equip_type_name=Multisports%2FCity-stades&refine.inst_part_type_filter=Complexe%20sportif&geofilter.distance=$latitude, $longitude, $perimeter";

            $apiResponse = $httpClient->request('GET', $url);
            $data = $apiResponse->toArray();

            if (empty($data['records'])) {
                return $this->json([
                    'message' => 'Aucun résultat trouvé'
                ]);
            }

            
            return $this->json([
                'message' => 'Données récupérées',
                'data' => $data
            ]);

        } catch (TransportExceptionInterface | ClientExceptionInterface | ServerExceptionInterface | RedirectionExceptionInterface $e) {
            
            return $this->json([
                'message' => 'Erreur lors de l\'appel à l\'API'
            ], 500);
        }

    }

    #[Route('/api/user/future-activities', name: 'app_user_future_activities', methods: ['POST'])]
    public function getUserFutureActivities(Request $request, ActivityRepository $activityRepository, UserRepository $userRepository, UserGroupChatRepository $userGroupChatRepository, GroupChatRepository $groupChatRepository): JSONResponse
    {
        $data = json_decode($request->getContent(), true);
        $userId = $data['userId'];

        if (!$userId) {
            return $this->json([
                'message' => 'Utilisateur non défini',
                'success' => false
            ]);
        }
        // On récupère l'entité user à partir de l'id
        $userEntity = $userRepository->findOneById($userId);
        // On récupère les entités UserGroupChat auquel le user est lié
        $userGroupChat = $userGroupChatRepository->getUserGroupChatByUser($userEntity);

        // On isole les id pour les envoyer à la requete
        $arrayId = array_map(fn($ugc) => $ugc->getGroupChat(), $userGroupChat);

        // On récupère les entités GroupChat pour avoir les entités Activity auquel le user est lié mais qu'il n'a pas créé
        $groupChat = $groupChatRepository->getGroupChatByUserGC($arrayId); 

        // On récupère les activités que le user a créées
        $futureActivities = $activityRepository->getUserFutureActivities($userEntity);

        // On boucle sur les entités GroupChat pour récupérer toutes les infos de l'entité Activity (User et Sport) lié à chaque entité GroupChat
        foreach ($groupChat as $joinedActivity) {
            $activityInfos = $activityRepository->getActivityInfos($joinedActivity->getActivity(), new \DateTimeImmutable('today'));
            // si l'id user de l'activité est le meme que l'id user => le user est créateur de l'activité, on le prend pas en compte

            if ($activityInfos !== null && $activityInfos['user']['id'] !== $userEntity->getId()) {
                $futureActivities[] = $activityInfos;
            }
        }
        
        return $this->json([
            'message' => 'Données récupérées',
            'success' => true,
            'futureActivities' => $futureActivities
        ]);
    }

    #[Route('/api/user/activity', name: 'app_user_activity', methods: ['POST'])]
    public function isUserInActivity(Request $request, UserRepository $userRepository, ActivityRepository $activityRepository, UserGroupChatRepository $userGroupChatRepository, GroupChatRepository $groupChatRepository): JSONResponse
    {
        $data = json_decode($request->getContent(), true);
        $activityId = intval($data['id']);
        $userId = intval($data['userId']);

        $userEntity = $userRepository->findOneById($userId);
        $activityEntity = $activityRepository->findOneById($activityId);

        $groupChatEntity = $groupChatRepository->getGroupChatByActivityEntity($activityEntity);
        $userGroupChatEntity = $userGroupChatRepository->getUserGroupChatByUserAndGCEntity($groupChatEntity, $userEntity);

        if (!$userGroupChatEntity) {
            return $this->json([
                'success' => true,
                'isInActivity' => false
            ]);
        }

        return $this->json([
            'success' => true,
            'isInActivity' => true
        ]);
    }

    // Récupérer les discussions dans lequel est le user
    #[Route('/api/user/group-chat', name: 'app_user_group_chat', methods: ['POST'])]
    public function getUserGroupChat(Request $request, UserRepository $userRepository, UserGroupChatRepository $userGroupChatRepository, GroupChatRepository $groupChatRepository, MessageRepository $messageRepository): JSONResponse
    {
        $data = json_decode($request->getContent(), true);
        $userId = $data['userId'];
        $userEntity = $userRepository->findOneById($userId);

        if (!$userEntity) {
            return $this->json([
                'success' => false,
                'message' => 'Aucun utilisateur trouvé'
            ]);
        }

        $userGroupChat = $userGroupChatRepository->getUserGroupChatByUser($userEntity);
        $arrayId = array_map(fn($ugc) => $ugc->getGroupChat(), $userGroupChat);
        $groupChat = $groupChatRepository->getGroupChatByUserGC($arrayId);
        $arrayGC = [];

        foreach ($groupChat as $gcEntity) {
            $activityEntity = $gcEntity->getActivity();
            $lastMessage = $messageRepository->getGCLastMessage($gcEntity);

            if ($lastMessage) {

                $messageSender = $lastMessage->getUser();
    
                $arrayGC[] = [
                    'id' => $gcEntity->getId(),
                    'activity' => [
                        'id' => $activityEntity->getId(),
                        'name' => $activityEntity->getName()
                    ],
                    'is_closed' => $gcEntity->isClosed(),
                    'created_at' => $gcEntity->getCreatedAt(),
                    'closed_at' => $gcEntity->getClosedAt(),
                    'last_message' => [
                        'id' => $lastMessage->getId(),
                        'user' => [
                            'id' => $messageSender->getId(),
                            'first_name' => $messageSender->getFirstName()
                        ],
                        'content' => $lastMessage->getContent(),
                        'sent_at' => $lastMessage->getSentAt(),
                        'is_deleted' => $lastMessage->isDeleted()
                    ]
                ];
            } else {
                $arrayGC[] = [
                    'id' => $gcEntity->getId(),
                    'activity' => [
                        'id' => $activityEntity->getId(),
                        'name' => $activityEntity->getName()
                    ],
                    'is_closed' => $gcEntity->isClosed(),
                    'created_at' => $gcEntity->getCreatedAt(),
                    'closed_at' => $gcEntity->getClosedAt(),
                ];                
            }

        }

        return $this->json([
            'success' => true,
            'groupChat' => $arrayGC
        ]);
    }


    #[Route('/api/user/activity/count', name: 'app_user_count_activities', methods: ['POST'])]
    public function countUserActivities(Request $req, UserRepository $userRepository, UserGroupChatRepository $userGroupChatRepository, GroupChatRepository $groupChatRepository): JSONResponse
    {
        $data = json_decode($req->getContent(), true);
        $userId = $data['userId'];
        $userEntity = $userRepository->findOneById($userId);

        if (!$userEntity) {
            return $this->json([
                'success' => false,
                'message' => 'Aucun utilisateur trouvé'
            ]);
        }

        $userGroupChat = $userGroupChatRepository->getUserGroupChatByUser($userEntity);
        $arrayId = array_map(fn($ugc) => $ugc->getGroupChat(), $userGroupChat);
        $groupChat = $groupChatRepository->getGroupChatByUserGC($arrayId);

        $countActivities = count($groupChat);
        
        return $this->json([
            'success' => true,
            'message' => 'Données récupérées',
            'count_activities' => $countActivities,
        ]);
    }

    #[Route('/api/user/modify', name: 'app_user_modify', methods: ['POST'])]
    public function modifyUser(Request $req, UserRepository $userRepository, EntityManagerInterface $em): JSONResponse
    {
        $data = json_decode($req->getContent(), true);
        $bio = $data['bio'];
        $isPublic = $data['isPublic'];
        $activityNotif = $data['isActivityNotification'];
        $perimeter = intval($data['perimeter']);
        $userId = $data['userId'];
        $userEntity = $userRepository->findOneById($userId);

        if (!$userEntity) {
            return $this->json([
                'success' => false,
                'message' => 'Aucun utilisateur trouvé'
            ]);
        }

        $userEntity->setDescription($bio);
        $userEntity->setIsPublic($isPublic);
        $userEntity->setActivityNotification($activityNotif);
        $userEntity->setPerimeter($perimeter);
        
        $em->persist($userEntity);
        $em->flush();

        return $this->json([
            'success' => true,
            'message' => 'Données mises à jour'
        ]);
    }

    #[Route('/api/user/activities', name: 'app_user_activities', methods: ['POST'])]
    public function getFutureAndPastActivities(Request $req, UserRepository $userRepository, UserGroupChatRepository $userGroupChatRepository, GroupChatRepository $groupChatRepository, ActivityRepository $activityRepository): JSONResponse
    {
        $data = json_decode($req->getContent(), true);
        $userId = $data['userId'];
        $userEntity = $userRepository->findOneById($userId);

        if (!$userEntity) {
            return $this->json([
                'success' => false,
                'message' => 'Aucun utilisateur trouvé'
            ]);
        }

        $userGroupChat = $userGroupChatRepository->getUserGroupChatByUser($userEntity);
        $arrayId = array_map(fn($ugc) => $ugc->getGroupChat(), $userGroupChat);
        $groupChat = $groupChatRepository->getGroupChatByUserGC($arrayId);

        $arrayActivityId = array_map(fn($gc) => $gc->getActivity(), $groupChat);
        $futureActivities = $activityRepository->getFutureActivitiesFromId($arrayActivityId);

        $arrayFutureActivities = [];
        $arrayPastActivities = [];

        foreach($futureActivities as $act) {
            $user = $act->getUser();
            $arrayFutureActivities[] = [
                'activityCreator' => [
                    'name' => $user->getFirstName(),
                    'id' => $user->getId()
                ],
                'activity' => [
                    'id' => $act->getId(),
                    'name' => $act->getName(),
                    'date' => $act->getActivityDate(),
                    'location_name' => $act->getLocationName(),
                    'description' => $act->getDescription(),
                    'hour_from' => $act->getHourFrom(),
                    'hour_to' => $act->getHourTo(),
                    'current_players' => $act->getCurrentPlayers(),
                    'max_players' => $act->getMaxPlayers()
                ] 
            ];
        }

        $pastActivities = $activityRepository->getPastActivitiesFromId($arrayActivityId);

        foreach($pastActivities as $act) {
            $user = $act->getUser();
            $arrayPastActivities[] = [
                'activityCreator' => [
                    'name' => $user->getFirstName(),
                    'id' => $user->getId()
                ],
                'activity' => [
                    'id' => $act->getId(),
                    'name' => $act->getName(),
                    'date' => $act->getActivityDate(),
                    'location_name' => $act->getLocationName(),
                    'description' => $act->getDescription(),
                    'hour_from' => $act->getHourFrom(),
                    'hour_to' => $act->getHourTo(),
                    'current_players' => $act->getCurrentPlayers(),
                    'max_players' => $act->getMaxPlayers()
                ] 
            ];
        }

        return $this->json([
            'success' => true,
            'futureActivities' => $arrayFutureActivities,
            'pastActivities' => $arrayPastActivities
        ]);
    }
}
