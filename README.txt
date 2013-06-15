-----------------
     maptype 
-----------------
roadmap 	= zeigt die Standard-Strassenkartenansicht.
satellite 	= zeigt Google Earth-Satellitenbilder.
hybrid		= zeigt eine Mischung aus der normalen und der Satellitenansicht.
terrain		= zeigt eine physische Karte an, die auf Gelaendeinformationen basiert. 


-------------------------------------------------
     moegliche konfiguration per typoscript  
-------------------------------------------------
plugin.tx_strouteplanner_pi1 {
	destination 	= Petersbergstraße1, 83026 Rosenheim
	destinationcoor = 47.8489987 , 12.1137908
	maptype 		= roadmap
	sensor 			= true
	zoom			= 14
	mapwidth		= 800
	mapheight		= 800
	destinationname = Name das Ziels in der Anzeige
	infotext		= Der Text, der in der Bubble steht
	template 		= Link zum Templatefile
}

| = letzter Trenner zum anzeigen des Zielnamens.