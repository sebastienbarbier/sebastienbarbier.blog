#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Sébastien BARBIER'
PATH = 'content'
SITEURL = '/'

TIMEZONE = 'Europe/Paris'

PLUGIN_PATHS = ["plugins"]
PLUGINS = ['i18n_subsites','neighbors']

THEME = 'theme'
THEME_STATIC_PATHS= ['../static']

SITENAME = 'Sébastien BARBIER - Blog'

I18N_SUBSITES = {
    'fr': {
        'SITEURL': '/fr',
        'THEME': 'theme',
        'THEME_STATIC_DIR': 'theme',
        'THEME_STATIC_PATHS': ['static']
    },
    'en': {
        'SITEURL': '/en',
        'THEME': 'theme',
        'THEME_STATIC_DIR': 'theme',
        'THEME_STATIC_PATHS': ['static']
    }
}

# Feed generation is usually not desired when developing

ARTICLE_URL = '{date:%Y}/{date:%m}/{date:%d}/{name}/'
ARTICLE_SAVE_AS = '{date:%Y}/{date:%m}/{date:%d}/{name}/index.html'
#YEAR_ARCHIVE_SAVE_AS = '{date:%Y}/index.html'
#MONTH_ARCHIVE_SAVE_AS = '{date:%Y}/{date:%m}/index.html'
#DAY_ARCHIVE_SAVE_AS = '{date:%Y}/{date:%m}/{date:%d}/index.html'
ARTICLE_ORDER_BY = 'date'

PAGE_URL = '{name}/'
PAGE_SAVE_AS = '{name}/index.html'

#CATEGORY_URL = 'category/{slug}/'
#CATEGORY_SAVE_AS = 'category/{slug}/index.html'

#TAG_URL = 'tag/{slug}/'
#TAG_SAVE_AS = 'tag/{slug}/index.html'

USE_FOLDER_AS_CATEGORY = False

FEED_RSS = 'feeds/rss.xml'
FEED_ATOM = 'feeds/atom.xml'
FEED_ALL_RSS =  None # 'feeds/all.rss.xml'
CATEGORY_FEED_RSS = None # 'feeds/%s.rss.xml'
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

DEFAULT_PAGINATION = 10
DEFAULT_METADATA = {
    'status': 'draft', # or published
}
# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = True
