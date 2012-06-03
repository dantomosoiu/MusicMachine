<%@ WebHandler Language="C#" Class="MyProfileChangePassword" %>

using System;
using System.Web;
using System.Data.SqlClient;
using Newtonsoft.Json;

public class MyProfileChangePassword : ServerResponse {
    protected override void Respond(HttpContext context)
    {
        MyDatabase mydb = new MyDatabase();
        SqlDataReader reader;
        String errorMsg;
        
        mydb.newQuery("SELECT password FROM [User] WHERE user_id = @userid");
        mydb.setParameter("userid", context.Session["user_id"].ToString());

        reader = mydb.ExecuteReader();

        if (reader.HasRows)
        {
            reader.Read();
            if (!reader["password"].ToString().Equals(context.Request.Params["password"].ToString()))
            {
                errorMsg = "Wrong password!";
                context.Response.Write(JsonConvert.SerializeObject(errorMsg));
                
            }
            else
            {
                if (context.Request.Params["new_password"].ToString().Length < 5)
                {
                    errorMsg = "New password too short (minimum 5 characters)!";
                    context.Response.Write(JsonConvert.SerializeObject(errorMsg));
                }
                else
                {
                    mydb.newQuery("UPDATE [User] SET password = @pass WHERE user_id = @userid");
                    mydb.setParameter("userid", context.Session["user_id"].ToString());
                    mydb.setParameter("pass", context.Request.Params["new_password"]);

                    mydb.ExecuteNonQuery();
                    context.Response.Write("true");
                }
            }

        }
        else
        {
            errorMsg = "Password was not saved!";
            context.Response.Write(errorMsg);
        }
        
        
        
        
    }
   

}