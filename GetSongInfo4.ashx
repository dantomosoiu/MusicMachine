<%@ WebHandler Language="C#" Class="GetSongInfo" %>

using System;
using System.Web;
using System.Web.SessionState;
using Newtonsoft.Json;
using System.Net;
using System.IO;
using System.Xml;

public class GetSongInfo : IHttpHandler, IRequiresSessionState
{
    
    public void ProcessRequest (HttpContext context) 
    {
        context.Response.ContentType = "application/json";
        String title = context.Request.Params["title"];
        String artist = context.Request.Params["artist"];

        try
        {
            String url = "http://webservices.lyrdb.com/lookup.php?for=match&q=" + artist + "|" + title;
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            StreamReader reader = new StreamReader(response.GetResponseStream());

            String trackId = reader.ReadToEnd();
            if (trackId.Length > 0)
            {
                trackId = trackId.Substring(0, trackId.IndexOf(@"\"));



                url = "http://webservices.lyrdb.com/getlyr.php?q=" + trackId;
                request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "GET";
                response = (HttpWebResponse)request.GetResponse();
                reader = new StreamReader(response.GetResponseStream());


                String versuri = reader.ReadToEnd().Replace("\r\r\n\r\r\n", Environment.NewLine + Environment.NewLine);
                versuri = versuri.Replace("\r\n\r\n\r\n", Environment.NewLine + Environment.NewLine);

                context.Response.Write(JsonConvert.SerializeObject(versuri));
            }
            else
            {
                context.Response.Write(JsonConvert.SerializeObject("no lyrics available"));
            }
        }
        catch (Exception e)
        {
            context.Response.Write(JsonConvert.SerializeObject("error"));
        }
        
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}