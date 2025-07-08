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
        // On récupère les entités GroupChat pour avoir les entités Activity auquel le user est lié mais qu'il n'a pas créé
        $groupChat = $groupChatRepository->getGroupChatByUserGC($userGroupChat);

        // On récupère les activités que le user a créées
        $futureActivities = $activityRepository->getUserFutureActivities($userEntity);

        // On boucle sur les entités GroupChat pour récupérer toutes les infos de l'entité Activity (User et Sport) lié à chaque entité GroupChat
        foreach ($groupChat as $joinedActivity) {
            $activityInfos = $activityRepository->getActivityInfos($joinedActivity->getActivity());
            $futureActivities[] = $activityInfos;
        }

        return $this->json([
            'message' => 'Données récupérées',
            'success' => true,
            'futureActivities' => $futureActivities
        ]);
    }
}
