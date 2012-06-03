<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UploadSong.aspx.cs" Inherits="UploadSong" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">



<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link type="text/css" href="css/app.css" rel="stylesheet" />    
    <link type="text/css" href="css/header_style.css" rel="stylesheet"/> 

    
    <script type="text/javascript" src="js/jquery-1.5.1.js"></script>    
    <script type="text/javascript" src="js/jquery-ui-1.8.11.custom.min.js"></script>
    <script type="text/javascript" src="js/jquery.ba-hashchange.js"></script>
    <script type="text/javascript" src="js/jquery.tablesorter.js"></script>
    <script src="js/GetSongInfo.js" type="text/javascript"></script>
  <%--  
	<link type="text/css" href="css/player.css" rel="stylesheet" />
	<link type="text/css" href="css/custom-theme/jquery-ui-1.8.11.custom.css" rel="stylesheet" />
	<link type="text/css" href="css/panel-ui.css" rel="stylesheet" />
    <link type="text/css" href="css/gridview/style.css" rel="stylesheet" />
    <link type="text/css" href="css/panel-myprofile.css" rel="stylesheet" />

	
    <script src="js/AppLoader.js" type="text/javascript"></script>
    <script src="js/UserAuth.js" type="text/javascript"></script>
    <script src="js/Mm.js" type="text/javascript"></script>
    <script src="js/url-framework.js" type="text/javascript"></script>
	<script src="js/panel-ui.js" type="text/javascript"></script>
    <script src="js/gridview/gridview.js" type="text/javascript"></script>
	<script src="js/queue.js" type="text/javascript"></script>
    <script src="js/player.js" type="text/javascript"></script>
   

    <script src="js/panels/home.js" type="text/javascript"></script>
    <script src="js/panels/playlists.js" type="text/javascript"></script>
    <script src="js/panels/lyrics.js" type="text/javascript"></script>
    <script src="js/panels/search.js" type="text/javascript"></script>
    <script src="js/panels/myprofile.js" type="text/javascript"></script>
    <script src="js/panels/upload.js" type="text/javascript"></script>
    <script src="js/panels/suggestions.js" type="text/javascript"></script>
    <script src="js/panels/friends.js" type="text/javascript"></script>--%>

    <title></title>
</head>

<body onload="parent.upload.getSongs();">
<form id="Form1" runat="server" >
<div class="scroll_vertical" style="height: 300px"><div class="oneline_form_container" style="width: 200px;">
                                <asp:HiddenField ID="album_artist_field" Value="" runat="server" />
								<table>
                                    <tr class="row">
                                        <td>
                                            <table>
                                                <tr>
                                                    <td id="fileUploadInfo">
                                                        File
                                                    </td>
                                                    <td>
                                                        <img id="loading" height="20px" width="20px" src="images/ajax-loader.gif" alt="" />
                                                    </td>
                                                </tr>
                                            </table>
                                          </td>
                                        <td><asp:FileUpload ID="inputSong" runat="server" /></td>
                                        <td></td>
								    </tr>
								    <%--<tr class="row">
									    <td>SongID</td><td><asp:TextBox ID="song_id_box" runat="server" ></asp:TextBox></td>
                                        <td></td>                                        
								    </tr>--%>
                                    <tr class="row">
									    <td>Song</td><td><asp:TextBox ID="song_name_box" runat="server"></asp:TextBox></td>
                                        <td></td>                                        
								    </tr>
								    <tr class="row">
									    <td>Artists</td>
                                        <td><asp:TextBox ID="artists_box" runat="server"></asp:TextBox></td>
                                        <td></td>
                                    </tr>
								    <tr class="row">
									    <td>Album</td>
                                        <td><asp:TextBox id="album_box" runat="server"></asp:TextBox></td>
                                        <td></td>
								    </tr>
								    <tr class="row">
									    <td>Year</td>
                                        <td><asp:TextBox ID="year_box" runat="server"></asp:TextBox></td>
                                        <td></td>                                        
								    </tr>
								    <tr class="row">
									    <td>Genres</td>
                                        <td><asp:TextBox id="genres_box" runat="server"></asp:TextBox></td>
                                        <td></td> 
								    </tr>
                                    <tr class="row">
									    <td>Lyrics</td>                                       
                                        <td><asp:TextBox  id="lyrics_box" runat="server" TextMode="MultiLine" Wrap="true" Rows="5" Columns="25" ></asp:TextBox></td>
                                        <td></td> 
								    </tr>
								    <tr class="submit">									    
                                            <td><asp:Button ID="Button2" runat="server" Text="Upload" onclick="InsertSong" /></td>
                                            <td><asp:Button ID="Button3" runat="server" Text="Update" onclick="UpdateSong" Visible="false" /></td>
                                            <%--<td><input id="input_button_submit" type="button" class="button" onclick="upload.insertSong();" value="Submit" /></td>--%>
                                            <td></td>
								    </tr>
                                </table>
                                <asp:Panel ID="UploadSummary" runat="server">
                                    <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ErrorMessage="Artist name field required" ControlToValidate="artists_box"></asp:RequiredFieldValidator>
                                    <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ErrorMessage="Song name field required" ControlToValidate="song_name_box"></asp:RequiredFieldValidator>
                                    <asp:RangeValidator ID="RangeValidator1" runat="server" ErrorMessage="Year field must be greater than 1900" ControlToValidate="year_box" MaximumValue="2050" MinimumValue="1900" Type="Integer"></asp:RangeValidator>
                                    <asp:Label ID="FileValidation" runat="server" Text=""></asp:Label>
                                    <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ErrorMessage="Album field must be completed" ControlToValidate="album_box"></asp:RequiredFieldValidator>
                                </asp:Panel>
                                    
                                                                
							</div>
                            
</div>
</form>
</body>
</html>
