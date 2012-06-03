using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;

/// <summary>
/// Summary description for MySession
/// </summary>
public class MySession
{

    private HttpContext context;

    public MySession(HttpContext context)
	{
        this.context = context;
    }

    public HttpContext GetContext()
    {
        return this.context;
    }
    
    public SessionInfo GetSession()
    {

        if(this.context.Session["user_id"] != null)
        {
            SessionInfo info = new SessionInfo(this.context.Session["user_id"].ToString(), this.context.Session["first_name"].ToString(), this.context.Session["last_name"].ToString(), this.context.Session["is_moderator"].ToString(), this.context.Session["is_uploader"].ToString(), this.context.Session["is_admin"].ToString());
            return info;
        }
        else return null;
    }

    public void SetSession(string UserId, string FirstName, string LastName, string isModerator, string isUploader, string isAdmin)
    {
        if (context.Session.IsNewSession)
        {
            this.context.Session.Add("user_id", UserId);
            this.context.Session.Add("first_name", FirstName);
            this.context.Session.Add("last_name", LastName);
            this.context.Session.Add("is_moderator", isModerator);
            this.context.Session.Add("is_uploader", isUploader);
            this.context.Session.Add("is_admin", isAdmin);
        }
        else
        {
            this.context.Session["user_id"] = UserId;
            this.context.Session["first_name"] = FirstName;
            this.context.Session["last_name"] = LastName;
            this.context.Session["is_moderator"] = isModerator;
            this.context.Session["is_uploader"] = isUploader;
            this.context.Session["is_admin"] = isAdmin;
        }
    }
}