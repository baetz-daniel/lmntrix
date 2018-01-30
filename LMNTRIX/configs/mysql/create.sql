SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `dkplog`
--

CREATE TABLE `dkplog` (
  `uuid` bigint(20) UNSIGNED NOT NULL,
  `member_uuid` bigint(20) UNSIGNED NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `kind` varchar(32) NOT NULL,
  `information` varchar(128) NOT NULL,
  `value` int(11) NOT NULL,
  `editor` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `dkplogfull`
--

CREATE TABLE `dkplogfull` (
  `uuid` bigint(20) UNSIGNED NOT NULL,
  `member_uuid` bigint(20) UNSIGNED NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `kind` varchar(32) NOT NULL,
  `information` varchar(128) NOT NULL,
  `value` int(11) NOT NULL,
  `editor` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `member`
--

CREATE TABLE `member` (
  `uuid` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(64) NOT NULL,
  `dkp` int(11) NOT NULL,
  `role` varchar(24) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `dkplog`
--
ALTER TABLE `dkplog`
  ADD PRIMARY KEY (`uuid`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD KEY `member_uuid_idx` (`member_uuid`);

--
-- Indizes für die Tabelle `dkplogfull`
--
ALTER TABLE `dkplogfull`
  ADD PRIMARY KEY (`uuid`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD KEY `member_uuid_idx` (`member_uuid`);

--
-- Indizes für die Tabelle `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`uuid`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `members_name_idx` (`name`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `dkplog`
--
ALTER TABLE `dkplog`
  MODIFY `uuid` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `dkplogfull`
--
ALTER TABLE `dkplogfull`
  MODIFY `uuid` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `member`
--
ALTER TABLE `member`
  MODIFY `uuid` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `dkplog`
--
ALTER TABLE `dkplog`
  ADD CONSTRAINT `member_uuid_idx_fk` FOREIGN KEY (`member_uuid`) REFERENCES `member` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `dkplogfull`
--
ALTER TABLE `dkplogfull`
  ADD CONSTRAINT `member_uuid_idx_fk` FOREIGN KEY (`member_uuid`) REFERENCES `member` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
  
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
