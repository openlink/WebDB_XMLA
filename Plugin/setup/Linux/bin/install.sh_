#!/bin/sh
#
#  install.sh
#

umask 022

#
#  Installation directory
#
PREFIX=`pwd`

#
#  Determine hostname
#
HOST=`hostname | sed -e 's/\..*//' 2>/dev/null`
HOST=${HOST:-localhost}
echo ""
echo "Started installation on : $HOST  $PREFIX"
echo ""

echo "Copying 'OpenLink HTML5 WebDB-to-XMLA (Bridge) Plugin ver:1.0.8' to /usr/lib/mozilla/plugins/"
mkdir -pv /usr/lib/mozilla/plugins
cp libnpxmla.so  /usr/lib/mozilla/plugins/libnpxmla.so

echo "End of installation"
exit 0
