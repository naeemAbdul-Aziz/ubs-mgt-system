-- V16 — Update Staff Schema
-- Add email and phone to staff table

ALTER TABLE staff
    ADD COLUMN email TEXT,
    ADD COLUMN phone TEXT;
