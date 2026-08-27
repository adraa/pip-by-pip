-- Hashes only. Codes are not stored. Hashes depend on AUTH_SALT
-- (default: pip-by-pip-dev-salt). Local sign-in uses the codes printed
-- in README. Production must use the same salt as these hashes.
DELETE FROM learners;
INSERT INTO learners (id, name, code_hash, is_recovery, created_at) VALUES ('dheepan', 'Dheepan', '078776cc9313e28a8afefe7b7143c2c28dc25c0382f827d9318d29c7dbf2bfca', 0, 1787830278860);
INSERT INTO learners (id, name, code_hash, is_recovery, created_at) VALUES ('wife', 'Wife', '5d7cc330d0fb0c5269473dda7aabc0884e750ef28626a1870d6a19b12edf50f4', 0, 1787830278860);
INSERT INTO learners (id, name, code_hash, is_recovery, created_at) VALUES ('recovery', 'Recovery', 'b86dc9184db46bd0df86680bb5a9fe048f224d06dc6f07f8e0bc3f8a7307203f', 1, 1787830278860);
