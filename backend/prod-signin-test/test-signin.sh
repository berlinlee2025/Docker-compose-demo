#!/bin/bash

read -p "Enter your email [e.g. aohion@hotmail.com]: " email;
read -sp "Enter your password [e.g. secret]: " password;

curl -X POST -H "Content-Type: application/json" -d "{"email": $email, "password": $password }" https://ai-recognition-backend.onrender.com/signin;
