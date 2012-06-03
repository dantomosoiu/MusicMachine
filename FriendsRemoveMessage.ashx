<%@ WebHandler Language="C#" Class="FriendsRemoveMessage" %>

using System;
using System.Web;
using System.Data.SqlClient;

public class FriendsRemoveMessage : ServerResponse {
    protected override void Respond(HttpContext context)
    {
        MyDatabase mydb = new MyDatabase();
        SqlDataReader reader;

        //verific daca mesajul a fost trimis catre userul logat
        mydb.newQuery(
            "SELECT [is_moderator] " +
            "FROM [User] " +
            "WHERE [user_id] = @userid"
        );
        mydb.setParameter("userid", context.Session["user_id"]);
        reader = mydb.ExecuteReader();

        if (reader.HasRows)
        {
            reader.Read();
            if (reader["is_moderator"].ToString().Equals("True"))
            {
                mydb.newQuery(
                    "DELETE FROM Message " +
                    "WHERE message_id = @messageid"
                );
                mydb.setParameter("messageid", context.Request.Params["message_id"]);
                mydb.ExecuteNonQuery();
                
                context.Response.Write("true");
                return;
            }
        }       
        context.Response.Write("false");
        return;
    }

}