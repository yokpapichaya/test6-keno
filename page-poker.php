<?php
/* Template Name: Poker */
$context = Timber::context();

$timber_post     = new Timber\Post();
$context['page'] = $timber_post;
$context['options_poker_content'] = get_fields('options')['poker_content'];
$context['options_poker_block'] = get_fields('options')['poker_block'];
Timber::render('templates/page-poker.twig', $context);

