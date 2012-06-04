set WIX="C:\Program Files (x86)\Windows Installer XML v3.5\bin\"

%WIX%"heat.exe" file npWebDB_to_XMLA.dll -out npWebDB_to_XMLA.wxs -gg -srd -cg PluginDLLGroup -dr INSTALLDIR -var var.BINSRC -t:FixFragment.xslt

if errorlevel 1 goto :VCReportError1
if errorlevel 1 goto VCReportError1

%WIX%"candle.exe" -dBINSRC=. -ext WixUtilExtension -ext WixUIExtension npWebDB_to_XMLA.wxs

if errorlevel 1 goto :VCReportError2
if errorlevel 1 goto VCReportError2

%WIX%"candle.exe" -dBINSRC=. -ext WixUtilExtension -ext WixUIExtension WebDB_to_XMLAInstaller.wxs

if errorlevel 1 goto :VCReportError3
if errorlevel 1 goto VCReportError3

%WIX%"light.exe" -sw1076 -ext WixUtilExtension -ext WixUIExtension -out WebDB_to_XMLA.msi WebDB_to_XMLAInstaller.wixobj npWebDB_to_XMLA.wixobj

if errorlevel 1 goto :VCReportError4
if errorlevel 1 goto VCReportError4

del *.wixobj
del *.wixpdb
goto end


:VCReportError1
echo Project : error PRJ0019: A tool returned an error code from "Compiling npWebDB_to_XMLA.dll -> npWebDB_to_XMLA.wxs"
exit 1

:VCReportError2
echo Project : error PRJ0019: A tool returned an error code from "Compiling npWebDB_to_XMLA.wxs -> npWebDB_to_XMLA.wixobj"
exit 1

:VCReportError3
echo Project : error PRJ0019: A tool returned an error code from "Compiling WebDB_to_XMLAInstaller.wxs -> WebDB_to_XMLAInstaller.wixobj"
exit 1

:VCReportError4
echo Project : error PRJ0019: A tool returned an error code from "Linking WebDB_to_XMLAInstaller.wixobj;npWebDB_to_XMLA.wixobj -> WebDB_to_XMLA.msi"
exit 1

:end