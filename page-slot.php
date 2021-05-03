<?php
/* Template Name: Slot */
$context = Timber::context();

$timber_post     = new Timber\Post();
$context['page'] = $timber_post;
$context['options_slot_content'] = get_fields('options')['slot_content'];
$context['options_slot_block'] = get_fields('options')['slot_block'];
Timber::render('templates/page-slot.twig', $context);

