<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * To generate specific templates for your pages you can use:
 * /mytheme/templates/page-mypage.twig
 * (which will still route through this PHP file)
 * OR
 * /mytheme/page-mypage.php
 * (in which case you'll want to duplicate this file and save to the above path)
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context = Timber::context();

$timber_post     = new Timber\Post();
$context['page'] = $timber_post;

if( is_front_page()) {
    $context['body_class'] = 'home';
    $context['options_h_menu'] = get_fields('options')['h_menu'];
    $context['options_slot_block'] = get_fields('options')['slot_block'];
    $context['options_casino_block'] = get_fields('options')['casino_block'];
    Timber::render('templates/page-home.twig', $context);
}else {
    Timber::render( array( 'page-' . $timber_post->post_name . '.twig', 'page.twig' ), $context );
}

