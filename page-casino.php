<?php
/* Template Name: Casino */
$context = Timber::context();

$timber_post     = new Timber\Post();
$context['page'] = $timber_post;
$context['options_casino_content'] = get_fields('options')['casino_content'];
$context['options_casino_block'] = get_fields('options')['casino_block'];
Timber::render('templates/page-casino.twig', $context);

