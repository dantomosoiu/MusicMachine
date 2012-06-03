using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Element de baza pentru afisarea informatiilor despre un cantec. Se foloseste la playlist, friends' most played, 
/// suggestions, top-uri, search, etc.
/// </summary>
public class SongInfo
{
    public int SongId;
    public string SongName;
    public string Artists;
    public string Album;
    public int Year;
    public string Genres;
    public string Duration;
    public int Vote;
    public int AlbumId;
    public int UploaderId;
    
	public SongInfo(int SongId, string SongName, string Artists, string Album, int Year, string Genres, 
        string Duration, int Vote = -1, int AlbumId = -1, int UploaderId = 39) 
	{
        //chestia cu UploaderId = 39 by default e o magarie
        this.SongId = SongId;
        this.SongName = SongName;
        this.Artists = Artists;
        this.Album = Album;
        this.Year = Year;
        this.Genres = Genres;
        this.Duration = Duration;
        this.Vote = Vote;
        this.AlbumId = AlbumId;
        this.UploaderId = UploaderId;
	}
}