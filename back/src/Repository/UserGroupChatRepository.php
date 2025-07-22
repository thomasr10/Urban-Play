<?php

namespace App\Repository;

use App\Entity\UserGroupChat;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;
use App\Entity\GroupChat;

/**
 * @extends ServiceEntityRepository<UserGroupChat>
 */
class UserGroupChatRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserGroupChat::class);
    }

   /**
    * @return UserGroupChat[] Returns an array of UserGroupChat objects
    */
   public function getUserGroupChatByUser(User $userEntity): array
   {
       return $this->createQueryBuilder('u_gc')
           ->select('u_gc', 'gc')
           ->join('u_gc.groupchat', 'gc')
           ->andWhere('u_gc.user = :userEntity')
           ->setParameter('userEntity', $userEntity)
           ->orderBy('u_gc.id', 'DESC')
           ->getQuery()
           ->getResult()
       ;
   }

   public function getUserGroupChatByUserAndGCEntity(GroupChat $gc, User $user): ?UserGroupChat
   {
        return $this->createQueryBuilder('ugc')
            ->andWhere('ugc.groupchat = :gc')
            ->andWhere('ugc.user = :user')
            ->setParameter('gc', $gc)
            ->setParameter('user', $user)
            ->getQuery()
            ->getOneOrNullResult()
        ;
   }

   public function getUsersInActivity(GroupChat $gc): array
   {
        return $this->createQueryBuilder('ugc')
            ->select('user', 'ugc')
            ->join('ugc.user', 'user')
            ->andWhere('ugc.groupchat = :gc')
            ->setParameter('gc', $gc)
            ->getQuery()
            ->getResult()
        ;
   }

   public function getUserGroupChatByGC(GroupChat $gc): array
   {
        return $this->createQueryBuilder('ugc')
            ->andWhere('ugc.groupchat = :gc')
            ->setParameter('gc', $gc)
            ->getQuery()
            ->getResult()
        ;
   }

//    public function findOneBySomeField($value): ?UserGroupChat
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
