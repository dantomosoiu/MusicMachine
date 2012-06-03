using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Se foloseste la afisarea friends' most played unde e nevoie si de numarul de aparitii.
/// </summary>

public class SongCount: SongInfo
{
    public int Count;

	public SongCount(int SongId, string SongName, string Artists, string Album, int Year, string Genres, 
        string Duration, int Count, int Vote = -1, int AlbumId = -1): 
        base(SongId, SongName, Artists, Album, Year, Genres, Duration, Vote = -1, AlbumId = -1)
	{
        this.Count = Count;
	}
}