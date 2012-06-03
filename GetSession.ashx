<%@ WebHandler Language="C#" Class="SessionCheck" %>

using System;
using System.Web;
using System.Web.SessionState;
using Newtonsoft.Json;

public class SessionCheck : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json";
        MySession mySession = new MySession(context);

        if (context.Session.IsNewSession || mySession.GetSession() == null)
        {
            string sessionExistence = "false";
            context.Response.Write(JsonConvert.SerializeObject(sessionExistence));
        }
        else
        {            
            context.Response.Write(JsonConvert.SerializeObject(mySession.GetSession()));
        }
            
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}