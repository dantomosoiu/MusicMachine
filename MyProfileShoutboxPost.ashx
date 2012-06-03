<%@ WebHandler Language="C#" Class="MyProfileShoutboxPost" %>

using System;
using System.Web;

public class MyProfileShoutboxPost : ServerResponse {

    protected override void Respond(HttpContext context) {
        MyDatabase mydb = new MyDatabase();

        mydb.newQuery(
            "INSERT INTO Message(sender_id, receiver_id, send_date, title, body) " +
            "VALUES (@userid, @userid, GETDATE(), '', @message)"
        );

        mydb.setParameter("userid", context.Session["user_id"].ToString());
        mydb.setParameter("message", context.Request["message"].ToString());

        mydb.ExecuteNonQuery();


    }

}