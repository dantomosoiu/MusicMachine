<%@ WebHandler Language="C#" Class="LogInAttempt" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.Data.SqlClient;
using Newtonsoft.Json;

public class LogInAttempt : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        HttpContext.Current.Session.Add("mydbobj_sqlDataReader", null);
        HttpContext.Current.Session.Add("mydbobj_sqlCommand", null);
        HttpContext.Current.Session.Add("mydbobj_sqlConnection", null);
        HttpContext.Current.Session.Add("mydbobj_connectionActive", true);
        
        String email = context.Request.Params["email"];
        String password = context.Request.Params["password"];
        context.Response.ContentType = "application/json";
        
        MyDatabase database = new MyDatabase();
        String query = "SELECT [password], [first_name], [last_name], [user_id], [is_moderator], [is_uploader], [is_admin] FROM [User] WHERE email=@mail";
        database.newQuery(query);
        database.setParameter("mail", email);
        SqlDataReader reader = database.ExecuteReader();

        if (reader.HasRows)
        {
            reader.Read();
            if (reader["password"].ToString().Equals(password))
            {
                MySession ses = new MySession(context);
                ses.SetSession(reader["user_id"].ToString(), reader["first_name"].ToString(), reader["last_name"].ToString(), reader["is_moderator"].ToString(), reader["is_uploader"].ToString(), reader["is_admin"].ToString());
                context.Response.Write(JsonConvert.SerializeObject(ses.GetSession()));
                context = ses.GetContext();
                
                query = "UPDATE [User] SET [last_login_date]= @date WHERE email=@mail";
                database.newQuery(query);
                DateTime currentDate = DateTime.Now;
                database.setParameter("date", currentDate);
                database.setParameter("mail", email);
                int result = database.ExecuteNonQuery();

                password = null;
                email = null;
            }
            else
            {
                string logIn = "false";
                context.Response.Write(JsonConvert.SerializeObject(logIn));
            }
        }
        else
        {
            string logIn = "false";
            context.Response.Write(JsonConvert.SerializeObject(logIn));
        }

        // inchid conexiunea la baza de date
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

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}