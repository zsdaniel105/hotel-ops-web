-- Safe configuration only: no employees, guest data, rooms, or operational fixtures.
INSERT OR IGNORE INTO properties(id,name,timezone,created_at,updated_at) VALUES ('default-property','Hotel Operations','America/New_York',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO departments(id,property_id,name) VALUES ('front-desk','default-property','Front Desk'),('housekeeping','default-property','Housekeeping'),('maintenance','default-property','Maintenance'),('management','default-property','Management');
