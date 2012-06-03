<%@ WebHandler Language="C#" Class="FriendsAcceptRequest" %>

using System;
using System.Web;

public class FriendsAcceptRequest : ServerResponse {

    protected override void Respond(HttpContext context)
    {
        MyDatabase mydb = new MyDatabase();

        mydb.newQuery(
            "UPDATE [FriendRequests] SET [status] = 'accepted', [decision_date] = GETDATE() " +
            "WHERE [receiver_id] = @userid AND [sender_id] = @friendid"
        );

        //mydb.newQuery(
        //    "DELETE [FriendRequests] " +
        //    "WHERE [receiver_id] = @userid AND [sender_id] = @friendid"
        //);
        mydb.setParameter("userid", context.Session["user_id"].ToString());
        mydb.setParameter("friendid", context.Request["friendId"].ToString());
        //System.Diagnostics.Debug.WriteLine(context.Session["user_id"].ToString() + context.Request["friendId"].ToString());
        
        mydb.ExecuteNonQuery();

        mydb.newQuery(
            "INSERT INTO [Friends] ([user1_id], [user2_id]) " +
            "VALUES (@userid, @friendid)"
        );

        mydb.setParameter("userid", context.Session["user_id"].ToString());
        mydb.setParameter("friendid", context.Request["friendId"].ToString());

        mydb.ExecuteNonQuery();

        mydb.newQuery(
            "INSERT INTO [Friends] ([user1_id], [user2_id]) " +
            "VALUES (@friendid, @userid)"
        );

        mydb.setParameter("userid", context.Session["user_id"].ToString());
        mydb.setParameter("friendid", context.Request["friendId"].ToString());

        mydb.ExecuteNonQuery();
    }

}