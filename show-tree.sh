#!/bin/bash
# This script prints a tree-like structure of the current directory

find . -print | sed -e 's;[^/]*\/;|____;g;s;____|; |;g'