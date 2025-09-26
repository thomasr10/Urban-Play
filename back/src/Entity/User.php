<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 50)]
    private ?string $first_name = null;

    #[ORM\Column(length: 50)]
    private ?string $last_name = null;

    #[ORM\Column]
    private ?bool $is_banned = null;

    #[ORM\Column]
    private ?bool $is_public = null;

    #[ORM\Column]
    private ?bool $activity_notification = null;

    #[ORM\Column]
    private ?int $perimeter = null;

    /**
     * @var Collection<int, Activity>
     */
    #[ORM\OneToMany(targetEntity: Activity::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $activities;

    /**
     * @var Collection<int, ReportedUser>
     */
    #[ORM\OneToMany(targetEntity: ReportedUser::class, mappedBy: 'user')]
    private Collection $reportedUsers;

    /**
     * @var Collection<int, UserGroupChat>
     */
    #[ORM\OneToMany(targetEntity: UserGroupChat::class, mappedBy: 'user')]
    private Collection $userGroupChats;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'user')]
    private Collection $messages;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTime $birth_date = null;

    #[ORM\Column]
    private ?bool $is_verified = null;

    #[ORM\Column(length: 10)]
    private ?string $gender = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $token = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $tokenLimit = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $profil_picture = null;

    /**
     * @var Collection<int, ReportedActivity>
     */
    #[ORM\OneToMany(targetEntity: ReportedActivity::class, mappedBy: 'user')]
    private Collection $reportedActivities;

    /**
     * @var Collection<int, ReportedUser>
     */
    #[ORM\OneToMany(targetEntity: ReportedUser::class, mappedBy: 'reported_user')]
    private Collection $oneReportedUser;

    public function __construct()
    {
        $this->activities = new ArrayCollection();
        $this->reportedUsers = new ArrayCollection();
        $this->userGroupChats = new ArrayCollection();
        $this->messages = new ArrayCollection();
        $this->reportedActivities = new ArrayCollection();
        $this->oneReportedUser = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstName(): ?string
    {
        return $this->first_name;
    }

    public function setFirstName(string $first_name): static
    {
        $this->first_name = $first_name;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->last_name;
    }

    public function setLastName(string $last_name): static
    {
        $this->last_name = $last_name;

        return $this;
    }

    public function isBanned(): ?bool
    {
        return $this->is_banned;
    }

    public function setIsBanned(bool $is_banned): static
    {
        $this->is_banned = $is_banned;

        return $this;
    }

    public function isPublic(): ?bool
    {
        return $this->is_public;
    }

    public function setIsPublic(bool $is_public): static
    {
        $this->is_public = $is_public;

        return $this;
    }

    public function isActivityNotification(): ?bool
    {
        return $this->activity_notification;
    }

    public function setActivityNotification(bool $activity_notification): static
    {
        $this->activity_notification = $activity_notification;

        return $this;
    }

    public function getPerimeter(): ?int
    {
        return $this->perimeter;
    }

    public function setPerimeter(int $perimeter): static
    {
        $this->perimeter = $perimeter;

        return $this;
    }

    /**
     * @return Collection<int, Activity>
     */
    public function getActivities(): Collection
    {
        return $this->activities;
    }

    public function addActivity(Activity $activity): static
    {
        if (!$this->activities->contains($activity)) {
            $this->activities->add($activity);
            $activity->setUser($this);
        }

        return $this;
    }

    public function removeActivity(Activity $activity): static
    {
        if ($this->activities->removeElement($activity)) {
            // set the owning side to null (unless already changed)
            if ($activity->getUser() === $this) {
                $activity->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ReportedUser>
     */
    public function getReportedUsers(): Collection
    {
        return $this->reportedUsers;
    }

    public function addReportedUser(ReportedUser $reportedUser): static
    {
        if (!$this->reportedUsers->contains($reportedUser)) {
            $this->reportedUsers->add($reportedUser);
            $reportedUser->setUser($this);
        }

        return $this;
    }

    public function removeReportedUser(ReportedUser $reportedUser): static
    {
        if ($this->reportedUsers->removeElement($reportedUser)) {
            // set the owning side to null (unless already changed)
            if ($reportedUser->getUser() === $this) {
                $reportedUser->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, UserGroupChat>
     */
    public function getUserGroupChats(): Collection
    {
        return $this->userGroupChats;
    }

    public function addUserGroupChat(UserGroupChat $userGroupChat): static
    {
        if (!$this->userGroupChats->contains($userGroupChat)) {
            $this->userGroupChats->add($userGroupChat);
            $userGroupChat->setUser($this);
        }

        return $this;
    }

    public function removeUserGroupChat(UserGroupChat $userGroupChat): static
    {
        if ($this->userGroupChats->removeElement($userGroupChat)) {
            // set the owning side to null (unless already changed)
            if ($userGroupChat->getUser() === $this) {
                $userGroupChat->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): static
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
            $message->setUser($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message)) {
            // set the owning side to null (unless already changed)
            if ($message->getUser() === $this) {
                $message->setUser(null);
            }
        }

        return $this;
    }

    public function getBirthDate(): ?\DateTime
    {
        return $this->birth_date;
    }

    public function setBirthDate(\DateTime $birth_date): static
    {
        $this->birth_date = $birth_date;

        return $this;
    }

    public function isVerified(): ?bool
    {
        return $this->is_verified;
    }

    public function setIsVerified(bool $is_verified): static
    {
        $this->is_verified = $is_verified;

        return $this;
    }

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function setGender(string $gender): static
    {
        $this->gender = $gender;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(?string $token): static
    {
        $this->token = $token;

        return $this;
    }

    public function getTokenLimit(): ?\DateTimeImmutable
    {
        return $this->tokenLimit;
    }

    public function setTokenLimit(?\DateTimeImmutable $tokenLimit): self
    {
        $this->tokenLimit = $tokenLimit;
        return $this;
    }

    public function getProfilPicture(): ?string
    {
        return $this->profil_picture;
    }

    public function setProfilPicture(?string $profil_picture): static
    {
        $this->profil_picture = $profil_picture;

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
            $reportedActivity->setUser($this);
        }

        return $this;
    }

    public function removeReportedActivity(ReportedActivity $reportedActivity): static
    {
        if ($this->reportedActivities->removeElement($reportedActivity)) {
            // set the owning side to null (unless already changed)
            if ($reportedActivity->getUser() === $this) {
                $reportedActivity->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ReportedUser>
     */
    public function getOneReportedUser(): Collection
    {
        return $this->oneReportedUser;
    }

    public function addOneReportedUser(ReportedUser $oneReportedUser): static
    {
        if (!$this->oneReportedUser->contains($oneReportedUser)) {
            $this->oneReportedUser->add($oneReportedUser);
            $oneReportedUser->setReportedUser($this);
        }

        return $this;
    }

    public function removeOneReportedUser(ReportedUser $oneReportedUser): static
    {
        if ($this->oneReportedUser->removeElement($oneReportedUser)) {
            // set the owning side to null (unless already changed)
            if ($oneReportedUser->getReportedUser() === $this) {
                $oneReportedUser->setReportedUser(null);
            }
        }

        return $this;
    }
}