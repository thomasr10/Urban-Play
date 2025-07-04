<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\SportRepository;

final class SportController extends AbstractController
{
    #[Route('/api/sport/get-sports', name: 'app_sport_get_sports')]
    public function getSports(SportRepository $sportRepository): JsonResponse
    {   
        $sports = $sportRepository->getArraySports();

        if (empty($sports)) {
            return $this->json([
                'message' => 'Aucun sport trouvé'
            ]);
        }

        return $this->json([
            'message' => 'Données récupérées',
            'sportsArray' => $sports,
        ]);
    }
}
