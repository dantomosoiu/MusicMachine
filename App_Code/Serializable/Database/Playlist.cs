using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Se foloseste pentru obtinerea listei de playlist-uri a unui utilizator.
/// </summary>
public class Playlist
{
    public int PlaylistId;
    public string PlaylistName;

	public Playlist(int PlaylistId, string PlaylistName)
	{
        this.PlaylistId = PlaylistId;
        this.PlaylistName = PlaylistName;
	}
}