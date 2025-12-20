const listTextArea = document.querySelectorAll("[textarea-mce]");
if (listTextArea.length > 0) {
  listTextArea.forEach((textarea) => {
    const id = textarea.id;
    tinymce.init({
      selector: `#${id}`,
      plugins: 'image code',
      image_title: true,
      images_upload_url: '/admin/upload',
      file_picker_types: "image",
      automatic_upload: true,
      // file_picker_callback: (cb, value, meta) => {
      //   const input = document.createElement('input');
      //   input.setAttribute('type', 'file');
      //   input.setAttribute('accept', 'image/*');

      //   input.addEventListener('change', (e) => {
      //     const file = e.target.files[0];

      //     const reader = new FileReader();
      //     reader.addEventListener('load', () => {
      //       /*
      //         Note: Now we need to register the blob in TinyMCEs image blob
      //         registry. In the next release this part hopefully won't be
      //         necessary, as we are looking to handle it internally.
      //       */
      //       const id = 'blobid' + (new Date()).getTime();
      //       const blobCache = tinymce.activeEditor.editorUpload.blobCache;
      //       const base64 = reader.result.split(',')[1];
      //       const blobInfo = blobCache.create(id, file, base64);
      //       blobCache.add(blobInfo);

      //       /* call the callback and populate the Title field with the file name */
      //       cb(blobInfo.blobUri(), { title: file.name });
      //     });
      //     reader.readAsDataURL(file);
      //   });

      //   input.click();
      // },

      ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
      uploadcare_public_key: '8b1f20992923bc5741f1',
    });

  });
}



// <!-- Place the first <script> tag in your HTML's <head> -->
// <script src="https://cdn.tiny.cloud/1/rmo51mkuxo6yobs8h7edv6js8p7b510v3zpor8gmftulshua/tinymce/8/tinymce.min.js" referrerpolicy="origin" crossorigin="anonymous"></script>

// <!-- Place the following <script> and <textarea> tags your HTML's <body> -->
// <script>
//   tinymce.init({
//     selector: 'textarea',
//     plugins: [
//       // Core editing features
//       'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
//       // Your account includes a free trial of TinyMCE premium features
//       // Try the most popular premium features until Oct 2, 2025:
//       'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
//     ],
//     toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
//     tinycomments_mode: 'embedded',
//     tinycomments_author: 'Author name',
//     mergetags_list: [
//       { value: 'First.Name', title: 'First Name' },
//       { value: 'Email', title: 'Email' },
//     ],
//     ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
//     uploadcare_public_key: '8b1f20992923bc5741f1',
//   });
// </script>
// <textarea>
//   Welcome to TinyMCE!
// </textarea>