"""
Setup file for uni_bot edX plugin.
"""

from setuptools import setup

from utils import get_version, load_requirements


with open('README.rst', 'r') as fh:
    README = fh.read()

setup(
    name='uni_bot',
    version=get_version('uni_bot', '__init__.py'),
    author='Intela',
    author_email='info@intela.io',
    description='edX plugin for Uni Bot setup',
    license='AGPL',
    long_description=README,
    long_description_content_type='text/x-rst',
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'Framework :: Django :: 3.2',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: GNU Affero General Public License v3',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 3.8',
    ],
    packages=[
        'uni_bot',
        'uni_bot_auth',
    ],
    include_package_data=True,
    install_requires=load_requirements('requirements/base.txt'),
    zip_safe=False,
    entry_points={
        'lms.djangoapp': [
            'uni_bot = uni_bot.apps:UniBotPluginConfig',
            'uni_bot_auth = uni_bot_auth.apps:UniBotAuthAppConfig',
        ],
        'cms.djangoapp': ['uni_bot = uni_bot.apps:UniBotPluginConfig'],
        'openedx.course_tab': ['uni_bot_tab = uni_bot.tab:UniBotDashboardTab'],
    },
)
