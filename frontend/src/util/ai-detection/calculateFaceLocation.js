
// Face-detection func
// data from fetching Clarifai API response
const calculateFaceLocation = (data) => {
    // We'd like to try only get 1 face now
    // bounding_box is % of image size
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;

    // DOM manipulation
    // for <img id='...'/> in <FaceRecognition/>
    const image = document.getElementById('face-image');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log('img width:\n', width, '\nimg height:\n', height);
    console.log('bounding box - calcFaceLocaiton\n', clarifaiFace);
    // returning an object to fill up this.state.box
    // img width 238px
    // img height 384px
    // sample dataset (%)
    // { top_row: 0.0871627, left_col: 0.3230537, bottom_row: 0.8270308, right_col: 0.7289897 }

    // sample dataset (px)
    // { top_row: 33.47(h),
    // left_col: 76.89(w),
    // bottom_row: 66.42(h),
    // right_col: 64.5(w) }
    console.log(`\ntopRow`, clarifaiFace.top_row * height, `\n`);
    console.log(`\nleftCol`, clarifaiFace.left_col * width, `\n`);
    console.log(`\nbottomRow`, height - clarifaiFace.bottom_row * height, `\n`);
    console.log(`\nrightCol`, width - clarifaiFace.right_col * width, `\n`);

    return {
      topRow: clarifaiFace.top_row * height,
      leftCol: clarifaiFace.left_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
      rightCol: width - clarifaiFace.right_col * width
    };
};

export default calculateFaceLocation;