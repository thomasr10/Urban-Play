<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\ActivityRepository;

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
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/ActivityController.php',
        ]);
    }
}
