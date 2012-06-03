<%@ WebHandler Language="C#" Class="ShoutboxRemoveMessage" %>

using System;
using System.Web;
using System.Data.SqlClient;

public class ShoutboxRemoveMessage : ServerResponse {
    protected override void Respond(HttpContext context)
    {
        MyDatabase mydb = new MyDatabase();
        SqlDataReader reader;

        //verific daca mesajul a fost trimis catre userul logat
        mydb.newQuery(
            "SELECT [message_id] " +
            "FROM [Message] " + 
            "WHERE [message_id] = @messageid AND [receiver_id] = @userid"
        );
        mydb.setParameter("messageid", context.Request.Params["message_id"]);
        mydb.setParameter("userid", context.Session["user_id"]);
        reader = mydb.ExecuteReader();

        if (reader.HasRows)
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
        else
        {
            context.Response.Write("false");
            return;
        }
    }
}