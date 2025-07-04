<?php

namespace App\Entity;

use App\Repository\ActivityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ActivityRepository::class)]
class Activity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 120)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $location_name = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(type: 'date_immutable')]
    private ?\DateTimeImmutable $activity_date = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'activities')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Sport $sport = null;

    #[ORM\ManyToOne(inversedBy: 'activities')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    /**
     * @var Collection<int, ReportedActivity>
     */
    #[ORM\OneToMany(targetEntity: ReportedActivity::class, mappedBy: 'activity')]
    private Collection $reportedActivities;

    /**
     * @var Collection<int, GroupChat>
     */
    #[ORM\OneToMany(targetEntity: GroupChat::class, mappedBy: 'activity')]
    private Collection $groupChats;

    #[ORM\Column(length: 255)]
    private ?string $location_latitude = null;

    #[ORM\Column(length: 255)]
    private ?string $location_longitude = null;

    #[ORM\Column]
    private ?bool $is_done = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTime $hour_from = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTime $hour_to = null;

    #[ORM\Column]
    private ?int $max_players = null;

    #[ORM\Column]
    private ?int $current_players = null;

    public function __construct()
    {
        $this->reportedActivities = new ArrayCollection();
        $this->groupChats = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getLocationName(): ?string
    {
        return $this->location_name;
    }

    public function setLocationName(string $location_name): static
    {
        $this->location_name = $location_name;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getActivityDate(): ?\DateTimeImmutable
    {
        return $this->activity_date;
    }

    public function setActivityDate(\DateTimeImmutable $activity_date): static
    {
        $this->activity_date = $activity_date;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getSport(): ?Sport
    {
        return $this->sport;
    }

    public function setSport(?Sport $sport): static
    {
        $this->sport = $sport;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection<int, ReportedActivity>
     */
    public function getReportedActivities(): Collection
    {
        return $this->reportedActivities;
    }

    public function addReportedActivity(ReportedActivity $reportedActivity): static
    {
        if (!$this->reportedActivities->contains($reportedActivity)) {
            $this->reportedActivities->add($reportedActivity);
            $reportedActivity->setActivity($this);
        }

        return $this;
    }

    public function removeReportedActivity(ReportedActivity $reportedActivity): static
    {
        if ($this->reportedActivities->removeElement($reportedActivity)) {
            // set the owning side to null (unless already changed)
            if ($reportedActivity->getActivity() === $this) {
                $reportedActivity->setActivity(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, GroupChat>
     */
    public function getGroupChats(): Collection
    {
        return $this->groupChats;
    }

    public function addGroupChat(GroupChat $groupChat): static
    {
        if (!$this->groupChats->contains($groupChat)) {
            $this->groupChats->add($groupChat);
            $groupChat->setActivity($this);
        }

        return $this;
    }

    public function removeGroupChat(GroupChat $groupChat): static
    {
        if ($this->groupChats->removeElement($groupChat)) {
            // set the owning side to null (unless already changed)
            if ($groupChat->getActivity() === $this) {
                $groupChat->setActivity(null);
            }
        }

        return $this;
    }

    public function getLocationLatitude(): ?string
    {
        return $this->location_latitude;
    }

    public function setLocationLatitude(string $location_latitude): static
    {
        $this->location_latitude = $location_latitude;

        return $this;
    }

    public function getLocationLongitude(): ?string
    {
        return $this->location_longitude;
    }

    public function setLocationLongitude(string $location_longitude): static
    {
        $this->location_longitude = $location_longitude;

        return $this;
    }

    public function isDone(): ?bool
    {
        return $this->is_done;
    }

    public function setIsDone(bool $is_done): static
    {
        $this->is_done = $is_done;

        return $this;
    }

    public function getHourFrom(): ?\DateTime
    {
        return $this->hour_from;
    }

    public function setHourFrom(\DateTime $hour_from): static
    {
        $this->hour_from = $hour_from;

        return $this;
    }

    public function getHourTo(): ?\DateTime
    {
        return $this->hour_to;
    }

    public function setHourTo(\DateTime $hour_to): static
    {
        $this->hour_to = $hour_to;

        return $this;
    }

    public function getMaxPlayers(): ?int
    {
        return $this->max_players;
    }

    public function setMaxPlayers(int $max_players): static
    {
        $this->max_players = $max_players;

        return $this;
    }

    public function getCurrentPlayers(): ?int
    {
        return $this->current_players;
    }

    public function setCurrentPlayers(int $current_players): static
    {
        $this->current_players = $current_players;

        return $this;
    }
}
