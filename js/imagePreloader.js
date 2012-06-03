$(document).ready(function () {
    var i;
    preload_image_object = new Image();

    image_url = new Array();

    image_url[0] = "/MusicMachine/images/loginbg.png";
    image_url[1] = "/MusicMachine/images/ajax-loader2.gif";
    image_url[2] = "/MusicMachine/images/ajax-loader.gif";
    image_url[3] = "/MusicMachine/images/imagine_header2.png";
    image_url[4] = "/MusicMachine/css/gridview/header.png";
    image_url[5] = "/MusicMachine/css/gridview/header-active.png";
    image_url[6] = "/MusicMachine/images/gridview-header.png";
    image_url[7] = "/MusicMachine/images/loginbg.png";
    image_url[8] = "/MusicMachine/images/buttons/button_background.png";
    image_url[9] = "/MusicMachine/images/buttons/shuffle.png";
    image_url[10] = "/MusicMachine/images/buttons/repeat.png";
    image_url[11] = "/MusicMachine/css/custom-theme/images/ui-bg_glass_50_327ae2_1x400.png";
    image_url[12] = "/MusicMachine/css/custom-theme/images/ui-bg_glass_75_cccccc_1x400.png";
    image_url[13] = "/MusicMachine/images/buttons/stop.png";
    image_url[14] = "/MusicMachine/images/buttons/play.png";
    image_url[15] = "/MusicMachine/images/buttons/replay.png";
    image_url[16] = "/MusicMachine/images/buttons/playlist.png";
    image_url[17] = "/MusicMachine/images/buttons/N.png";
    image_url[18] = "/MusicMachine/images/buttons/playlist_active.png";
    image_url[19] = "/MusicMachine/images/buttons/D.png";
    image_url[20] = "/MusicMachine/images/buttons/C.png";
    image_url[21] = "/MusicMachine/images/buttons/new.png";
    image_url[22] = "/MusicMachine/images/buttons/friends.png";
    image_url[23] = "/MusicMachine/images/buttons/top.png";
    image_url[24] = "/MusicMachine/images/buttons/fwd_background.png";
    image_url[25] = "/MusicMachine/images/buttons/bwd_background.png";
    image_url[26] = "/MusicMachine/images/plus-circle.png";
    image_url[27] = "/MusicMachine/images/cross-button.png";
    image_url[28] = "/MusicMachine/images/user-24.png";
    image_url[29] = "/MusicMachine/images/user.png";
    image_url[30] = "/MusicMachine/images/user-frame-32.png";
    image_url[31] = "/MusicMachine/images/panel-ui/close-button.png";
    image_url[32] = "/MusicMachine/images/delete_gridview_song.png";
    image_url[33] = "/MusicMachine/images/demote_gridview_song.png";
    image_url[34] = "/MusicMachine/images/promote_gridview_song.png";
    image_url[35] = "/MusicMachine/images/to_queue_gridview_song.png";

    // --

    image_url[36] = "/MusicMachine/images/user-24.png";
    image_url[37] = "/MusicMachine/images/user.png";
    image_url[38] = "/MusicMachine/images/user-frame-32.png";
    image_url[39] = "/MusicMachine/images/queue/1.png";
    image_url[40] = "/MusicMachine/images/queue/1_active.png";
    image_url[41] = "/MusicMachine/images/queue/1_hover.png";
    image_url[42] = "/MusicMachine/images/queue/1_voted.png";
    image_url[43] = "/MusicMachine/images/queue/2.png";
    image_url[44] = "/MusicMachine/images/queue/2_active.png";
    image_url[45] = "/MusicMachine/images/queue/2_hover.png";
    image_url[46] = "/MusicMachine/images/queue/2_voted.png";
    image_url[47] = "/MusicMachine/images/queue/3.png";
    image_url[48] = "/MusicMachine/images/queue/3_active.png";
    image_url[49] = "/MusicMachine/images/queue/3_hover.png";
    image_url[50] = "/MusicMachine/images/queue/3_voted.png";
    image_url[51] = "/MusicMachine/images/queue/4.png";
    image_url[52] = "/MusicMachine/images/queue/4_active.png";
    image_url[53] = "/MusicMachine/images/queue/4_hover.png";
    image_url[54] = "/MusicMachine/images/queue/4_voted.png";
    image_url[55] = "/MusicMachine/images/queue/5.png";
    image_url[56] = "/MusicMachine/images/queue/5_active.png";
    image_url[57] = "/MusicMachine/images/queue/5_hover.png";
    image_url[58] = "/MusicMachine/images/queue/5_voted.png";
    image_url[59] = "/MusicMachine/images/queue/dummy.png";
    image_url[60] = "/MusicMachine/images/queue/remove.png";
    image_url[61] = "/MusicMachine/images/queue/remove_active.png";
    image_url[62] = "/MusicMachine/images/queue/remove_hover.png";
    image_url[63] = "/MusicMachine/images/queue/shadow1.png";
    image_url[64] = "/MusicMachine/images/queue/shadow2.png";
    image_url[65] = "/MusicMachine/images/queue/shadow3.png";
    image_url[66] = "/MusicMachine/images/queue/shadow4.png";
    image_url[67] = "/MusicMachine/images/buttons/bwd_active.png";
    image_url[68] = "/MusicMachine/images/buttons/bwd_hover.png";
    image_url[69] = "/MusicMachine/images/buttons/C_active.png";
    image_url[70] = "/MusicMachine/images/buttons/C_hover.png";
    image_url[71] = "/MusicMachine/images/buttons/D_active.png";
    image_url[72] = "/MusicMachine/images/buttons/D_hover.png";
    image_url[73] = "/MusicMachine/images/buttons/friends_active.png";
    image_url[74] = "/MusicMachine/images/buttons/friends_hover.png";
    image_url[75] = "/MusicMachine/images/buttons/fwd_active.png";
    image_url[76] = "/MusicMachine/images/buttons/fwd_hover.png";
    image_url[77] = "/MusicMachine/images/buttons/N_hover.png";
    image_url[78] = "/MusicMachine/images/buttons/new_active.png";
    image_url[79] = "/MusicMachine/images/buttons/new_hover.png";
    image_url[80] = "/MusicMachine/images/buttons/next_active.png";
    image_url[81] = "/MusicMachine/images/buttons/next_background.png";
    image_url[82] = "/MusicMachine/images/buttons/next_hover.png";
    image_url[83] = "/MusicMachine/images/buttons/pause.png";
    image_url[84] = "/MusicMachine/images/buttons/pause_active.png";
    image_url[85] = "/MusicMachine/images/buttons/pause_hover.png";
    image_url[86] = "/MusicMachine/images/buttons/play_active.png";
    image_url[87] = "/MusicMachine/images/buttons/play_hover.png";
    image_url[88] = "/MusicMachine/images/buttons/N_active.png";
    image_url[89] = "/MusicMachine/images/buttons/playlist_hover.png";
    image_url[90] = "/MusicMachine/images/buttons/previous_active.png";
    image_url[91] = "/MusicMachine/images/buttons/previous_background.png";
    image_url[92] = "/MusicMachine/images/buttons/previous_hover.png";
    image_url[93] = "/MusicMachine/images/buttons/repeat_active.png";
    image_url[94] = "/MusicMachine/images/buttons/repeat_hover.png";
    image_url[95] = "/MusicMachine/images/buttons/replay_active.png";
    image_url[96] = "/MusicMachine/images/buttons/replay_hover.png";
    image_url[97] = "/MusicMachine/images/buttons/replay_hover.png";
    image_url[98] = "/MusicMachine/images/buttons/shuffle_active.png";
    image_url[99] = "/MusicMachine/images/buttons/shuffle_hover.png";
    image_url[100] = "/MusicMachine/images/buttons/stop_active.png";
    image_url[101] = "/MusicMachine/images/buttons/stop_hover.png";
    image_url[102] = "/MusicMachine/images/buttons/top_active.png";
    image_url[103] = "/MusicMachine/images/buttons/top_hover.png";
    image_url[104] = "/MusicMachine/images/cover-art/-1.png";
    image_url[105] = "/MusicMachine/images/panel-ui/close-button.png";


    for (i = 0; i <= 105; i++) {
        preload_image_object.src = image_url[i];
    }

});
  