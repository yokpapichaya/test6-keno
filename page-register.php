<?php
/* Template Name: Register */
$context = Timber::context();

$timber_post     = new Timber\Post();
$context['page'] = $timber_post;
$context['options_api_register'] = get_fields('options')['api_register'];
Timber::render('templates/page-register.twig', $context);

