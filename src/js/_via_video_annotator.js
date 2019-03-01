'use strict'

var data = new _via_data();
try {
  var store = new _via_store_localstorage(data);
  store.prev_session_data_init().then( function(ok) {
    var button = document.getElementById('_via_restore_project_button');
    if ( store.prev_session_is_available() ) {
      var button_title = 'Restore and save ' + store.prev_session_get_size() + ' bytes of VIA project data saved on ' + store.prev_session_get_timestamp();
      button.getElementsByTagName('title')[0].innerHTML = button_title;
    } else {
      button.classList.add('disabled_button');
      button.getElementsByTagName('title')[0].innerHTML = 'Browser\'s localStorage is not available!';
      button.setAttribute('onclick', '');
    }
    if ( store._init() ) {
      data._store_add('localStorage', store);
    }
  }.bind(this), function(err) {
    var button = document.getElementById('_via_restore_project_button');
    button.classList.add('disabled_button');
    button.getElementsByTagName('title')[0].innerHTML = 'Browser\'s localStorage is not available!';
    button.setAttribute('onclick', '');

    if ( store._init() ) {
      data._store_add('localStorage', store);
    }
  }.bind(this));
}
catch(e) {
  console.log(e);
}

data.attribute_add('Caption',
                _VIA_ATTRIBUTE_TYPE.TEXT);
data.attribute_add('Keywords',
                _VIA_ATTRIBUTE_TYPE.TEXT);

/*
data.attribute_add('Keyword',
                   _VIA_ATTRIBUTE_TYPE.SELECT,
                   {
                     'talk':'Talk',
                     'play':'Play',
                     'eat':'Eat',
                     'sleep':'Sleep',
                     'run':'Run',
                     'walk':'Walk',
                     'none':'None'
                   },
                   'none');
*/

//-- debug code start
var remote_uri_list = [
  'https://upload.wikimedia.org/wikipedia/commons/b/bd/US-WA-Olympia-NisquallyWildlifeRefuge-Heron.webm',
  'https://upload.wikimedia.org/wikipedia/commons/a/a7/Wood_mouse_%28Apodemus_sylvaticus%29.webm',
  'https://upload.wikimedia.org/wikipedia/commons/3/37/Flock_of_birds_near_Padilla_Bay.webm',
  'https://upload.wikimedia.org/wikipedia/commons/7/7b/Mud_volcano_Paclele_mici.webm',
  'https://upload.wikimedia.org/wikipedia/commons/6/68/A_Trip_Down_Market_Street_%28High_Res%29.webm',
  'https://upload.wikimedia.org/wikipedia/commons/c/ce/Pedestrians_in_Buchanan_Street%2C_Glasgow.webm',
];

var local_uri_list = [
  'file:///data/svt/videos/Moon_transit_of_sun_large.mp4',
  'file:///data/svt/videos/Alex_Ovechkin_swing_and_a_miss_-NHLAllStar_-365.mp4',
  'file:///data/svt/videos/mouse.mp4',
  'file:///data/svt/videos/svt_demo_fish_25fps.mp4',
  'file:///data/svt/videos/US-WA-Olympia-NisquallyWildlifeRefuge-Heron.mp4',
  'file:///data/svt/videos/Wood_cleaving_-_2016.mp4',
  'file:///data/datasets/via/debug_media/bbc_signdb_001.mp4',
  'file:///data/datasets/via/debug_media/bbc_signdb_003.mp4',
];

var i, fid;
for ( i = 0; i < local_uri_list.length; ++i ) {
  fid = data.file_add(_via_util_get_filename_from_uri( local_uri_list[i] ),
                      _VIA_FILE_TYPE.VIDEO,
                      _VIA_FILE_LOC.URIFILE,
                      local_uri_list[i]
                     );
}
//data.metadata_add(fid, [32.5, 33.5], [], {'0':'talk', '1':'keyword1, keyword2'});
/*
data.metadata_add(fid, [0.567, 3.557], [], {'0':'talk', '1':'keyword1, keyword2'});
data.metadata_add(fid, [2.032, 13.557], [], {'0':'house', '1':'keyword6, keyword8'});
data.metadata_add(fid, [15.532, 20], [], {'0':'fire', '1':'keyword3, keyword9'});
data.metadata_add(fid, [35.532, 40], [], {'0':'jump', '1':'keyword7, keyword2'});
data.metadata_add(fid, [42.532, 50], [], {'0':'laugh', '1':'keyword9, keyword5'});
*/
//data.metadata_segment_add(fid, [2.534, 5.751], {'0':'Lorem ipsum dolor sit amet, consectetur adipiscing elit', '1':'talk'});
//data.metadata_segment_add(fid, [3.895, 5.391, 6.241, 8.105], {'0':'segment label 2', '1':'walk'});

//-- debug code end

var annotator_container = document.getElementById('annotator_container');
var annotator = new _via_annotator(annotator_container, data);
window.addEventListener('keydown', function(e) {
  // avoid handling events when text input field is in focus
  if ( e.target.type !== 'text' ) {
    annotator._on_event_keydown(e);
  }
});

//var project_container = document.getElementById('project_container');
//var project = new _via_project(project_container, data, annotator);


//var editor_container = document.getElementById('editor_container');
//var editor = new _via_editor(editor_container, data);

var filelist_element = document.getElementById('file_manager_filelist');
var file_manager = new _via_file_manager(filelist_element, data, annotator);
file_manager._init();

var io = new _via_io(data);

// for debugging, show one of the files
annotator.file_show_fid(0);

function _via_on_browser_resize() {
  annotator.emit_event('container_resize', {});
}

function _via_toggle_metadata_and_attribute_editor() {
  if ( editor_container.classList.contains('hide') ) {
    document.getElementById('annotator_container').style.height = '65vh';
    document.getElementById('editor_container').style.height = '30vh';
    editor_container.classList.remove('hide');
  } else {
    document.getElementById('annotator_container').style.height = '95vh';
    editor_container.classList.add('hide');
  }
  annotator.on_browser_resize();
}