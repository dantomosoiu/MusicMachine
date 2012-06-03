using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using System.Data.SqlClient;
using System.Diagnostics;

/// <summary>
/// Clasa de baza pentru orice raspuns de la server catre un client autentificat
/// </summary>
public abstract class ServerResponse : IHttpHandler, IRequiresSessionState
{
	public ServerResponse()
	{

	}

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json";

        if (context.Session.IsNewSession || context.Session["user_id"] == null)
        {
            context.Response.Write("{ \"_serverStatus\": \"no_session\" }");
        }
        else
        {
            context.Session.Add("mydbobj_sqlDataReader", null);
            context.Session.Add("mydbobj_sqlCommand", null);
            context.Session.Add("mydbobj_sqlConnection", null);
            context.Session.Add("mydbobj_connectionActive", true);

            try
            {
                Respond(context);
            }
            catch (Exception ex)
            {
                string eventErrMsg = "";
                while (ex != null)
                {
                    eventErrMsg += "Message\r\n" + ex.Message.ToString() + "\r\n\r\n";
                    eventErrMsg += "Source\r\n" + ex.Source + "\r\n\r\n";
                    eventErrMsg += "Target site\r\n" + ex.TargetSite.ToString() + "\r\n\r\n";
                    eventErrMsg += "Stack trace\r\n" + ex.StackTrace + "\r\n\r\n";
                    eventErrMsg += "Detailed exception information\r\n\r\n" + ex.ToString();

                    // Assign the next InnerException
                    // to catch the details of that exception as well
                    ex = ex.InnerException;
                }

                if (EventLog.SourceExists("MusicMachineWebApp"))
                {
                    EventLog myLog = new EventLog("Application");
                    myLog.Source = "MusicMachineWebApp";
                    
                    // Write the error entry to the event log.    
                    myLog.WriteEntry(eventErrMsg, EventLogEntryType.Error);
                }

                context.Response.Clear();
                context.Response.Write("{ \"_serverStatus\": \"error\" }");
            }
        }

        if (HttpContext.Current.Session["mydbobj_connectionActive"] != null && ((bool)HttpContext.Current.Session["mydbobj_connectionActive"]) == true)
        {
            if (HttpContext.Current.Session["mydbobj_sqlDataReader"] != null)
            {
                try
                {
                    ((SqlDataReader)HttpContext.Current.Session["mydbobj_sqlDataReader"]).Close();
                }
                catch (Exception ex) { } // sqlDataReader deja a fost inchis
            }
            if (HttpContext.Current.Session["mydbobj_sqlConnection"] != null)
            {
                try
                {
                    ((SqlConnection)HttpContext.Current.Session["mydbobj_sqlConnection"]).Close();
                }
                catch (Exception ex) { } // conexiunea deja a fost inchisa
            }
            HttpContext.Current.Session["mydbobj_connectionActive"] = false;
            HttpContext.Current.Session.Remove("mydbobj_sqlDataReader");
            HttpContext.Current.Session.Remove("mydbobj_sqlCommand");
            HttpContext.Current.Session.Remove("mydbobj_sqlConnection");
            HttpContext.Current.Session.Remove("mydbobj_connectionActive");
        }
    }

    protected abstract void Respond(HttpContext context);

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}