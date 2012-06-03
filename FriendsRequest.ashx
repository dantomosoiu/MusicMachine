<%@ WebHandler Language="C#" Class="FriendsRequest" %>

using System;
using System.Web;

public class FriendsRequest : ServerResponse {

    protected override void Respond(HttpContext context)
    {
        MyDatabase mydb = new MyDatabase();

        mydb.newQuery(
            "INSERT INTO [FriendRequests] ([sender_id], [receiver_id], [status], [send_date]) " +
            "VALUES (@userid, @friendid, 'pending', GETDATE())"
        );
        mydb.setParameter("userid", context.Session["user_id"].ToString());
        mydb.setParameter("friendid", context.Request["friendId"].ToString());

        mydb.ExecuteNonQuery();
            
    }
}