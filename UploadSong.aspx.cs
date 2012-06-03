using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Data.SqlClient;
using System.Net;
using System.Xml;



public partial class UploadSong : System.Web.UI.Page
{

    MyDatabase mydb = new MyDatabase();
    String songID;

    public String SONG_ID { get { return songID;}  set{songID= value;} }


    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {

            string Songid = Request.Params["SongId"];
            string do_function = Request.Params["do_function"];
            if ((Songid != null) && (do_function != null))
            {
                if (do_function.Equals("update") == true) { SONG_ID = Songid; FillTextBoxes(Songid);}
             //   if (do_function.Equals("upload") == true) { SONG_ID = Songid; UploadSongOnServer(sender,e); }

            }
        }

    }

    public void FillTextBoxes ( String songid ){
        SqlDataReader sqlReader;        

        mydb.newQuery(" SELECT  [Song].[song_name], [Song].[artists], [Song].[album] , [Song].[lyrics], [Song].[year], [Song].[genres] FROM [Song] WHERE [Song].[song_id] = @songid ");

        mydb.setParameter("songid", songid);

        sqlReader = mydb.ExecuteReader();
        sqlReader.Read();

      // song_id_box.Text=sqlReader["song_id"].ToString();        
        song_name_box.Text = sqlReader["song_name"].ToString();
        artists_box.Text = sqlReader["artists"].ToString();
        album_box.Text = sqlReader["album"].ToString();
        year_box.Text = sqlReader["year"].ToString();
        genres_box.Text = sqlReader["genres"].ToString();
        lyrics_box.Text = sqlReader["lyrics"].ToString();

        
        inputSong.Visible = false;
        Button2.Visible = false;
        Button3.Visible = true;
        
    }

    protected void UpdateSong(object sender, EventArgs e)
    {

        SqlDataReader sqlReader;
        int albumId;

        SONG_ID = Request.Params["SongId"];

        mydb.newQuery("SELECT [Album].[album_id] FROM [Album] WHERE [Album].[album] like @album");
        mydb.setParameter("album", album_box.Text.Trim());
        sqlReader = mydb.ExecuteReader();

        if (sqlReader.HasRows == true)
        {
            sqlReader.Read();
            albumId = int.Parse(sqlReader["album_id"].ToString().Trim());

        }
        else
        {
            mydb.newQuery("INSERT INTO [Album] (album) VALUES (@album)");
            mydb.setParameter("album", album_box.Text.Trim());
            mydb.ExecuteNonQuery();
            albumId = mydb.GetLastInsertId();

        }        

        mydb.newQuery("UPDATE [Song] SET [Song].[song_name] = @songname , [Song].[artists] = @artist , [Song].[album] = @album , [Song].[album_id] = @albumid , [Song].[year] = @year , [Song].[genres] = @genres , [Song].[lyrics] = @lyrics WHERE [Song].[song_id] = @songid ");

        mydb.setParameter("songid", SONG_ID.Trim());         
        mydb.setParameter("songname", song_name_box.Text.Trim());
        mydb.setParameter("artist",  artists_box.Text.Trim());
        mydb.setParameter("album", album_box.Text.Trim());
        mydb.setParameter("albumid", albumId);
        mydb.setParameter("year", year_box.Text.Trim());
        mydb.setParameter("genres",  genres_box.Text.Trim());
        mydb.setParameter("lyrics",  lyrics_box.Text.Trim());

        mydb.ExecuteNonQuery();

        int songId = int.Parse(SONG_ID.Trim());

        mydb.newQuery("DELETE FROM [HasGenre] WHERE [HasGenre].[song_id] = @id");

        mydb.setParameter("id", SONG_ID.Trim());

        mydb.ExecuteNonQuery();

        String[] genres_words = genres_box.Text.Split(',');
        int[] genres_ids = new int[genres_words.Length];
        int i = 0;
        while (i < genres_words.Length)
        {
            mydb.newQuery("SELECT [Genre].[genre_id] FROM [Genre] WHERE [Genre].[genre_name] like @gen");
            mydb.setParameter("gen", genres_words[i].Trim());
            sqlReader = mydb.ExecuteReader();

            if (sqlReader.HasRows == true)
            {
                sqlReader.Read();
                int genreid = int.Parse(sqlReader["genre_id"].ToString().Trim());
                genres_ids[i] = genreid;

                //mydb.newQuery("SELECT * FROM [HasGenre] WHERE [HasGenre].[song_id] = @songid and [HasGenre].[genre_id] = @genid ");
                //mydb.setParameter("songid", songId);
                //mydb.setParameter("genid", genreid);

                //sqlReader = mydb.ExecuteReader();
                //if (sqlReader.HasRows == false)
                //{
                mydb.newQuery("INSERT INTO [HasGenre] (song_id,genre_id) VALUES (@songid,@genid)");
                mydb.setParameter("songid", songId);
                mydb.setParameter("genid", genreid);

                mydb.ExecuteNonQuery();
                //}                   


            }
            else
            {
                mydb.newQuery("INSERT INTO [Genre] (genre_name) VALUES (@gen)");
                mydb.setParameter("gen", genres_words[i].Trim());
                mydb.ExecuteNonQuery();

                //aici trebuie facut altceva pentru a lua ultimul id ca e dubios asa
                int genreId = mydb.GetLastInsertId();
                genres_ids[i] = genreId;
                mydb.newQuery("INSERT INTO [HasGenre] (song_id,genre_id) VALUES (@songid,@genid)");
                mydb.setParameter("songid", songId);
                mydb.setParameter("genid", genreId);

                mydb.ExecuteNonQuery();

            }
            i++;
        }




        mydb.newQuery("DELETE FROM [Sings] WHERE [Sings].[song_id] = @id");

        mydb.setParameter("id", SONG_ID.Trim());

        mydb.ExecuteNonQuery();

        String[] artists_words = artists_box.Text.Split(',');
        int[] artists_ids = new int[artists_words.Length];
        i = 0;
        while (i < artists_words.Length)
        {
            mydb.newQuery("SELECT [Artist].[artist_id] FROM [Artist] WHERE [Artist].[artist_name] like @art");
            mydb.setParameter("art", artists_words[i].Trim());
            sqlReader = mydb.ExecuteReader();

            if (sqlReader.HasRows == true)
            {
                sqlReader.Read();
                int artiid = int.Parse(sqlReader["artist_id"].ToString().Trim());
                artists_ids[i] = artiid;

                //mydb.newQuery("SELECT * FROM [Sings] WHERE [Sings].[song_id] = @songid and [Sings].[artist_id] = @artid ");
                //mydb.setParameter("songid", songId);
                //mydb.setParameter("artid", artiid);

                //sqlReader = mydb.ExecuteReader();
                //if (sqlReader.HasRows == false)
                //{
                mydb.newQuery("INSERT INTO [Sings] (song_id,artist_id) VALUES (@songid,@artid)");
                mydb.setParameter("songid", songId);
                mydb.setParameter("artid", artiid);

                mydb.ExecuteNonQuery();
                //}   

            }
            else
            {
                string artistName = artists_words[i].Trim();
                mydb.newQuery("INSERT INTO [Artist] (artist_name) VALUES (@art)");
                mydb.setParameter("art", artistName);
                mydb.ExecuteNonQuery();

                //aici trebuie facut altceva pentru a lua ultimul id ca e dubios asa
                int artistId = mydb.GetLastInsertId();
                artists_ids[i] = artistId;

                // modulul de sugestii calculeaza similaritatile pentru noul artist
                ArtistInfo NewArtist = new ArtistInfo(artistId, artistName);
                List<ArtistInfo> prevArtists = SimilarityGraph.GetArtists(mydb, artistId);
                SimilarityGraph.CalculateSimilarities(mydb, NewArtist, false, prevArtists);

                mydb.newQuery("INSERT INTO [Sings] (song_id,artist_id) VALUES (@songid,@artid)");
                mydb.setParameter("songid", songId);
                mydb.setParameter("artid", artistId);

                mydb.ExecuteNonQuery();

            }
            i++;
        }



        List<int> genre_ids = new List<int>();

        mydb.newQuery("SELECT [HasGenre].[genre_id] FROM [HasGenre] WHERE [HasGenre].[song_id] = @id");

        mydb.setParameter("id", SONG_ID.Trim());

        sqlReader = mydb.ExecuteReader();

        while (sqlReader.Read())
        {
            genre_ids.Add(int.Parse(sqlReader["genre_id"].ToString().Trim()));
        }

        i = 0;
        while (i < genre_ids.Count)
        {

            mydb.newQuery("SELECT [ArtistsGenres].[songs_count] FROM [ArtistsGenres] WHERE [ArtistsGenres].[genre_id] = @genid");

            mydb.setParameter("genid", genre_ids[i]);
            sqlReader = mydb.ExecuteReader();

            if (sqlReader.HasRows == true)
            {

                sqlReader.Read();
                int songcount = int.Parse(sqlReader["songs_count"].ToString().Trim());
                songcount--;

                mydb.newQuery("UPDATE [ArtistsGenres] SET [ArtistsGenres].[songs_count]=@songcount WHERE  [ArtistsGenres].[genre_id] = @gen_id ");

                mydb.setParameter("gen_id", genre_ids[i]);
                mydb.setParameter("songcount", songcount);

                mydb.ExecuteNonQuery();
            }

            i++;
        }


        int j = 0;
        i = 0;
        while (i < artists_ids.Length)
        {
            while (j < genres_ids.Length)
            {
                mydb.newQuery("SELECT [ArtistsGenres].[songs_count] FROM [ArtistsGenres] WHERE [ArtistsGenres].[artist_id] = @art_id and [ArtistsGenres].[genre_id] = @gen_id ");

                mydb.setParameter("art_id", artists_ids[i]);
                mydb.setParameter("gen_id", genres_ids[j]);

                sqlReader = mydb.ExecuteReader();

                if (sqlReader.HasRows == true)
                {
                    sqlReader.Read();
                    int songcount = int.Parse(sqlReader["songs_count"].ToString().Trim());
                    songcount++;
                    mydb.newQuery("UPDATE [ArtistsGenres] SET [ArtistsGenres].[songs_count]=@songcount WHERE  [ArtistsGenres].[artist_id] = @art_id and [ArtistsGenres].[genre_id] = @gen_id ");
                    mydb.setParameter("art_id", artists_ids[i]);
                    mydb.setParameter("gen_id", genres_ids[j]);
                    mydb.setParameter("songcount", songcount);

                    mydb.ExecuteNonQuery();
                }
                else
                {
                    mydb.newQuery("INSERT INTO [ArtistsGenres] (artist_id,genre_id,songs_count) VALUES (@art_id,@gen_id,1)");
                    mydb.setParameter("art_id", artists_ids[i]);
                    mydb.setParameter("gen_id", genres_ids[j]);

                    mydb.ExecuteNonQuery();

                }

                j++;

            }
            i++;
            j = 0;

        }

        mydb.newQuery("DELETE FROM [ArtistsGenres] WHERE [ArtistsGenres].[songs_count] = 0 ");
        mydb.ExecuteNonQuery();

        //mydb.newQuery("DELETE FROM [Genre] WHERE 0 = (SELECT COUNT (*) FROM [HasGenre] WHERE [HasGenre].[genre_id] = [Genre].[genre_id]) ");
        //mydb.ExecuteNonQuery();

        Response.Redirect("UploadSong.aspx");

    }

    protected void InsertSong(object sender, EventArgs e)
    {
        if(Context.Session["is_uploader"].Equals("True")){
        if (inputSong.HasFile && inputSong.FileName.EndsWith(".mp3", true, null))
        {
            SqlDataReader sqlReader;
            int albumId;


            mydb.newQuery("SELECT [Album].[album_id] FROM [Album] WHERE [Album].[album] like @album");
            mydb.setParameter("album", album_box.Text.Trim());
            sqlReader = mydb.ExecuteReader();

            if (sqlReader.HasRows == true)
            {
                sqlReader.Read();
                albumId = int.Parse(sqlReader["album_id"].ToString().Trim());

            }
            else
            {
                mydb.newQuery("INSERT INTO [Album] (album) VALUES (@album)");
                mydb.setParameter("album", album_box.Text.Trim());
                mydb.ExecuteNonQuery();
                albumId = mydb.GetLastInsertId();

            }

            //AICI DOWNLOADEZ POZA DE ALBUM !!!!
            GetAlbumArt(albumId.ToString(), album_box.Text.Trim(), album_artist_field.Value);
            //AICI DOWNLOADEZ POZA DE ALBUM !!!!

            mydb.newQuery("INSERT INTO [Song] (song_name,artists,album,album_id,year,genres,lyrics,uploader_id) VALUES (@songname,@artist,@album,@albumid,@year,@genres,@lyrics,@uploader_id) ");

            mydb.setParameter("songname", song_name_box.Text.Trim());
            mydb.setParameter("artist", artists_box.Text.Trim());
            mydb.setParameter("album", album_box.Text.Trim());
            mydb.setParameter("albumid", albumId);
            mydb.setParameter("year", year_box.Text.Trim());
            mydb.setParameter("genres", genres_box.Text.Trim());
            mydb.setParameter("lyrics", lyrics_box.Text.Trim());

            //added by bitza (to remove unauthorised uploads)
            mydb.setParameter("uploader_id", Context.Session["user_id"].ToString());

            mydb.ExecuteNonQuery();

            //mydb.newQuery("SELECT [Song].[song_id] FROM [Song] WHERE  [Song].[song_name] like @songname and  [Song].[artist] like @artist and  [Song].[album] like @album ");

            //mydb.setParameter("songname", context.Request.Params["SongName"].ToString());
            //mydb.setParameter("artist", context.Request.Params["Artists"].ToString());
            //mydb.setParameter("album", context.Request.Params["Album"].ToString());

            //sqlReader = mydb.ExecuteReader();

            //var songId = sqlReader.Read();

            int songId = mydb.GetLastInsertId();

            SONG_ID = songId.ToString();


            String[] genres_words = genres_box.Text.Split(',');
            int[] genres_ids = new int[genres_words.Length];
            int i = 0;
            while (i < genres_words.Length)
            {
                mydb.newQuery("SELECT [Genre].[genre_id] FROM [Genre] WHERE [Genre].[genre_name] like @gen");
                mydb.setParameter("gen", genres_words[i].Trim());
                sqlReader = mydb.ExecuteReader();

                if (sqlReader.HasRows == true)
                {
                    sqlReader.Read();
                    int genreid = int.Parse(sqlReader["genre_id"].ToString().Trim());
                    genres_ids[i] = genreid;
                    mydb.newQuery("INSERT INTO [HasGenre] (song_id,genre_id) VALUES (@songid,@genid)");
                    mydb.setParameter("songid", songId);
                    mydb.setParameter("genid", genreid);

                    mydb.ExecuteNonQuery();
                }
                else
                {
                    mydb.newQuery("INSERT INTO [Genre] (genre_name) VALUES (@gen)");
                    mydb.setParameter("gen", genres_words[i].Trim());
                    mydb.ExecuteNonQuery();

                    //aici trebuie facut altceva pentru a lua ultimul id ca e dubios asa
                    int genreId = mydb.GetLastInsertId();
                    genres_ids[i] = genreId;
                    mydb.newQuery("INSERT INTO [HasGenre] (song_id,genre_id) VALUES (@songid,@genid)");
                    mydb.setParameter("songid", songId);
                    mydb.setParameter("genid", genreId);

                    mydb.ExecuteNonQuery();

                }
                i++;
            }



            String[] artists_words = artists_box.Text.Split(',');
            int[] artists_ids = new int[artists_words.Length];
            i = 0;
            while (i < artists_words.Length)
            {
                mydb.newQuery("SELECT [Artist].[artist_id] FROM [Artist] WHERE [Artist].[artist_name] like @art");
                mydb.setParameter("art", artists_words[i].Trim());
                sqlReader = mydb.ExecuteReader();

                if (sqlReader.HasRows == true)
                {
                    sqlReader.Read();
                    int artiid = int.Parse(sqlReader["artist_id"].ToString().Trim());
                    artists_ids[i] = artiid;
                    mydb.newQuery("INSERT INTO [Sings] (song_id,artist_id) VALUES (@songid,@artid)");
                    mydb.setParameter("songid", songId);
                    mydb.setParameter("artid", artiid);

                    mydb.ExecuteNonQuery();
                }
                else
                {
                    string artistName = artists_words[i].Trim();
                    mydb.newQuery("INSERT INTO [Artist] (artist_name) VALUES (@art)");
                    mydb.setParameter("art", artistName);
                    mydb.ExecuteNonQuery();

                    //aici trebuie facut altceva pentru a lua ultimul id ca e dubios asa
                    int artistId = mydb.GetLastInsertId();
                    artists_ids[i] = artistId;

                    // modulul de sugestii calculeaza similaritatile pentru noul artist
                    ArtistInfo NewArtist = new ArtistInfo(artistId, artistName);
                    List<ArtistInfo> prevArtists = SimilarityGraph.GetArtists(mydb, artistId);
                    SimilarityGraph.CalculateSimilarities(mydb, NewArtist, false, prevArtists);

                    mydb.newQuery("INSERT INTO [Sings] (song_id,artist_id) VALUES (@songid,@artid)");
                    mydb.setParameter("songid", songId);
                    mydb.setParameter("artid", artistId);

                    mydb.ExecuteNonQuery();

                }
                i++;
            }


            int j = 0;
            i = 0;
            while (i < artists_ids.Length)
            {
                while (j < genres_ids.Length)
                {
                    mydb.newQuery("SELECT [ArtistsGenres].[songs_count] FROM [ArtistsGenres] WHERE [ArtistsGenres].[artist_id] = @art_id and [ArtistsGenres].[genre_id] = @gen_id ");

                    mydb.setParameter("art_id", artists_ids[i]);
                    mydb.setParameter("gen_id", genres_ids[j]);

                    sqlReader = mydb.ExecuteReader();

                    if (sqlReader.HasRows == true)
                    {
                        sqlReader.Read();
                        int songcount = int.Parse(sqlReader["songs_count"].ToString());
                        songcount++;
                        mydb.newQuery("UPDATE [ArtistsGenres] SET [ArtistsGenres].[songs_count]=@songcount WHERE  [ArtistsGenres].[artist_id] = @art_id and [ArtistsGenres].[genre_id] = @gen_id ");
                        mydb.setParameter("art_id", artists_ids[i]);
                        mydb.setParameter("gen_id", genres_ids[j]);
                        mydb.setParameter("songcount", songcount);

                        mydb.ExecuteNonQuery();
                    }
                    else
                    {
                        mydb.newQuery("INSERT INTO [ArtistsGenres] (artist_id,genre_id,songs_count) VALUES (@art_id,@gen_id,1)");
                        mydb.setParameter("art_id", artists_ids[i]);
                        mydb.setParameter("gen_id", genres_ids[j]);

                        mydb.ExecuteNonQuery();

                    }

                    j++;

                }
                i++;
                j = 0;

            }



            // Response.Redirect("UploadSong.aspx?SongId="+SONG_ID+"&do_function=upload");
            UploadSongOnServer(sender, e);
        }
        else
        {
            FileValidation.Text = "Select an mp3 file!";
        }
        }
        else {
    
            FileValidation.Text = "You have no upload rights!";
        }
    }

    protected void UploadSongOnServer(object sender, EventArgs e)
    {
     //   SONG_ID = Request.Params["SongId"];

        if (inputSong.HasFile)  //daca e vreun fisier selectat
        {
            string path = Server.MapPath(@"~/music/");
            string songName = inputSong.PostedFile.FileName;           
            //string title = song_name_box.Text;            
            //string artist = artists_box.Text.Replace(",", " & ");
            string songid = SONG_ID;
            

            if (songName.EndsWith(".mp3", true, null))   //daca are extensia mp3
            {
                if (!File.Exists(path + songName))      //daca nu exista deja pe server.
                {
                  //  inputSong.SaveAs(Server.MapPath("~/music/" + artist + " - " + title + ".mp3"));  //salveaza fisieru cu numele frumos asa.
                    inputSong.SaveAs(Server.MapPath("~/music/" + songid +".mp3"));
                }
            }
            else
            {
                //UploadSummary.Text = "The file " + songName + " already exists!";
            }
        }
        else
        {
            //UploadSummary.Text = "Select a file!";
        }
        Response.Redirect("UploadSong.aspx");
    }

    protected void GetAlbumArt(string albumId, string album, string artist)
    {
        string path = Server.MapPath(@"~/images/cover-art/");

        if(!File.Exists(path + albumId + ".png")){
            string url = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=b25b959554ed76058ac220b7b2e0a026&artist=" + artist + "&album=" + album;
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "GET";
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();

                XmlTextReader reader = new XmlTextReader(response.GetResponseStream());
                while (reader.Read())
                {
                    if (reader.NodeType == XmlNodeType.Element && reader.Name == "image")
                    {
                        if (reader.GetAttribute("size").Equals("large"))
                        {
                            url = reader.ReadInnerXml();

                            WebClient webClient = new WebClient();
                            webClient.DownloadFile(url, path + albumId + ".png");
                        }
                    }
                }
            }
            catch (Exception e)
            {
            }
        }
    }

    protected string RemoveBadChars(string input)
    {
        return input;
    }

    //protected void DeleteSongFromServer(object sender, EventArgs e)
    //{

    //    SONG_ID = Request.Params["SongId"];

    //    string path = Server.MapPath(@"~/music/");
    //    string songName = inputSong.PostedFile.FileName;
    //  //  string title = song_name_box.Text;
    //   // string artist = artists_box.Text.Replace(",", " & ");
    //    string songid =SONG_ID;
    //    File.Delete(path + songid +".mp3");        
    //    song_name_box.Text = "";
    //    song_id_box.Text = "";
    //    artists_box.Text = "";
    //    //File.Delete(path + artist + " - " + title + ".mp3");  cam asa se sterge un fisier de pe server.
    //    //File.Delete(path + "Kimya Dawson & Mateo Messina - Twentieth Century Fox Fanfare.mp3");
    //}

}
