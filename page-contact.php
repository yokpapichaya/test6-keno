<?php
/* Template Name: Contact */
$context = Timber::context();

$timber_post     = new Timber\Post();
$context['page'] = $timber_post;

$context['options_c_title'] = get_fields('options')['c_title'];
$context['options_c_content'] = get_fields('options')['c_content'];
$context['options_c_group'] = get_fields('options')['c_group'];

Timber::render('templates/page-contact.twig', $context);
