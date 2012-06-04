/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- 
 *
 * ***** END LICENSE BLOCK ***** */

#ifdef XP_WIN
#include <windows.h>
#include <windowsx.h>
#endif


#ifdef XP_UNIX
#include <string.h>
#endif

#include <stdio.h>
#include <string.h>


#include "plugin.h"
#include "npfunctions.h"

#include "Database.h"
#include "mthreads.h"


DatabaseObject::DatabaseObject(NPP npp)
    : ScriptablePluginObjectBase(npp)
  {
    mc_run_id = NPN_GetStringIdentifier("run");
    mc_ExecAsync_id = NPN_GetStringIdentifier("ExecAsync");
  }


DatabaseObject::~DatabaseObject()
{
}


bool
DatabaseObject::HasMethod(NPIdentifier name)
{
  if (name == mc_ExecAsync_id)
    return true;
  else
    return false;
}

bool
DatabaseObject::HasProperty(NPIdentifier name)
{
  return false;
}

bool
DatabaseObject::GetProperty(NPIdentifier name, NPVariant *result)
{
  return false;
}

bool
DatabaseObject::SetProperty(NPIdentifier name, const NPVariant *value)
{
  return false;
}

bool
DatabaseObject::Invoke(NPIdentifier name, const NPVariant *args,
                               uint32_t argCount, NPVariant *result)
{
  VOID_TO_NPVARIANT(*result);

  if (name == mc_ExecAsync_id) {
    if (argCount < 1) {
      NPN_SetException(this, "Too few parameters count");
      return true;
    }
    if (!NPVARIANT_IS_OBJECT(args[0])) {
      NPN_SetException(this, "Wrong argument type");
      return true;
    }
    ExecAsync(NPVARIANT_TO_OBJECT(args[0]));
    return true;
  }
  return false;
}


void AsyncParamFree(AsyncParam *param)
{
  NPN_ReleaseObject(param->pObj);
  NPN_MemFree(param);
}

void asyncProc(void *ptr) 
{
  NPVariant result;
  NPVariant arg;
  AsyncParam *param = (AsyncParam *)ptr;

  VOID_TO_NPVARIANT(result);
  VOID_TO_NPVARIANT(arg);

  NPN_Invoke(param->npp, param->pObj, param->mc_run_id, &arg, 0, &result);

  AsyncParamFree(param);
}


NPError
DatabaseObject::ExecAsync(NPObject *pObj)
{
  AsyncParam *param = (AsyncParam *)NPN_MemAlloc(sizeof(AsyncParam));
  if (!param)
	  return NPERR_GENERIC_ERROR;
  param->npp = mNpp;
  param->pObj = NPN_RetainObject(pObj);
  param->mc_run_id = mc_run_id;
  
  NPN_PluginThreadAsyncCall(mNpp, asyncProc, (void*)param);
  return NPERR_NO_ERROR;
}


