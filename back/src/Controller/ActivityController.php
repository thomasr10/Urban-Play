<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\ActivityRepository;
use App\Repository\SportRepository;
use App\Repository\UserRepository;
use App\Repository\UserGroupChatRepository;
use App\Repository\GroupChatRepository;
use App\Entity\Activity;
use App\Entity\GroupChat;
use App\Entity\UserGroupChat;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

final class ActivityController extends AbstractController
{
    #[Route('/api/activity/location', name: 'app_activity')]
    public function getActivityFromLocation(Request $request, ActivityRepository $activityRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $latitude = $data['coordinates'][1];
        $longitude = $data['coordinates'][0];

        $activities = $activityRepository->getFutureActivitiesFromLocation($latitude, $longitude);

        if (empty($activities)) {
            return $this->json([
                'message' => 'Aucune activité prévue pour ce lieu'
            ], 200);
        }

        return $this->json([
            'message' => 'Données récupérées',
            'success' => true,
            'activities' => $activities,
        ]);
    }

    #[Route('/api/activity/create', name: 'app_activity_create', methods: ['POST'])]
    public function createNewActivity(Request $request, ActivityRepository $activityRepository, SportRepository $sportRepository, UserRepository $userRepository, EntityManagerInterface $em): JSONResponse
    {
        $data = json_decode($request->getContent(), true);
        $isDateFree = $activityRepository->getActivityFromLocationDateTime($data['coords'], new \DateTimeImmutable($data['date']), new \DateTime($data['from']), new \DateTime($data['to']));

        if (!empty($isDateFree)) {
            return $this->json([
                'message' => 'Une activité est déjà prévue ici à cette date et aux mêmes horaires',
                'success' => false
            ], 200);
        }

        // get Sport entity + User entity       
        $sportEntity = $sportRepository->getSportEntityFromId(intval($data['sportId']));
        $userEntity = $userRepository->findOneById($data['userId']);

        $activity = new Activity();
        $activity->setSport($sportEntity); //chercher entité
        $activity->setUser($userEntity);
        $activity->setName($data['activityName']);
        $activity->setLocationName($data['locationName']);
        $activity->setLocationLatitude($data['coords'][1]);
        $activity->setLocationLongitude($data['coords'][0]);
        $activity->setCreatedAt(new \DateTimeImmutable());
        $activity->setActivityDate(new \DateTimeImmutable($data['date']));
        $activity->setDescription($data['activityDescription']);
        $activity->setIsdone(false);
        $activity->setHourFrom(new \DateTime($data['from']));
        $activity->setHourTo(new \DateTime($data['to']));
        $activity->setMaxPlayers($data['players']);
        $activity->setCurrentPlayers(1);
        $activity->setPicturePath('/img/img-city.webp');
        
        $em->persist($activity);

        $groupChat = new GroupChat();
        $groupChat->setActivity($activity);
        $groupChat->setIsClosed(0);
        $groupChat->setCreatedAt(new \DateTimeImmutable());
        $groupChat->setClosedAt((clone $activity->getActivityDate())->modify('+1 day'));
        $em->persist($groupChat);

        $userGroupChat = new UserGroupChat();
        $userGroupChat->setUser($userEntity);
        $userGroupChat->setGroupChat($groupChat);
        $userGroupChat->setJoinedAt(new \DateTimeImmutable);
        $em->persist($userGroupChat);

        $em->flush();

        return $this->json([
            'message' => 'Activité créée avec succès !',
            'success' => true,
            'id' => $activity->getId()
        ]);
    }

