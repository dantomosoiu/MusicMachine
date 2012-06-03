<%@ WebHandler Language="C#" Class="FriendsIsFriend" %>

using System;
using System.Web;
using System.Data.SqlClient;

public class FriendsIsFriend : ServerResponse {

    protected override void Respond(HttpContext context) {
        MyDatabase mydb = new MyDatabase();
        SqlDataReader reader;

        if (context.Session["user_id"].ToString().Equals(context.Request["friendid"].ToString())) {
            context.Response.Write("true");
            return;
        }

        mydb.newQuery(
           "SELECT user1_id FROM Friends " +
           "WHERE user1_id = @userid AND user2_id = @friendid " +
           "OR user2_id = @userid AND user1_id = @friendid"
       );
        mydb.setParameter("userid", context.Session["user_id"].ToString());
        mydb.setParameter("friendid", context.Request["friendid"].ToString());
        reader = mydb.ExecuteReader();

        if (reader.HasRows) {
            context.Response.Write("true");
        }
        else {
         context.Response.Write("false");
        }
    }
}