<%@ WebHandler Language="C#" Class="ModeratorMessageDelete" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;


public class ModeratorMessageDelete : ServerResponse
{
    MyDatabase mydb = new MyDatabase();
    
    protected override void Respond(HttpContext context)
    {
        //verific daca persoana care a initiat stergerea mesajului este moderator
        if (context.Session["is_moderator"].Equals("True"))
        {
                
            mydb.newQuery("DELETE FROM [Message] WHERE [Message].[message_id] = @messId");

            mydb.setParameter("messId", int.Parse(context.Request.Params["MessageId"].ToString()));

            mydb.ExecuteNonQuery(); 
        }
        
        context.Response.Write("{}");
    }

}