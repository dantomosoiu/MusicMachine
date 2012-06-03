<%@ WebHandler Language="C#" Class="LogInAttempt" %>

using System;
using System.Web;
using System.Web.SessionState;

public class LogInAttempt : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        context.Session.Clear();
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}