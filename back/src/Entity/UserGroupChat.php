<?php

namespace App\Entity;

use App\Repository\UserGroupChatRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserGroupChatRepository::class)]
class UserGroupChat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'userGroupChats')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'userGroupChats')]
    #[ORM\JoinColumn(nullable: false)]
    private ?GroupChat $groupchat = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $joined_at = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getGroupchat(): ?GroupChat
    {
        return $this->groupchat;
    }

    public function setGroupchat(?GroupChat $groupchat): static
    {
        $this->groupchat = $groupchat;

        return $this;
    }

    public function getJoinedAt(): ?\DateTimeImmutable
    {
        return $this->joined_at;
    }

    public function setJoinedAt(\DateTimeImmutable $joined_at): static
    {
        $this->joined_at = $joined_at;

        return $this;
    }

}
