<?php
/**
 * Timber starter-theme
 * https://github.com/timber/starter-theme
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since   Timber 0.1
 */

/**
 * If you are installing Timber as a Composer dependency in your theme, you'll need this block
 * to load your dependencies and initialize Timber. If you are using Timber via the WordPress.org
 * plug-in, you can safely delete this block.
 */
$composer_autoload = __DIR__ . '/vendor/autoload.php';
if ( file_exists( $composer_autoload ) ) {
	require_once $composer_autoload;
	$timber = new Timber\Timber();
}

function register_style_and_script() {
    wp_enqueue_style( 'style-name', get_template_directory_uri() . '/css/main.min.css' );
	wp_enqueue_script( 'script-name', get_template_directory_uri() . '/js/index.js', array(), '1.0.0', true );
    wp_localize_script( 'script-name', 'myAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) ); // setting ajaxurl
}
add_action( 'wp_enqueue_scripts', 'register_style_and_script' );

/**
 * This ensures that Timber is loaded and available as a PHP class.
 * If not, it gives an error message to help direct developers on where to activate
 */
if ( ! class_exists( 'Timber' ) ) {

	add_action(
		'admin_notices',
		function() {
			echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
		}
	);

	add_filter(
		'template_include',
		function( $template ) {
			return get_stylesheet_directory() . '/static/no-timber.html';
		}
	);
	return;
}

/**
 * Sets the directories (inside your theme) to find .twig files
 */
Timber::$dirname = array( 'templates', 'views' );

/**
 * By default, Timber does NOT autoescape values. Want to enable Twig's autoescape?
 * No prob! Just set this value to true
 */
Timber::$autoescape = false;


/**
 * We're going to configure our theme inside of a subclass of Timber\Site
 * You can move this to its own file and include here via php's include("MySite.php")
 */
class StarterSite extends Timber\Site {
	/** Add timber support. */
	public function __construct() {
		add_action( 'after_setup_theme', array( $this, 'theme_supports' ) );
		add_filter( 'timber/context', array( $this, 'add_to_context' ) );
		add_filter( 'timber/twig', array( $this, 'add_to_twig' ) );
		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_taxonomies' ) );
		parent::__construct();
	}
	/** This is where you can register custom post types. */
	public function register_post_types() {

	}
	/** This is where you can register custom taxonomies. */
	public function register_taxonomies() {

	}

	/** This is where you add some context
	 *
	 * @param string $context context['this'] Being the Twig's {{ this }}.
	 */
	public function add_to_context( $context ) {
		$context['foo']   = 'bar';
		$context['stuff'] = 'I am a value set in your functions.php file';
		$context['notes'] = 'These values are available everytime you call Timber::context();';
		$context['footer_menu']  = new Timber\Menu('footer-menu');
		$context['main_menu']  = new Timber\Menu('main-menu');
		$context['site']  = $this;
		$context['options_menu_group'] = get_fields('options')['menu_group'];
		$context['options_logo_website'] = get_fields('options')['logo_website'];
		$context['options_menu_mobile'] = get_fields('options')['menu_mobile'];
		$context['options_f_payment'] = get_fields('options')['f_payment'];
		$context['options_f_logogame'] = get_fields('options')['f_logogame'];
		$context['options_h_banner_image'] = get_fields('options')['h_banner_image'];
		$context['options_bg_website'] = get_fields('options')['bg_website'];
		return $context;
	}
	

	public function theme_supports() {
		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support(
			'html5',
			array(
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
			)
		);

		/*
		 * Enable support for Post Formats.
		 *
		 * See: https://codex.wordpress.org/Post_Formats
		 */
		add_theme_support(
			'post-formats',
			array(
				'aside',
				'image',
				'video',
				'quote',
				'link',
				'gallery',
				'audio',
			)
		);

		// add_theme_support( 'menus' );
		function register_my_menus() {
			register_nav_menus(
			  array(
				'main-menu' => __( 'Main Menu' ),
			  )
			);
		}
		add_action( 'init', 'register_my_menus' );

		/**
		 * Options page
		 */
		if( function_exists('acf_add_options_page') ) {
			
			acf_add_options_page(array(
				'page_title' 	=> 'เมนู/โลโก้/พื้นหลัง',
				'menu_slug' 	=> 'p_menu',
			));

			acf_add_options_page(array(
				'page_title' 	=> 'หน้าหลัก',
				'menu_slug' 	=> 'p_home',
				'icon_url' => 'dashicons-admin-home',
			));
			acf_add_options_page(array(
				'page_title' 	=> 'โปรโมชั่น',
				'menu_slug' 	=> 'p_promotion',
				'icon_url' => 'dashicons-admin-page',
			));
			acf_add_options_page(array(
				'page_title' 	=> 'คาสิโน',
				'menu_slug' 	=> 'p_casino',
				'icon_url' => 'dashicons-tickets',
			));
			acf_add_options_page(array(
				'page_title' 	=> 'สล็อต',
				'menu_slug' 	=> 'p_slot',
				'icon_url' => 'dashicons-image-filter',
			));

			acf_add_options_page(array(
				'page_title' 	=> 'ติดต่อเรา',
				'menu_slug' 	=> 'contact',
				'icon_url' => 'dashicons-phone',
			));

			acf_add_options_page(array(
				'page_title' 	=> 'ฟุตเตอร์',
				'menu_slug' 	=> 'fotter',
				'icon_url' => 'dashicons-admin-tools',
			));

			acf_add_options_page(array(
				'page_title' => __('เข้าสู่ระบบ'),
				'menu_slug' => 'login-user',
				'icon_url' => 'dashicons-admin-network',
				'capability' => 'administrator',
			));
			

			acf_add_options_page(array(
				'page_title' => __('สมัครสมาชิก'),
				'menu_slug' => 'register',
				'icon_url' => 'dashicons-migrate',
				'capability' => 'administrator',
			));

			acf_add_options_page(array(
				'page_title' => __('ฝากถอน'),
				'menu_slug' => 'login',
				'icon_url' => 'dashicons-update-alt',
				'capability' => 'administrator',
			));
		}

  
	}
	/** This Would return 'foo bar!'.
	 *
	 * @param string $text being 'foo', then returned 'foo bar!'.
	 */
	public function myfoo( $text ) {
		$text .= ' bar!';
		return $text;
	}

	/** This is where you can add your own functions to twig.
	 *
	 * @param string $twig get extension.
	 */
	public function add_to_twig( $twig ) {
		$twig->addExtension( new Twig\Extension\StringLoaderExtension() );
		$twig->addFilter( new Twig\TwigFilter( 'myfoo', array( $this, 'myfoo' ) ) );

		$twig->addFunction( new Timber\Twig_Function( '_get_term', function( $post_id,  $taxonomy ) {
			$terms = get_the_terms($post_id, $taxonomy);
			
			if($terms) {
				foreach ( $terms as $term ) {
					$item_term[] = $term->slug;
				}

				$array_term = join( ", ", $item_term );
			}

			return $array_term;
		} ) );

		return $twig;
	}
}

add_action("wp_ajax_get_list_game", "get_list_game");
add_action("wp_ajax_nopriv_get_list_game", "get_list_game");

function get_list_game() {
	$id = $_POST['post_id'];
	
	if(isset($id)){
		$group_url = array(
			'list_game' => get_field('slot_prefix',$id), 
			'login_link' => get_field('login_api',$id),
			'slugpost' => get_field('postslug',$id)
		);
	}
	$result = json_encode($group_url);
	echo $result;

	die();

}

// var_dump();
// exit;

if ( get_current_user_id() != 1 ) {
	add_action( 'admin_menu', 'my_remove_menu_pages' );
	function my_remove_menu_pages() {
	  remove_menu_page( 'edit.php?post_type=page' );    //Pages
	  remove_menu_page( 'edit.php' );                   //Posts
	  remove_menu_page( 'upload.php' );                 //Media
	  remove_menu_page( 'edit-comments.php' );          //Comments
	  remove_menu_page( 'themes.php' );                 //Appearance
	  remove_menu_page( 'users.php' );                  //Users
	  remove_menu_page( 'tools.php' );                  //Tools
	  remove_menu_page( 'options-general.php' );        //Settings
	  remove_menu_page( 'duplicator' );					//duplicator plugin
	  remove_menu_page( 'plugins.php' );                //plugin menu
	  remove_menu_page('cptui_main_menu');				//cpui plugin
	  remove_menu_page('edit.php?post_type=casino_game');  // casino post type
	  remove_menu_page('edit.php?post_type=slot_game');    // slot post type
	  remove_menu_page( 'edit.php?post_type=acf-field-group' ); //acf plugin
	  remove_menu_page( 'index.php' ); 		
	  	if(wp_get_current_user()->roles[0] == 'author') {
			remove_menu_page( 'profile.php' );	
		}
	};
	add_action( 'admin_bar_menu', 'change_new_post_name', 999 );

	function change_new_post_name ( $wp_admin_bar ) {
		//Removing +New
		$wp_admin_bar->remove_node( 'new-content' );
		$wp_admin_bar->remove_node( 'comments' );
		$wp_admin_bar->remove_node( 'updates' );
		if(wp_get_current_user()->roles[0] == 'author') {
			$wp_admin_bar->remove_menu('my-account');
			$wp_admin_bar->remove_menu('autoptimize');
			$wp_admin_bar->remove_menu('site-name');
			$wp_admin_bar->remove_menu('wpseo-menu');
		}
	}
	
}

add_action( 'admin_bar_menu', 'custom_wp_toolbar_link', 999 );
 
function custom_wp_toolbar_link( $wp_admin_bar ) {
    if( current_user_can( 'level_5' ) ){ // Set the permission level or capability here for which user tier can see the link.
 
        $args = array(
            'id' => 'askmebet', // Set the ID of your custom link
            'meta' => array(
                'target' => '_self', // Change to _blank for launching in a new window
                'class' => 'askmebet-link', // Add a class to your link
                'title' => 'askmebet\' link to Star Wars' // Add a title to your link
            )
        );
        $wp_admin_bar->add_node($args);
 
    }
}

function remove_wp_logo( $wp_admin_bar ){
    $wp_admin_bar->remove_node( 'wp-logo' );
}
add_action( 'admin_bar_menu', 'remove_wp_logo', 100 );

function add_my_own_logo( $wp_admin_bar ) {
    $args = array(
        'id'    => 'my-logo',
        'meta'  => array( 'class' => 'my-logo', 'title' => 'logo' )
    );
    $wp_admin_bar->add_node( $args );
}
add_action( 'admin_bar_menu', 'add_my_own_logo', 1 );

// custom logo askmebet
function wpb_custom_logo() {
	echo '
	<style type="text/css">
	#wpadminbar .my-logo .ab-item.ab-empty-item:before {
    content:"";
	background-image: url(' . get_bloginfo('stylesheet_directory') . '/images/amb-logo-wp.png)!important;
	background-position: 0 0;
	color:rgba(0, 0, 0, 0);
	width: 7rem;
	height: 1rem;
	margin-top: 0.5rem;
	background-repeat: no-repeat;
	}
	#submitdiv {
		position:fixed;
	}
	.-pencil{
		display:none;
	}
	#collapse-menu{
	    display:none;
	}
	</style>
	';
	if(wp_get_current_user()->roles[0] == 'author') {
		echo '<style tyle="text/css">
		.postbox-container { pointer-events: none !important; }
		</style>';
	}
}
add_action('wp_before_admin_bar_render', 'wpb_custom_logo');

