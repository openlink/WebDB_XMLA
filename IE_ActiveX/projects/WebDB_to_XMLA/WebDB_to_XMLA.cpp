/**********************************************************\

  Auto-generated WebDB_to_XMLA.cpp

  This file contains the auto-generated main plugin object
  implementation for the OpenLink HTML5 WebDB-to-XMLA (Bridge) ActiveX project

\**********************************************************/

#include "WebDB_to_XMLAAPI.h"

#include "WebDB_to_XMLA.h"

///////////////////////////////////////////////////////////////////////////////
/// @fn WebDB_to_XMLA::StaticInitialize()
///
/// @brief  Called from PluginFactory::globalPluginInitialize()
///
/// @see FB::FactoryBase::globalPluginInitialize
///////////////////////////////////////////////////////////////////////////////
void WebDB_to_XMLA::StaticInitialize()
{
    // Place one-time initialization stuff here; As of FireBreath 1.4 this should only
    // be called once per process
}

///////////////////////////////////////////////////////////////////////////////
/// @fn WebDB_to_XMLA::StaticInitialize()
///
/// @brief  Called from PluginFactory::globalPluginDeinitialize()
///
/// @see FB::FactoryBase::globalPluginDeinitialize
///////////////////////////////////////////////////////////////////////////////
void WebDB_to_XMLA::StaticDeinitialize()
{
    // Place one-time deinitialization stuff here. As of FireBreath 1.4 this should
    // always be called just before the plugin library is unloaded
}

///////////////////////////////////////////////////////////////////////////////
/// @brief  WebDB_to_XMLA constructor.  Note that your API is not available
///         at this point, nor the window.  For best results wait to use
///         the JSAPI object until the onPluginReady method is called
///////////////////////////////////////////////////////////////////////////////
WebDB_to_XMLA::WebDB_to_XMLA()
{
}

///////////////////////////////////////////////////////////////////////////////
/// @brief  WebDB_to_XMLA destructor.
///////////////////////////////////////////////////////////////////////////////
WebDB_to_XMLA::~WebDB_to_XMLA()
{
    // This is optional, but if you reset m_api (the shared_ptr to your JSAPI
    // root object) and tell the host to free the retained JSAPI objects then
    // unless you are holding another shared_ptr reference to your JSAPI object
    // they will be released here.
    releaseRootJSAPI();
    m_host->freeRetainedObjects();
}

void WebDB_to_XMLA::onPluginReady()
{
    // When this is called, the BrowserHost is attached, the JSAPI object is
    // created, and we are ready to interact with the page and such.  The
    // PluginWindow may or may not have already fire the AttachedEvent at
    // this point.
}

///////////////////////////////////////////////////////////////////////////////
/// @brief  Creates an instance of the JSAPI object that provides your main
///         Javascript interface.
///
/// Note that m_host is your BrowserHost and shared_ptr returns a
/// FB::PluginCorePtr, which can be used to provide a
/// boost::weak_ptr<WebDB_to_XMLA> for your JSAPI class.
///
/// Be very careful where you hold a shared_ptr to your plugin class from,
/// as it could prevent your plugin class from getting destroyed properly.
///////////////////////////////////////////////////////////////////////////////
FB::JSAPIPtr WebDB_to_XMLA::createJSAPI()
{
    // m_host is the BrowserHost
    return boost::make_shared<WebDB_to_XMLAAPI>(FB::ptr_cast<WebDB_to_XMLA>(shared_from_this()), m_host);
}

bool WebDB_to_XMLA::onMouseDown(FB::MouseDownEvent *evt, FB::PluginWindow *)
{
    //printf("Mouse down at: %d, %d\n", evt->m_x, evt->m_y);
    return false;
}

bool WebDB_to_XMLA::onMouseUp(FB::MouseUpEvent *evt, FB::PluginWindow *)
{
    //printf("Mouse up at: %d, %d\n", evt->m_x, evt->m_y);
    return false;
}

bool WebDB_to_XMLA::onMouseMove(FB::MouseMoveEvent *evt, FB::PluginWindow *)
{
    //printf("Mouse move at: %d, %d\n", evt->m_x, evt->m_y);
    return false;
}
bool WebDB_to_XMLA::onWindowAttached(FB::AttachedEvent *evt, FB::PluginWindow *)
{
    // The window is attached; act appropriately
    return false;
}

bool WebDB_to_XMLA::onWindowDetached(FB::DetachedEvent *evt, FB::PluginWindow *)
{
    // The window is about to be detached; act appropriately
    return false;
}

