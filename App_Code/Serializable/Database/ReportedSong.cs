using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Se foloseste la afisarea informatiilor despre melodiile raportate, in panoul de upload. 
/// ReportType e "tags" sau "song", in functie de problema.
/// </summary>
public class ReportedSong
{
    public BasicInfo Reporter;
    public SongInfo Song;
    public string ReportDate;
    public string ReportType;
    public string Comment;

	public ReportedSong(BasicInfo Reporter, SongInfo Song, string ReportDate, 
        string ReportType, string Comment)
	{
        this.Reporter = Reporter;
        this.Song = Song;
        this.ReportDate = ReportDate;
        this.ReportType = ReportType;
        this.Comment = Comment;
	}
}