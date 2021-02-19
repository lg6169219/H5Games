# Dump of table Player
# ---------------------------------------------

CREATE TABLE IF NOT EXISTS `Player`(
	`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`userId` bigint(20) unsigned NOT NULL DEFAULT '0',
	`name` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
	`vit` smallint(6) unsigned NOT NULL DEFAULT '0',
	`money` bigint(20) unsigned NOT NULL DEFAULT '0',
	`gold` bigint(20) unsigned NOT NULL DEFAULT '0',
	`level` smallint(6) unsigned NOT NULL DEFAULT '1',
	`exp` bigint(20) unsigned NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`),
	KEY `INDEX_PALYER_USER_ID` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

# Dump of table Buyer
# ---------------------------------------------

CREATE TABLE IF NOT EXISTS `Buyer`(
	`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`playerId` bigint(20) unsigned NOT NULL DEFAULT '0',
	`buyerId` smallint(6) unsigned NOT NULL DEFAULT '0',
	`level` smallint(6) unsigned NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`),
	KEY `INDEX_PALYER_BUYER_ID` (`playerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;