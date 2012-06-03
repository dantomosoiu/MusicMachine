<%@ WebHandler Language="C#" Class="Handler2" %>

using System;
using System.Web;
using System.Data.SqlClient;
using System.Collections.Generic;

public class Handler2 : ServerResponse {

    SqlDataReader reader;
    List<string> friendId = new List<string>();
    
    protected override void Respond(HttpContext context)
    {
        MyDatabase mydb = new MyDatabase();

        //if (context.Request["friendId"].ToString().Equals("0"))
        //{
        //    mydb.newQuery(
        //        "SELECT [User].user_id " +
        //        "FROM [User], [Friends] " +
        //        "WHERE [User].user_id = [Friends].user1_id AND [Friends].user2_id = @userid " +
        //        "UNION " +
        //        "SELECT [User].user_id " +
        //        "FROM [User], [Friends] " +
        //        "WHERE [User].user_id = [Friends].user2_id AND [Friends].user1_id = @userid "
        //    );
        //    mydb.setParameter("userid", context.Session["user_id"].ToString());

        //    reader = mydb.ExecuteReader();
        //    while (reader.Read())
        //    {
        //        friendId.Add(reader["user_id"].ToString());
        //    }
            
        //    foreach (string entry in friendId)  {
        //        mydb.newQuery(
        //             "INSERT INTO [Recommendation] ([sender_id], [receiver_id], [song_id], [send_date]) " +
        //             "VALUES (@userid, @friendid, @songid, GETDATE())"
        //         );
        //                mydb.setParameter("userid", context.Session["user_id"].ToString());
        //                mydb.setParameter("friendid", entry);
        //                mydb.setParameter("songid", context.Request["songId"].ToString());

        //                mydb.ExecuteNonQuery();
        //    }   
            
        //}
        //else
        //{
        
        mydb.newQuery(
            "SELECT sender_id FROM Recommendation " +
            "WHERE sender_id = @userid AND receiver_id = @friendid AND song_id = @songid "
        );
        mydb.setParameter("userid", context.Session["user_id"].ToString());
        mydb.setParameter("friendid", context.Request["friendId"].ToString());
        mydb.setParameter("songid", context.Request["songId"].ToString());
        reader = mydb.ExecuteReader();
        if(reader.HasRows) {
            context.Response.Write("false");
            return;
        }
            mydb.newQuery(
                "INSERT INTO [Recommendation] ([sender_id], [receiver_id], [song_id], [send_date]) " +
                "VALUES (@userid, @friendid, @songid, GETDATE())"
            );
            mydb.setParameter("userid", context.Session["user_id"].ToString());
            mydb.setParameter("friendid", context.Request["friendId"].ToString());
            mydb.setParameter("songid", context.Request["songId"].ToString());

            mydb.ExecuteNonQuery();
        //}
            context.Response.Write("true");
    }
}