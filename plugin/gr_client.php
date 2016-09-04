<?php
/**
 * @version		0.0.1
 * @package		Google Places Client (plugin)
 * @author    	Vadim Raskin - http://raskin.pro
 * @copyright	Copyright (c) 2016 Vadim Raskin. All rights reserved.
 * @license		GNU/GPL license: http://www.gnu.org/copyleft/gpl.html
 */

 // no direct access
 defined('_JEXEC') or die('Restricted access');

 jimport('joomla.plugin.plugin');
 if (version_compare(JVERSION, '1.6.0', 'ge')){
 	jimport('joomla.html.parameter');
 }

 class plgContentGr_client extends JPlugin {

   // Plugin reference parameters
 	var $plg_name					= "gr_client";
 	var $plg_tag					= "gr";
 	var $plg_copyrights_start		= "\n\n<!-- Vadim Raskin \"Google Places Client\" Plugin (v0.0.1) starts here -->\n";
 	var $plg_copyrights_end			= "\n<!-- JoomlaWorks \"Google Places Client\" Plugin (v0.0.1) ends here -->\n\n";

 	function plgContentGr_client( &$subject, $params ){
 		parent::__construct( $subject, $params );

 		// Define the DS constant under Joomla! 3.0+
 		if (!defined('DS')){
 			define('DS', DIRECTORY_SEPARATOR);
 		}
 	}

 	// Joomla! 1.5
 	function onPrepareContent(&$row, &$params, $page = 0){
 		$this->renderSimpleImageGallery($row, $params, $page = 0);
 	}

 	// Joomla! 2.5+
 	function onContentPrepare($context, &$row, &$params, $page = 0){
 		$this->renderSimpleImageGallery($row, $params, $page = 0);
 	}
  // The main function
  function renderSimpleImageGallery(&$row, &$params, $page = 0){

    // API
    jimport('joomla.filesystem.file');
    $mainframe = JFactory::getApplication();
    $document  = JFactory::getDocument();

    // Assign paths
    $sitePath = JPATH_SITE;
    $siteUrl  = JURI::root(true);
    if (version_compare(JVERSION, '1.6.0', 'ge')){
      $pluginLivePath = $siteUrl.'/plugins/content/'.$this->plg_name.'/'.$this->plg_name;
    } else {
      $pluginLivePath = $siteUrl.'/plugins/content/'.$this->plg_name;
    }

    // Check if plugin is enabled
    if (JPluginHelper::isEnabled('content', $this->plg_name) == false) return;

    // Bail out if the page format is not what we want
    $allowedFormats = array('', 'html', 'feed', 'json');
    if (!in_array(JRequest::getCmd('format'), $allowedFormats)) return;

    // Simple performance check to determine whether plugin should process further
    if (JString::strpos($row->text, $this->plg_tag) === false) return;

    // expression to search for
    $regex = "#{".$this->plg_tag."}(.*?){/".$this->plg_tag."}#is";
    // Find all instances of the plugin and put them in $matches
    preg_match_all($regex, $row->text, $matches);

    // Number of plugins
    $count = count($matches[0]);
    // Plugin only processes if there are any instances of the plugin in the text
    if (!$count) return;

    // Get plugin info
		$plugin = JPluginHelper::getPlugin('content', $this->plg_name);

		// Control external parameters and set variable for controlling plugin layout within modules
    $pluginParams = class_exists('JParameter') ? new JParameter($plugin->params) : new JRegistry($plugin->params);
    $api_key = $pluginParams->get('api_key');
    $place_id = $pluginParams->get('place_id');
    $thb_template = 'Classic';
    $_SESSION['api_key'] = $api_key;
    $_SESSION['place_id'] = $place_id;

    // Includes
    require_once (dirname(__FILE__).DS.$this->plg_name.DS.'includes'.DS.'helper.php');

    // Include Google places libs and css
    $document->addScript('https://maps.googleapis.com/maps/api/js?key='.$api_key.'&libraries=places');
    $document->addScript('https://apis.google.com/js/client.js');
    $document->addScript('https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js');


    $document->addStyleSheet($pluginLivePath.'/includes/css/style.css');

    // Fetch the template
    ob_start();
    $templatePath = GoogleReviewClientHelper::getTemplatePath($this->plg_name, 'default.php', $thb_template);
    $templatePath = $templatePath->file;
    include ($templatePath);
    $getTemplate = $this->plg_copyrights_start.ob_get_contents().$this->plg_copyrights_end;
    ob_end_clean();

    // Set parameters
    $script = "<script>var api_key=".$api_key." console.log(api_key)</script>";
    $document->addScriptDeclaration($script);

    // Output
    $plg_html = $getTemplate;
    // var_dump($plg_html);

    // Do the replace
    $row->text = preg_replace("#{".$this->plg_tag."}"."{/".$this->plg_tag."}#s", $plg_html, $row->text);


}

}
