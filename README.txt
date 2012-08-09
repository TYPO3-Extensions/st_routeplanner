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
	destination 	= Petristrasse, 37308, Heilbad Heiligenstadt
	destinationcoor = 51.3766528 , 10.1377672
	maptype 		= roadmap
	sensor 			= true
	zoom			= 7
	mapwidth		= 400
	mapheight		= 400
	destinationname = name das Ziels in der Anzeige
	bubbletext		= Der Text, der in der Bubble steht
	template 		= link zum Templatefile
}

| = letzter Trenner zum anzeigen des Zielnamens.