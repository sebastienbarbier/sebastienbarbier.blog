#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

# This file is only used if you use `make publish` or
# explicitly specify it as your config file.

import os
import sys
sys.path.append(os.curdir)
from pelicanconf import *

I18N_SUBSITES = {
    'fr': {
        'SITEURL': 'https://blog.sebastienbarbier.com/fr',
        'THEME': 'theme',
        'THEME_STATIC_DIR': 'theme',
        'THEME_STATIC_PATHS': ['static']
    },
    'en': {
        'SITEURL': 'https://blog.sebastienbarbier.com',
        'THEME': 'theme',
        'THEME_STATIC_DIR': 'theme',
        'THEME_STATIC_PATHS': ['static']
    }
}

RELATIVE_URLS = True

# FEED_ALL_ATOM = 'feeds/all.atom.xml'
# CATEGORY_FEED_ATOM = 'feeds/%s.atom.xml'

DELETE_OUTPUT_DIRECTORY = True

# Following items are often useful when publishing

#DISQUS_SITENAME = ""
#GOOGLE_ANALYTICS = ""
