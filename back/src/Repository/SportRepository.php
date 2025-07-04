<?php

namespace App\Repository;

use App\Entity\Sport;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Sport>
 */
class SportRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Sport::class);
    }

   /**
    * @return Sport[] Returns an array of Sport objects
    */
   public function getArraySports(): array
   {
       return $this->createQueryBuilder('s')
            ->select('s.id, s.name')
            ->orderBy('s.id', 'ASC')
            ->getQuery()
            ->getArrayResult()
       ;
   }

   public function getSportEntityFromId($id): ?Sport
   {
       return $this->createQueryBuilder('s')
           ->andWhere('s.id = :id')
           ->setParameter('id', $id)
           ->getQuery()
           ->getOneOrNullResult()
       ;
   }
}
