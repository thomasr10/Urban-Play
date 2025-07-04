<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\ActivityRepository;
use App\Repository\SportRepository;
use App\Repository\UserRepository;
use App\Entity\Activity;
use Doctrine\ORM\EntityManagerInterface;

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
        $activity->setMaxPlayers($data['player']);
        $activity->setCurrentPlayers(1);

        $em->persist($activity);
        $em->flush($activity);

        return $this->json([
            'message' => 'Activité créée avec succès !',
            'success' => true,
            'id' => $activity->getId()
        ]);
    }
}
