/**********************************************************\

  Auto-generated WebDB_to_XMLAAPI.h

\**********************************************************/

#include <string>
#include <sstream>
#include <boost/weak_ptr.hpp>
#include "JSAPIAuto.h"
#include "BrowserHost.h"
#include "WebDB_to_XMLA.h"

#ifndef H_WebDB_to_XMLAAPI
#define H_WebDB_to_XMLAAPI

class WebDB_to_XMLAAPI : public FB::JSAPIAuto
{
public:
    WebDB_to_XMLAAPI(const WebDB_to_XMLAPtr& plugin, const FB::BrowserHostPtr& host);
    virtual ~WebDB_to_XMLAAPI();

    WebDB_to_XMLAPtr getPlugin();

    // Read-only property ${PROPERTY.ident}
    std::string get_version();
    int ExecAsync(const FB::JSObjectPtr& callback);

private:
    WebDB_to_XMLAWeakPtr m_plugin;
    FB::BrowserHostPtr m_host;

};

#endif // H_WebDB_to_XMLAAPI

