<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250925123518 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE reported_activity ADD user_id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reported_activity ADD CONSTRAINT FK_86BCAB4BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_86BCAB4BA76ED395 ON reported_activity (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reported_user ADD reported_user_id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reported_user ADD CONSTRAINT FK_11D39223E7566E FOREIGN KEY (reported_user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_11D39223E7566E ON reported_user (reported_user_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE reported_activity DROP FOREIGN KEY FK_86BCAB4BA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_86BCAB4BA76ED395 ON reported_activity
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reported_activity DROP user_id
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reported_user DROP FOREIGN KEY FK_11D39223E7566E
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_11D39223E7566E ON reported_user
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reported_user DROP reported_user_id
        SQL);
    }
}
