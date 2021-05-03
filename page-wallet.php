<?php
/* Template Name: Wallet */
$context = Timber::context();

$timber_post     = new Timber\Post();
$context['page'] = $timber_post;
$context['options_wallet_api'] = get_fields('options')['wallet_api'];
Timber::render('templates/page-wallet.twig', $context);

