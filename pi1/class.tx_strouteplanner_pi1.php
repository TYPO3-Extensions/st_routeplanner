<?php
/***************************************************************
*  Copyright notice
*
*  (c) 2011 Scheibo <scheibitz@studio1.de>
*  All rights reserved
*
*  This script is part of the TYPO3 project. The TYPO3 project is
*  free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*  This copyright notice MUST APPEAR in all copies of the script!
***************************************************************/
/**
 * [CLASS/FUNCTION INDEX of SCRIPT]
 *
 * Hint: use extdeveval to insert/update function index above.
 */

require_once(PATH_tslib.'class.tslib_pibase.php');


/**
 * Plugin 'Google Maps Routeplanner' for the 'st_routeplanner' extension.
 *
 * @author	Thomas Scheibitz <mail@kreativschmiede-eichsfeld.de>
 * @package	TYPO3
 * @subpackage	tx_strouteplanner
 */
class tx_strouteplanner_pi1 extends tslib_pibase {
	var $prefixId      = 'tx_strouteplanner_pi1';		// Same as class name
	var $scriptRelPath = 'pi1/class.tx_strouteplanner_pi1.php';	// Path to this script relative to the extension dir.
	var $extKey        = 'st_routeplanner';	// The extension key.
	var $pi_checkCHash = true;
	
	/**
	 * The main method of the PlugIn
	 *
	 * @param	string		$content: The PlugIn content
	 * @param	array		$conf: The PlugIn configuration
	 * @return	The content that is displayed on the website
	 */
	function main($content, $conf) {
		$this->conf = $conf;
		$this->pi_setPiVarDefaults();
		$this->pi_loadLL();
		$this->pi_initPIflexForm();

		foreach ($this->cObj->data['pi_flexform']['data']['sDEF']['lDEF'] as $key => $value) $$key = reset($value);

		$langkey = $GLOBALS['TSFE']->config['config']['language'];

		foreach (explode(',', 'maptype,zoom,mapwidth,mapheight,destination,infotext,template') as $value) $$value  = ($this->conf[$value]) ? $this->conf[$value] : $$value;
		$destination_coordinates 	= ($this->conf['destinationcoor']) 	? explode(',', $this->conf['destinationcoor']) 	: $this->getMapsCoordinates($destination);
		$sensor 					= ($this->conf['sensor']) 			? $this->conf['sensor'] 			: 'true';
		$destination_name 			= ($this->conf['destinationname']) 	? $this->conf['destinationname'] 	: trim(end(explode('|', $destination)));
		$cid = $this->cObj->data['uid'];
		
		$GLOBALS['TSFE']->additionalHeaderData[$this->extKey.'_10']	= '<link href="' . t3lib_extMgm::siteRelPath( $this->extKey ) . 'static/style.css" rel="stylesheet" type="text/css" />';
		$GLOBALS['TSFE']->additionalFooterData[$this->extKey.'_100']	= '<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=' . $sensor . '&amp;language=' . $langkey . '"></script>';
		$GLOBALS['TSFE']->additionalFooterData[$this->extKey.'_120']	= '<script type="text/javascript" src="' . t3lib_extMgm::siteRelPath( $this->extKey ) . 'static/st_routeplanner.js"></script>';

		if($destination_coordinates == 'error1') return '<div class="tx_strouteplanner_error">' . $start . '&nbsp;-&nbsp;' . $this->pi_getLL('location_error') . '</div>';
		if($destination_coordinates == 'error2') return '<div class="tx_strouteplanner_error">' . $this->pi_getLL('spam_error') . '</div>';

		$markerArray['###START###'] 		= '<label>' . $this->pi_getLL('start') . '</label><input id="c' . $cid . '_st_routeplanner_start" class="st_routeplanner_start" type="text" name="start" value="" />';
		$markerArray['###DESTINATION###'] 	= '<label>' . $this->pi_getLL('destination') . '</label><span>' . $destination_name . '</span>';
		$markerArray['###SUBMIT###']		= '<input type="submit" name="submit" id="c' . $cid . '_st_routeplanner_submit" class="st_routeplanner_submit" value="' . $this->pi_getLL('getDirections') . '" />';
		$markerArray['###MAP###']			= '<div id="c' . $cid . '_map_canvas" class="map_canvas" style="width: ' . $mapwidth . 'px; height: ' . $mapheight . 'px"></div>';
		$markerArray['###DIRECTION###']		= '<div id="c' . $cid . '_directions-panel" class="directions-panel" style="width: ' . $mapwidth . 'px"></div>';

		$markerArray['###JSSETTINGS###']	= '<input type="hidden" id="c' . $cid . '_latlng" value="' . $destination_coordinates[0] . ',' . $destination_coordinates[1] . '" />';
		$markerArray['###JSSETTINGS###']	.= '<input type="hidden" id="c' . $cid . '_zoom" value="' . $zoom . '" />';
		$markerArray['###JSSETTINGS###']	.= '<input type="hidden" id="c' . $cid . '_maptype" value="' . $maptype . '" />';
		$markerArray['###JSSETTINGS###']	.= '<input type="hidden" id="c' . $cid . '_infotext" value="' . preg_replace('/\r\n|\r|\n/', ' ', nl2br($infotext)) . '" />';
		$markerArray['###JSSETTINGS###']	.= '<input type="hidden" id="c' . $cid . '_bubbletitle" value="' . $destination_name . '" />';

		$template = ($template) ? $template : 'EXT:st_routeplanner/static/template.html' ;
		$this->template=$this->cObj->fileResource($template);
		$subpart=$this->cObj->getSubpart($this->template,'###ROUTEPLANNER###'); 
		$content = $this->cObj->substituteMarkerArrayCached($subpart, $markerArray, $subpartArray, array());
		return $this->pi_wrapInBaseClass($content);
	}


	/**
	 * Get geo coordinates from address
	 *
	 * @param string $data
	 * @return array lat, lng
	 */
	function getMapsCoordinates($data){
		$json = t3lib_div::getUrl('https://maps.googleapis.com/maps/api/geocode/json?sensor=false&region=de&address=' . urlencode($data));
		$jsonDecoded = json_decode($json, true);
		if (!empty($jsonDecoded['results'])) {
			$lat = $jsonDecoded['results']['0']['geometry']['location']['lat'];
			$lng = $jsonDecoded['results']['0']['geometry']['location']['lng'];
		} else {
			$lat = 0;
			$lng = 0;
		}
		return array($lat, $lng);
	}

}

if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/st_routeplanner/pi1/class.tx_strouteplanner_pi1.php'])	{
	include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/st_routeplanner/pi1/class.tx_strouteplanner_pi1.php']);
}

?>