<%@ WebHandler Language="C#" Class="FriendsGetShoutbox" %>

using System;
using System.Web;
using System.Data.SqlClient;
using System.Collections.Generic;
using Newtonsoft.Json;

public class FriendsGetShoutbox : ServerResponse {

    protected override void Respond(HttpContext context)
    {
        
        MyDatabase mydb = new MyDatabase();
        SqlDataReader reader;
        List<ShoutboxEntry> shoutBoxList = new List<ShoutboxEntry>();
        
        mydb.newQuery(
            "SELECT [Message].[message_id], [Message].[sender_id], [Message].[send_date], [Message].[body], [User].[first_name], [User].[last_name], [User].[email], [User].[user_id] " +
            "FROM [Message] " +
            "JOIN [User] ON [User].[user_id] = [Message].[sender_id] " +
            "WHERE [Message].[receiver_id] = @friendid " + 
            "ORDER BY [Message].[send_date] asc");
        
        mydb.setParameter("friendid", context.Request.Params["friend_id"].ToString());
        reader = mydb.ExecuteReader();
        

        if (!reader.HasRows)
        {
            context.Response.Write("false");
        }
        else
        {
            while (reader.Read())
            {
                DateTime dt = Convert.ToDateTime(reader["send_date"]);
                shoutBoxList.Add(new ShoutboxEntry(
                    int.Parse(reader["message_id"].ToString()),
                    new BasicInfo(int.Parse(reader["user_id"].ToString()),
                        reader["first_name"].ToString(),
                        reader["last_name"].ToString(),
                        reader["email"].ToString()
                    ),
                    String.Format("{0:f}", dt),
                    "title",
                    reader["body"].ToString()
                    )
                );
                
            }
            context.Response.Write(JsonConvert.SerializeObject(shoutBoxList));
        }
    }
        
}