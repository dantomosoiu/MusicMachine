<%@ WebHandler Language="C#" Class="ModeratorDeleteMessageReport" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;


public class ModeratorDeleteMessageReport : ServerResponse
{
    MyDatabase mydb = new MyDatabase();
    
    protected override void Respond(HttpContext context)
    {
        //verific daca persoana care a initiat stergerea mesajului este moderator
        if (context.Session["is_moderator"].Equals("True"))
        {

            mydb.newQuery("UPDATE [Message] SET [Message].[reporter_id] = NULL, [Message].[report_date] = NULL, [Message].[comment] = NULL, [Message].[resolved] = NULL WHERE [Message].[message_id] = @messId");

            mydb.setParameter("messId", int.Parse(context.Request.Params["MessageId"].ToString()));

            mydb.ExecuteNonQuery(); }
        
        context.Response.Write("{}");
    }

}