<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\ActivityRepository;
use App\Repository\UserRepository;
use App\Repository\UserGroupChatRepository;
use App\Repository\GroupChatRepository;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

final class GroupChatController extends AbstractController
{
    #[Route('/api/groupchat/activity/is-done', name: 'app_is_activity_done', methods: ['POST'])]
    public function isActivityDone(Request $req, GroupChatRepository $gcRepository, UserGroupChatRepository $ugcRepository, ActivityRepository $activityRepository):JSONResponse
    {
        $data = json_decode($req->getContent(), true);
        $groupChatEntity = $gcRepository->findOneById($data['id']);
        $activityId = $groupChatEntity->getActivity()->getId();

        $activityEntity = $activityRepository->findOneById($activityId);
        
        $activityDate = $activityEntity->getActivityDate();

        return $this->json([
            'success' => true,
            'activityDate' => $activityDate
        ], 200);
    }
}