<%@ WebHandler Language="C#" Class="FriendsShoutboxPost" %>

using System;
using System.Web;

public class FriendsShoutboxPost : ServerResponse {

    protected override void Respond(HttpContext context)
    {
        MyDatabase mydb = new MyDatabase();

        mydb.newQuery(
            "INSERT INTO Message(sender_id, receiver_id, send_date, title, body) " +
            "VALUES (@userid, @friendid, GETDATE(), '', @message)"
        );

        mydb.setParameter("userid", context.Session["user_id"].ToString());
        mydb.setParameter("friendid", context.Request["friendId"].ToString());
        mydb.setParameter("message", context.Request["message"].ToString());
            
        mydb.ExecuteNonQuery();
        
          
    }
}