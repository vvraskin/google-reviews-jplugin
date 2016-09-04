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
<div id = "apiKey" style="display: none;"><?php echo $_SESSION['api_key']; ?></div>
<div id = "placeID" style="display: none;"><?php echo $_SESSION['place_id']; ?></div>
<div id = "map">
<script src="<?php echo $pluginLivePath; ?>/includes/js/client.js" type="text/javascript"></script>
</div>
<div class = "reviews">
</div>
