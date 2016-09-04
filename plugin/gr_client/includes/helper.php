<?php
/**
 * @version		0.0.1
 * @package		Google Reviews Client
 * @author    	Vadim Raskin - www.raskin.pro
 * @copyright	Was copied from Simple Image Gallery (plugin)
 * @license		GNU/GPL license: http://www.gnu.org/copyleft/gpl.html
 */

// no direct access
defined('_JEXEC') or die('Restricted access');

class GoogleReviewClientHelper {


// Path overrides
public static function getTemplatePath($pluginName, $file, $tmpl)
{

  $mainframe = JFactory::getApplication();
  $p = new JObject;
  $pluginGroup = 'content';

  $jTemplate = $mainframe->getTemplate();

  if($mainframe->isAdmin()){
    $db = JFactory::getDBO();
    if (version_compare(JVERSION, '1.6', 'ge'))
    {
      $query = "SELECT template FROM #__template_styles WHERE client_id = 0 AND home = 1";
    }
    else
    {
      $query = "SELECT template FROM #__templates_menu WHERE client_id = 0 AND menuid = 0";
    }
    $db->setQuery($query);
    $jTemplate = $db->loadResult();
  }

  if (file_exists(JPATH_SITE.DS.'templates'.DS.$jTemplate.DS.'html'.DS.$pluginName.DS.$tmpl.DS.str_replace('/', DS, $file)))
  {
    $p->file = JPATH_SITE.DS.'templates'.DS.$jTemplate.DS.'html'.DS.$pluginName.DS.$tmpl.DS.$file;
    $p->http = JURI::root(true)."/templates/".$jTemplate."/html/{$pluginName}/{$tmpl}/{$file}";
  }
  else
  {
    if (version_compare(JVERSION, '1.6.0', 'ge'))
    {
      // Joomla! 1.6+
      $p->file = JPATH_SITE.DS.'plugins'.DS.$pluginGroup.DS.$pluginName.DS.$pluginName.DS.'tmpl'.DS.$tmpl.DS.$file;
      $p->http = JURI::root(true)."/plugins/{$pluginGroup}/{$pluginName}/{$pluginName}/tmpl/{$tmpl}/{$file}";
    }
    else
    {
      // Joomla! 1.5
      $p->file = JPATH_SITE.DS.'plugins'.DS.$pluginGroup.DS.$pluginName.DS.'tmpl'.DS.$tmpl.DS.$file;
      $p->http = JURI::root(true)."/plugins/{$pluginGroup}/{$pluginName}/tmpl/{$tmpl}/{$file}";
    }
  }
  return $p;
}
}
