# MyLibrary-v3-BE

SQL to create table:

CREATE TABLE `books` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(5633) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pages` int(5) NOT NULL,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not read'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);
COMMIT;

