<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

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

        $baseUrl = $this->param->get('app.base_url');
        
        $apiResponse = $httpClient->request('GET', $baseUrl, [
            'query' => [
                'refine.equip_type_name' => 'Multisports/City-stades',
                'refine.inst_part_type_filter' => 'Complexe sportif',
                'refine.aps_name' => 'Football/Football en salle (Futsal)'
            ]
        ]);
        var_dump($apiResponse->toArray());

        return $this->json([
            'message' => 'test'
        ]);
    }
}