    #[Route('/api/activity/{id}', name: 'app_activity_id', methods: ['GET'])]
    public function getActivityInfos(int $id, ActivityRepository $activityRepository): JSONResponse
    {
        $activity = $activityRepository->findOneById($id);
        
        if (!$activity) {
            return $this->json([
                'success' => false,
                'message' => 'Activité non trouvée'
            ]);
        }

        $user = $activity->getUser();
        $sport = $activity->getSport();

        return $this->json([
            'success' => true,
            'activity' => [
                'id' => $activity->getId(),
                'sport' => [
                    'name' => $sport->getName()
                ],
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'first_name' => $user->getFirstName(),
                    'is_banned' => $user->isBanned(),
                    'gender' => $user->getGender()
                ],
                'name' => $activity->getName(),
                'location_name' => $activity->getLocationName(),
                'location_latitude' => $activity->getLocationLatitude(),
                'location_longitude' => $activity->getLocationLongitude(),
                'created_at' => $activity->getCreatedAt(),
                'activity_date' => $activity->getActivityDate(),
                'description' => $activity->getDescription(),
                'is_done' => $activity->isDone(),
                'hour_from' => $activity->getHourFrom(),
                'hour_to' => $activity->getHourTo(),
                'current_players' => $activity->getCurrentPlayers(),
                'max_players' => $activity->getMaxPlayers(),
                'picture_path' => $activity->getPicturePath()
            ]
        ]);
    }

    #[Route('/api/activity/infos', name: 'app_activity_infos')]
    public function getActivityInfosFromGC (Request $req, GroupChatRepository $groupChatRepository, UserGroupChatRepository $userGroupChatRepository): JSONResponse
    {
        $data = json_decode($req->getContent(), true);
        $groupChatId = $data['id'];
        $groupChat = $groupChatRepository->findOneById($groupChatId);

        $activity = $groupChat->getActivity();
        $userGroupChat = $userGroupChatRepository->getUsersInActivity($groupChat);

        $usersInActivity = [];
        foreach($userGroupChat as $ugc) {

            $user = $ugc->getUser();
            $usersInActivity[] = [
                'id' => $user->getId(),
                'first_name' => $user->getFirstName(),
            ];
        }

        return $this->json([
            'success' => true,
            'users' => $usersInActivity,
            'activityInfos' => [
                'id' => $activity->getId(),
                'name' => $activity->getName()
            ]
        ]);

    }

    #[Route('/api/activity/add-user', name: 'app_activity_add_user', methods: ['POST'])]
    public function addUserToActivity(Request $req, ActivityRepository $activityRepository, UserRepository $userRepository ,GroupChatRepository $groupChatRepository, EntityManagerInterface $em): JSONResponse
    {
        $data = json_decode($req->getContent(), true);
        $activityId = $data['id'];
        $userId = $data['userId'];

        $activityEntity = $activityRepository->findOneById($activityId);

        if (!$activityEntity) {
            return $this->json([
                'success' => false,
                'message' => 'Activité non trouvée'
            ]);
        }

        $userEntity = $userRepository->findOneById($userId);

        if (!$userEntity) {
            return $this->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ]);
        }

        $groupChat = $groupChatRepository->getGroupChatByActivityEntity($activityEntity);

        if (!$groupChat) {
            return $this->json([
                'success' => false,
                'message' => 'Groupe de discussion non trouvé'
            ]);
        }

        $newUserGC = new UserGroupChat();
        $newUserGC->setUser($userEntity);
        $newUserGC->setGroupChat($groupChat);
        $newUserGC->setJoinedAt(new \DateTimeImmutable);
        $em->persist($newUserGC);

        $activityEntity->setCurrentPlayers($activityEntity->getCurrentPlayers() + 1);

        $em->flush();

        return $this->json([
            'success' => true,
            'message' => 'Vous avez rejoint l\'activité'
        ]);
    }

    #[Route('/api/activity/groupchat', name: 'app_activity_groupchat', methods: ['POST'])]
    public function getActivityGroupChat(Request $req, ActivityRepository $activityRepository, GroupChatRepository $groupChatRepository): JSONResponse
    {
        $data = json_decode($req->getContent(), true);
        $activityId = $data['id'];
        $activityEntity = $activityRepository->findOneById($activityId);

        if (!$activityEntity) {
            return $this->json([
                'success' => false,
                'message' => 'Activité non trouvée'
            ]);
        }

        $groupChat = $groupChatRepository->getGroupChatByActivityEntity($activityEntity);

        return $this->json([
            'success' => true,
            'groupChatId' => $groupChat->getId()
        ]);
    }
}