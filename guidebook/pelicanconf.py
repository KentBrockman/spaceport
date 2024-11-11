#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

PATH = 'content'

TIMEZONE = 'Canada/Mountain'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

DEFAULT_PAGINATION = False

MARKDOWN = {
    'extension_configs': {
        'markdown.extensions.codehilite': {'css_class': 'highlight'},
        'markdown.extensions.extra': {},
        'markdown.extensions.meta': {},
        'markdown.extensions.toc': {
            'toc_depth': '2-3',
            'anchorlink': True,
        },
    },
    'output_format': 'html5',
}

PLUGINS = [
    'obsidian',
    'linkclass',
]

#STATIC_PATHS = ['media']

EXTRA_PATH_METADATA = {
    'extra/favicon.svg': {'path': 'favicon.svg'},
}

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True

THEME = 'themes/theme'

# turn off useless outputs
TAG_SAVE_AS = ''
CATEGORY_SAVE_AS = ''
AUTHOR_SAVE_AS = ''
ARCHIVES_SAVE_AS = ''
AUTHORS_SAVE_AS = ''
CATEGORIES_SAVE_AS = ''
TAGS_SAVE_AS = ''

FILENAME_METADATA = '(?P<title>.*)'   # required to not need Title: metadata
DEFAULT_DATE = 'fs'
ARTICLE_ORDER_BY = 'filename'

PROD = False