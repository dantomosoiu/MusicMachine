<%@ WebHandler Language="C#" Class="SignUpAttempt" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.Data.SqlClient;
using Newtonsoft.Json;

public class SignUpAttempt : IHttpHandler, IRequiresSessionState
{

    Boolean REGISTERING_CLOSED = true;

    public void ProcessRequest(HttpContext context)
    {
        if (REGISTERING_CLOSED)
        {
            context.Response.Write(JsonConvert.SerializeObject("0"));
            return;
        }
        
        String email = context.Request.Params["email"];
        String password = context.Request.Params["password"];
        String firstName = context.Request.Params["firstName"];
        String lastName = context.Request.Params["lastName"];
        
        context.Response.ContentType = "application/json";
        
        MyDatabase database = new MyDatabase();
        String query = "SELECT [email] FROM [User] WHERE email=@mail";
        database.newQuery(query);
        database.setParameter("mail", email);
        SqlDataReader reader = database.ExecuteReader();

        if (reader.HasRows)
        {
            context.Response.Write(JsonConvert.SerializeObject("1"));
        }
        else
        {
            reader.Close();
            DateTime currentDate = DateTime.Now;
            Boolean fals = false;
            query = "INSERT INTO [User] ([password], [email], [last_name], [first_name], [join_date], [last_login_date], [last_profile_update_date], [skin], [is_moderator], [is_uploader], [is_admin], [last_artists_weights_update]) " +
                "VALUES (@pass, @mail2, @lname, @fname, @dat, @dat2, @dat3, @skin, @f, @f2, @f3, @dat4)";
            //MyDatabase mydb = new MyDatabase();
            database.newQuery(query);

            database.setParameter("pass", password);
            database.setParameter("mail2", email);
            database.setParameter("lname", lastName);
            database.setParameter("fname", firstName);
            database.setParameter("dat", currentDate);
            database.setParameter("dat2", currentDate);
            database.setParameter("dat3", currentDate);
            database.setParameter("skin", "default");
            database.setParameter("f", fals);
            database.setParameter("f2", fals);
            database.setParameter("f3", fals);
            database.setParameter("dat4", currentDate);

            database.ExecuteNonQuery();

            int userid = database.GetLastInsertId();

            query = "INSERT INTO [Playlist] ([playlist_name], [owner_id]) VALUES (@pn, @id)";
            database.newQuery(query);
            database.setParameter("pn", "Favourites");
            database.setParameter("id", userid);

            database.ExecuteNonQuery();
                
            context.Response.Write(JsonConvert.SerializeObject("0"));
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