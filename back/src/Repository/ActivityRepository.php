<?php

namespace App\Repository;

use App\Entity\Activity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Activity>
 */
class ActivityRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Activity::class);
    }

   /**
    * @return Activity[] Returns an array of Activity objects
    */
   public function getFutureActivitiesFromLocation($lat, $long): array
   {
       return $this->createQueryBuilder('a')
           ->andWhere('a.location_latitude = :lat')
           ->andWhere('a.location_longitude = :long')
           ->andWhere('a.is_done = 0')
           ->setParameter('lat', $lat)
           ->setParameter('long', $long)
           ->orderBy('a.id', 'ASC')
           ->setMaxResults(10)
           ->getQuery()
           ->getResult()
       ;
   }

//    public function findOneBySomeField($value): ?Activity
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
