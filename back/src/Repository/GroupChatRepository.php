<?php

namespace App\Repository;

use App\Entity\GroupChat;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Activity;

/**
 * @extends ServiceEntityRepository<GroupChat>
 */
class GroupChatRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GroupChat::class);
    }

   /**
    * @return GroupChat[] Returns an array of GroupChat objects
    */
   public function getGroupChatByUserGC(array $userGC): array
   {
       return $this->createQueryBuilder('gc')
           ->select('gc', 'activity')
           ->join('gc.activity', 'activity')
           ->andWhere('gc.id IN (:arrayUserGC)')
           ->setParameter('arrayUserGC', $userGC)
           ->orderBy('gc.id', 'DESC')
           ->getQuery()
           ->getResult()
       ;
   }

   public function getGroupChatByActivityEntity(Activity $activity): ?GroupChat
   {
        return $this->createQueryBuilder('gc')
            ->andWhere('gc.activity = :activity')
            ->setParameter('activity', $activity)
            ->getQuery()
            ->getOneOrNullResult()
        ;
   }

   public function findOneById($id): ?GroupChat
   {
       return $this->createQueryBuilder('g')
           ->andWhere('g.id = :id')
           ->setParameter('id', $id)
           ->getQuery()
           ->getOneOrNullResult()
       ;
   }
   
}
