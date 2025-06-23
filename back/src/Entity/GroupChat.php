<?php

namespace App\Entity;

use App\Repository\GroupChatRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GroupChatRepository::class)]
class GroupChat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'groupChats')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Activity $activity = null;

    #[ORM\Column]
    private ?bool $is_closed = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $closed_at = null;

    /**
     * @var Collection<int, UserGroupChat>
     */
    #[ORM\OneToMany(targetEntity: UserGroupChat::class, mappedBy: 'groupchat')]
    private Collection $userGroupChats;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'groupchat')]
    private Collection $messages;

    public function __construct()
    {
        $this->userGroupChats = new ArrayCollection();
        $this->messages = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getActivity(): ?Activity
    {
        return $this->activity;
    }

    public function setActivity(?Activity $activity): static
    {
        $this->activity = $activity;

        return $this;
    }

    public function isClosed(): ?bool
    {
        return $this->is_closed;
    }

    public function setIsClosed(bool $is_closed): static
    {
        $this->is_closed = $is_closed;

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

    public function getClosedAt(): ?\DateTimeImmutable
    {
        return $this->closed_at;
    }

    public function setClosedAt(\DateTimeImmutable $closed_at): static
    {
        $this->closed_at = $closed_at;

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
            $userGroupChat->setGroupchat($this);
        }

        return $this;
    }

    public function removeUserGroupChat(UserGroupChat $userGroupChat): static
    {
        if ($this->userGroupChats->removeElement($userGroupChat)) {
            // set the owning side to null (unless already changed)
            if ($userGroupChat->getGroupchat() === $this) {
                $userGroupChat->setGroupchat(null);
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
            $message->setGroupchat($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message)) {
            // set the owning side to null (unless already changed)
            if ($message->getGroupchat() === $this) {
                $message->setGroupchat(null);
            }
        }

        return $this;
    }
}
