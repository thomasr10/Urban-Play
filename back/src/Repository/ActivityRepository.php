<?php

namespace App\Repository;

use App\Entity\Activity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;

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
   public function getFutureActivitiesFromLocation(float $lat, float $long): array
   {
       return $this->createQueryBuilder('a')
           ->select('a', 'sport', 'user')
           ->join('a.sport', 'sport')
           ->join('a.user', 'user')
           ->andWhere('a.location_latitude = :lat')
           ->andWhere('a.location_longitude = :long')
           ->andWhere('a.is_done = 0')
           ->setParameter('lat', $lat)
           ->setParameter('long', $long)
           ->orderBy('a.id', 'DESC')
           ->setMaxResults(10)
           ->getQuery()
           ->getArrayResult()
       ;
   }

   public function getActivityFromLocationDateTime(array $coords, \DateTimeImmutable $date, \DateTime $from, \DateTime $to): array
   {
        return $this->createQueryBuilder('a')
            ->andWhere('a.location_latitude = :lat')
            ->andWhere('a.location_longitude = :long')
            ->andWhere('a.activity_date = :date')
            ->andWhere('a.hour_from < :to')
            ->andWhere('a.hour_to > :from')
            ->setParameter('lat', $coords[1])
            ->setParameter('long', $coords[0])
            ->setParameter('date', $date)
            ->setParameter('from', $from)
            ->setParameter('to', $to)
            ->getQuery()
            ->getResult()
        ;
   }

   public function getUserFutureActivities(User $user, array $groupChat): array
   {
        return $this->createQueryBuilder('a')
            ->select('a', 'gc')
            ->andWhere('a.user_id = :user')
            ->orWhere('a.id in (:groupChat)')
            ->andWhere('is_done = 0')
            ->setParameter('user', $user)
            ->setParameter('groupChat', $groupChat)
            ->getQuery()
            ->getResult()
        ;
   }


}
