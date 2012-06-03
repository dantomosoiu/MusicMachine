<%@ WebHandler Language="C#" Class="ReportSong" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient; 


public class ReportSong : ServerResponse
{
    MyDatabase mydb = new MyDatabase();
    
    protected override void Respond(HttpContext context)
    {
                
        mydb.newQuery("UPDATE [Song] SET report_type = @rtype, reporter_id = @rid, comment = @cmmnt , report_date = @rdate WHERE song_id = @songid");
        mydb.setParameter("rid", context.Session["user_id"].ToString());
        mydb.setParameter("songid", context.Request.Params["SongId"].ToString());
        mydb.setParameter("rtype", context.Request.Params["Type"].ToString());
        mydb.setParameter("cmmnt", context.Request.Params["Comment"].ToString());
        mydb.setParameter("rdate", DateTime.Now);
        mydb.ExecuteNonQuery();
        
     context.Response.Write("{}");
    }

}