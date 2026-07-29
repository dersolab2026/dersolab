create extension if not exists "pgcrypto";

create type user_role as enum ('student', 'parent', 'instructor', 'admin');
create type grade_track as enum ('lgs', 'yks');
create type booking_status as enum ('scheduled', 'completed', 'cancelled', 'no_show');
create type homework_status as enum ('assigned', 'submitted', 'completed');
create type purchase_status as enum ('pending', 'completed', 'failed', 'refunded');
create type notification_type as enum ('lesson_completed', 'lesson_missed', 'homework_assigned', 'homework_completed', 'booking_reminder');
create type notification_channel as enum ('in_app', 'email', 'sms');
