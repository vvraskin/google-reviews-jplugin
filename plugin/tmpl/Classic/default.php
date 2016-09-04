<?php
/**
 * @version		0.0.1
 * @package		Google Reviews Client
 * @author    	Vadim Raskin - www.raskin.pro
 * @copyright	Copyright (c) 2016 Vadim Raskin. All rights reserved.
 * @license		GNU/GPL license: http://www.gnu.org/copyleft/gpl.html
 */

// no direct access
defined('_JEXEC') or die('Restricted access');

?>
<script>
var api_key=<?php echo $params->get('api_key'); ?>;
var place_id=<?php echo $params->get('api_key'); ?>;
</script>
<div id = "map">
<script src="<?php echo $pluginLivePath; ?>/includes/js/client.js" type="text/javascript"></script>
</div>
<div class = "reviews">
From Vadim
</div>
