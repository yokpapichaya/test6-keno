<?php
/* Template Name: Promotions */
$context = Timber::context();

$timber_post     = new Timber\Post();
$context['page'] = $timber_post;
$context['options_promotion'] = get_fields('options')['promotion'];
Timber::render('templates/page-promotion.twig', $context);

