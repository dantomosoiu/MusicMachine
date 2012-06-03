<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using Newtonsoft.Json;

public class Handler : ServerResponse {

    protected override void Respond(HttpContext context)
    {
        context.Response.Write("{ response: 'abc' }");
        //BasicInfo b = new BasicInfo();
        //context.Response.Write(JsonConvert.SerializeObject(b));
    }

}