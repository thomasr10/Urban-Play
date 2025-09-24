<?php

namespace App\Repository;

use App\Entity\Activity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;
use Doctrine\ORM\Query;

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
   public function getFutureActivitiesFromLocation(float $lat, float $long, \DateTimeImmutable $todayDate): array
   {
       return $this->createQueryBuilder('a')
           ->select('a', 'sport', 'user')
           ->join('a.sport', 'sport')
           ->join('a.user', 'user')
           ->andWhere('a.location_latitude = :lat')
           ->andWhere('a.location_longitude = :long')
           ->andWhere('a.is_done = 0')
           ->andWhere('a.activity_date > :todayDate')
           ->setParameter('lat', $lat)
           ->setParameter('long', $long)
           ->setParameter('todayDate', $todayDate)
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

   public function getUserFutureActivities(User $user): array
   {
        return $this->createQueryBuilder('a')
            ->select('a', 's', 'u')
            ->join('a.user', 'u')
            ->join('a.sport', 's')
            ->andWhere('a.user = :user')
            ->andWhere('a.is_done = 0')
            ->andWhere("CONCAT(a.activity_date, ' ', a.hour_from)>= CURRENT_TIMESTAMP()")
            ->setParameter('user', $user)
            ->orderBy('a.activity_date', 'ASC')
            ->getQuery()
            ->getArrayResult()
        ;
   }

   public function getActivityInfos(Activity $activity, \DateTimeImmutable $now): ?array
   {
        return $this->createQueryBuilder('a')
            ->select('a', 'u', 's')
            ->join('a.user', 'u')
            ->join('a.sport', 's')
            ->andWhere('a = :activity')
            ->andWhere('a.activity_date >= :now')
            ->setParameter('activity', $activity)
            ->setParameter('now', $now)
            ->getQuery()
            ->getOneOrNullResult(Query::HYDRATE_ARRAY)
        ;
   }

   public function findOneById(int $id): ?Activity
   {
        return $this->createQueryBuilder('a')
            ->andWhere('a.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult()
        ;
   }

   public function getFutureActivitiesFromId(array $arrayActivity): array
   {
        return $this->createQueryBuilder('a')
            ->andWhere('a.id in (:arrayActivity)')
            ->andWhere('a.is_done = 0')
            ->andWhere("CONCAT(a.activity_date, ' ', a.hour_from)>= CURRENT_TIMESTAMP()")
            ->setParameter('arrayActivity', $arrayActivity)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(5)
            ->getQuery()
            ->getResult()
        ;
   }

   public function getPastActivitiesFromId(array $arrayActivity): array
   {
        return $this->createQueryBuilder('a')
            ->andWhere('a.id in (:arrayActivity)')
            ->andWhere('a.is_done = 0')
            ->andWhere("CONCAT(a.activity_date, ' ', a.hour_from) < CURRENT_TIMESTAMP()")
            ->setParameter('arrayActivity', $arrayActivity)
            ->orderBy('a.id', 'DESC')
            ->setMaxResults(5)
            ->getQuery()
            ->getResult()
        ;   }
        
   public function getCountTotalActivities(): array
   {
        return $this->createQueryBuilder('a')
            ->select('COUNT(a)')
            ->orderBy('a.id', 'DESC')
            ->getQuery()
            ->getOneOrNullResult()
        ;   }

        
   public function getLatestActivities(int $offset): array
   {
        return $this->createQueryBuilder('a')
            ->select('a')
            ->orderBy('a.id', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults(10)
            ->getQuery()
            ->getArrayResult()
        ;   }
}