echo '======= Creation of the XMLA NPAPI plugin.dmg ======='
rm -R -f TargetImage.dmg
rm -R -f HTML5_WebDB2XMLA_NPAPI_Plugin.dmg
#
sudo hdiutil create -megabytes 60 TargetImage.dmg -layout NONE -fs HFS+
sleep 5
#
DEVDSK=`sudo hdid -nomount TargetImage.dmg| awk '{ print $1 }'`
#
/sbin/newfs_hfs -v 'HTML5_WebDB2XMLA_NPAPI' $DEVDSK
sleep 2
#
hdiutil eject /Volumes/HTML5_WebDB2XMLA_NPAPI
sleep 1
#
hdid TargetImage.dmg
#sleep 10
#
cp -R -f HTML5\ WebDB-to-XMLA\ \(Bridge\)\ NPAPI\ Plugin.mpkg  /Volumes/HTML5_WebDB2XMLA_NPAPI
#sleep 10
#
hdiutil eject /Volumes/HTML5_WebDB2XMLA_NPAPI
#sleep 10
#
hdiutil convert -format UDCO TargetImage.dmg -o HTML5_WebDB2XMLA_NPAPI_Plugin.dmg
#
rm -R -f TargetImage.dmg

