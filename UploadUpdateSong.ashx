<%@ WebHandler Language="C#" Class="UploadUpdateSong" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;

public class UploadUpdateSong : ServerResponse
{

    MyDatabase mydb = new MyDatabase();

    protected override void Respond(HttpContext context)
    {
        SqlDataReader sqlReader;
        int albumId;

        mydb.newQuery("SELECT [Album].[album_id] FROM [Album] WHERE [Album].[album] like @album");
        mydb.setParameter("album", context.Request.Params["Album"].ToString().Trim());
        sqlReader = mydb.ExecuteReader();

        if (sqlReader.HasRows == true)
        {
            sqlReader.Read();
            albumId = int.Parse(sqlReader["album_id"].ToString().Trim());

        }
        else
        {
            mydb.newQuery("INSERT INTO [Album] (album) VALUES (@album)");
            mydb.setParameter("album", context.Request.Params["Album"].ToString().Trim());
            mydb.ExecuteNonQuery();
            albumId = mydb.GetLastInsertId();

        }


        mydb.newQuery("UPDATE [Song] SET [Song].[song_name] = @songname , [Song].[artists] = @artist , [Song].[album] = @album , [Song].[album_id] = @albumid , [Song].[year] = @year , [Song].[genres] = @genres , [Song].[lyrics] = @lyrics WHERE [Song].[song_id] = @songid ");

        mydb.setParameter("songid", context.Request.Params["SongId"].ToString().Trim());
        mydb.setParameter("songname", context.Request.Params["SongName"].ToString().Trim());
        mydb.setParameter("artist", context.Request.Params["Artists"].ToString().Trim());
        mydb.setParameter("album", context.Request.Params["Album"].ToString().Trim());
        mydb.setParameter("albumid", albumId);
        mydb.setParameter("year", context.Request.Params["Year"].ToString().Trim());
        mydb.setParameter("genres", context.Request.Params["Genres"].ToString().Trim());
        mydb.setParameter("lyrics", context.Request.Params["Lyrics"].ToString().Trim());

        mydb.ExecuteNonQuery();

        int songId = int.Parse(context.Request.Params["SongId"].ToString().Trim());

        mydb.newQuery("DELETE FROM [HasGenre] WHERE [HasGenre].[song_id] = @id");

        mydb.setParameter("id", context.Request.Params["SongId"].ToString().Trim());

        mydb.ExecuteNonQuery();

        String[] genres_words = context.Request.Params["Genres"].ToString().Split(',');
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

        mydb.setParameter("id", context.Request.Params["SongId"].ToString().Trim());

        mydb.ExecuteNonQuery();

        String[] artists_words = context.Request.Params["Artists"].ToString().Split(',');
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

        mydb.setParameter("id", context.Request.Params["SongId"].ToString().Trim());

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

        mydb.newQuery("DELETE FROM [Genre] WHERE 0 = (SELECT COUNT (*) FROM [HasGenre] WHERE [HasGenre].[genre_id] = [Genre].[genre_id]) ");
        mydb.ExecuteNonQuery();

        //mydb.newQuery("DELETE FROM [Artist] WHERE 0 = (SELECT COUNT (*) FROM [Sings] WHERE [Sings].[artist_id] = [Artist].[artist_id]) ");
        //mydb.ExecuteNonQuery();

        context.Response.Write("{}");
    }

}