// Admin footer modification
  
function remove_footer_admin () {
    echo '<span id="footer-thankyou">Developed by <a href="https://askmebet.com/" target="_blank">Askmebet.com</a></span>';
}

add_filter('admin_footer_text', 'remove_footer_admin');

function my_login_logo_one() { 
	echo '
	<style type="text/css"> 
	body.login div#login h1 a {
	background-image:url(' . get_bloginfo('stylesheet_directory') . '/images/logo/logo.png)!important;
	padding-bottom: 30px; 
	width: 137px!important;
	height: 45px!important;
	background-size: 100% auto;
	} 

	body{
		background-image: linear-gradient(106deg, rgb(10, 145, 107), rgb(255, 205, 0))!important;
	}
	</style>
	 ';
} add_action( 'login_enqueue_scripts', 'my_login_logo_one' );

function autologin() {
	// PARAMETER TO CHECK FOR
	if(isset($_GET['autologin'])) {
		if ($_GET['autologin'] == 'demo') {
		
			// ACCOUNT USERNAME TO LOGIN TO
			$creds['user_login'] = 'ambdemo';
			
			// ACCOUNT PASSWORD TO USE
			$creds['user_password'] = '@e^D1WZrAtYys$RfSaN)Kukq';
			
			$creds['remember'] = true;
			$autologin_user = wp_signon( $creds, true );
			
			if ( !is_wp_error($autologin_user) ) 
				header('Location: wp-admin'); // LOCATION TO REDIRECT TO
		}
	}
	
}
// ADD CODE JUST BEFORE HEADERS AND COOKIES ARE SENT
add_action( 'after_setup_theme', 'autologin' );
new StarterSite();