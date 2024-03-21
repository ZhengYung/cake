import { ref } from 'vue';

import CKEditor from '@ckeditor/ckeditor5-vue';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { FontSize, FontFamily, FontColor, FontBackgroundColor } from '@ckeditor/ckeditor5-font';
import { Bold, Italic, Underline, Strikethrough } from '@ckeditor/ckeditor5-basic-styles';
import { Link } from '@ckeditor/ckeditor5-link';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { SimpleUploadAdapter } from '@ckeditor/ckeditor5-upload';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { List } from '@ckeditor/ckeditor5-list';
import { Indent, IndentBlock } from '@ckeditor/ckeditor5-indent';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload, ImageResize } from '@ckeditor/ckeditor5-image';


const ckeditor = CKEditor.component;
const editorData = ref('');
const editorConfig = {
    placeholder: 'type the content here',
    plugins: [
        Alignment,
        Indent, IndentBlock,
        Heading, List,
        FontSize, FontFamily, FontColor, FontBackgroundColor,
        Bold, Italic, Underline, Strikethrough,
        Link, Paragraph, Essentials,
        Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload, ImageResize,
        SimpleUploadAdapter
    ],
    toolbar: {
        items: [
            'undo', 'redo', '|', 'heading', '|',
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'fontSize', 'fontColor', 'fontBackgroundColor', '|',
            'link', 'insertImage', '|',
            'alignment:left', 'alignment:center', 'alignment:right', 'alignment:justify', '|',
            'bulletedList', 'numberedList', 'outdent', 'indent'
        ],
        // toolbar RWD true 自動換行/false 膠囊
        shouldNotGroupWhenFull: false
    },
    simpleUpload: {
        // The URL that the images are uploaded to.
        uploadUrl: 'http://localhost:3000/image',
    },
    image: {
        toolbar: [
            'imageStyle:block',
            'imageStyle:side',
            '|',
            'toggleImageCaption',
            'imageTextAlternative',
            '|',
            'linkImage'
        ],
        insert: {
            // If this setting is omitted, the editor defaults to 'block'.
            // See explanation below.
            type: 'auto'
        }
    },
    fontSize: {
        // 自訂義字級選項
        options: [12, 14, 16, 18, 20, 24, 28, 30, 32]
    },
    link: {
        // 點擊連結另起新分頁
        addTargetToExternalLinks: true
    }
};
export { ckeditor, ClassicEditor, editorData, editorConfig }