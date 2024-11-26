#!/bin/bash

read -p "username [e.g. postgres]: " username;
read -p "hostname [e.g. 127.0.0.1]: " hostname;
read -p "database name [e.g. smart-brain]: " dbName;

pg_dump -U $username -h $hostname -d $dbName -f "$dbName"_backup.sql;