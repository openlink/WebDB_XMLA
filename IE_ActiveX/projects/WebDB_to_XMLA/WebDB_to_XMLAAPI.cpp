/**********************************************************\

  Auto-generated WebDB_to_XMLAAPI.cpp

\**********************************************************/

#include "JSObject.h"
#include "variant_list.h"
#include "DOM/Document.h"

#include "script.h"
#include "WebDB_to_XMLAAPI.h"

///////////////////////////////////////////////////////////////////////////////
/// @fn WebDB_to_XMLAAPI::WebDB_to_XMLAAPI(const WebDB_to_XMLAPtr& plugin, const FB::BrowserHostPtr host)
///
/// @brief  Constructor for your JSAPI object.  You should register your methods, properties, and events
///         that should be accessible to Javascript from here.
///
/// @see FB::JSAPIAuto::registerMethod
/// @see FB::JSAPIAuto::registerProperty
/// @see FB::JSAPIAuto::registerEvent
///////////////////////////////////////////////////////////////////////////////
WebDB_to_XMLAAPI::WebDB_to_XMLAAPI(const WebDB_to_XMLAPtr& plugin, const FB::BrowserHostPtr& host) : m_plugin(plugin), m_host(host)
{
    registerMethod("ExecAsync",  make_method(this, &WebDB_to_XMLAAPI::ExecAsync));

    // Read-only property
    registerProperty("version",
                     make_property(this,
                        &WebDB_to_XMLAAPI::get_version));

    host->evaluateJavaScript((char *)code);
}

///////////////////////////////////////////////////////////////////////////////
/// @fn WebDB_to_XMLAAPI::~WebDB_to_XMLAAPI()
///
/// @brief  Destructor.  Remember that this object will not be released until
///         the browser is done with it; this will almost definitely be after
///         the plugin is released.
///////////////////////////////////////////////////////////////////////////////
WebDB_to_XMLAAPI::~WebDB_to_XMLAAPI()
{
}

///////////////////////////////////////////////////////////////////////////////
/// @fn WebDB_to_XMLAPtr WebDB_to_XMLAAPI::getPlugin()
///
/// @brief  Gets a reference to the plugin that was passed in when the object
///         was created.  If the plugin has already been released then this
///         will throw a FB::script_error that will be translated into a
///         javascript exception in the page.
///////////////////////////////////////////////////////////////////////////////
WebDB_to_XMLAPtr WebDB_to_XMLAAPI::getPlugin()
{
    WebDB_to_XMLAPtr plugin(m_plugin.lock());
    if (!plugin) {
        throw FB::script_error("The plugin is invalid");
    }
    return plugin;
}



int
WebDB_to_XMLAAPI::ExecAsync(const FB::JSObjectPtr& callback)
{
  FB::VariantList args;

  callback->InvokeAsync("run", args);
  return 0;
}


// Read-only property version
std::string WebDB_to_XMLAAPI::get_version()
{
    return "1.0.0";
}


