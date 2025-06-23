<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250623083835 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE activity (id INT AUTO_INCREMENT NOT NULL, sport_id INT NOT NULL, user_id INT NOT NULL, name VARCHAR(120) NOT NULL, location_name VARCHAR(255) NOT NULL, location_coordinates VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', activity_date DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', description LONGTEXT NOT NULL, INDEX IDX_AC74095AAC78BCF8 (sport_id), INDEX IDX_AC74095AA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE group_chat (id INT AUTO_INCREMENT NOT NULL, activity_id INT NOT NULL, is_closed TINYINT(1) NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', closed_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_4CC7A9DA81C06096 (activity_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE message (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, groupchat_id INT NOT NULL, content LONGTEXT NOT NULL, sent_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', is_deleted TINYINT(1) NOT NULL, INDEX IDX_B6BD307FA76ED395 (user_id), INDEX IDX_B6BD307F302F4E76 (groupchat_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE reported_activity (id INT AUTO_INCREMENT NOT NULL, activity_id INT NOT NULL, reason VARCHAR(150) NOT NULL, comment LONGTEXT NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_86BCAB4B81C06096 (activity_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE reported_user (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, reason VARCHAR(150) NOT NULL, comment LONGTEXT NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_11D39223A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE sport (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(30) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, is_banned TINYINT(1) NOT NULL, is_public TINYINT(1) NOT NULL, activity_notification TINYINT(1) NOT NULL, perimeter INT NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user_group_chat (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, groupchat_id INT NOT NULL, joined_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_EBA06F36A76ED395 (user_id), INDEX IDX_EBA06F36302F4E76 (groupchat_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE activity ADD CONSTRAINT FK_AC74095AAC78BCF8 FOREIGN KEY (sport_id) REFERENCES sport (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE activity ADD CONSTRAINT FK_AC74095AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE group_chat ADD CONSTRAINT FK_4CC7A9DA81C06096 FOREIGN KEY (activity_id) REFERENCES activity (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE message ADD CONSTRAINT FK_B6BD307FA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE message ADD CONSTRAINT FK_B6BD307F302F4E76 FOREIGN KEY (groupchat_id) REFERENCES group_chat (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reported_activity ADD CONSTRAINT FK_86BCAB4B81C06096 FOREIGN KEY (activity_id) REFERENCES activity (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reported_user ADD CONSTRAINT FK_11D39223A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_group_chat ADD CONSTRAINT FK_EBA06F36A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_group_chat ADD CONSTRAINT FK_EBA06F36302F4E76 FOREIGN KEY (groupchat_id) REFERENCES group_chat (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE activity DROP FOREIGN KEY FK_AC74095AAC78BCF8
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE activity DROP FOREIGN KEY FK_AC74095AA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE group_chat DROP FOREIGN KEY FK_4CC7A9DA81C06096
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE message DROP FOREIGN KEY FK_B6BD307FA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE message DROP FOREIGN KEY FK_B6BD307F302F4E76
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reported_activity DROP FOREIGN KEY FK_86BCAB4B81C06096
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reported_user DROP FOREIGN KEY FK_11D39223A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_group_chat DROP FOREIGN KEY FK_EBA06F36A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_group_chat DROP FOREIGN KEY FK_EBA06F36302F4E76
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE activity
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE group_chat
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE message
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE reported_activity
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE reported_user
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE sport
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_group_chat
        SQL);
    }
}
