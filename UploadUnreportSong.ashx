<%@ WebHandler Language="C#" Class="UploadUnreportSong" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;


public class UploadUnreportSong : ServerResponse
{

    MyDatabase mydb = new MyDatabase();

    protected override void Respond(HttpContext context)
    {
        mydb.newQuery("UPDATE [Song] SET [Song].[reporter_id] = null,[Song].[report_date] = null,[Song].[comment] = null,[Song].[report_type] = null WHERE [Song].[song_id] = @id");

        mydb.setParameter("id", context.Request.Params["SongId"].ToString());
       

        mydb.ExecuteNonQuery();
        
        context.Response.Write("{}");
    }

}