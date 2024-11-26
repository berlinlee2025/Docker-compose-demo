#!/bin/bash

git config filter.compress.clean gzip;
git config filter.compress.smudge gzip -d;