<?php
/* Template Name: Log in */
$context = Timber::context();

$timber_post     = new Timber\Post();
$context['page'] = $timber_post;
$context['options_login_data'] = get_fields('options')['login_data'];
Timber::render('templates/page-login.twig', $context);

