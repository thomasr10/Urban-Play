<?php

namespace App\Repository;

use App\Entity\UserGroupChat;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;

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
