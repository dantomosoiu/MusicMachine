<%@ WebHandler Language="C#" Class="FriendsReportMessage" %>

using System;
using System.Web;
using System.Data.SqlClient;

public class FriendsReportMessage : ServerResponse {

    protected override void Respond(HttpContext context) {
        MyDatabase mydb = new MyDatabase();

        mydb.newQuery(
            "UPDATE Message " +
            "SET reporter_id = @userid, " +
            "report_date = GETDATE() " +
            "WHERE message_id = @messageid"
        );

        mydb.setParameter("userid", context.Session["user_id"].ToString());
        mydb.setParameter("messageid", context.Request["message_id"].ToString());

        mydb.ExecuteNonQuery();

    }

}