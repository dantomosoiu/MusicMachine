<%@ WebHandler Language="C#" Class="FriendsIgnoreFriend" %>

using System;
using System.Web;

public class FriendsIgnoreFriend : ServerResponse {

    protected override void Respond(HttpContext context)
    {
        MyDatabase mydb = new MyDatabase();

        //mydb.newQuery(
        //    "DELETE [FriendRequests] " +
        //    "WHERE [receiver_id] = @userid AND [sender_id] = @friendid"
        //);

        mydb.newQuery(
            "UPDATE [FriendRequests] SET [status] = 'declined', [decision_date] = GETDATE() " +
            "WHERE [receiver_id] = @userid AND [sender_id] = @friendid"
        );
        
        mydb.setParameter("userid", context.Session["user_id"].ToString());
        mydb.setParameter("friendid", context.Request["friendId"].ToString());

        mydb.ExecuteNonQuery();

    }
}